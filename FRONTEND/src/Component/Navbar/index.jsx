import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Login from '../../pages/Login/index.jsx';
import Register from '../../pages/Register/index.jsx';
import AddStory from '../../pages/Add Story/index.jsx'; // Ensure this path is correct
import './index.css';
import Menu from '../../assets/Images/Menu.png';
import Bookmarks from '../../assets/Images/Bookmarks.png';
import MyStory from '../../pages/Home/MyStory/index.jsx';

const Navbar = ({ setShowMyStory }) => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // To track the active route
  const dropdownRef = useRef(null);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openAddStoryModal = () => setIsAddStoryModalOpen(true);
  const closeAddStoryModal = () => setIsAddStoryModalOpen(false);

  const getActiveClass = (path) => (location.pathname === path ? 'active-link' : '');

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Story Platform
        </Link>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <Link
              to="/bookmark"
              className={`navbar-link bookmark ${getActiveClass('/bookmark')}`}
            >
              <img src={Bookmarks} className="bookmark-img" alt="Bookmarks" />
              Bookmarks
            </Link>
            <Link
              to="#"
              className={`navbar-link add-story ${isAddStoryModalOpen ? 'active-link' : ''}`}
              onClick={openAddStoryModal}
            >
              Add Story
            </Link>
            <div className="navbar-user-menu" ref={dropdownRef}>
              <button className="navbar-user-icon" onClick={toggleDropdown}>
                {user ? getInitials(user.username) : 'U'}
              </button>
              {isDropdownOpen && (
                <div className="navbar-dropdown">
                  <Link
                    to="/"
                    className={`navbar-link username ${getActiveClass('/profile')}`}
                  >
                    {user ? user.username : 'USER NAME'}
                  </Link>
                  <Link to="/" onClick={logout} className="navbar-link logout">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="#"
              onClick={openRegisterModal}
              className={`navbar-link register-btn ${isRegisterModalOpen ? 'active-link' : ''}`}
            >
              Register Now
            </Link>
            <Link
              to="#"
              onClick={openLoginModal}
              className={`navbar-link login-btn ${isLoginModalOpen ? 'active-link' : ''}`}
            >
              Sign in
            </Link>
          </>
        )}

        {/* Menu button should be visible for both logged-in and logged-out users */}
        <button className="navbar-menu-btn" onClick={toggleMobileMenu}>
          <img src={Menu} alt="Menu" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="navbar-dropdown-mobile">
          {isLoggedIn ? (
            <>
              <div className="user">
                <button className="user-icon">{user ? getInitials(user.username) : 'U'}</button>
                <Link to="/" className="navbar-link username">
                  {user ? user.username : 'USER NAME'}
                </Link>
              </div>
              <Link className="my-story-btn" onClick={() => setShowMyStory(true)}>
                MyStory
              </Link>
              <Link to="#" onClick={openAddStoryModal} className="navbar-link addStory">
                Add Story
              </Link>
              <Link to="/bookmark" className="navbar-link book-marks">
                Bookmarks
              </Link>
              <Link to="/" onClick={logout} className="navbar-link log-out">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="#" onClick={openRegisterModal} className="navbar-link register">
                Register Now
              </Link>
              <Link to="#" onClick={openLoginModal} className="navbar-link login">
                Sign in
              </Link>
            </>
          )}
        </div>
      )}

      {isLoginModalOpen && <Login closeModal={closeLoginModal} />}
      {isRegisterModalOpen && <Register closeModal={closeRegisterModal} />}
      {isAddStoryModalOpen && (
        <AddStory isOpen={isAddStoryModalOpen} closeModal={closeAddStoryModal} />
      )}
    </nav>
  );
};

export default Navbar;
