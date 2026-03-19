import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';

const Homepage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [posterUrl, setPosterUrl] = useState("");

  const API_KEY = 'd8729808deaf90c40331b219faa728c6'; 

  const moods = ['Excited', 'Relaxed', 'Melancholic', 'Romantic', 'Thrilled', 'Thoughtful'];


  const moodSpotlight = {
    Excited: { title: "Mad Max: Fury Road", id: "76341" },
    Relaxed: { title: "The Secret Life of Walter Mitty", id: "116745" },
    Melancholic: { title: "Her", id: "152601" },
    Romantic: { title: "La La Land", id: "313369" },
    Thrilled: { title: "The Dark Knight", id: "155" },
    Thoughtful: { title: "Inception", id: "27205" }
  };

  useEffect(() => {
    if (activeMood) {
      const movieId = moodSpotlight[activeMood].id;
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.poster_path) {
            setPosterUrl(`https://image.tmdb.org/t/p/w1280${data.poster_path}`);
          }
        })
        .catch(err => console.error("TMDb Fetch Error:", err));
    }
  }, [activeMood]);

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Cinematic Red Glow Orb */}
      <div style={redOrbStyle} />

      {/* Navbar Section */}
      <nav style={navStyle}>
        <div style={logoStyle}>MOOD<span style={{ color: '#fff' }}>FLIX</span></div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <span style={navLinkStyle}>Discover</span>
          <span style={navLinkStyle}>Community</span>
          <button onClick={() => setIsLoginOpen(true)} style={joinBtnStyle}>JOIN MOODFLIX</button>
        </div>
      </nav>

      {/* Hero Content */}
      <section style={heroSectionStyle}>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} style={heroTitleStyle}>
            Movies that match <br /> your <span style={textGlowStyle}>vibe.</span>
          </motion.h1>
          <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} style={heroSubtitleStyle}>
            MoodFlix understands your unique taste. Pick a mood, discover your <br/> next favorite film, and join the conversation.
          </motion.p>
        </motion.div>

        {/* Mood Chips */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', zIndex: 10, marginBottom: '40px' }}>
          {moods.map((mood) => (
            <motion.button
              key={mood}
              onClick={() => setActiveMood(mood)}
              whileHover={{ scale: 1.05 }}
              style={{
                ...moodBtnStyle,
                borderColor: activeMood === mood ? '#FF2E55' : '#2A2A2A',
                color: activeMood === mood ? '#FF2E55' : '#fff',
                backgroundColor: activeMood === mood ? 'rgba(255,46,85,0.1)' : '#141414'
              }}
            >
              {mood}
            </motion.button>
          ))}
        </div>

        {/* Mood Spotlight Preview */}
        <div style={{ position: 'relative', height: '350px', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {activeMood && posterUrl ? (
              <motion.div
                key={activeMood}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 100 }}
                style={{ display: 'flex', gap: '50px', alignItems: 'center' }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={posterGlowStyle} />
                  <img 
                    src={posterUrl} 
                    style={spotlightPosterStyle} 
                    alt="Recommended"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/500x750?text=Poster+Not+Found"; }}
                  />
                </div>
                <div>
                  <span style={spotlightTagStyle}>AI RECOMMENDED</span>
                  <h2 style={spotlightTitleStyle}>{moodSpotlight[activeMood].title}</h2>
                  <button style={outlineBtnStyle}>VIEW DETAILS</button>
                </div>
              </motion.div>
            ) : (
              <motion.p initial={{ opacity: 0.3 }} animate={{ opacity: 0.6 }} style={placeholderTextStyle}>
                Select a mood to preview your discovery...
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Social Hub Preview */}
      <section style={{ padding: '100px 60px', backgroundColor: '#050505', position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '50px' }}>Trending <span style={{ color: '#FF2E55' }}>Discussions</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {[1, 2, 3].map((i) => (
            <motion.div whileHover={{ y: -8 }} key={i} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <span style={{ color: '#FF2E55', fontWeight: 700 }}>@MOVIE_BUFF</span>
                <span>❤️ 124</span>
              </div>
              <h4 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px 0' }}>Blade Runner 2049</h4>
              <p style={{ color: '#B3B3B3', fontSize: '14px', lineHeight: '1.6' }}>"The visual storytelling perfectly matches the mood algorithm."</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

// --- STYLES ---
const redOrbStyle = { position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: '#FF2E55', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 };
const navStyle = { height: '80px', padding: '0 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', width: '100%', zIndex: 100, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #262626', boxSizing: 'border-box' };
const logoStyle = { fontWeight: 800, fontSize: '24px', letterSpacing: '2px', color: '#FF2E55' };
const navLinkStyle = { fontSize: '14px', fontWeight: 600, color: '#B3B3B3', cursor: 'pointer' };
const joinBtnStyle = { background: '#FF2E55', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' };
const heroSectionStyle = { minHeight: '100vh', padding: '120px 60px 60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'radial-gradient(circle at top left, #300000, #0A0A0A 70%)', position: 'relative', zIndex: 2, boxSizing: 'border-box' };
const heroTitleStyle = { fontSize: '72px', fontWeight: 700, letterSpacing: '-2px', margin: 0, lineHeight: 1, color: '#fff' };
const textGlowStyle = { color: '#FF2E55', textShadow: '0 0 40px rgba(255,46,85,0.6)' };
const heroSubtitleStyle = { fontSize: '20px', color: '#B3B3B3', maxWidth: '650px', margin: '30px 0 50px 0', lineHeight: 1.6 };
const moodBtnStyle = { border: '1px solid', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: '0.3s' };
const spotlightPosterStyle = { width: '220px', borderRadius: '12px', border: '1px solid rgba(255,46,85,0.3)', position: 'relative', zIndex: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
const posterGlowStyle = { position: 'absolute', inset: -20, background: '#FF2E55', filter: 'blur(50px)', opacity: 0.25 };
const spotlightTagStyle = { color: '#FF2E55', fontSize: '12px', fontWeight: 800, letterSpacing: '2px' };
const spotlightTitleStyle = { fontSize: '48px', fontWeight: 800, margin: '10px 0', color: '#fff' };
const outlineBtnStyle = { background: 'transparent', border: '1px solid #444', color: '#fff', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 };
const placeholderTextStyle = { color: '#444', fontSize: '18px', fontStyle: 'italic' };
const cardStyle = { background: '#141414', padding: '30px', borderRadius: '16px', border: '1px solid #262626', cursor: 'pointer' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };

export default Homepage;