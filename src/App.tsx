import { useState, useEffect } from 'react';
import { Settings, Home, RefreshCw, Clock, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import './App.css';
import { GameStage } from './components/GameStage';
import { audio } from './logic/AudioEngine';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import type { BannerAdOptions, RewardAdOptions } from '@capacitor-community/admob';

const translations = {
  vi: {
    practice: 'TẬP SỰ',
    normal: 'BÌNH THƯỜNG',
    hard: 'KHÓ',
    leaderboard: 'Bảng Xếp Hạng',
    gameRule: 'LUẬT CHƠI',
    settings: 'Cài Đặt',
    sound: 'Âm thanh',
    vibration: 'Rung',
    darkMode: 'Nền tối',
    language: 'Ngôn ngữ',
    backToMenu: 'Về Màn Hình Chính',
    close: 'Đóng',
    speech: 'Đào cỏ thu hoạch cà rốt, cẩn thận đừng chạm vào các bé Chuột nha!',
    win: 'Thắng Rồi! 🎉',
    lose: 'Bùm!',
    time: 'Thời gian:',
    playAgain: 'Chơi Lại',
    ruleTitle1: 'Cách Đào Đất',
    ruleContent1: 'Chạm 1 lần vào ô cỏ để đào đất tìm cà rốt. Cẩn thận đừng chạm phải Chuột nha!',
    ruleTitle2: 'Cách Đọc Số',
    ruleContent2: 'Số 1 cho biết có ĐÚNG 1 bé Chuột đang lẩn trốn ở 8 ô cỏ xung quanh nó.',
    ruleTitle3: 'Cắm Cờ',
    ruleContent3: 'Nhấn giữ (Long press) để cắm cờ đánh dấu ô có chuột. Đào hết cỏ an toàn là Thắng!',
    back: 'Trở lại',
    next: 'Tiếp',
    gotIt: 'Đã hiểu!',
  },
  en: {
    practice: 'PRACTICE',
    normal: 'NORMAL',
    hard: 'HARD',
    leaderboard: 'Leaderboard',
    gameRule: 'GAME RULE',
    settings: 'Settings',
    sound: 'Sound',
    vibration: 'Vibration',
    darkMode: 'Dark Mode',
    language: 'Language',
    backToMenu: 'Main Menu',
    close: 'Close',
    speech: 'Dig grass to harvest carrots, but be careful not to touch the Moles!',
    win: 'You Win! 🎉',
    lose: 'Boom!',
    time: 'Time:',
    playAgain: 'Play Again',
    ruleTitle1: 'How to Dig',
    ruleContent1: 'Tap once on a grass tile to dig for carrots. Be careful not to hit a Mole!',
    ruleTitle2: 'How to Read Numbers',
    ruleContent2: 'A number 1 means there is EXACTLY 1 Mole hiding in the 8 surrounding tiles.',
    ruleTitle3: 'Flagging',
    ruleContent3: 'Long press to plant a flag and mark a Mole. Clear all safe grass to Win!',
    back: 'Back',
    next: 'Next',
    gotIt: 'Got It!',
  }
};
type Lang = keyof typeof translations;
type TranslationKey = keyof typeof translations['vi'];
// --- SVG Mascot Component ---
const BunnyFace = ({ expression, color }: { expression: 'happy' | 'neutral' | 'intense', color: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width="100" 
      height="100" 
      style={{ 
        position: 'absolute', 
        bottom: '-15px', 
        left: '-15px', 
        transform: 'rotate(15deg)', 
        fill: 'white' 
      }}
    >
      {/* Ears */}
      <ellipse cx="30" cy="28" rx="14" ry="28" transform="rotate(-15 30 28)" />
      <ellipse cx="70" cy="28" rx="14" ry="28" transform="rotate(15 70 28)" />
      {/* Head */}
      <circle cx="50" cy="65" r="42" />
      
      {/* Face details drawn with the button's background color to look 'cut out' */}
      {expression === 'happy' && (
        <g stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round">
          {/* ^ ^ eyes */}
          <path d="M 32 58 Q 38 48 44 58" />
          <path d="M 56 58 Q 62 48 68 58" />
          {/* nose/mouth */}
          <path d="M 45 68 Q 50 72 55 68" />
          <circle cx="50" cy="65" r="2.5" fill={color} stroke="none" />
        </g>
      )}
      {expression === 'neutral' && (
        <g stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round">
          {/* - - eyes */}
          <line x1="32" y1="58" x2="44" y2="58" />
          <line x1="56" y1="58" x2="68" y2="58" />
          {/* flat mouth */}
          <line x1="46" y1="70" x2="54" y2="70" strokeWidth="3" />
        </g>
      )}
      {expression === 'intense' && (
        <g stroke={color} strokeWidth="4.5" fill="none">
          {/* Wide open eyes */}
          <circle cx="38" cy="58" r="4.5" fill={color} />
          <circle cx="62" cy="58" r="4.5" fill={color} />
          {/* Open mouth */}
          <circle cx="50" cy="72" r="3.5" fill="none" strokeWidth="3" />
          {/* Angry eyebrows */}
          <line x1="30" y1="48" x2="42" y2="53" strokeLinecap="round" />
          <line x1="70" y1="48" x2="58" y2="53" strokeLinecap="round" />
          {/* Red cheeks */}
          <circle cx="28" cy="68" r="7" fill="#fca5a5" stroke="none" />
          <circle cx="72" cy="68" r="7" fill="#fca5a5" stroke="none" />
        </g>
      )}
    </svg>
  );
};

const RulesModal = ({ onClose, t }: { onClose: () => void, t: (key: TranslationKey) => string }) => {
  const [slide, setSlide] = useState(0);
  
  const slides = [
    {
      title: t('ruleTitle1'),
      content: t('ruleContent1'),
      renderVisual: () => (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%', height: '100%', backgroundColor: '#5c3a21', padding: '6px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            {/* The revealed tile */}
            <div style={{ backgroundColor: '#7a4d30', borderRadius: '4px', boxShadow: 'inset 0 4px 0 #3a2210' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d' }} />
          </div>
          {/* Finger tapping center */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', fontSize: '45px', transform: 'translate(-20%, -20%)', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.4))', animation: 'tapAnim 1.5s infinite' }}>
            👆
          </div>
        </div>
      )
    },
    {
      title: t('ruleTitle2'),
      content: t('ruleContent2'),
      renderVisual: () => {
        const GrassTile = () => (
          <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/carrot_bg.svg" style={{ width: '75%', height: '75%', objectFit: 'contain' }} alt="Carrot" />
          </div>
        );
        return (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%', height: '100%', backgroundColor: '#5c3a21', padding: '6px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
            <GrassTile />
            <GrassTile />
            <GrassTile />
            
            <GrassTile />
            {/* The revealed tile with 1 */}
            <div style={{ backgroundColor: '#7a4d30', borderRadius: '4px', boxShadow: 'inset 0 4px 0 #3a2210', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', color: '#60a5fa', WebkitTextStroke: '1px #291c13', textShadow: '0 2px 2px #000' }}>1</div>
            {/* The mouse */}
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 0 0 3px #ef4444, 0 4px 0 #65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/mole_mine.svg" style={{ width: '85%', height: '85%', objectFit: 'contain' }} alt="Mole" />
            </div>
            
            <GrassTile />
            <GrassTile />
            <GrassTile />
          </div>
        </div>
        );
      }
    },
    {
      title: t('ruleTitle3'),
      content: t('ruleContent3'),
      renderVisual: () => {
        const GrassTile = () => (
          <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/carrot_bg.svg" style={{ width: '75%', height: '75%', objectFit: 'contain' }} alt="Carrot" />
          </div>
        );
        return (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%', height: '100%', backgroundColor: '#5c3a21', padding: '6px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
            <GrassTile />
            <GrassTile />
            <GrassTile />
            
            <GrassTile />
            {/* The flag */}
            <div style={{ backgroundColor: '#84cc16', borderRadius: '4px', boxShadow: '0 4px 0 #65a30d', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
              <img src="/farm_sign.svg" style={{ width: '85%', height: '85%', objectFit: 'contain' }} alt="Flag" />
            </div>
            <GrassTile />
            
            <GrassTile />
            <GrassTile />
            <GrassTile />
          </div>
          {/* Finger long pressing center */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', fontSize: '45px', transform: 'translate(-20%, -20%)', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.4))', animation: 'longPressAnim 2s infinite' }}>
            👆
          </div>
        </div>
        );
      }
    }
  ];

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 3000 }}>
      {/* NO overflowY: 'auto' so the mascot rabbit is NOT cut off */}
      <div className="modal-content" style={{ maxWidth: '90%', width: '340px', padding: '45px 25px 25px 25px', background: '#fff', borderRadius: '30px', border: '6px solid #fbcfe8', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Peeking Mascot */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', fontSize: '70px', filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.2))' }}>
          🐰
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.8rem', color: '#ec4899', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          🥕 {t('gameRule')} <img src="/mole_mine.svg" style={{ width: '32px', height: '32px', objectFit: 'contain' }} alt="Mole" />
        </h2>
        
        {/* Slide Visual Area */}
        <div style={{ padding: '20px 0', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {slides[slide].renderVisual()}
        </div>

        <h3 style={{ textAlign: 'center', color: '#ec4899', fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px' }}>
          {slide + 1}. {slides[slide].title}
        </h3>
        
        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.5', minHeight: '65px', fontWeight: 'bold' }}>
          {slides[slide].content}
        </p>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          {slide > 0 ? (
            <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSlide(s => s - 1)}>
              {t('back')}
            </button>
          ) : (
            <button className="btn-secondary" style={{ flex: 1, padding: '12px', opacity: 0.5 }} disabled>
              {t('back')}
            </button>
          )}
          
          {slide < slides.length - 1 ? (
            <button className="btn-primary" style={{ flex: 1, padding: '12px', backgroundColor: '#34d399', boxShadow: '0 4px 0 #059669', border: 'none' }} onClick={() => setSlide(s => s + 1)}>
              {t('next')} 
            </button>
          ) : (
            <button className="btn-primary" style={{ flex: 1, padding: '12px', backgroundColor: '#ec4899', boxShadow: '0 4px 0 #be185d', border: 'none' }} onClick={onClose}>
              {t('gotIt')}
            </button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: i === slide ? '#ec4899' : '#fbcfe8' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState('SPLASH');
  const [gameOverStatus, setGameOverStatus] = useState<'NONE' | 'WIN' | 'LOSE'>('NONE');
  
  // Settings & Rules state
  const [showSettings, setShowSettings] = useState(false);
  const [showRules, setShowRules] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [hapticEnabled, setHapticEnabled] = useState(() => localStorage.getItem('hapticEnabled') !== 'false');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState<Lang>(() => (localStorage.getItem('language') as Lang) || 'vi');

  const t = (key: TranslationKey) => translations[language][key];

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    audio.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('hapticEnabled', hapticEnabled.toString());
  }, [hapticEnabled]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const [gamesPlayed, setGamesPlayed] = useState(() => parseInt(localStorage.getItem('gamesPlayed') || '0'));
  const [nextAdShowCount, setNextAdShowCount] = useState(() => parseInt(localStorage.getItem('nextAdShowCount') || '5'));

  useEffect(() => {
    localStorage.setItem('gamesPlayed', gamesPlayed.toString());
  }, [gamesPlayed]);

  useEffect(() => {
    localStorage.setItem('nextAdShowCount', nextAdShowCount.toString());
  }, [nextAdShowCount]);

  useEffect(() => {
    AdMob.initialize().then(() => {
      // Banner Ad
      const options: BannerAdOptions = {
        adId: 'ca-app-pub-9818038428942167/2375638048',
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
      };
      AdMob.showBanner(options);

      // Preload Reward Video Ad
      const rewardOptions: RewardAdOptions = {
        adId: 'ca-app-pub-9818038428942167/2125070616',
        isTesting: false
      };
      AdMob.prepareRewardVideoAd(rewardOptions);
    }).catch(e => console.log('AdMob Error', e));
  }, []);

  // In-game state
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameId, setGameId] = useState(Date.now()); // Used to reset GameStage
  
  // Difficulty settings
  const [boardWidth, setBoardWidth] = useState(9);
  const [boardHeight, setBoardHeight] = useState(9);
  const [totalMines, setTotalMines] = useState(10);
  const [minesLeft, setMinesLeft] = useState(10);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Handle Splash Screen
  useEffect(() => {
    if (screen === 'SPLASH') {
      const timer = setTimeout(() => {
        setScreen('MENU');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Timer
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && gameOverStatus === 'NONE' && screen === 'PLAY') {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning || gameOverStatus !== 'NONE' || screen !== 'PLAY') {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameOverStatus, screen]);

  const handleGameOver = (win: boolean) => {
    setIsTimerRunning(false);
    // Add a 1.2s delay before showing the modal so the player can see the board and avoid accidental clicks
    setTimeout(() => {
      setGameOverStatus(win ? 'WIN' : 'LOSE');
    }, 1200);
  };

  const startGame = async (w: number, h: number, m: number) => {
    // Show Ad logic
    if (gamesPlayed >= nextAdShowCount) {
      try {
        await AdMob.showRewardVideoAd();
        // Preload next ad
        AdMob.prepareRewardVideoAd({ adId: 'ca-app-pub-9818038428942167/2125070616', isTesting: false });
      } catch (e) {
        console.log('Error showing ad', e);
      }
      setNextAdShowCount(gamesPlayed + Math.floor(Math.random() * 6) + 5);
    }
    
    setGamesPlayed(prev => prev + 1);

    setBoardWidth(w);
    setBoardHeight(h);
    setTotalMines(m);
    setGameOverStatus('NONE');
    setTime(0);
    setMinesLeft(m);
    setIsTimerRunning(true);
    setGameId(Date.now()); // Reset the game board
    setScreen('PLAY');
  };

  // The Settings Modal Component
  const SettingsModal = () => (
    <div className="modal-overlay fade-in" style={{ zIndex: 3000 }}>
      <div className="modal-content" style={{ maxWidth: '90%', width: '320px', padding: '45px 30px 30px 30px', background: '#fff', borderRadius: '30px', border: '6px solid #fbcfe8', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Peeking Mascot */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', fontSize: '70px', filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.2))' }}>
          🐰
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '2rem', color: '#ec4899', fontWeight: 900 }}>⚙️ {t('settings')}</h2>
        
        <div className="setting-item" style={{ marginBottom: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}>
            {soundEnabled ? <Volume2 size={24}/> : <VolumeX size={24}/>} {t('sound')}
          </span>
          <label className="switch-ios">
            <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
            <span className="slider-ios"></span>
          </label>
        </div>

        <div className="setting-item" style={{ marginBottom: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}>
            <span style={{ fontSize: '1.5rem' }}>📳</span> {t('vibration')}
          </span>
          <label className="switch-ios">
            <input type="checkbox" checked={hapticEnabled} onChange={() => setHapticEnabled(!hapticEnabled)} />
            <span className="slider-ios"></span>
          </label>
        </div>

        <div className="setting-item" style={{ marginBottom: '25px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}>
            {darkMode ? <Moon size={24}/> : <Sun size={24}/>} {t('darkMode')}
          </span>
          <label className="switch-ios">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider-ios"></span>
          </label>
        </div>

        <div className="setting-item" style={{ marginBottom: '25px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4b5563' }}>
            <span style={{ fontSize: '1.5rem' }}>🌐</span> {t('language')}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{ padding: '5px 15px', borderRadius: '15px', border: '2px solid', borderColor: language === 'vi' ? '#ec4899' : '#e5e7eb', background: language === 'vi' ? '#fbcfe8' : 'transparent', fontWeight: 'bold', color: '#4b5563', cursor: 'pointer' }}
              onClick={() => setLanguage('vi')}
            >
              VI
            </button>
            <button 
              style={{ padding: '5px 15px', borderRadius: '15px', border: '2px solid', borderColor: language === 'en' ? '#ec4899' : '#e5e7eb', background: language === 'en' ? '#fbcfe8' : 'transparent', fontWeight: 'bold', color: '#4b5563', cursor: 'pointer' }}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {screen === 'PLAY' && (
            <button className="btn-primary" style={{ backgroundColor: '#ef4444', color: 'white', justifyContent: 'center', boxShadow: '0 4px 0 #b91c1c', border: 'none' }} onClick={() => {
              setShowSettings(false);
              setScreen('MENU');
            }}>
              <Home size={20}/> {t('backToMenu')}
            </button>
          )}
          
          <button className="btn-secondary" style={{ justifyContent: 'center', border: 'none' }} onClick={() => setShowSettings(false)}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* --- SPLASH SCREEN --- */}
      {screen === 'SPLASH' && (
        <div className="splash-screen fade-in">
          <div className="studio-logo">
            <img src="/logo_studio.png" alt="Hehe Studio" style={{ width: '80%', maxWidth: '300px', marginBottom: '20px' }} />
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN MENU --- */}
      {screen === 'MENU' && (
        <div className="screen-container fade-in">
          <div style={{ position: 'absolute', top: '25px', right: '20px' }}>
            <button className="btn-icon" onClick={() => setShowSettings(true)} style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <Settings size={28} color="#9ca3af" />
            </button>
          </div>

          <button className="menu-btn menu-btn-practice" onClick={() => startGame(9, 9, 10)}>
            <BunnyFace expression="happy" color="#34d399" />
            <span className="menu-btn-text">{t('practice')}</span>
          </button>
          
          <button className="menu-btn menu-btn-normal" onClick={() => startGame(12, 16, 30)}>
            <BunnyFace expression="neutral" color="#fbbf24" />
            <span className="menu-btn-text">{t('normal')}</span>
          </button>

          <button className="menu-btn menu-btn-hard" onClick={() => startGame(16, 24, 70)}>
            <BunnyFace expression="intense" color="#fb7185" />
            <span className="menu-btn-text">{t('hard')}</span>
          </button>

          <div className="bottom-pill-container">
            <button className="bottom-pill pill-leaderboard">{t('leaderboard')}</button>
            <button className="bottom-pill pill-rules" onClick={() => setShowRules(true)}>{t('gameRule')}</button>
          </div>

          {showSettings && <SettingsModal />}
          {showRules && <RulesModal onClose={() => setShowRules(false)} t={t} />}
        </div>
      )}

      {/* --- GAMEPLAY --- */}
      {screen === 'PLAY' && (
        <div className="screen-container fade-in" style={{ justifyContent: 'flex-start', paddingTop: '25px', paddingBottom: '10px' }}>
          
          {/* HEADER */}
          <div className="game-header glass-panel">
            <button className="btn-icon" onClick={() => { setIsTimerRunning(false); setShowSettings(true); }}>
               <Settings size={24} />
            </button>

            <div className="stats-box glass-panel" style={{ padding: '5px 12px', fontSize: '1.2rem', gap: '5px' }}>
              <img src="/farm_sign.svg" alt="Flags Left" width={24} height={24} /> {minesLeft}
            </div>

            <div className="stats-box glass-panel" style={{ padding: '5px 12px', fontSize: '1.2rem', gap: '5px' }}>
              <Clock size={20} /> {time}
            </div>
          </div>

          {/* MASCOT RABBIT */}
          <div className="mascot-container">
            <img src="/mascot_rabbit.png" alt="Rabbit Mascot" className="mascot-img" />
            <div className="speech-bubble glass-panel">
              {t('speech')} <img src="/mole_mine.svg" style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle' }} alt="Mole" />
            </div>
          </div>

          {/* GAME BOARD */}
          <div className="game-stage-wrapper" style={{ marginTop: '10px' }}>
            <GameStage 
              key={gameId} 
              width={boardWidth} 
              height={boardHeight} 
              mines={totalMines} 
              onGameOver={handleGameOver} 
              onFlagChange={(flagsLeft) => setMinesLeft(flagsLeft)}
            />
          </div>

          {/* GAME OVER MODAL */}
          {gameOverStatus !== 'NONE' && (
            <div className="modal-overlay fade-in" style={{ zIndex: 3000 }}>
              <div 
                className="modal-content" 
                style={{ 
                  textAlign: 'center', 
                  maxWidth: '90%', 
                  width: '320px', 
                  padding: '45px 30px 30px 30px', 
                  background: '#fff', 
                  borderRadius: '30px', 
                  border: gameOverStatus === 'WIN' ? '6px solid #86efac' : '6px solid #fca5a5', 
                  position: 'relative', 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                }}
              >
                {/* Peeking Mascot */}
                <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.2))' }}>
                  {gameOverStatus === 'WIN' ? <span style={{ fontSize: '70px' }}>🐰</span> : <img src="/mole_mine.svg" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Mole" />}
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '5px', color: gameOverStatus === 'WIN' ? '#22c55e' : '#ef4444', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  {gameOverStatus === 'WIN' ? t('win') : <>{t('lose')} <img src="/mole_mine.svg" style={{ width: '45px', height: '45px', objectFit: 'contain' }} alt="Mole" /></>}
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '25px', color: '#4b5563', fontWeight: 'bold' }}>{t('time')} {time}s</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn-primary" style={{ margin: '0 auto', width: '100%', justifyContent: 'center', backgroundColor: gameOverStatus === 'WIN' ? '#22c55e' : '#ef4444', color: 'white', boxShadow: gameOverStatus === 'WIN' ? '0 4px 0 #16a34a' : '0 4px 0 #b91c1c', border: 'none' }} onClick={() => startGame(boardWidth, boardHeight, totalMines)}>
                    <RefreshCw size={24} /> {t('playAgain')}
                  </button>
                  <button className="btn-secondary" style={{ margin: '0 auto', width: '100%', justifyContent: 'center', border: 'none' }} onClick={() => setScreen('MENU')}>
                    <Home size={24} /> {t('backToMenu')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* IN-GAME SETTINGS MODAL */}
          {showSettings && <SettingsModal />}
        </div>
      )}

      {/* CUTE BANNER DECORATION */}
      <div style={{ position: 'absolute', bottom: '50px', left: 0, width: '100%', height: '30px', pointerEvents: 'none', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', fontSize: '20px', padding: '0 10px' }}>
        <span>🥕</span>
        <span>🐰</span>
        <span>🥕</span>
        <span>🐰</span>
        <span>🥕</span>
      </div>
    </div>
  );
}

export default App;
