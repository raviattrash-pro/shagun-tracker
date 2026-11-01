async function dumpDetails() {
  const res = await fetch('https://www.wix.com/demone2/ws-peca', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find paragraphs, spans, subtitles
  const paras = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  console.log('Sample paragraphs:', paras.slice(0, 15).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean));

  // Find color values in style attributes
  const colorMatches = html.match(/(?:color|background-color|background|border-color):\s*([^;"]+)/gi) || [];
  console.log('Unique inline styles count:', colorMatches.length);
  const uniqueStyles = [...new Set(colorMatches)].slice(0, 30);
  console.log('Sample inline styles:', uniqueStyles);
}
dumpDetails();
