import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Vote, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="w-full px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-500 tracking-tighter">
                    <Vote className="w-8 h-8" />
                    <span>Pollify</span>
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Polls</Link>
                    {user ? (
                        <>
                            <Link to="/create-poll" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105">
                                <PlusCircle className="w-4 h-4" />
                                <span>Create Poll</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-neutral-400 hover:text-red-400 transition-colors">
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-neutral-400 hover:text-white transition-colors">Login</Link>
                            <Link to="/signup" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-neutral-200 transition-all">Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
