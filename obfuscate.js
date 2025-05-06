/**
 * Simple JavaScript and CSS Obfuscator
 * --------------------------
 * Script sederhana untuk mengobfuscate kode JavaScript
 * dan meminify CSS sebelum di-push ke GitHub Pages
 * 
 * Penggunaan: 
 * 1. Install Node.js
 * 2. Install terlebih dahulu: npm install terser clean-css
 * 3. Jalankan: node obfuscate.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Check if dependencies are installed
  try {
    require.resolve('terser');
    require.resolve('clean-css');
  } catch (e) {
    console.log('Installing required packages...');
    execSync('npm install terser clean-css', { stdio: 'inherit' });
  }

  const Terser = require('terser');
  const CleanCSS = require('clean-css');

  // Paths
  const mainJsFile = path.join(__dirname, 'script.js'); // Adjust to your script file name
  const minJsOutput = path.join(__dirname, 'obfuscated-files', 'script.min.js');
  
  const mainCssFile = path.join(__dirname, 'style.css');
  const minCssOutput = path.join(__dirname, 'obfuscated-files', 'style.min.css');

  // Ensure output directory exists
  if (!fs.existsSync(path.dirname(minJsOutput))) {
    fs.mkdirSync(path.dirname(minJsOutput), { recursive: true });
  }

  // Obfuscate JavaScript
  if (fs.existsSync(mainJsFile)) {
    const jsCode = fs.readFileSync(mainJsFile, 'utf8');
    Terser.minify(jsCode, {
      compress: {
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        keep_fargs: false,
        passes: 3
      },
      mangle: {
        toplevel: true,
        properties: true
      },
      output: {
        beautify: false
      }
    }).then(result => {
      fs.writeFileSync(minJsOutput, result.code);
      console.log(`✅ JavaScript obfuscated and saved to ${minJsOutput}`);
    }).catch(err => {
      console.error('❌ JavaScript obfuscation failed:', err);
    });
  } else {
    console.log(`❌ JavaScript file not found: ${mainJsFile}`);
  }

  // Minify CSS
  if (fs.existsSync(mainCssFile)) {
    const cssCode = fs.readFileSync(mainCssFile, 'utf8');
    const minifiedCss = new CleanCSS({
      level: {
        1: {
          all: true
        },
        2: {
          all: true 
        }
      }
    }).minify(cssCode);

    fs.writeFileSync(minCssOutput, minifiedCss.styles);
    console.log(`✅ CSS minified and saved to ${minCssOutput}`);
  } else {
    console.log(`❌ CSS file not found: ${mainCssFile}`);
  }

  // Instructions for next steps
  console.log('\n--- NEXT STEPS ---');
  console.log('1. Update your index.html to use the minified files');
  console.log('2. Consider removing or not committing the original files');
  console.log('3. Push the changes to GitHub');

} catch (error) {
  console.error('Error:', error);
} 