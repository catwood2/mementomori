const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#121212';
  ctx.fillRect(0, 0, size, size);

  // Inner circle
  const padding = size * 0.1;
  const radius = (size - padding * 2) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // Draw circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#9B2C2C';
  ctx.lineWidth = size * 0.05;
  ctx.stroke();

  // Draw hourglass
  const hourglassWidth = radius * 0.8;
  const hourglassHeight = radius * 1.2;
  const topY = centerY - hourglassHeight / 2;
  const bottomY = centerY + hourglassHeight / 2;

  ctx.beginPath();
  ctx.moveTo(centerX - hourglassWidth / 2, topY);
  ctx.lineTo(centerX + hourglassWidth / 2, topY);
  ctx.lineTo(centerX, centerY);
  ctx.lineTo(centerX - hourglassWidth / 2, topY);
  ctx.fillStyle = '#9B2C2C';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - hourglassWidth / 2, bottomY);
  ctx.lineTo(centerX + hourglassWidth / 2, bottomY);
  ctx.lineTo(centerX, centerY);
  ctx.lineTo(centerX - hourglassWidth / 2, bottomY);
  ctx.fillStyle = '#9B2C2C';
  ctx.fill();

  return canvas.toBuffer('image/png');
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
  const icon = generateIcon(size);
  fs.writeFileSync(`icons/icon-${size}.png`, icon);
  console.log(`Generated icon-${size}.png`);
}); 