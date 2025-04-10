
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n' // Import i18n configuration

// Performance measurement - Uncomment when setting up web-vitals
// import { reportWebVitals } from './lib/performance';

// Initialize the app with performance timing
const startTime = performance.now();

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Log initial render time in development
if (process.env.NODE_ENV === 'development') {
  const renderTime = performance.now() - startTime;
  console.log(`[Performance] Initial app render: ${renderTime.toFixed(2)}ms`);
}

// Enable web vitals reporting when ready
// reportWebVitals(console.log);
