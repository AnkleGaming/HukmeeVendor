import React from "react";
import { FaCartShopping } from "react-icons/fa6"; // Make sure the image path is correct

const CartCard = () => {
  return (
    <div className="lg:mt-[10px] w-[300px] p-6 bg-white border border-gray-300 rounded-[5px]  flex flex-col items-center">
      <FaCartShopping className="w-[40px] h-[40px] object-contain mb-4" />
      <p className="text-gray-600 text-[16px] font-normal">
        No items in your cart
      </p>
    </div>
  );
};

export default CartCard;
