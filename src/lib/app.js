import { createBoardRenderer } from './board.js';
import { runTests } from './tests.js';

function setNote(noteEl, msg){
  if (!noteEl) return;
  if (msg){
    noteEl.style.display = 'block';
    noteEl.textContent = String(msg);
  } else {
    noteEl.style.display = 'none';
    noteEl.textContent = '';
  }
}

export function createSnakesLaddersApp({ canvasId, noteId, controls }){
  const canvas = document.getElementById(canvasId);
  const noteEl = document.getElementById(noteId);
  if (!canvas) throw new Error(`Canvas #${canvasId} not found`);

  const ui = {
    dialect: document.getElementById(controls.dialectId),
    sound1: document.getElementById(controls.sound1Id),
    sound2: document.getElementById(controls.sound2Id),
    sound3: document.getElementById(controls.sound3Id),
    position: document.getElementById(controls.positionId),
    shape: document.getElementById(controls.shapeId),
    theme: document.getElementById(controls.themeId),
    btnGenerate: document.getElementById(controls.generateBtnId),
    btnDownload: document.getElementById(controls.downloadBtnId),
    btnPrint: document.getElementById(controls.printBtnId),
  };

  const renderer = createBoardRenderer({
    canvas,
    setNote: (m)=>setNote(noteEl, m)
  });

  window.addEventListener('error', (ev)=>{
    console.error(ev);
    setNote(noteEl, `Error: ${ev?.message || 'Unknown error'}`);
  });

  // Tests must never stop the app.
  try { runTests(); } catch (e) { console.warn('Tests failed:', e); }

  function expandSoundValue(v){
    const val = String(v || '').trim();
    if (!val) return [];    return [val];
  }

  function getSettings(){
    const picks = [
      ...expandSoundValue(ui.sound1?.value),
      ...expandSoundValue(ui.sound2?.value),
      ...expandSoundValue(ui.sound3?.value),
    ];

    // de-dup while preserving order
    const sounds = [];
    for (const s of picks){
      if (!s) continue;
      if (!sounds.includes(s)) sounds.push(s);
    }

    if (!sounds.length){
      window.alert('Choose at least 1 target sound.');
      return null;
    }
    if (sounds.length > 3){
      window.alert('You can select up to 3 sounds per board. Try again.');
      return null;
    }

    return {
      dialect: 'UK',
      sounds,
      position: ui.position?.value || 'any',
      shapeGroup: ui.shape?.value || 'CVC+CVVC',
      theme: ui.theme?.value || 'color'
    };
  }

  ui.btnGenerate?.addEventListener('click', ()=>{
    const s = getSettings();
    if (!s) return;
    renderer.generate(s);
  });
  ui.btnDownload?.addEventListener('click', ()=>renderer.downloadPNG());
  ui.btnPrint?.addEventListener('click', ()=>renderer.printOrSavePdf());

  {
    const s = getSettings();
    if (s) renderer.generate(s);
  }
}
