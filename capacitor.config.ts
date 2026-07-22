import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hehe.Bunnyssweeper',
  appName: 'Bunny\'s Sweeper',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9818038428942167~6307144192',
    }
  }
};

export default config;
