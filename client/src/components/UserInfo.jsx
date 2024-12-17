import React from "react";

const UserInfo = ({ user, logout }) => {
  return (
    <div className="user-info bg-white/20 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl border border-white/30 max-w-xs w-72 flex flex-col items-center space-y-4 transform transition-all hover:scale-105">
      <div className="avatar relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70 blur-lg"></div>
        <div className="relative bg-white p-1 rounded-full shadow-lg">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white/50"
          />
        </div>
      </div>
      <div className="user-details text-center space-y-1">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">
          {user.username}
        </h2>
        <p className="text-sm font-medium text-white/80 tracking-wider">
          {user.email}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-lg 
        shadow-md transition-all duration-300 ease-in-out 
        transform hover:scale-105 active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;