import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bunnysweeper.game',
  appName: 'BunnysSweeper',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9818038428942167~6307144192',
    }
  }
};

export default config;
