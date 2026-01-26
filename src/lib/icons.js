const OPENMOJI_VER = '15.0.0';
const TWEMOJI_VER = '14.0.2';

let cache = new Map(); // key: `${BW}|${HEX}` -> {img, blobUrl}

export function resetIconCache(){
  for (const v of cache.values()){
    if (v?.blobUrl){
      try { URL.revokeObjectURL(v.blobUrl); } catch(_) {}
    }
  }
  cache = new Map();
}

function stripVS16(hex){
  return String(hex).toUpperCase().replace(/-FE0F/g, '');
}

function openmojiUrl(hex, bw){
  const h = String(hex).toUpperCase();
  const folder = bw ? 'black/svg' : 'color/svg';
  return `https://cdn.jsdelivr.net/npm/openmoji@${OPENMOJI_VER}/${folder}/${h}.svg`;
}

function twemojiKey(hex){
  // twemoji wants lowercase and no VS16
  return stripVS16(hex).toLowerCase();
}

function twemojiUrl(hex){
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@${TWEMOJI_VER}/assets/svg/${twemojiKey(hex)}.svg`;
}

function hexVariants(hex){
  const h = String(hex).toUpperCase();
  const noVS = stripVS16(h);
  const vars = [];
  vars.push(h);
  if (noVS !== h) vars.push(noVS);
  // if user ever passes something like "1F3F3-FE0F-200D-..." keep both
  return Array.from(new Set(vars));
}

async function fetchAsImage(url){
  const res = await fetch(url, { mode:'cors' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const img = new Image();
  img.decoding = 'async';
  await new Promise((resolve, reject)=>{
    img.onload = ()=>resolve();
    img.onerror = ()=>reject(new Error('img decode failed'));
    img.src = blobUrl;
  });

  return { img, blobUrl };
}

export async function getEmojiImage(hex, bw){
  const key = `${bw ? 'bw' : 'color'}|${String(hex).toUpperCase()}`;
  if (cache.has(key)) return cache.get(key)?.img || null;

  // Try OpenMoji first (with variants), then fallback to Twemoji.
  const vars = hexVariants(hex);
  for (const v of vars){
    try{
      const { img, blobUrl } = await fetchAsImage(openmojiUrl(v, bw));
      cache.set(key, { img, blobUrl });
      return img;
    } catch(_) {}
  }

  try{
    const { img, blobUrl } = await fetchAsImage(twemojiUrl(hex));
    cache.set(key, { img, blobUrl });
    return img;
  } catch(_) {
    cache.set(key, { img:null, blobUrl:null });
    return null;
  }
}

export async function preloadHexes(hexes, bw){
  const uniq = Array.from(new Set(hexes.map(h => String(h).toUpperCase()))).filter(Boolean);
  await Promise.all(uniq.map(h => getEmojiImage(h, bw)));
}
