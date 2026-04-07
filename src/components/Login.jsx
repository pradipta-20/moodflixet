import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── API base — adjust if your server runs on a different port ───────────────
const API = 'http://localhost:5000/api';

const Login = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState('email'); // email | otp | complete

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [emailError, setEmailError]     = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading]           = useState(false);
  const [otp, setOtp]                   = useState('');
  const [resendCooldown, setResendCooldown] = useState(0); // seconds

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ─── Resend cooldown timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ─── Validation helpers ────────────────────────────────────────────────────
  const validateEmail = (email) => {
    if (!email)                       { setEmailError('Email is required'); return false; }
    if (!emailRegex.test(email))      { setEmailError('Please enter a valid email address'); return false; }
    setEmailError(''); return true;
  };

  const validatePassword = (password) => {
    if (!password)                    { setPasswordError('Password is required'); return false; }
    if (password.length < 6)          { setPasswordError('Password must be at least 6 characters'); return false; }
    if (!isLogin && formData.confirmPassword && password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match'); return false;
    }
    setPasswordError(''); return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setGeneralError('');
    setSuccessMessage('');
    if (name === 'email') validateEmail(value);
    if (name === 'password' || name === 'confirmPassword')
      validatePassword(name === 'password' ? value : formData.password);
  };

  // ─── Send OTP via backend (Nodemailer) ────────────────────────────────────
  const sendOtp = async () => {
    setLoading(true);
    setGeneralError('');
    try {
      const res = await fetch(`${API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setResendCooldown(60); // 60-second cooldown before resend
      return true;
    } catch (err) {
      setGeneralError(err.message || 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ─── Verify OTP via backend ───────────────────────────────────────────────
  const verifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setGeneralError('');
    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setVerificationStep('complete');
      setSuccessMessage('✓ Email verified successfully!');
    } catch (err) {
      setGeneralError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Sign Up ───────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    if (!formData.username.trim()) { setGeneralError('Username is required'); return; }
    if (!validateEmail(formData.email)) return;
    if (!validatePassword(formData.password)) return;
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match'); return;
    }
    const sent = await sendOtp();
    if (sent) {
      setIsVerifying(true);
      setVerificationStep('otp');
    }
  };

  // ─── Handle Login ─────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    if (!validateEmail(formData.email)) return;
    if (!validatePassword(formData.password)) return;

    setLoading(true);
    try {
      // ── Replace this block with your real login API call ──
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('✓ Login successful! Redirecting...');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch {
      setGeneralError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Complete Sign Up ─────────────────────────────────────────────────────
  const completeSignUp = async () => {
    setLoading(true);
    try {
      // ── Replace with real account creation API call ──
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('✓ Account created successfully!');
      setTimeout(() => {
        onClose();
        resetForm();
        setIsLogin(true);
      }, 1500);
    } catch {
      setGeneralError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp('');
    setGeneralError('');
    const sent = await sendOtp();
    if (sent) setSuccessMessage('A new code was sent to your email.');
  };

  // ─── Reset ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setEmailError(''); setPasswordError(''); setGeneralError(''); setSuccessMessage('');
    setOtp(''); setIsVerifying(false); setVerificationStep('email'); setResendCooldown(0);
  };

  useEffect(() => { resetForm(); }, [isLogin]);

  // ─── Render ───────────────────────────────────────────────────────────────
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
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={modalStyle}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 700 }}>
              Welcome to MoodFlix
            </h2>

            {/* Alerts */}
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...alertStyle, background: '#2a1f1f', borderColor: '#FF2E55', color: '#FF2E55' }}
              >
                {generalError}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...alertStyle, background: '#1f2a21', borderColor: '#00D084', color: '#00D084' }}
              >
                {successMessage}
              </motion.div>
            )}

            {/* ── OTP Step ── */}
            {isVerifying && verificationStep === 'otp' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ textAlign: 'center', color: '#B3B3B3', marginBottom: '8px', fontSize: '14px' }}>
                  Verification code sent to
                </p>
                <p style={{ textAlign: 'center', color: '#fff', fontWeight: 600, marginBottom: '20px', fontSize: '15px' }}>
                  {formData.email}
                </p>

                {/* OTP digit boxes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 44, height: 52,
                        background: '#141414',
                        border: `1px solid ${otp[i] ? '#FF2E55' : '#333'}`,
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 700, color: '#fff',
                        transition: '0.15s',
                      }}
                    >
                      {otp[i] || ''}
                    </div>
                  ))}
                </div>

                {/* Hidden single input drives the boxes above */}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  style={{ ...inputStyle, textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }}
                  autoFocus
                />

                <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', textAlign: 'center' }}>
                  Didn't receive a code?{' '}
                  <span
                    onClick={handleResend}
                    style={{
                      color: resendCooldown > 0 ? '#555' : '#FF2E55',
                      cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                  </span>
                </p>

                <button
                  onClick={verifyOtp}
                  disabled={otp.length !== 6 || loading}
                  style={{ ...continueBtnStyle, marginTop: '16px', opacity: (otp.length !== 6 || loading) ? 0.5 : 1 }}
                >
                  {loading ? 'VERIFYING…' : 'VERIFY CODE'}
                </button>
              </motion.div>
            )}

            {/* ── Verification Complete ── */}
            {isVerifying && verificationStep === 'complete' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ color: '#B3B3B3', marginBottom: '20px' }}>
                  Your email has been verified.<br />Complete your sign up below.
                </p>
                <button onClick={completeSignUp} disabled={loading} style={continueBtnStyle}>
                  {loading ? 'CREATING ACCOUNT…' : 'COMPLETE SIGN UP'}
                </button>
              </motion.div>
            )}

            {/* ── Login / Sign Up Form ── */}
            {!isVerifying && verificationStep === 'email' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', position: 'relative' }}>
                  <button onClick={() => setIsLogin(true)}  style={{ ...toggleBtnStyle, color: isLogin  ? '#FF2E55' : '#666' }}>Login</button>
                  <button onClick={() => setIsLogin(false)} style={{ ...toggleBtnStyle, color: !isLogin ? '#FF2E55' : '#666' }}>Sign Up</button>
                  <motion.div animate={{ x: isLogin ? -38 : 38 }} style={underlineStyle} />
                </div>

                <form onSubmit={isLogin ? handleLogin : handleSignUp}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {!isLogin && (
                      <input
                        type="text" name="username" placeholder="Username"
                        value={formData.username} onChange={handleInputChange}
                        style={inputStyle}
                      />
                    )}

                    <div>
                      <input
                        type="email" name="email" placeholder="Email"
                        value={formData.email} onChange={handleInputChange}
                        style={{
                          ...inputStyle,
                          borderColor: emailError ? '#FF2E55' : '#262626',
                          background: emailError ? 'rgba(255,46,85,0.08)' : '#141414',
                        }}
                      />
                      {emailError && (
                        <p style={fieldMsgStyle('#FF2E55')}>{emailError}</p>
                      )}
                      {!emailError && formData.email && emailRegex.test(formData.email) && (
                        <p style={fieldMsgStyle('#00D084')}>✓ Email looks good</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="password" name="password" placeholder="Password"
                        value={formData.password} onChange={handleInputChange}
                        style={{
                          ...inputStyle,
                          borderColor: passwordError && formData.password ? '#FF2E55' : '#262626',
                          background: passwordError && formData.password ? 'rgba(255,46,85,0.08)' : '#141414',
                        }}
                      />
                      {passwordError && formData.password && (
                        <p style={fieldMsgStyle('#FF2E55')}>{passwordError}</p>
                      )}
                    </div>

                    {!isLogin && (
                      <div>
                        <input
                          type="password" name="confirmPassword" placeholder="Confirm Password"
                          value={formData.confirmPassword} onChange={handleInputChange}
                          style={{
                            ...inputStyle,
                            borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? '#FF2E55' : '#262626',
                            background: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'rgba(255,46,85,0.08)' : '#141414',
                          }}
                        />
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p style={fieldMsgStyle('#00D084')}>✓ Passwords match</p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...continueBtnStyle, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading
                      ? (isLogin ? 'LOGGING IN…' : 'SENDING CODE…')
                      : (isLogin ? 'LOGIN' : 'SEND VERIFICATION CODE')}
                  </button>
                </form>
              </>
            )}

            <button onClick={() => { onClose(); resetForm(); }} style={cancelBtnStyle}>
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const fieldMsgStyle = (color) => ({
  color, fontSize: '12px', margin: '5px 0 0 0',
});

const overlayStyle    = { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' };
const modalStyle      = { background: '#111111', padding: '50px', borderRadius: '20px', width: '400px', border: '1px solid #262626', boxShadow: '0 0 60px rgba(255,46,85,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const toggleBtnStyle  = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '16px', transition: '0.3s' };
const underlineStyle  = { position: 'absolute', bottom: -5, width: '40px', height: '2px', background: '#FF2E55' };
const inputStyle      = { width: '100%', padding: '14px', background: '#141414', border: '1px solid #262626', color: 'white', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', transition: '0.2s', fontSize: '14px' };
const continueBtnStyle = { width: '100%', padding: '16px', background: '#FF2E55', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', marginTop: '10px', cursor: 'pointer', transition: '0.2s' };
const cancelBtnStyle  = { width: '100%', background: 'none', border: 'none', color: '#B3B3B3', marginTop: '20px', cursor: 'pointer', fontSize: '14px' };
const alertStyle      = { padding: '12px', borderRadius: '8px', border: '1px solid', marginBottom: '15px', fontSize: '14px', textAlign: 'center' };

export default Login;
