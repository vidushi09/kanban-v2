import React from "react";

const UserInfo = ({ user , logout }) => {
  return (
    <div className="user-info bg-blue-600 text-white p-6 rounded-xl shadow-lg max-w-xs absolute top-4 right-4 flex flex-col items-center space-y-2">
      {/* User Avatar */}
      <div className="avatar bg-white p-2 rounded-full shadow-md">
        <img
          src={user.avatar || "https://via.placeholder.com/100"} // Placeholder for avatar if not provided
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      
      {/* User Details */}
      <div className="user-details text-center">
        <span className="text-2xl font-bold">{user.username}</span>
        <p className="text-sm font-semibold mt-1">{user.email}</p>
      </div>

       <button
          onClick={logout}
          className="bg-red-500 text-white p-2 rounded-lg shadow-md mt-4"
        >
          Logout
        </button>
    </div>

    
  );
};

export default UserInfo;
