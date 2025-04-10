
// This file is a reference for scripts to add to package.json
module.exports = {
  scripts: {
    "analyze": "source-map-explorer 'dist/assets/*.js'",
    "build:production": "vite build --mode production",
    "serve:production": "vite preview --mode production"
  }
};

/**
 * To use the source-map-explorer, add the following to your package.json:
 * 
 * 1. Install the package:
 *    npm install --save-dev source-map-explorer
 * 
 * 2. Add the script to your package.json scripts section:
 *    "analyze": "source-map-explorer 'dist/assets/*.js'"
 * 
 * 3. Build your app with source maps:
 *    npm run build
 * 
 * 4. Run the analyzer:
 *    npm run analyze
 */
