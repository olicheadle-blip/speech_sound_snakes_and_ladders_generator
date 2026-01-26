import { WORD_BANK } from './wordBank.js';
import { selectBank } from './selectBank.js';
import { UK_CLASSIC_TEMPLATE } from './template.js';

function assert(name, cond){
  if (!cond) throw new Error('Test failed: ' + name);
}

const ALLOWED_SOUNDS = new Set([
  'b','p','t','d','k','g','m','n','ng','f','v','th','dh','s','z','sh','zh','h','ch','j','l','r','y','w'
]);

const ALLOWED_POS = new Set(['initial','medial','final']);

const ALLOWED_SHAPES = new Set([
  'CV','CVV','CVC','CVVC','CCVC','CCVVC','CVCC','CVVCC','OTHER'
]);

function looksLikeHexSeq(s){
  return /^[0-9A-F]+(?:-[0-9A-F]+)*$/.test(String(s||''));
}

export function runTests(){
  // 1) Bank integrity
  for (const w of WORD_BANK){
    assert('orth exists', !!w.orth);
    assert('sound allowed', ALLOWED_SOUNDS.has(w.sound));
    assert('pos allowed', ALLOWED_POS.has(w.pos));
    assert('shape allowed', ALLOWED_SHAPES.has(w.shape));
    assert('hex exists', !!w.hex);
    assert('hex looks like hex sequence', looksLikeHexSeq(w.hex));
  }

  // 2) selection returns something sensible for a common setting
  const sample = selectBank({ dialect:'UK', sound:'b', position:'initial', shapeGroup:'CVC+CVVC' });
  assert('sample bank non-empty', sample.length >= 2);

  // 3) template sanity: no 15->4 snake, yes 24->6, yes 29->10
  const has15to4 = UK_CLASSIC_TEMPLATE.some(e => e.kind==='snake' && e.from===15 && e.to===4);
  const has24to6 = UK_CLASSIC_TEMPLATE.some(e => e.kind==='snake' && e.from===24 && e.to===6);
  const has29to10 = UK_CLASSIC_TEMPLATE.some(e => e.kind==='snake' && e.from===29 && e.to===10);
  assert('snake 15->4 removed', has15to4 === false);
  assert('snake 24->6 present', has24to6 === true);
  assert('snake 29->10 present', has29to10 === true);

  return true;
}
