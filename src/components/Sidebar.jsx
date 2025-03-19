import { NavLink } from 'react-router-dom';
import { Menu, MessageSquare, List, UserCog,X } from 'lucide-react';
import React, { useState } from 'react';
import { useSidebar } from '../contexts/SidebarContext';  // Importa el useSidebar hook
const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();  // Obtiene isSidebarOpen y closeSidebar del Context

    return (
        <div className={`bg-gray-900 text-white py-6 min-h-screen transition-transform duration-300 ease-in-out 
                         fixed top-0 left-0 z-20
                         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                         sm:translate-x-0 sm:w-64 sm:relative`}>
            {/* Hamburger button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 left-4 text-white focus:outline-none"
            >
                <X size={24} />
            </button>

            <ul className="flex-grow mt-10">
                <li>
                    <NavLink to="/chat" onClick={closeSidebar} className={`flex items-center py-3 px-4 hover:bg-gray-600 transition-all duration-200 ease-linear`}>
                        <MessageSquare className="mr-2" size={20} />
                        <span>Chat</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" onClick={closeSidebar} className={`flex items-center py-3 px-4 hover:bg-gray-600 transition-all duration-200 ease-linear`}>
                        <List className="mr-2" size={20} />
                        <span>History</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin" onClick={closeSidebar} className={`flex items-center py-3 px-4 hover:bg-gray-600 transition-all duration-200 ease-linear`}>
                        <UserCog className="mr-2" size={20} />
                        <span>Admin</span>
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;