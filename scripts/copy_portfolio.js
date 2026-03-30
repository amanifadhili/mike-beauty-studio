const fs = require('fs');
const path = require('path');

const srcDir = '/home/amani/.gemini/antigravity/brain/81c56766-1d30-462c-83d0-654d52cd73a1';
const destDir = path.join(__dirname, '..', 'public', 'portfolio');

// Create destDir if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));

files.forEach(file => {
  // simplify the file name by removing the timestamp part
  // e.g., lash_classic_1_1774837522570.png -> lash_classic_1.png
  let newName = file;
  const match = file.match(/^(.*?)_\d+\.png$/);
  if (match) {
    newName = match[1] + '.png';
  }
  
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, newName);
  
  fs.copyFileSync(srcFile, destFile);
  console.log(`Copied ${file} -> ${newName}`);
});

console.log('Done copying portfolio images!');
