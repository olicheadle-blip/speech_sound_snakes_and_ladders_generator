import { UK_CLASSIC_TEMPLATE, LANES, INSETS } from './template.js';
import { selectBank, entryShape } from './selectBank.js';
import { arrangeItemsNoAdjacent } from './arrange.js';
import { preloadHexes, getEmojiImage, resetIconCache } from './icons.js';
import { mulberry32 } from './rng.js';

export function createBoardRenderer({ canvas, setNote }){
  const ctx = canvas.getContext('2d');

  const W = canvas.width, H = canvas.height;
  // Layout
  // Reserve space for the header so it never overlaps the board.
  const HEADER = { x: 20, y: 20, h: 190 };
  const BOARD = { x: 40, y: HEADER.y + HEADER.h + 30, w: 900, h: 900 };
  const CELL = BOARD.w / 10;

  let STATE = {
    seed: (Math.random()*1e9)>>>0,
    lastSettings: null
  };

  // IPA labels used for header grouping
  const SOUND_IPA = {
    p: '/p/',
    b: '/b/',
    t: '/t/',
    d: '/d/',
    k: '/k/',
    g: '/g/',
    m: '/m/',
    n: '/n/',
    ng: '/ŋ/',
    f: '/f/',
    v: '/v/',
    th: '/θ/',
    dh: '/ð/',
    s: '/s/',
    z: '/z/',
    sh: '/ʃ/',
    zh: '/ʒ/',
    h: '/h/',
    ch: '/tʃ/',
    j: '/dʒ/',
    l: '/l/',
    r: '/r/',
    y: '/j/',
    w: '/w/',
  };


  function note(msg){ if (setNote) setNote(msg || ''); }

  function roundedRectPath(x,y,w,h,r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  // Backwards-compatible helper: some parts of the renderer historically used
  // roundedRect(ctx, ...) instead of the closure-based roundedRectPath(...).
  function roundedRect(x, y, w, h, r){
    roundedRectPath(x, y, w, h, r);
  }

  function squareRect(n){
    const idx = n - 1;
    const rowFromBottom = Math.floor(idx/10);
    const colInRow = idx % 10;
    const reversed = (rowFromBottom % 2) === 1;
    const col = reversed ? (9 - colInRow) : colInRow;
    const x = BOARD.x + col*CELL;
    const y = BOARD.y + (9 - rowFromBottom)*CELL;
    return {x,y,w:CELL,h:CELL,row:rowFromBottom,col};
  }

  function centerOfSquare(n){
    const r = squareRect(n);
    return {cx:r.x+r.w/2, cy:r.y+r.h/2, row:r.row, col:r.col};
  }

  function connectorEndpoints(from, to, kind, lane=0){
    const a0 = centerOfSquare(from);
    const b0 = centerOfSquare(to);
    const dx0 = b0.cx-a0.cx, dy0 = b0.cy-a0.cy;
    const len0 = Math.hypot(dx0,dy0) || 1;
    const ux0 = dx0/len0, uy0 = dy0/len0;
    const nx0 = -uy0, ny0 = ux0;

    const sInset = CELL * (INSETS[kind]?.start ?? 0.5);
    const eInset = CELL * (INSETS[kind]?.end ?? 0.5);

    let ax = a0.cx + ux0*sInset;
    let ay = a0.cy + uy0*sInset;
    let bx = b0.cx - ux0*eInset;
    let by = b0.cy - uy0*eInset;

    ax += nx0*lane; ay += ny0*lane;
    bx += nx0*lane; by += ny0*lane;

    const dx = bx-ax, dy = by-ay;
    const len = Math.hypot(dx,dy) || 1;
    return {ax,ay,bx,by,ux:dx/len,uy:dy/len,nx:-dy/len,ny:dx/len,len,a0,b0};
  }

  function linearBg(bw){
    if (bw){
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0,W,H);
      return;
    }
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,"#fff3e8");
    g.addColorStop(1,"#e9fbff");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
  }

  function drawHeader(meta, targetGroups){
  const HEADER_H = HEADER.h;

  // Header box
  roundedRect(HEADER.x, HEADER.y, W - 40, HEADER_H, 24);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000';
  ctx.stroke();

  // Title
  ctx.fillStyle = '#000';
  ctx.font = 'bold 30px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Speech Sound Snakes and Ladders', 40, 56);

  // Meta line
  ctx.font = 'bold 18px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  const themeLabel = meta.themeLabel ? ` (${meta.themeLabel})` : '';
  ctx.fillText(`Target: ${meta.soundLabel} - ${meta.posLabel} - ${meta.shapeLabel}${themeLabel}`, 40, 78);

  // Target words grouped by sound
  ctx.font = '600 15px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  const baseX = 40;
  const maxWidth = W - 80;
  const lineH = 18;

  ctx.fillText('Target words:', baseX, 100);

  const maxY = HEADER.y + HEADER_H - 14;
  let y = 120;

  for (const g of (targetGroups || [])){
    const ipa = g.ipa || SOUND_IPA[g.sound] || `/${g.sound}/`;
    const words = (g.words || []).slice();
    if (!words.length) continue;

    const indent = 26;
    let current = `${ipa}: `;
    let currentX = baseX;

    for (let i = 0; i < words.length; i++){
      const w = words[i];
      const candidate = (current.endsWith(': ')) ? (current + w) : (current + ', ' + w);
      const avail = maxWidth - (currentX - baseX);

      if (ctx.measureText(candidate).width <= avail){
        current = candidate;
      } else {
        // draw current line
        if (y > maxY) return;
        ctx.fillText(current, currentX, y);
        y += lineH;

        // start new continuation line (no ipa label)
        currentX = baseX + indent;
        current = w;
      }
    }

    if (y > maxY) return;
    ctx.fillText(current, currentX, y);
    y += lineH;
  }
}

function drawBoardBase(bw){
    ctx.save();
    // shadow
    roundedRectPath(BOARD.x-14+6, BOARD.y-14+6, BOARD.w+28, BOARD.h+28, 20);
    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.18;
    ctx.fill();
    ctx.globalAlpha = 1;

    roundedRectPath(BOARD.x-14, BOARD.y-14, BOARD.w+28, BOARD.h+28, 20);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";
    ctx.stroke();

    const palette = bw
      ? ["#ffffff","#f4f4f4"]
      : ["#ff5c74","#ffd24d","#5e9cff","#4ecc98","#ffffff","#c38cff"];

    for (let n=1;n<=100;n++){
      const r = squareRect(n);
      const fill = palette[(r.row*10 + r.col) % palette.length];

      roundedRectPath(r.x, r.y, r.w, r.h, 10);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();

      if (n===1 || n===100){
        ctx.save();
        ctx.font = "900 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n===1?"START":"FINISH", r.x+r.w/2, r.y+r.h/2);
        ctx.restore();
        continue;
      }

      // number badge
      roundedRectPath(r.x+4, r.y+4, 28, 18, 6);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.lineWidth=2;
      ctx.strokeStyle="#000";
      ctx.stroke();
      ctx.font = "800 11px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign="left";
      ctx.textBaseline="top";
      ctx.fillText(String(n), r.x+10, r.y+6);
    }
    ctx.restore();
  }

  function drawLadder(conn, bw){
    const {ax,ay,bx,by,len,nx,ny} = conn;
    const off = 12;
    const a1 = {x:ax + nx*off, y:ay + ny*off};
    const a2 = {x:ax - nx*off, y:ay - ny*off};
    const b1 = {x:bx + nx*off, y:by + ny*off};
    const b2 = {x:bx - nx*off, y:by - ny*off};
    const rungs = Math.max(6, Math.min(22, Math.round(len / 42)));

    ctx.save();
    ctx.lineCap = "round";

    // shadow
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000";
    ctx.globalAlpha = 0.32;
    ctx.beginPath(); ctx.moveTo(a1.x+4,a1.y+4); ctx.lineTo(b1.x+4,b1.y+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a2.x+4,a2.y+4); ctx.lineTo(b2.x+4,b2.y+4); ctx.stroke();
    ctx.globalAlpha = 1;

    // outline
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000";
    ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(b1.x,b1.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a2.x,a2.y); ctx.lineTo(b2.x,b2.y); ctx.stroke();

    // body
    ctx.lineWidth = 6;
    ctx.strokeStyle = bw ? "#777" : "#b0713d";
    ctx.beginPath(); ctx.moveTo(a1.x,a1.y); ctx.lineTo(b1.x,b1.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a2.x,a2.y); ctx.lineTo(b2.x,b2.y); ctx.stroke();

    // rungs
    for (let i=1;i<=rungs;i++){
      const t = i/(rungs+1);
      const rx1 = a1.x + (b1.x-a1.x)*t;
      const ry1 = a1.y + (b1.y-a1.y)*t;
      const rx2 = a2.x + (b2.x-a2.x)*t;
      const ry2 = a2.y + (b2.y-a2.y)*t;

      ctx.lineWidth = 8;
      ctx.strokeStyle = "#000";
      ctx.beginPath(); ctx.moveTo(rx1,ry1); ctx.lineTo(rx2,ry2); ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = bw ? "#aaa" : "#dca26e";
      ctx.beginPath(); ctx.moveTo(rx1,ry1); ctx.lineTo(rx2,ry2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawCoolSnake(conn, bw, curveSign=1, seed=1){
    const {ax,ay,bx,by,len,nx,ny,ux,uy,a0,b0} = conn;

    const rowSpan = Math.abs(a0.row - b0.row);

    // Per your requirement: very short snakes should go straight (no curve)
    if (rowSpan <= 1){
      ctx.save();
      ctx.lineCap = "round";

      // shadow
      ctx.globalAlpha = 0.30;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 18;
      ctx.beginPath(); ctx.moveTo(ax+4,ay+4); ctx.lineTo(bx+4,by+4); ctx.stroke();
      ctx.globalAlpha = 1;

      // outline
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();

      // body
      ctx.strokeStyle = bw ? "#333" : "#2aa7ff";
      ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke();

      // head (face away from body)
      drawSnakeHead(ax, ay, -ux, -uy, bw ? "#333" : "#2aa7ff");
      // tail
      drawSnakeTail(bx, by, ux, uy);
      ctx.restore();
      return;
    }

    const mx=(ax+bx)/2, my=(ay+by)/2;
    let wig = Math.max(42, Math.min(110, len*0.24));
    const c1 = {x: mx + nx*wig*curveSign, y: my + ny*wig*curveSign};
    const c2 = {x: mx - nx*wig*curveSign, y: my - ny*wig*curveSign};

    const pts=[];
    const steps=92;
    for (let i=0;i<=steps;i++){
      const t=i/steps;
      const x = (1-t)**3*ax + 3*(1-t)**2*t*c1.x + 3*(1-t)*t**2*c2.x + t**3*bx;
      const y = (1-t)**3*ay + 3*(1-t)**2*t*c1.y + 3*(1-t)*t**2*c2.y + t**3*by;
      pts.push({x,y});
    }

    const bodyA = bw ? "#222" : "#ff5c74";
    const bodyB = bw ? "#555" : "#5e9cff";

    ctx.save();
    ctx.lineCap = "round";

    // shadow
    ctx.beginPath();
    ctx.moveTo(pts[0].x+4, pts[0].y+4);
    for (const p of pts) ctx.lineTo(p.x+4,p.y+4);
    ctx.strokeStyle = "#000";
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // outline
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x,p.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 16;
    ctx.stroke();

    // gradient body
    const grad = ctx.createLinearGradient(ax,ay,bx,by);
    grad.addColorStop(0, bodyA);
    grad.addColorStop(1, bodyB);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.stroke();

    // glossy highlight
    ctx.beginPath();
    ctx.moveTo(pts[0].x + nx*3, pts[0].y + ny*3);
    for (const p of pts) ctx.lineTo(p.x + nx*3, p.y + ny*3);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 5;
    ctx.stroke();

    // scales (diamonds) + spines
    const rnd = mulberry32(seed>>>0);
    for (let i=10;i<pts.length-16;i+=10){
      const p = pts[i];
      const ang = (rnd()*Math.PI) - (Math.PI/2);

      // diamond scale
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // tiny spine
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(p.x + nx*7, p.y + ny*7);
      ctx.lineTo(p.x + nx*3 + ux*3, p.y + ny*3 + uy*3);
      ctx.lineTo(p.x + nx*3 - ux*3, p.y + ny*3 - uy*3);
      ctx.closePath();
      ctx.fill();
    }

    // head/tail (head faces away from body)
    drawSnakeHead(ax, ay, ax-pts[1].x, ay-pts[1].y, bodyA, true);
    drawSnakeTail(bx, by, bx-pts[pts.length-2].x, by-pts[pts.length-2].y);

    ctx.restore();
  }

  function drawSnakeHead(x,y,ux,uy, fill){
    // ux,uy can be vector or normalized-ish
    const len = Math.hypot(ux,uy) || 1;
    const dx = ux/len, dy = uy/len;
    const nx = -dy, ny = dx;

    ctx.save();
    // head shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x+3, y+3, 16, 13, Math.atan2(dy,dx), 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // head shape
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x, y, 16, 13, Math.atan2(dy,dx), 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 11, Math.atan2(dy,dx), 0, Math.PI*2);
    ctx.fill();

    // eyes + brows
    for (const side of [-1, 1]){
      const ex = x + nx*side*6 + dx*2;
      const ey = y + ny*side*6 + dy*2;

      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(ex, ey, 3.6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath(); ctx.arc(ex, ey, 1.7, 0, Math.PI*2); ctx.fill();

      // brow
      ctx.strokeStyle="#000";
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(ex - nx*side*4 - dx*2, ey - ny*side*4 - dy*2);
      ctx.lineTo(ex - dx*2, ey - dy*2);
      ctx.stroke();
    }

    // tongue
    ctx.strokeStyle="#c8003c";
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(x + dx*12, y + dy*12);
    ctx.lineTo(x + dx*22, y + dy*22);
    ctx.stroke();

    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(x + dx*22, y + dy*22);
    ctx.lineTo(x + dx*28 + nx*4, y + dy*28 + ny*4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + dx*22, y + dy*22);
    ctx.lineTo(x + dx*28 - nx*4, y + dy*28 - ny*4);
    ctx.stroke();

    ctx.restore();
  }

  function drawSnakeTail(x,y,ux,uy){
    const len = Math.hypot(ux,uy) || 1;
    const dx = ux/len, dy = uy/len;
    const nx = -dy, ny = dx;
    ctx.save();
    ctx.strokeStyle="#000";
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - dx*10 + nx*6, y - dy*10 + ny*6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - dx*10 - nx*6, y - dy*10 - ny*6);
    ctx.stroke();
    ctx.restore();
  }

  function drawConnectors(bw){
    let ladderIdx=0, snakeIdx=0;
    for (const c of UK_CLASSIC_TEMPLATE){
      const lane = LANES[((c.kind==='ladder')?ladderIdx++:snakeIdx++) % LANES.length] * (c.kind==='snake' ? 0.55 : 1);
      const conn = connectorEndpoints(c.from, c.to, c.kind, lane);
      if (c.kind === 'ladder'){
        drawLadder(conn, bw);
      } else {
        const curveSign = (snakeIdx % 2 === 0) ? 1 : -1;
        drawCoolSnake(conn, bw, curveSign, (STATE.seed + snakeIdx*1337)>>>0);
      }
    }
  }

  function buildOverlapMask(){
    const m = document.createElement('canvas');
    m.width=W; m.height=H;
    const mctx = m.getContext('2d');
    mctx.fillStyle="#000";
    mctx.strokeStyle="#000";

    function bezierPoints(ax,ay,c1x,c1y,c2x,c2y,bx,by, steps=80){
      const pts=[];
      for (let i=0;i<=steps;i++){
        const t=i/steps;
        const x = (1-t)**3*ax + 3*(1-t)**2*t*c1x + 3*(1-t)*t**2*c2x + t**3*bx;
        const y = (1-t)**3*ay + 3*(1-t)**2*t*c1y + 3*(1-t)*t**2*c2y + t**3*by;
        pts.push({x,y});
      }
      return pts;
    }

    let ladderIdx=0, snakeIdx=0;
    for (const c of UK_CLASSIC_TEMPLATE){
      const lane = LANES[((c.kind==='ladder')?ladderIdx++:snakeIdx++) % LANES.length] * (c.kind==='snake'?0.55:1);
      const conn = connectorEndpoints(c.from, c.to, c.kind, lane);

      if (c.kind === 'ladder'){
        const off=12;
        const {ax,ay,bx,by,nx,ny,len} = conn;
        const a1 = {x:ax + nx*off, y:ay + ny*off};
        const a2 = {x:ax - nx*off, y:ay - ny*off};
        const b1 = {x:bx + nx*off, y:by + ny*off};
        const b2 = {x:bx - nx*off, y:by - ny*off};

        mctx.lineCap="round";
        mctx.lineWidth=14;
        mctx.beginPath(); mctx.moveTo(a1.x,a1.y); mctx.lineTo(b1.x,b1.y); mctx.stroke();
        mctx.beginPath(); mctx.moveTo(a2.x,a2.y); mctx.lineTo(b2.x,b2.y); mctx.stroke();

        const rungs = Math.max(6, Math.min(22, Math.round(len/42)));
        mctx.lineWidth=12;
        for (let i=1;i<=rungs;i++){
          const t=i/(rungs+1);
          const rx1=a1.x+(b1.x-a1.x)*t, ry1=a1.y+(b1.y-a1.y)*t;
          const rx2=a2.x+(b2.x-a2.x)*t, ry2=a2.y+(b2.y-a2.y)*t;
          mctx.beginPath(); mctx.moveTo(rx1,ry1); mctx.lineTo(rx2,ry2); mctx.stroke();
        }
      } else {
        const {ax,ay,bx,by,len,nx,ny,a0,b0} = conn;
        const rowSpan = Math.abs(a0.row-b0.row);

        mctx.lineCap="round";
        mctx.lineWidth=20;

        if (rowSpan <= 1){
          mctx.beginPath(); mctx.moveTo(ax,ay); mctx.lineTo(bx,by); mctx.stroke();
          mctx.beginPath(); mctx.arc(ax, ay, 14, 0, Math.PI*2); mctx.fill();
          continue;
        }

        const mx=(ax+bx)/2, my=(ay+by)/2;
        let wig = Math.max(42, Math.min(110, len*0.24));
        const curveSign = (snakeIdx % 2 === 0) ? 1 : -1;
        const c1 = {x: mx + nx*wig*curveSign, y: my + ny*wig*curveSign};
        const c2 = {x: mx - nx*wig*curveSign, y: my - ny*wig*curveSign};
        const pts = bezierPoints(ax,ay,c1.x,c1.y,c2.x,c2.y,bx,by, 90);

        mctx.beginPath(); mctx.moveTo(pts[0].x, pts[0].y);
        for (const p of pts) mctx.lineTo(p.x,p.y);
        mctx.stroke();
        mctx.beginPath(); mctx.arc(ax, ay, 14, 0, Math.PI*2); mctx.fill();
      }
    }

    return mctx.getImageData(0,0,W,H).data;
  }


  function overlapFraction(mask, x0,y0,x1,y1){
    if (!mask) return 0;

    const ix0 = Math.max(0, Math.floor(x0));
    const iy0 = Math.max(0, Math.floor(y0));
    const ix1 = Math.min(W-1, Math.floor(x1));
    const iy1 = Math.min(H-1, Math.floor(y1));

    let hit = 0, total = 0;
    const step = 3;
    for (let y=iy0; y<=iy1; y+=step){
      for (let x=ix0; x<=ix1; x+=step){
        total++;
        const i = (y*W + x)*4;
        if (mask[i+3] > 0) hit++;
      }
    }
    return total ? (hit / total) : 0;
  }

  function clamp(v, lo, hi){
    return Math.max(lo, Math.min(hi, v));
  }

  function uniqueCandidates(list){
    const seen = new Set();
    const out = [];
    for (const p of list){
      const key = `${Math.round(p.x)}|${Math.round(p.y)}|${p.size}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
    return out;
  }

  // Try multiple positions (and slightly smaller sizes) so we only skip a cell
  // when connectors genuinely take up most of the usable space.
  function bestIconPlacement(cellRect, baseSize, mask){
    const pad = 8;
    const r = cellRect;

    const sizes = [
      baseSize,
      Math.max(40, baseSize - 8),
      Math.max(34, baseSize - 16),
      Math.max(28, baseSize - 24)
    ];

    let best = null;

    for (const size of sizes){
      const safeLeft = r.x + pad;
      const safeRight = r.x + r.w - pad - size;
      const safeTop = r.y + 26; // avoid number badge area
      const safeBottom = r.y + r.h - pad - size;

      const cx = r.x + (r.w - size)/2;
      const cy = r.y + (r.h - size)/2 + 6;

      const candidates = uniqueCandidates([
        {x: cx, y: cy, size},
        {x: safeLeft, y: safeTop, size},
        {x: safeRight, y: safeTop, size},
        {x: safeLeft, y: safeBottom, size},
        {x: safeRight, y: safeBottom, size},
        {x: safeLeft, y: cy, size},
        {x: safeRight, y: cy, size},
        {x: cx, y: safeTop, size},
        {x: cx, y: safeBottom, size},
      ].map(p => ({
        x: clamp(p.x, r.x + pad, r.x + r.w - pad - size),
        y: clamp(p.y, r.y + 22, r.y + r.h - pad - size),
        size
      })));

      for (const p of candidates){
        const frac = overlapFraction(mask, p.x, p.y, p.x + size, p.y + size);
        const score = frac;

        if (!best || score < best.score){
          best = { ...p, frac, score };
        }

        // early exit if we find a clean spot
        if (best && best.frac <= 0.12) return best;
      }

      // if we found something acceptably clean at this size, stop here
      if (best && best.frac <= 0.18) return best;
    }

    return best;
  }



  async function drawIcons(arranged, mask, bw){
    // Returns set of visible target words
    const usedKeys = new Set();
    const usedItems = [];

    for (let i=0;i<arranged.length;i++){
      const sq = i+2;
      const r = squareRect(sq);
      const item = arranged[i];
      if (!item) continue;

      // base icon size (can shrink a touch if needed)
      const pad = 10;
      const baseSize = Math.min(56, CELL - pad*2);

      // Find the least-overlapped spot in the cell (rather than skipping on any overlap)
      const placement = bestIconPlacement(r, baseSize, mask);
      if (!placement) continue;

      // Only skip when connectors genuinely occupy most of the usable space
      if (placement.frac > 0.65) continue;

      const img = await getEmojiImage(item.hex, bw);
      if (!img) continue;

      ctx.save();
      if (bw){
        // extra safety: grayscale on draw (icons should already be black)
        ctx.filter = 'grayscale(1) contrast(1.1)';
      }
      ctx.drawImage(img, placement.x, placement.y, placement.size, placement.size);
      ctx.restore();
      const key = `${item.sound}|${item.orth}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        usedItems.push({ orth: item.orth, sound: item.sound });
      }
    }
    return usedItems;
  }

  function buildMeta({ dialect, sounds, sound, position, shapeGroup, theme }){
    const IPA = SOUND_IPA;
    const list = Array.isArray(sounds) && sounds.length ? sounds : (sound ? [sound] : []);
    const soundLabel = list.length
      ? list.map(s => IPA[s] || `/${s}/`).join(', ')
      : '—';

    return {
      dialectLabel: 'UK English',
      soundLabel,
      posLabel: position === 'any' ? 'Any position' : (position[0].toUpperCase() + position.slice(1)),
      shapeLabel: shapeGroup,
      themeLabel: theme === 'bw' ? 'B/W' : 'Colour'
    };
  }

  async function render(settings){
    const bw = settings.theme === 'bw';
    resetIconCache(); // keeps colour/BW accurate and avoids stale failures

    // STRICT selection (UK only): no relaxing rules.
    const bank = selectBank(settings);
    if (bank.length < 2){
      // Clear canvas and show message.
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0,W,H);
      const msg = 'Not enough targets match these filters. Try changing structure or sound position settings.';
      note(msg);
      try { window.alert(msg); } catch(_) {}
      return;
    }

    note('');

    const seed = (Math.random()*1e9)>>>0;
    STATE.seed = seed;
    STATE.lastSettings = settings;

    // arrange
    const arrangedInfo = arrangeItemsNoAdjacent(bank, seed);

    // draw base board immediately (never blocked by icon fetching)
    linearBg(bw);
    drawBoardBase(bw);

    // overlap mask (used to place icons away from connectors)
    const mask = buildOverlapMask();

    // preload icons (so we can export PNG reliably)
    const hexes = arrangedInfo.arranged.filter(Boolean).map(it => it.hex);
    await preloadHexes(hexes, bw);

    // icons + targets used
    const usedItems = await drawIcons(arrangedInfo.arranged, mask, bw);

    const soundOrder = Array.isArray(settings.sounds) && settings.sounds.length
      ? settings.sounds
      : (settings.sound ? [settings.sound] : []);

    const bySound = new Map();
    for (const it of usedItems){
      const arr = bySound.get(it.sound) || [];
      arr.push(it.orth);
      bySound.set(it.sound, arr);
    }

    // Build grouped target lists (in sound-selection order)
    // IMPORTANT: do NOT mutate bySound before building this list.
    const targetsBySound = [];
    const seen = new Set();
    for (const s of soundOrder){
      seen.add(s);
      const words = Array.from(new Set(bySound.get(s) || [])).sort((a,b)=>a.localeCompare(b));
      if (words.length) targetsBySound.push({ sound: s, ipa: SOUND_IPA[s] || `/${s}/`, words });
    }

    // any leftover sounds (shouldn't happen) go at the end
    const remainingSounds = Array.from(bySound.keys())
      .filter(s => !seen.has(s))
      .sort((a,b)=>a.localeCompare(b));
    for (const s of remainingSounds){
      const words = Array.from(new Set(bySound.get(s) || [])).sort((a,b)=>a.localeCompare(b));
      if (words.length) targetsBySound.push({ sound: s, ipa: SOUND_IPA[s] || `/${s}/`, words });
    }


    // connectors AFTER icons so they stay visually clear
    drawConnectors(bw);

    // header LAST (so it stays clean)
    const meta = buildMeta(settings);
    drawHeader(meta, targetsBySound);
  }

  async function generate(settings){
    try{
      await render(settings);
    } catch (e){
      console.error(e);
      note('Could not generate (icons may be blocked). Open console for details.');
    }
  }

  function downloadPNG(){
    try{
      canvas.toBlob((blob)=>{
        if (!blob){
          note('Could not create PNG. Use Print / Save PDF instead.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = `snakes_ladders_${STATE.seed}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(()=>{ try{ URL.revokeObjectURL(url); }catch(_){ } }, 1500);
      }, 'image/png');
    } catch(e){
      note('Download failed. Use Print / Save PDF instead.');
    }
  }

  function printOrSavePdf(){
    try{
      window.print();
    } catch(e){
      note('Print failed in this environment.');
    }
  }

  return { generate, downloadPNG, printOrSavePdf };
}
