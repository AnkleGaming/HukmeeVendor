// src/components/wallet/TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import { Wallet, History, IndianRupee, Calendar, Phone } from "lucide-react";
import { motion } from "framer-motion";
import GetWallet from "../../backend/getwallet/getwallet";
import GetTransaction from "../../backend/gettransaction/gettransaction";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const phone = localStorage.getItem("userPhone");

  useEffect(() => {
    const fetchData = async () => {
      if (!phone) return;

      setIsLoading(true);
      try {
        const [walletData, txnData] = await Promise.all([
          GetWallet(phone).catch(() => ({ WalletBalance: 0 })),
          GetTransaction(phone).catch(() => []),
        ]);

        setWalletBalance(
          Number(
            walletData?.[0]?.WalletBalance || walletData?.WalletBalance || 0
          ) || 0
        );
        setTransactions(Array.isArray(txnData) ? txnData : []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [phone]);

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "—";
    }
  };

  if (!phone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium text-base">
            Please log in to view wallet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Use full width on mobile, max-w-md on larger screens */}
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6" />
              <span className="text-sm sm:text-base font-medium">
                Wallet Balance
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold">
              ₹{walletBalance.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>

        {/* Transaction List Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </h2>
          </div>

          {/* Scrollable List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <History className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="font-medium text-base">No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions
                  .slice()
                  .reverse()
                  .map((txn, i) => (
                    <motion.div
                      key={txn.id || txn.Transactionid || i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <IndianRupee className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            #{txn.Transactionid || txn.id || "—"}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="w-3 h-3" />
                              {formatDate(txn.DateTime || txn.DateTim)}
                            </span>
                            {txn.Phone && (
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Phone className="w-3 h-3" />
                                {txn.Phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-3">
                        <p className="font-bold text-green-600 text-base sm:text-lg whitespace-nowrap">
                          +₹
                          {parseFloat(txn.TransactionAmt || 0).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {transactions.length > 5 && (
            <div className="px-5 py-3 bg-gray-50 text-center border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Showing last {transactions.length} transactions • Scroll up for
                older
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
