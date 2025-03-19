import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <nav className="bg-gray-800 text-white p-2 sm:p-4 flex items-center justify-between fixed w-full top-0 left-0 z-10">
      <button onClick={toggleSidebar} className="text-white focus:outline-none mr-4">
        <Menu size={24} />
      </button>
      <span className="font-bold px-2 sm:px-4"><span className='text-red-600'>A</span>I<span className='text-blue-700'>K</span> - ¡KLK CON LA IA!</span>
      <div>
        {isLoggedIn ? (
          <>
            <span>Welcome, {user?.username}</span>
            <button onClick={logout} className="ml-2 sm:ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-4 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            {isLoginPage ? (
              <button onClick={() => navigate("/register")}>Register</button>
            ) : isRegisterPage ? (
              <button onClick={() => navigate("/login")}>Login</button>
            ) : (
              <button onClick={() => navigate("/login")}>Login</button> // Default to Login if not on login or register
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;