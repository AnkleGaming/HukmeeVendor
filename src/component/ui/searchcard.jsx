import React from "react";
import { FiSearch } from "react-icons/fi"; // React-icons for search icon

const SearchCard = () => {
  return (
    <div className="max-w-md mx-auto p-[1px] mb-[10px]">
      <div className="flex items-center border border-gray-300 rounded-[5px] px-4 py-2 bg-white">
        <FiSearch className="text-gray-400 mr-3" size={20} />
        <input
          type="text"
          placeholder="Search for ‘Shop’" 
          className="flex-grow outline-none text-gray-600 placeholder-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
};

export default SearchCard;
