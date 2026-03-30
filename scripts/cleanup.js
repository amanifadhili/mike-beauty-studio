const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app', '(public)', 'booking');

try {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    console.log(`✅ Legacy booking page directory physically deleted: ${targetDir}`);
  } else {
    console.log(`The directory ${targetDir} does not exist anymore. It's already cleaned!`);
  }
} catch (error) {
  console.error(`Failed to delete directory:`, error);
}
