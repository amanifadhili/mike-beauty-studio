const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'app', '(public)', 'services');

try {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    console.log(`✅ Successfully deleted physically: ${targetDir}`);
  } else {
    console.log(`The directory ${targetDir} does not exist anymore. It's already clean!`);
  }
} catch (error) {
  console.error(`Failed to delete directory:`, error);
}
