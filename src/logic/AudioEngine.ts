// Web Audio API Synthesizer for Bunny's Sweeper
class AudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmAudio: HTMLAudioElement | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/bgm.m4a');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.4; // Lofi usually needs to be soft
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
  }

  public playBGM() {
    if (!this.enabled) return;
    this.init();
    if (this.bgmAudio) {
      this.bgmAudio.play().catch(e => {
        console.log('Autoplay prevented, waiting for interaction:', e);
        const playOnInteract = () => {
          if (this.enabled && this.bgmAudio) {
            this.bgmAudio.play().catch(() => {});
          }
          document.removeEventListener('click', playOnInteract);
          document.removeEventListener('touchstart', playOnInteract);
        };
        document.addEventListener('click', playOnInteract);
        document.addEventListener('touchstart', playOnInteract);
      });
    }
  }

  public stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  public playDig() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playFlag() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playExplosion() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Lowpass filter for explosion thud
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  public playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const playNote = (freq: number, startTime: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    };

    const now = this.ctx.currentTime;
    playNote(440, now);       // A4
    playNote(554.37, now + 0.1); // C#5
    playNote(659.25, now + 0.2); // E5
    playNote(880, now + 0.3); // A5
  }
}

export const audio = new AudioEngine();
