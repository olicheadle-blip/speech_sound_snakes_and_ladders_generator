import { mulberry32 } from './rng.js';

/**
 * Arrange 98 tiles (squares 2..99) so the SAME orth doesn't touch orth-adjacent
 * (4-neighbour grid). If impossible, returns best-effort.
 */
export function arrangeItemsNoAdjacent(items, seed){
  const rnd = mulberry32(seed >>> 0);
  const N = 98;

  const uniqOrth = Array.from(new Set(items.map(i=>i.orth))).filter(Boolean);
  if (!uniqOrth.length){
    return { ok:false, arranged:Array(N).fill(null), attempts:0, reason:'empty pool' };
  }

  // coords for squares 2..99 on a 10x10 serpentine board
  const coords = [];
  for (let n=2;n<=99;n++){
    const idx = n-1;
    const rowFromBottom = Math.floor(idx/10);
    const colInRow = idx % 10;
    const reversed = (rowFromBottom % 2) === 1;
    const col = reversed ? (9-colInRow) : colInRow;
    coords.push({ n, r:rowFromBottom, c:col });
  }

  const posIndex = new Map();
  for (let i=0;i<coords.length;i++) posIndex.set(coords[i].r+','+coords[i].c, i);

  const adj = Array(coords.length).fill(0).map(()=>[]);
  for (let i=0;i<coords.length;i++){
    const {r,c} = coords[i];
    const nbs = [[r,c-1],[r,c+1],[r-1,c],[r+1,c]];
    for (const [rr,cc] of nbs){
      const j = posIndex.get(rr+','+cc);
      if (j !== undefined) adj[i].push(j);
    }
  }

  function shuffle(arr){
    for (let i=arr.length-1;i>0;i--){
      const j = Math.floor(rnd()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  // Build a balanced pool (repeat items)
  const base = items.slice();
  const maxAttempts = 180;

  for (let attempt=1; attempt<=maxAttempts; attempt++){
    shuffle(base);
    const pool = [];
    while (pool.length < N){
      for (const it of base){
        pool.push(it);
        if (pool.length >= N) break;
      }
      shuffle(base);
    }
    shuffle(pool);

    const remaining = pool.slice();
    const placed = Array(N).fill(null);
    let ok = true;

    for (let i=0;i<N;i++){
      const forbid = new Set();
      for (const j of adj[i]) if (placed[j]) forbid.add(placed[j].orth);

      let pick = -1;
      const scan = Math.min(60, remaining.length);
      for (let k=0;k<scan;k++){
        if (!forbid.has(remaining[k].orth)){ pick = k; break; }
      }
      if (pick === -1){ ok=false; break; }
      placed[i] = remaining.splice(pick,1)[0];
    }

    if (!ok) continue;

    // verify
    for (let i=0;i<N && ok;i++){
      for (const j of adj[i]){
        if (j>i && placed[i] && placed[j] && placed[i].orth === placed[j].orth){
          ok=false; break;
        }
      }
    }
    if (ok) return { ok:true, arranged:placed, attempts:attempt, reason:'' };
  }

  // best-effort fallback
  const fallback = [];
  while (fallback.length < N){
    for (const it of items){
      fallback.push(it);
      if (fallback.length>=N) break;
    }
  }
  shuffle(fallback);
  return { ok:false, arranged:fallback.slice(0,N), attempts:maxAttempts, reason:'could not satisfy adjacency (pool too small / too repetitive)' };
}
