const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const coinsSrc = 'C:/Users/ASUS/.gemini/antigravity/brain/e0fd850b-6fc1-478d-8ead-61709d7581ab/.user_uploaded/media_1793555108244_b4cc72c2.png';
const notesSrc = 'C:/Users/ASUS/.gemini/antigravity/brain/e0fd850b-6fc1-478d-8ead-61709d7581ab/.user_uploaded/media_1793555128016_91aa9249.png';

const coinsDir = path.join(__dirname, '../public/assets/coins');
const currencyDir = path.join(__dirname, '../public/assets/currency');

if (!fs.existsSync(coinsDir)) fs.mkdirSync(coinsDir, { recursive: true });
if (!fs.existsSync(currencyDir)) fs.mkdirSync(currencyDir, { recursive: true });

async function cropAssets() {
  console.log('Cropping real coins...');

  // Coins in media_1793555108244_b4cc72c2.png (565 x 542)
  // 1 Rupee: circle at top-left
  await sharp(coinsSrc)
    .extract({ left: 30, top: 110, width: 132, height: 132 })
    .toFile(path.join(coinsDir, 'coin-1.png'));

  // 2 Rupee: circle at top-center
  await sharp(coinsSrc)
    .extract({ left: 180, top: 110, width: 136, height: 136 })
    .toFile(path.join(coinsDir, 'coin-2.png'));

  // 5 Rupee: circle at top-right
  await sharp(coinsSrc)
    .extract({ left: 340, top: 80, width: 195, height: 195 })
    .toFile(path.join(coinsDir, 'coin-5.png'));

  // 10 Rupee: circle at bottom-left
  await sharp(coinsSrc)
    .extract({ left: 30, top: 320, width: 190, height: 190 })
    .toFile(path.join(coinsDir, 'coin-10.png'));

  // 20 Rupee: circle at bottom-right
  await sharp(coinsSrc)
    .extract({ left: 318, top: 305, width: 215, height: 215 })
    .toFile(path.join(coinsDir, 'coin-20.png'));

  console.log('Cropping missing currency notes...');

  // ₹2000: Row 1 Left
  await sharp(notesSrc)
    .extract({ left: 15, top: 16, width: 208, height: 95 })
    .toFile(path.join(currencyDir, 'inr-2000.png'));

  // ₹20: Row 3 Right
  await sharp(notesSrc)
    .extract({ left: 308, top: 275, width: 206, height: 93 })
    .toFile(path.join(currencyDir, 'inr-20.png'));

  // ₹10: Row 4 Center
  await sharp(notesSrc)
    .extract({ left: 170, top: 400, width: 206, height: 95 })
    .toFile(path.join(currencyDir, 'inr-10.png'));

  console.log('All real coins and notes cropped successfully!');
}

cropAssets().catch(console.error);
