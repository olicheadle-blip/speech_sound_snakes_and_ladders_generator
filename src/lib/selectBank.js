import { WORD_BANK, normalizeHex } from './wordBank.js';

export function entryShape(entry, dialect){
  if (entry?.shapes?.[dialect]) return entry.shapes[dialect];
  return entry.shape;
}

export function shapesForGroup(group){
  switch (group){
    case 'CV+CVV': return ['CV','CVV'];
    case 'CVC+CVVC': return ['CVC','CVVC'];
    case 'CCVC+CCVVC': return ['CCVC','CCVVC'];
    case 'CVCC+CVVCC': return ['CVCC','CVVCC'];
    default: return null;
  }
}

export function selectBank({ sounds, sound, position, shapeGroup, dialect }){
  dialect = 'UK'; // UK-only for now

  let bank = WORD_BANK.slice();

  // sound filter
  const picked = Array.isArray(sounds) ? sounds.filter(Boolean) : [];
  if (picked.length){
    bank = bank.filter(w => picked.includes(w.sound));
  }
else if (sound){
    bank = bank.filter(w => w.sound === sound);
  }

  // position filter
  if (position && position !== 'any'){
    bank = bank.filter(w => w.pos === position);
  }

  // shape group filter
  const allowed = shapesForGroup(shapeGroup);
  if (allowed){
    bank = bank.filter(w => allowed.includes(entryShape(w, dialect)));
  }

  // normalize hex
  bank = bank.map(w => ({...w, hex: normalizeHex(w.hex) }));

  return bank;
}
