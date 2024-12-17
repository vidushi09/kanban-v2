import React from 'react';
import UserInfo from './UserInfo'; 

const BoardHeader = ({ user, logout }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 px-6 py-24 flex justify-between items-center">
        <div>
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
            Kanban Board
          </h1>
          <p className="text-xl text-white/80 mt-2">
            Organize Your Workflow
          </p>
        </div>
        <UserInfo user={user} logout={logout} />
      </div>
    </div>
  );
};

export default BoardHeader;