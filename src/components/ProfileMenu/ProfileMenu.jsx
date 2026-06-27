import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const ProfileMenu = ({ user, logout, onClose }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    onClose();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 bg-[#13131a] border border-[#2d2d3d] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
    >
      <div className="px-4 py-3 border-b border-[#2d2d3d]">
        <p className="text-sm text-[#9ca3af]">Signed in as</p>
        <p className="text-sm font-semibold text-white truncate">{firstName}</p>
      </div>
      <button
        type="button"
        onClick={() => handleNavigate('/settings')}
        className="w-full text-left px-4 py-3 hover:bg-white/5 text-[#e5e7eb]"
      >
        Profile Settings
      </button>
      <button
        type="button"
        onClick={() => handleNavigate('/dashboard')}
        className="w-full text-left px-4 py-3 hover:bg-white/5 text-[#e5e7eb]"
      >
        Dashboard
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full text-left px-4 py-3 hover:bg-white/5 text-[#f87171]"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
