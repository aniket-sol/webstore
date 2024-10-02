import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Navbar from './Component/Navbar/index.jsx';
import Home from './pages/Home/index.jsx';
import Login from './pages/Login/index.jsx';
import Register from './pages/Register/index.jsx';
import Bookmark from './pages/Bookmark/index.jsx';
import ShareStory from './pages/Share Story/index.jsx';


function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar onLoginClick={handleLoginClick} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookmark" element={< Bookmark />} />
            <Route path="/story/:id" element={< ShareStory />} />
          </Routes>
          {isLoginModalOpen && <Login closeModal={closeModal} />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;