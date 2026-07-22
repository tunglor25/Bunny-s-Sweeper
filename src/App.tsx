import { useState, useEffect, useRef } from 'react';
import { Settings, Home, RefreshCw, Clock, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import './App.css';
import { GameStage } from './components/GameStage';
import { audio } from './logic/AudioEngine';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import type { BannerAdOptions, RewardAdOptions } from '@capacitor-community/admob';

import { translations, languages } from './translations';
import type { LangCode } from './translations';
type TranslationKey = keyof typeof translations['en'];

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
  const [language, setLanguage] = useState<LangCode>(() => (localStorage.getItem('language') as LangCode) || 'en');

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
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
      };
      
      const loadBanner = () => {
        if (!isHardModeRef.current) {
          AdMob.showBanner(options).catch(e => console.log('AdMob Show Error', e));
        }
      };
      
      loadBanner();

      // Retry loading if banner fails (e.g. no fill or network issue)
      AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
        console.log('Banner failed to load:', error);
        setTimeout(loadBanner, 15000); // retry after 15 seconds
      });

      // Preload Reward Video Ad
      const rewardOptions: RewardAdOptions = {
        adId: 'ca-app-pub-9818038428942167/2125070616',
        isTesting: false
      };
      AdMob.prepareRewardVideoAd(rewardOptions).catch(e => console.log('AdMob Reward Error', e));
    }).catch(e => console.log('AdMob Init Error', e));
  }, []);

  // In-game state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameId, setGameId] = useState(Date.now()); // Used to reset GameStage
  
  // Difficulty settings
  const [boardWidth, setBoardWidth] = useState(9);
  const [boardHeight, setBoardHeight] = useState(9);
  const [totalMines, setTotalMines] = useState(10);
  const [minesLeft, setMinesLeft] = useState(10);

  const isHardMode = screen === 'PLAY' && totalMines === 70;
  const isHardModeRef = useRef(isHardMode);

  useEffect(() => {
    isHardModeRef.current = isHardMode;
    if (isHardMode) {
      AdMob.hideBanner().catch(e => console.log('AdMob Hide Error', e));
    } else {
      const options: BannerAdOptions = {
        adId: 'ca-app-pub-9818038428942167/2375638048',
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false
      };
      AdMob.showBanner(options).catch(e => console.log('AdMob Show Error', e));
    }
  }, [isHardMode]);

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
          <div style={{ display: 'flex' }}>
            <button 
              onClick={() => setShowLanguageModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '20px',
                border: '2px solid #fbcfe8', backgroundColor: '#fdf2f8',
                color: '#ec4899', fontWeight: 'bold', fontSize: '1rem',
                boxShadow: '0 4px 6px -1px rgba(251, 207, 232, 0.5)',
                cursor: 'pointer'
              }}
            >
              {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
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

  const LanguageModal = () => (
    <div className="modal-overlay fade-in" style={{ zIndex: 4000 }}>
      <div className="modal-content" style={{ maxWidth: '90%', width: '340px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '25px', background: '#fff', borderRadius: '30px', border: '6px solid #fbcfe8', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', color: '#ec4899', fontWeight: 900 }}>🌐 {t('language')}</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingBottom: '10px' }}>
          {languages.map(lang => (
            <button 
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setShowLanguageModal(false); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                padding: '15px 10px', borderRadius: '20px', cursor: 'pointer',
                border: language === lang.code ? '3px solid #ec4899' : '2px solid #f3f4f6',
                backgroundColor: language === lang.code ? '#fdf2f8' : '#fff',
                color: language === lang.code ? '#ec4899' : '#4b5563',
                fontWeight: 'bold', fontSize: '0.9rem',
                boxShadow: language === lang.code ? '0 4px 10px rgba(236, 72, 153, 0.2)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{lang.flag}</span>
              <span style={{ textAlign: 'center' }}>{lang.name}</span>
            </button>
          ))}
        </div>

        <button className="btn-secondary" style={{ width: '100%', marginTop: '15px', justifyContent: 'center', border: 'none', flexShrink: 0 }} onClick={() => setShowLanguageModal(false)}>
          {t('back')}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${screen === 'MENU' ? 'bg-menu' : ''} ${screen === 'PLAY' ? 'bg-play' : ''} ${gameOverStatus !== 'NONE' ? 'blur-bg' : ''} ${isHardMode ? 'no-ad-padding' : ''}`}>
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
          <div style={{ position: 'absolute', top: '35px', right: '25px', zIndex: 10 }}>
            <button className="btn-icon" onClick={() => setShowSettings(true)}>
              <Settings size={28} />
            </button>
          </div>

          <button className="menu-btn menu-btn-practice" onClick={() => startGame(9, 9, 10)}>
            <div className="menu-btn-mascot practice-mascot"></div>
            <div className="menu-btn-text-container">
              <span className="menu-btn-text">{t('practice')}</span>
              <div className="menu-btn-divider"><span className="menu-btn-carrot">🥕</span></div>
              <span className="menu-btn-subtext">{t('practiceSub')}</span>
            </div>
          </button>
          
          <button className="menu-btn menu-btn-normal" onClick={() => startGame(12, 16, 30)}>
            <div className="menu-btn-mascot normal-mascot"></div>
            <div className="menu-btn-text-container">
              <span className="menu-btn-text">{t('normal')}</span>
              <div className="menu-btn-divider"><span className="menu-btn-carrot">🥕</span></div>
              <span className="menu-btn-subtext">{t('normalSub')}</span>
            </div>
          </button>

          <button className="menu-btn menu-btn-hard" onClick={() => startGame(16, 24, 70)}>
            <div className="menu-btn-mascot hard-mascot"></div>
            <div className="menu-btn-text-container">
              <span className="menu-btn-text">{t('hard')}</span>
              <div className="menu-btn-divider"><span className="menu-btn-carrot">🥕</span></div>
              <span className="menu-btn-subtext">{t('hardSub')}</span>
            </div>
          </button>

          <div className="bottom-pill-container">
            <button className="bottom-pill pill-leaderboard">🏆 {t('leaderboard')}</button>
            <button className="bottom-pill pill-rules" onClick={() => setShowRules(true)}>📖 {t('gameRule')}</button>
          </div>

          {showSettings && !showLanguageModal && <SettingsModal />}
          {showLanguageModal && <LanguageModal />}
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
          {showSettings && !showLanguageModal && <SettingsModal />}
          {showLanguageModal && <LanguageModal />}
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
