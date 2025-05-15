import { NextFont } from 'next/dist/compiled/@next/font';
import localFont from 'next/font/local';

// Configure PressStart2P font
export const pressStart2P = localFont({
  src: '../public/fonts/PressStart2P-Regular.ttf',
  display: 'swap',
  variable: '--font-press-start-2p',
  preload: true,
  fallback: ['monospace']
});