import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          style={overlayStyle}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={modalStyle}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 700 }}>Welcome to MoodFlix</h2>
            
            {/* Toggle System with Animated Underline */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', position: 'relative' }}>
              <button onClick={() => setIsLogin(true)} style={{ ...toggleBtnStyle, color: isLogin ? '#FF2E55' : '#666' }}>Login</button>
              <button onClick={() => setIsLogin(false)} style={{ ...toggleBtnStyle, color: !isLogin ? '#FF2E55' : '#666' }}>Sign Up</button>
              <motion.div 
                animate={{ x: isLogin ? -38 : 38 }} 
                style={underlineStyle} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {!isLogin && <input type="text" placeholder="Username" style={inputStyle} />}
              <input type="email" placeholder="Email" style={inputStyle} />
              <input type="password" placeholder="Password" style={inputStyle} />
              {!isLogin && <input type="password" placeholder="Confirm Password" style={inputStyle} />}
            </div>
            
            <button style={continueBtnStyle}>CONTINUE</button>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Styles based on your Section 6 Spec
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' };
const modalStyle = { background: '#111111', padding: '50px', borderRadius: '20px', width: '400px', border: '1px solid #262626', boxShadow: '0 0 60px rgba(255,46,85,0.2)' };
const toggleBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '16px', transition: '0.3s' };
const underlineStyle = { position: 'absolute', bottom: -5, width: '40px', height: '2px', background: '#FF2E55' };
const inputStyle = { width: '100%', padding: '14px', background: '#141414', border: '1px solid #262626', color: 'white', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' };
const continueBtnStyle = { width: '100%', padding: '16px', background: '#FF2E55', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', marginTop: '10px', cursor: 'pointer' };
const cancelBtnStyle = { width: '100%', background: 'none', border: 'none', color: '#B3B3B3', marginTop: '20px', cursor: 'pointer', fontSize: '14px' };

export default Login;