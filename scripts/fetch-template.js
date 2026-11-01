async function run() {
  const res = await fetch('https://www.wix.com/demone2/ws-peca', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  // Find background colors, gradients, font imports
  const colors = html.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgba?\([^)]+\)/g);
  const colorCounts = {};
  colors?.forEach(c => colorCounts[c] = (colorCounts[c] || 0) + 1);
  const topColors = Object.entries(colorCounts).sort((a,b) => b[1] - a[1]).slice(0, 15);
  console.log('Top colors:', topColors);

  // Find images / graphics
  const imgMatches = html.match(/https:\/\/[^"'\s]+\.(png|jpg|jpeg|svg|webp)/gi);
  console.log('Sample images:', [...new Set(imgMatches)].slice(0, 10));
}
run();
