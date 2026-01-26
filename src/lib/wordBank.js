// UK-only word bank of *imageable* targets.
//
// Shapes are intentionally conservative:
// - V  = monophthong (short OR long)
// - VV = diphthong
// - Keep most entries in CVC / CVVC / CCVC / CVCC / CVVCC so filters remain reliable.
// - If a word doesn't fit the supported shapes cleanly, mark as OTHER.
//
// We store the emoji character and derive the Unicode hex sequence automatically
// (reduces mistakes vs hand-typing codepoints).

function emojiToHexSequence(emoji){
  // Handles multi-codepoint sequences (e.g. variation selectors, ZWJ sequences)
  const parts = [];
  for (const ch of String(emoji)){
    parts.push(ch.codePointAt(0).toString(16).toUpperCase());
  }
  return parts.join('-');
}

// Raw entries (emoji -> hex computed below)
const RAW = [
  // -----------------------------
  // STOPS
  // /p/
  { orth:'pea',   sound:'p', pos:'initial', shape:'CV',   emoji:'🫛' },
  { orth:'paw',   sound:'p', pos:'initial', shape:'CV',   emoji:'🐾' },
  { orth:'pie',   sound:'p', pos:'initial', shape:'CVV',  emoji:'🥧' },
  { orth:'pig',   sound:'p', pos:'initial', shape:'CVC',  emoji:'🐷' },
  { orth:'pan',   sound:'p', pos:'initial', shape:'CVC',  emoji:'🍳' },
  { orth:'pen',   sound:'p', pos:'initial', shape:'CVC',  emoji:'🖊️' },
  { orth:'pin',   sound:'p', pos:'initial', shape:'CVC',  emoji:'📌' },
  { orth:'pot',   sound:'p', pos:'initial', shape:'CVC',  emoji:'🪴' },
  { orth:'pear',  sound:'p', pos:'initial', shape:'CVV',   emoji:'🍐' },
  { orth:'pail',  sound:'p', pos:'initial', shape:'CVVC', emoji:'🪣' },
  { orth:'pizza', sound:'p', pos:'initial', shape:'OTHER',emoji:'🍕' },
  { orth:'pants', sound:'p', pos:'initial', shape:'CVCC', emoji:'👖' },
  { orth:'post',  sound:'p', pos:'initial', shape:'CVVCC',emoji:'📮' },
  { orth:'plug',  sound:'p', pos:'initial', shape:'CCVC', emoji:'🔌' },
  { orth:'plane', sound:'p', pos:'initial', shape:'CCVVC',emoji:'✈️' },
  { orth:'plate', sound:'p', pos:'initial', shape:'CCVVC',emoji:'🍽️' },
  { orth:'cap',   sound:'p', pos:'final',   shape:'CVC',  emoji:'🧢' },
  { orth:'map',   sound:'p', pos:'final',   shape:'CVC',  emoji:'🗺️' },
  { orth:'cup',   sound:'p', pos:'final',   shape:'CVC',  emoji:'☕' },
  { orth:'tap',   sound:'p', pos:'final',   shape:'CVC',  emoji:'🚰' },
  { orth:'lip',   sound:'p', pos:'final',   shape:'CVC',  emoji:'👄' },
  { orth:'ship',  sound:'p', pos:'final',   shape:'CVC',  emoji:'🚢' },
  { orth:'soap',  sound:'p', pos:'final',   shape:'CVVC', emoji:'🧼' },
  { orth:'tape',  sound:'p', pos:'final',   shape:'CVVC', emoji:'📼' },
  { orth:'soup',  sound:'p', pos:'final',   shape:'CVC',  emoji:'🍲' },
  { orth:'lamp',  sound:'p', pos:'final',   shape:'CVCC', emoji:'💡' },
  { orth:'camp',  sound:'p', pos:'final',   shape:'CVCC', emoji:'🏕️' },

  // /p/ medial (multi-syllable / not shape-filter friendly)
  { orth:'apple', sound:'p', pos:'medial',  shape:'OTHER',emoji:'🍎' },
  { orth:'happy', sound:'p', pos:'medial',  shape:'OTHER',emoji:'😊' },

  // /b/
  { orth:'bee',   sound:'b', pos:'initial', shape:'CV',   emoji:'🐝' },
  { orth:'baa',   sound:'b', pos:'initial', shape:'CV',   emoji:'🐑' },
  { orth:'boo',   sound:'b', pos:'initial', shape:'CV',   emoji:'👻' },
  { orth:'bye',   sound:'b', pos:'initial', shape:'CVV',  emoji:'👋' },
  { orth:'bow',   sound:'b', pos:'initial', shape:'CVV',  emoji:'🎀' },
  { orth:'boy',   sound:'b', pos:'initial', shape:'CVV',  emoji:'👦' },
  { orth:'bear',  sound:'b', pos:'initial', shape:'CVV',  emoji:'🐻' },
  { orth:'bag',   sound:'b', pos:'initial', shape:'CVC',  emoji:'👜' },
  { orth:'bus',   sound:'b', pos:'initial', shape:'CVC',  emoji:'🚌' },
  { orth:'bat',   sound:'b', pos:'initial', shape:'CVC',  emoji:'🦇' },
  { orth:'bin',   sound:'b', pos:'initial', shape:'CVC',  emoji:'🗑️' },
  { orth:'bed',   sound:'b', pos:'initial', shape:'CVC',  emoji:'🛏️' },
  { orth:'bead',  sound:'b', pos:'initial', shape:'CVC',  emoji:'📿' },
  { orth:'bean',  sound:'b', pos:'initial', shape:'CVC',  emoji:'🫘' },
  { orth:'bird',  sound:'b', pos:'initial', shape:'CVC',  emoji:'🐦' },
  { orth:'bug',   sound:'b', pos:'initial', shape:'CVC',  emoji:'🐛' },
  { orth:'ball',  sound:'b', pos:'initial', shape:'CVC',  emoji:'⚽' },
  { orth:'bell',  sound:'b', pos:'initial', shape:'CVC',  emoji:'🔔' },
  { orth:'bike',  sound:'b', pos:'initial', shape:'CVVC', emoji:'🚲' },
  { orth:'boat',  sound:'b', pos:'initial', shape:'CVVC', emoji:'⛵' },
  { orth:'bowl',  sound:'b', pos:'initial', shape:'CVVC', emoji:'🥣' },
  { orth:'boots', sound:'b', pos:'initial', shape:'CVCC', emoji:'🥾' },
  { orth:'box',   sound:'b', pos:'initial', shape:'CVCC', emoji:'📦' },
  { orth:'bank',  sound:'b', pos:'initial', shape:'CVCC', emoji:'🏦' },
  { orth:'bulb',  sound:'b', pos:'initial', shape:'CVCC', emoji:'💡' },
  { orth:'boats', sound:'b', pos:'initial', shape:'CVVCC',emoji:'⛵' },
  { orth:'bread', sound:'b', pos:'initial', shape:'CCVC', emoji:'🍞' },
  { orth:'brick', sound:'b', pos:'initial', shape:'CCVC', emoji:'🧱' },
  { orth:'broom', sound:'b', pos:'initial', shape:'CCVC', emoji:'🧹' },
  { orth:'brush', sound:'b', pos:'initial', shape:'CCVC', emoji:'🪥' },
  { orth:'brain', sound:'b', pos:'initial', shape:'CCVVC',emoji:'🧠' },

  // /b/ final
  { orth:'cab',   sound:'b', pos:'final',   shape:'CVC',  emoji:'🚕' },
  { orth:'tub',   sound:'b', pos:'final',   shape:'CVC',  emoji:'🛁' },

  { orth:'job',   sound:'b', pos:'final',   shape:'CVC',  emoji:'💼' },
  { orth:'fab',   sound:'b', pos:'final',   shape:'CVC',  emoji:'👍' },
  { orth:'web',   sound:'b', pos:'final',   shape:'CVC',  emoji:'🕸️' },
  { orth:'robe',  sound:'b', pos:'final',   shape:'CVVC', emoji:'👘' },
  { orth:'crab',  sound:'b', pos:'final',   shape:'CCVC', emoji:'🦀' },
  { orth:'cube',  sound:'b', pos:'final',   shape:'CCVC', emoji:'🧊' },
  { orth:'crib',  sound:'b', pos:'final',   shape:'CCVC', emoji:'🛏️' },
  { orth:'globe', sound:'b', pos:'final',   shape:'CCVVC',emoji:'🌍' },

  // /b/ medial (multi-syllable / not shape-filter friendly)
  { orth:'baby',   sound:'b', pos:'medial', shape:'OTHER',emoji:'🍼' },
  { orth:'rabbit', sound:'b', pos:'medial', shape:'OTHER',emoji:'🐰' },
  { orth:'bubble', sound:'b', pos:'medial', shape:'OTHER',emoji:'🫧' },
  { orth:'cabbage',sound:'b', pos:'medial', shape:'OTHER',emoji:'🥬' },

  // /t/
  { orth:'tea',    sound:'t', pos:'initial', shape:'CV',    emoji:'🫖' },
  { orth:'toe',    sound:'t', pos:'initial', shape:'CVV',   emoji:'🦶' },
  { orth:'tie',    sound:'t', pos:'initial', shape:'CVV',   emoji:'👔' },
  { orth:'toy',    sound:'t', pos:'initial', shape:'CVV',   emoji:'🧸' },
  { orth:'tin',    sound:'t', pos:'initial', shape:'CVC',   emoji:'🥫' },
  { orth:'tap',    sound:'t', pos:'initial', shape:'CVC',   emoji:'🚰' },
  { orth:'tag',    sound:'t', pos:'initial', shape:'CVC',   emoji:'🏷️' },
  { orth:'tub',    sound:'t', pos:'initial', shape:'CVC',   emoji:'🛁' },
  { orth:'tape',   sound:'t', pos:'initial', shape:'CVVC',  emoji:'📼' },
  { orth:'toad',   sound:'t', pos:'initial', shape:'CVVC',  emoji:'🐸' },
  { orth:'tent',   sound:'t', pos:'initial', shape:'CVCC',  emoji:'⛺' },
  { orth:'tusk',   sound:'t', pos:'initial', shape:'CVCC',  emoji:'🐘' },
  { orth:'toast',  sound:'t', pos:'initial', shape:'CVVCC', emoji:'🍞' },
  { orth:'trap',   sound:'t', pos:'initial', shape:'CCVC',  emoji:'🪤' },
  { orth:'truck',  sound:'t', pos:'initial', shape:'CCVC',  emoji:'🚚' },
  { orth:'train',  sound:'t', pos:'initial', shape:'CCVVC', emoji:'🚆' },
  { orth:'taxi',   sound:'t', pos:'initial', shape:'OTHER', emoji:'🚕' },

  // /t/ medial (multi-syllable / not shape-filter friendly)
  { orth:'water',  sound:'t', pos:'medial',  shape:'OTHER', emoji:'💧' },
  { orth:'butter', sound:'t', pos:'medial',  shape:'OTHER', emoji:'🧈' },

  // /t/ final
  { orth:'meat',   sound:'t', pos:'final',   shape:'CVC',   emoji:'🍖' },
  { orth:'hat',    sound:'t', pos:'final',   shape:'CVC',   emoji:'🎩' },
  { orth:'cat',    sound:'t', pos:'final',   shape:'CVC',   emoji:'🐱' },
  { orth:'foot',   sound:'t', pos:'final',   shape:'CVC',   emoji:'🦶' },
  { orth:'shirt',  sound:'t', pos:'final',   shape:'CVC',   emoji:'👕' },
  { orth:'boat',   sound:'t', pos:'final',   shape:'CVVC',  emoji:'⛵' },
  { orth:'coat',   sound:'t', pos:'final',   shape:'CVVC',  emoji:'🧥' },
  { orth:'kite',   sound:'t', pos:'final',   shape:'CVVC',  emoji:'🪁' },
  { orth:'light',  sound:'t', pos:'final',   shape:'CVVC',  emoji:'💡' },
  { orth:'gift',   sound:'t', pos:'final',   shape:'CVCC',  emoji:'🎁' },
  { orth:'lift',   sound:'t', pos:'final',   shape:'CVCC',  emoji:'🛗' },
  { orth:'post',   sound:'t', pos:'final',   shape:'CVVCC', emoji:'📮' },
  { orth:'plate',  sound:'t', pos:'final',   shape:'CCVVC', emoji:'🍽️' },

  // /d/
  { orth:'door',  sound:'d', pos:'initial', shape:'CV',    emoji:'🚪' },
  { orth:'deer',  sound:'d', pos:'initial', shape:'CVV',    emoji:'🦌' },
  { orth:'dog',   sound:'d', pos:'initial', shape:'CVC',   emoji:'🐶' },
  { orth:'duck',  sound:'d', pos:'initial', shape:'CVC',   emoji:'🦆' },
  { orth:'doll',  sound:'d', pos:'initial', shape:'CVC',   emoji:'🪆' },
  { orth:'dig',   sound:'d', pos:'initial', shape:'CVC',   emoji:'⛏️' },

  { orth:'dish',  sound:'d', pos:'initial', shape:'CVC',   emoji:'🍽️' },
  { orth:'day',   sound:'d', pos:'initial', shape:'CVV',   emoji:'📅' },
  { orth:'dough', sound:'d', pos:'initial', shape:'CVV',   emoji:'🍞' },
  { orth:'dice',  sound:'d', pos:'initial', shape:'CVVC',  emoji:'🎲' },
  { orth:'dome',  sound:'d', pos:'initial', shape:'CVVC',  emoji:'🏛️' },
  { orth:'date',  sound:'d', pos:'initial', shape:'CVVC',  emoji:'📅' },
  { orth:'disk',  sound:'d', pos:'initial', shape:'CVCC',  emoji:'💿' },
  { orth:'desk',  sound:'d', pos:'initial', shape:'CVCC',  emoji:'💻' },
  { orth:'drum',  sound:'d', pos:'initial', shape:'CCVC',  emoji:'🥁' },
  { orth:'dress', sound:'d', pos:'initial', shape:'CCVC',  emoji:'👗' },
  { orth:'drive', sound:'d', pos:'initial', shape:'CCVVC', emoji:'🚗' },

  // /d/ medial (multi-syllable / not shape-filter friendly)
  { orth:'ladder',sound:'d', pos:'medial',  shape:'OTHER', emoji:'🪜' },

  // /d/ final
  { orth:'bed',   sound:'d', pos:'final',   shape:'CVC',   emoji:'🛏️' },
  { orth:'food',  sound:'d', pos:'final',   shape:'CVC',   emoji:'🍲' },
  { orth:'bird',  sound:'d', pos:'final',   shape:'CVC',   emoji:'🐦' },
  { orth:'seed',  sound:'d', pos:'final',   shape:'CVC',   emoji:'🌱' },
  { orth:'wood',  sound:'d', pos:'final',   shape:'CVC',   emoji:'🪵' },
  { orth:'road',  sound:'d', pos:'final',   shape:'CVVC',  emoji:'🛣️' },
  { orth:'toad',  sound:'d', pos:'final',   shape:'CVVC',  emoji:'🐸' },
  { orth:'hand',  sound:'d', pos:'final',   shape:'CVCC',  emoji:'✋' },
  { orth:'bread', sound:'d', pos:'final',   shape:'CCVC',  emoji:'🍞' },
  { orth:'cloud', sound:'d', pos:'final',   shape:'CCVVC', emoji:'☁️' },

  // /k/ (expanded)
  // initial
  { orth:'key',   sound:'k', pos:'initial', shape:'CV',    emoji:'🔑' },
  { orth:'cow',   sound:'k', pos:'initial', shape:'CVV',   emoji:'🐄' },
  { orth:'koi',   sound:'k', pos:'initial', shape:'CVV',   emoji:'🐠' },

  { orth:'cat',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🐱' },
  { orth:'cup',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🥤' },
  { orth:'can',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🥫' },
  { orth:'kid',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🧒' },
  { orth:'cap',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🧢' },
  { orth:'cook',  sound:'k', pos:'initial', shape:'CVC',   emoji:'🧑‍🍳' },
  { orth:'corn',  sound:'k', pos:'initial', shape:'CVC',   emoji:'🌽' },
  { orth:'cod',   sound:'k', pos:'initial', shape:'CVC',   emoji:'🐟' },

  { orth:'kite',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🪁' },
  { orth:'cake',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🎂' },
  { orth:'coat',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🧥' },
  { orth:'cone',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🍦' },

  { orth:'coin',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🪙' },

  { orth:'comb',  sound:'k', pos:'initial', shape:'CVVC',  emoji:'🪮' },

  { orth:'camp',  sound:'k', pos:'initial', shape:'CVCC',  emoji:'🏕️' },
  { orth:'cask',  sound:'k', pos:'initial', shape:'CVCC',  emoji:'🛢️' },

  { orth:'cakes', sound:'k', pos:'initial', shape:'CVVCC', emoji:'🎂' },
  { orth:'kites', sound:'k', pos:'initial', shape:'CVVCC', emoji:'🪁' },
  { orth:'coats', sound:'k', pos:'initial', shape:'CVVCC', emoji:'🧥' },
  { orth:'coins', sound:'k', pos:'initial', shape:'CVVCC', emoji:'🪙' },
  { orth:'caves', sound:'k', pos:'initial', shape:'CVVCC', emoji:'🕳️' },

  { orth:'crab',  sound:'k', pos:'initial', shape:'CCVC',  emoji:'🦀' },
  { orth:'clip',  sound:'k', pos:'initial', shape:'CCVC',  emoji:'🖇️' },
  { orth:'clock', sound:'k', pos:'initial', shape:'CCVC',  emoji:'🕒' },

  { orth:'crane', sound:'k', pos:'initial', shape:'CCVVC', emoji:'🏗️' },
  { orth:'clown', sound:'k', pos:'initial', shape:'CCVVC', emoji:'🤡' },
  { orth:'crown', sound:'k', pos:'initial', shape:'CCVVC', emoji:'👑' },

  // medial (multi-syllable / not shape-filter friendly)
  { orth:'bacon',   sound:'k', pos:'medial', shape:'OTHER', emoji:'🥓' },
  { orth:'chicken', sound:'k', pos:'medial', shape:'OTHER', emoji:'🐔' },
  { orth:'rocket',  sound:'k', pos:'medial', shape:'OTHER', emoji:'🚀' },
  { orth:'packet',  sound:'k', pos:'medial', shape:'OTHER', emoji:'📦' },

  // final
  { orth:'sock',  sound:'k', pos:'final',   shape:'CVC',   emoji:'🧦' },
  { orth:'book',  sound:'k', pos:'final',   shape:'CVC',   emoji:'📖' },
  { orth:'shark', sound:'k', pos:'final',   shape:'CVC',   emoji:'🦈' },
  { orth:'rock',  sound:'k', pos:'final',   shape:'CVC',   emoji:'🪨' },
  { orth:'fork',  sound:'k', pos:'final',   shape:'CVC',   emoji:'🍴' },
  { orth:'back',  sound:'k', pos:'final',   shape:'CVC',   emoji:'🎒' },

  { orth:'pack',  sound:'k', pos:'final',   shape:'CVC',   emoji:'📦' },
  { orth:'chick', sound:'k', pos:'final',   shape:'CVC',   emoji:'🐥' },

  { orth:'cake',  sound:'k', pos:'final',   shape:'CVVC',  emoji:'🎂' },
  { orth:'bike',  sound:'k', pos:'final',   shape:'CVVC',  emoji:'🚲' },
  { orth:'snake', sound:'k', pos:'final',   shape:'CCVVC', emoji:'🐍' },

  { orth:'milk',  sound:'k', pos:'final',   shape:'CVCC',  emoji:'🥛' },
  { orth:'silk',  sound:'k', pos:'final',   shape:'CVCC',  emoji:'🧵' },

  { orth:'truck', sound:'k', pos:'final',   shape:'CCVC',  emoji:'🚚' },
  { orth:'clock', sound:'k', pos:'final',   shape:'CCVC',  emoji:'🕒' },

  // /g/ (expanded)
  // initial
  { orth:'goo',    sound:'g', pos:'initial', shape:'CV',    emoji:'🧴' }, // lotion bottle (goo/gel)
  { orth:'go',     sound:'g', pos:'initial', shape:'CVV',   emoji:'🚦' }, // traffic light (go)
  { orth:'guy',    sound:'g', pos:'initial', shape:'CVV',   emoji:'🧑' }, // person

  { orth:'gem',    sound:'g', pos:'initial', shape:'CVC',   emoji:'💎' },
  { orth:'gas',    sound:'g', pos:'initial', shape:'CVC',   emoji:'⛽' },
  { orth:'gum',    sound:'g', pos:'initial', shape:'CVC',   emoji:'🍬' }, // candy as proxy for chewing gum
  { orth:'goose',  sound:'g', pos:'initial', shape:'CVC',   emoji:'🪿' },

  { orth:'goat',   sound:'g', pos:'initial', shape:'CVVC',  emoji:'🐐' },
  { orth:'game',   sound:'g', pos:'initial', shape:'CVVC',  emoji:'🎮' },
  { orth:'gate',   sound:'g', pos:'initial', shape:'CVVC',  emoji:'🚪' }, // door as proxy for gate

  { orth:'gift',   sound:'g', pos:'initial', shape:'CVCC',  emoji:'🎁' },
  { orth:'gold',   sound:'g', pos:'initial', shape:'CVCC',  emoji:'🪙' },

  { orth:'goats',  sound:'g', pos:'initial', shape:'CVVCC', emoji:'🐐' },
  { orth:'games',  sound:'g', pos:'initial', shape:'CVVCC', emoji:'🎮' },

  { orth:'glove',  sound:'g', pos:'initial', shape:'CCVC',  emoji:'🧤' },
  { orth:'grass',  sound:'g', pos:'initial', shape:'CCVC',  emoji:'🌿' },

  { orth:'globe',  sound:'g', pos:'initial', shape:'CCVVC', emoji:'🌍' },
  { orth:'grape',  sound:'g', pos:'initial', shape:'CCVVC', emoji:'🍇' },

  // medial (multi-syllable / not shape-filter friendly)
  { orth:'tiger',  sound:'g', pos:'medial',  shape:'OTHER', emoji:'🐅' },
  { orth:'wagon',  sound:'g', pos:'medial',  shape:'OTHER', emoji:'🚚' }, // truck as proxy

  // final
  { orth:'bag',    sound:'g', pos:'final',   shape:'CVC',   emoji:'👜' },
  { orth:'bug',    sound:'g', pos:'final',   shape:'CVC',   emoji:'🐛' },
  { orth:'log',    sound:'g', pos:'final',   shape:'CVC',   emoji:'🪵' },
  { orth:'mug',    sound:'g', pos:'final',   shape:'CVC',   emoji:'☕' },
  { orth:'fog',    sound:'g', pos:'final',   shape:'CVC',   emoji:'🌫' },
  { orth:'tag',    sound:'g', pos:'final',   shape:'CVC',   emoji:'🏷' },
  { orth:'rug',    sound:'g', pos:'final',   shape:'CVC',   emoji:'🧶' }, // yarn as proxy for rug
  { orth:'dig',    sound:'g', pos:'final',   shape:'CVC',   emoji:'⛏' },

  { orth:'frog',   sound:'g', pos:'final',   shape:'CCVC',  emoji:'🐸' },
  { orth:'slug',   sound:'g', pos:'final',   shape:'CCVC',  emoji:'🐌' },
  // -----------------------------
  // NASALS
  // /m/
  { orth:'ma',     sound:'m', pos:'initial', shape:'CV',    emoji:'👩' },
  { orth:'moo',    sound:'m', pos:'initial', shape:'CV',    emoji:'🐄' },

  { orth:'map',    sound:'m', pos:'initial', shape:'CVC',   emoji:'🗺️' },
  { orth:'moon',   sound:'m', pos:'initial', shape:'CVC',   emoji:'🌙' },
  { orth:'mum',    sound:'m', pos:'initial', shape:'CVC',   emoji:'👩‍👧' },
  { orth:'man',    sound:'m', pos:'initial', shape:'CVC',   emoji:'👨' },
  { orth:'meat',   sound:'m', pos:'initial', shape:'CVC',   emoji:'🥩' },
  { orth:'meal',   sound:'m', pos:'initial', shape:'CVC',   emoji:'🍽️' },
  { orth:'mug',    sound:'m', pos:'initial', shape:'CVC',   emoji:'☕' },
  { orth:'moose',  sound:'m', pos:'initial', shape:'CVC',   emoji:'🫎' },

  { orth:'mouse',  sound:'m', pos:'initial', shape:'CVVC',  emoji:'🐭' },
  { orth:'mouth',  sound:'m', pos:'initial', shape:'CVVC',  emoji:'👄' },
  { orth:'mail',   sound:'m', pos:'initial', shape:'CVVC',  emoji:'📫' },

  { orth:'milk',   sound:'m', pos:'initial', shape:'CVCC',  emoji:'🥛' },
  { orth:'mask',   sound:'m', pos:'initial', shape:'CVCC',  emoji:'😷' },
  { orth:'mint',   sound:'m', pos:'initial', shape:'CVCC',  emoji:'🍃' },
  { orth:'mount',  sound:'m', pos:'initial', shape:'CVVCC', emoji:'🏔️' },

  // final /m/
  { orth:'jam',    sound:'m', pos:'final',   shape:'CVC',   emoji:'🫙' },
  { orth:'ham',    sound:'m', pos:'final',   shape:'CVC',   emoji:'🍖' },
  { orth:'ram',    sound:'m', pos:'final',   shape:'CVC',   emoji:'🐏' },
  { orth:'comb',   sound:'m', pos:'final',   shape:'CVVC',  emoji:'🪮' },
  { orth:'home',   sound:'m', pos:'final',   shape:'CVVC',  emoji:'🏠' },
  { orth:'film',   sound:'m', pos:'final',   shape:'CVCC',  emoji:'🎞️' },

  { orth:'clam',   sound:'m', pos:'final',   shape:'CCVC',  emoji:'🐚' },
  { orth:'drum',   sound:'m', pos:'final',   shape:'CCVC',  emoji:'🥁' },
  { orth:'swim',   sound:'m', pos:'final',   shape:'CCVC',  emoji:'🏊' },
  { orth:'cream',  sound:'m', pos:'final',   shape:'CCVC',  emoji:'🍦' },

  { orth:'flame',  sound:'m', pos:'final',   shape:'CCVVC', emoji:'🔥' },
  { orth:'frame',  sound:'m', pos:'final',   shape:'CCVVC', emoji:'🖼️' },

  // /m/ medial (OTHER)
  { orth:'lemon',  sound:'m', pos:'medial',  shape:'OTHER', emoji:'🍋' },
  { orth:'camel',  sound:'m', pos:'medial',  shape:'OTHER', emoji:'🐫' },
  { orth:'hammer', sound:'m', pos:'medial',  shape:'OTHER', emoji:'🔨' },
  { orth:'tomato', sound:'m', pos:'medial',  shape:'OTHER', emoji:'🍅' },

  // /n/
  // initial
  { orth:'neigh',  sound:'n', pos:'initial', shape:'CVV',   emoji:'🐴' },

  { orth:'net',    sound:'n', pos:'initial', shape:'CVC',   emoji:'🥅' },
  { orth:'nut',    sound:'n', pos:'initial', shape:'CVC',   emoji:'🥜' },
  { orth:'nap',    sound:'n', pos:'initial', shape:'CVC',   emoji:'😴' },
  { orth:'nurse',  sound:'n', pos:'initial', shape:'CVC',   emoji:'👩‍⚕️' },

  { orth:'nose',   sound:'n', pos:'initial', shape:'CVVC',  emoji:'👃' },
  { orth:'nail',   sound:'n', pos:'initial', shape:'CVVC',  emoji:'💅' },
  { orth:'night',  sound:'n', pos:'initial', shape:'CVVC',  emoji:'🌙' },

  { orth:'nest',   sound:'n', pos:'initial', shape:'CVCC',  emoji:'🪺' },

  // final
  { orth:'sun',    sound:'n', pos:'final',   shape:'CVC',   emoji:'☀️' },
  { orth:'can',    sound:'n', pos:'final',   shape:'CVC',   emoji:'🥫' },
  { orth:'pan',    sound:'n', pos:'final',   shape:'CVC',   emoji:'🍳' },
  { orth:'rain',   sound:'n', pos:'final',   shape:'CVVC',  emoji:'🌧️' },
  { orth:'spoon',  sound:'n', pos:'final',   shape:'CCVC',  emoji:'🥄' },
  { orth:'train',  sound:'n', pos:'final',   shape:'CCVVC', emoji:'🚆' },
  { orth:'clown',  sound:'n', pos:'final',   shape:'CCVVC', emoji:'🤡' },
  { orth:'crown',  sound:'n', pos:'final',   shape:'CCVVC', emoji:'👑' },

  // medial (OTHER)
  { orth:'banana', sound:'n', pos:'medial',  shape:'OTHER', emoji:'🍌' },
  { orth:'tunnel', sound:'n', pos:'medial',  shape:'OTHER', emoji:'🚇' },
  { orth:'dinner', sound:'n', pos:'medial',  shape:'OTHER', emoji:'🍽️' },
  { orth:'bunny',  sound:'n', pos:'medial',  shape:'OTHER', emoji:'🐰' },

  // /ŋ/
  // Note: English /ŋ/ is not initial in native words; expect Initial to hard-block.
  // Final (CVC)
  { orth:'ring',  sound:'ng', pos:'final', shape:'CVC',  emoji:'💍' },
  { orth:'wing',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🪽' },
  { orth:'king',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🤴' },
  { orth:'sing',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🎤' },
  { orth:'song',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🎵' },
  { orth:'long',  sound:'ng', pos:'final', shape:'CVC',  emoji:'📏' },
  // removed: lung (medical)
  { orth:'tongue',sound:'ng', pos:'final', shape:'CVC',  emoji:'👅' },
  { orth:'bang',  sound:'ng', pos:'final', shape:'CVC',  emoji:'💥' },
  { orth:'hang',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🪝' },
  { orth:'fang',  sound:'ng', pos:'final', shape:'CVC',  emoji:'🦷' },

  // Final (CCVC)
  { orth:'sting', sound:'ng', pos:'final', shape:'CCVC', emoji:'🐝' },
  { orth:'stung', sound:'ng', pos:'final', shape:'CCVC', emoji:'🐝' },
  { orth:'string',sound:'ng', pos:'final', shape:'CCVC', emoji:'🧵' },

  // -----------------------------
  // FRICATIVES
  // /f/
  // CV (monophthong)
  { orth:'fee',   sound:'f', pos:'initial', shape:'CV',    emoji:'🧾' },

  // CVV (diphthong)
  { orth:'foe',   sound:'f', pos:'initial', shape:'CVV',   emoji:'🥊' },

  // CVC
  { orth:'fish',  sound:'f', pos:'initial', shape:'CVC',   emoji:'🐟' },
  { orth:'fan',   sound:'f', pos:'initial', shape:'CVC',   emoji:'🪭' },
  { orth:'foot',  sound:'f', pos:'initial', shape:'CVC',   emoji:'🦶' },
  { orth:'fog',   sound:'f', pos:'initial', shape:'CVC',   emoji:'🌫️' },

  // CVVC
  { orth:'phone', sound:'f', pos:'initial', shape:'CVVC',  emoji:'📱' },
  { orth:'face',  sound:'f', pos:'initial', shape:'CVVC',  emoji:'🙂' },
  { orth:'file',  sound:'f', pos:'initial', shape:'CVVC',  emoji:'🗂️' },

  // CVCC
  { orth:'fork',  sound:'f', pos:'initial', shape:'CVCC',  emoji:'🍴' },
  { orth:'fox',   sound:'f', pos:'initial', shape:'CVCC',  emoji:'🦊' },
  { orth:'fist',  sound:'f', pos:'initial', shape:'CVCC',  emoji:'✊' },
  { orth:'film',  sound:'f', pos:'initial', shape:'CVCC',  emoji:'🎞️' },

  // CCVC
  { orth:'frog',  sound:'f', pos:'initial', shape:'CCVC',  emoji:'🐸' },
  { orth:'flag',  sound:'f', pos:'initial', shape:'CCVC',  emoji:'🚩' },
  { orth:'flap',  sound:'f', pos:'initial', shape:'CCVC',  emoji:'🪽' },
  { orth:'flute', sound:'f', pos:'initial', shape:'CCVC',  emoji:'🪈' },

  // CCVVC
  { orth:'flame', sound:'f', pos:'initial', shape:'CCVVC', emoji:'🔥' },
  { orth:'flake', sound:'f', pos:'initial', shape:'CCVVC', emoji:'❄️' },

  // final
  { orth:'leaf',  sound:'f', pos:'final',   shape:'CVC',   emoji:'🍃' },
  { orth:'roof',  sound:'f', pos:'final',   shape:'CVC',   emoji:'🏠' },
  { orth:'loaf',  sound:'f', pos:'final',   shape:'CVVC',  emoji:'🍞' },
  { orth:'chef',  sound:'f', pos:'final',   shape:'CVC',   emoji:'🧑‍🍳' },
  { orth:'beef',  sound:'f', pos:'final',   shape:'CVC',   emoji:'🥩' },
  { orth:'wolf',  sound:'f', pos:'final',   shape:'CVCC',  emoji:'🐺' },
  { orth:'cliff', sound:'f', pos:'final',   shape:'CCVC',  emoji:'⛰️' },

  // medial (OTHER)
  { orth:'sofa',   sound:'f', pos:'medial', shape:'OTHER', emoji:'🛋️' },
  { orth:'coffee', sound:'f', pos:'medial', shape:'OTHER', emoji:'☕' },
  { orth:'waffle', sound:'f', pos:'medial', shape:'OTHER', emoji:'🧇' },
  // /v/
  // Initial (note: very few clean CV/CVV words for /v/ in English; CV+CVV may hard-block)
  { orth:'van',    sound:'v', pos:'initial', shape:'CVC',   emoji:'🚐' },
  { orth:'vet',    sound:'v', pos:'initial', shape:'CVC',   emoji:'🧑‍⚕️' },

  { orth:'vase',   sound:'v', pos:'initial', shape:'CVVC',  emoji:'🏺' },
  { orth:'vine',   sound:'v', pos:'initial', shape:'CVVC',  emoji:'🍇' },

  { orth:'vest',   sound:'v', pos:'initial', shape:'CVCC',  emoji:'🦺' },
  // removed: vamp (scary theme)

  // removed: vroom (onomatopoeia)

  // Final
  { orth:'dove',   sound:'v', pos:'final',   shape:'CVC',   emoji:'🕊️' },

  { orth:'hive',   sound:'v', pos:'final',   shape:'CVVC',  emoji:'🍯' },

  { orth:'wave',   sound:'v', pos:'final',   shape:'CVVC',  emoji:'🌊' },
  { orth:'save',   sound:'v', pos:'final',   shape:'CVVC',  emoji:'💾' },
  { orth:'glove',  sound:'v', pos:'final',   shape:'CCVC',  emoji:'🧤' },
  { orth:'stove',  sound:'v', pos:'final',   shape:'CCVVC', emoji:'🔥' },

  // Medial (OTHER)
  { orth:'seven',  sound:'v', pos:'medial',  shape:'OTHER', emoji:'🎲' },
  { orth:'shovel', sound:'v', pos:'medial',  shape:'OTHER', emoji:'⛏️' },
  { orth:'movie',  sound:'v', pos:'medial',  shape:'OTHER', emoji:'🎬' },

  // /θ/
  // Initial
  { orth:'thaw',   sound:'th', pos:'initial', shape:'CV',    emoji:'🧊' },
  { orth:'thigh',  sound:'th', pos:'initial', shape:'CVV',   emoji:'🦵' },

  { orth:'thumb',  sound:'th', pos:'initial', shape:'CVC',   emoji:'🖐️' },
  { orth:'thorn',  sound:'th', pos:'initial', shape:'CVC',   emoji:'🌹' },
  // removed: thief (crime)
  { orth:'thin',   sound:'th', pos:'initial', shape:'CVC',   emoji:'📏' },
  { orth:'think',  sound:'th', pos:'initial', shape:'CVCC',  emoji:'🧠' },
  { orth:'thump',  sound:'th', pos:'initial', shape:'CVCC',  emoji:'🥁' },
  { orth:'thirst', sound:'th', pos:'initial', shape:'CVCC',  emoji:'🥤' },
  { orth:'thread', sound:'th', pos:'initial', shape:'CCVC',  emoji:'🧵' },
  { orth:'thrush', sound:'th', pos:'initial', shape:'CCVC',  emoji:'🐦' },
  { orth:'throne', sound:'th', pos:'initial', shape:'CCVVC', emoji:'🪑' },

  // Final
  { orth:'tooth',  sound:'th', pos:'final',   shape:'CVC',   emoji:'🦷' },
  { orth:'bath',   sound:'th', pos:'final',   shape:'CVC',   emoji:'🛁' },
  { orth:'path',   sound:'th', pos:'final',   shape:'CVC',   emoji:'🛣️' },
  { orth:'moth',   sound:'th', pos:'final',   shape:'CVC',   emoji:'🦋' },

  { orth:'north',  sound:'th', pos:'final',   shape:'CVC',   emoji:'🗺️' },
  { orth:'wreath', sound:'th', pos:'final',   shape:'CVC',   emoji:'🌿' },
  { orth:'south',  sound:'th', pos:'final',   shape:'CVVC',  emoji:'🧭' },

  { orth:'cloth',  sound:'th', pos:'final',   shape:'CCVC',  emoji:'👕' },
  { orth:'sloth',  sound:'th', pos:'final',   shape:'CCVC',  emoji:'🦥' },
  // /ð/ (voiced 'th') — keep to genuinely imageable items (UK-only)
  // Medial (OTHER)
  { orth:'mother',  sound:'dh', pos:'medial',  shape:'OTHER', emoji:'👩' },
  { orth:'father',  sound:'dh', pos:'medial',  shape:'OTHER', emoji:'👨' },
  { orth:'brother', sound:'dh', pos:'medial',  shape:'OTHER', emoji:'👦' },
  { orth:'feather', sound:'dh', pos:'medial',  shape:'OTHER', emoji:'🪶' },
  { orth:'leather', sound:'dh', pos:'medial',  shape:'OTHER', emoji:'👞' },
  { orth:'weather', sound:'dh', pos:'medial',  shape:'OTHER', emoji:'☁️' },

  // Final
  { orth:'bathe',   sound:'dh', pos:'final',   shape:'CVVC',  emoji:'🛁' },
  // removed: breathe (medical)
  { orth:'soothe',  sound:'dh', pos:'final',   shape:'CVVC',  emoji:'😌' },
  { orth:'clothe',  sound:'dh', pos:'final',   shape:'CCVVC', emoji:'👕' },
  { orth:'smooth',  sound:'dh', pos:'final',   shape:'CCVC',  emoji:'🧴' },
  // /s/
  // Initial — CV / CVV
  { orth:'see',    sound:'s', pos:'initial', shape:'CV',    emoji:'👀' },
  { orth:'sew',    sound:'s', pos:'initial', shape:'CVV',   emoji:'🧵' },
  { orth:'sow',    sound:'s', pos:'initial', shape:'CVV',   emoji:'🐖' },
  { orth:'say',    sound:'s', pos:'initial', shape:'CVV',   emoji:'🗣️' },

  // Initial — CVC / CVVC
  { orth:'sun',    sound:'s', pos:'initial', shape:'CVC',   emoji:'☀️' },
  { orth:'sock',   sound:'s', pos:'initial', shape:'CVC',   emoji:'🧦' },
  { orth:'seal',   sound:'s', pos:'initial', shape:'CVC',   emoji:'🦭' },
  { orth:'sad',    sound:'s', pos:'initial', shape:'CVC',   emoji:'😢' },
  { orth:'sip',    sound:'s', pos:'initial', shape:'CVC',   emoji:'🥤' },
  { orth:'sit',    sound:'s', pos:'initial', shape:'CVC',   emoji:'🪑' },
  { orth:'soup',   sound:'s', pos:'initial', shape:'CVC',   emoji:'🍲' },

  { orth:'soap',   sound:'s', pos:'initial', shape:'CVVC',  emoji:'🧼' },
  { orth:'sail',   sound:'s', pos:'initial', shape:'CVVC',  emoji:'⛵' },
  { orth:'soil',   sound:'s', pos:'initial', shape:'CVVC',  emoji:'🌱' },

  // Initial — CVCC / CVVCC
  { orth:'sand',   sound:'s', pos:'initial', shape:'CVCC',  emoji:'🏖️' },
  { orth:'salt',   sound:'s', pos:'initial', shape:'CVCC',  emoji:'🧂' },
  { orth:'sink',   sound:'s', pos:'initial', shape:'CVCC',  emoji:'🚰' },
  { orth:'soaps',  sound:'s', pos:'initial', shape:'CVVCC', emoji:'🧼' },
  { orth:'sails',  sound:'s', pos:'initial', shape:'CVVCC', emoji:'⛵' },

  // Initial clusters — CCVC / CCVVC
  { orth:'scarf',  sound:'s', pos:'initial', shape:'CCVC',  emoji:'🧣' },
  { orth:'spoon',  sound:'s', pos:'initial', shape:'CCVC',  emoji:'🥄' },
  { orth:'spud',   sound:'s', pos:'initial', shape:'CCVC',  emoji:'🥔' },
  { orth:'swim',   sound:'s', pos:'initial', shape:'CCVC',  emoji:'🏊' },
  { orth:'stick',  sound:'s', pos:'initial', shape:'CCVC',  emoji:'🪵' },

  { orth:'snake',  sound:'s', pos:'initial', shape:'CCVVC', emoji:'🐍' },
  { orth:'spike',  sound:'s', pos:'initial', shape:'CCVVC', emoji:'📌' },
  { orth:'skate',  sound:'s', pos:'initial', shape:'CCVVC', emoji:'🛹' },
  { orth:'smile',  sound:'s', pos:'initial', shape:'CCVVC', emoji:'🙂' },

  // Medial (OTHER)
  { orth:'castle',   sound:'s', pos:'medial', shape:'OTHER', emoji:'🏰' },
  { orth:'biscuit',  sound:'s', pos:'medial', shape:'OTHER', emoji:'🍪' },
  { orth:'pasta',    sound:'s', pos:'medial', shape:'OTHER', emoji:'🍝' },
  { orth:'dinosaur', sound:'s', pos:'medial', shape:'OTHER', emoji:'🦖' },
  { orth:'basket',   sound:'s', pos:'medial', shape:'OTHER', emoji:'🧺' },

  // Final
  { orth:'bus',    sound:'s', pos:'final',  shape:'CVC',   emoji:'🚌' },
  { orth:'mess',   sound:'s', pos:'final',  shape:'CVC',   emoji:'🧹' },
  { orth:'house',  sound:'s', pos:'final',  shape:'CVVC',  emoji:'🏠' },
  { orth:'glass',  sound:'s', pos:'final',  shape:'CCVC',  emoji:'🥛' },

  // /z/
  // Initial — CV (long monophthongs like /zuː/ count as CV here)
  { orth:'zoo',    sound:'z', pos:'initial', shape:'CV',    emoji:'🦁' },

  // Initial — CVC
  { orth:'zip',    sound:'z', pos:'initial', shape:'CVC',   emoji:'🤐' },
  { orth:'zap',    sound:'z', pos:'initial', shape:'CVC',   emoji:'⚡' },
  // removed: zen (too abstract)

  // Initial — CVVC
  { orth:'zone',   sound:'z', pos:'initial', shape:'CVVC',  emoji:'🗺️' },

  // Initial — CVCC
  { orth:'zest',   sound:'z', pos:'initial', shape:'CVCC',  emoji:'🍋' },

  // Initial — OTHER
  { orth:'zebra',  sound:'z', pos:'initial', shape:'OTHER', emoji:'🦓' },
  { orth:'zipper', sound:'z', pos:'initial', shape:'OTHER', emoji:'🧥' },

  // Medial (OTHER)
  { orth:'lizard', sound:'z', pos:'medial',  shape:'OTHER', emoji:'🦎' },
  { orth:'daisy',  sound:'z', pos:'medial',  shape:'OTHER', emoji:'🌼' },
  { orth:'lazy',   sound:'z', pos:'medial',  shape:'OTHER', emoji:'😴' },
  { orth:'wizard', sound:'z', pos:'medial',  shape:'OTHER', emoji:'🧙' },

  // Final — CVVC (diphthong + /z/)
  { orth:'nose',   sound:'z', pos:'final',   shape:'CVVC',  emoji:'👃' },
  { orth:'rose',   sound:'z', pos:'final',   shape:'CVVC',  emoji:'🌹' },
  { orth:'maze',   sound:'z', pos:'final',   shape:'CVVC',  emoji:'🧩' },
  { orth:'toes',   sound:'z', pos:'final',   shape:'CVVC',  emoji:'🦶' },

  // Final — CVC
  { orth:'peas',   sound:'z', pos:'final',   shape:'CVC',   emoji:'🫛' },
  { orth:'bees',   sound:'z', pos:'final',   shape:'CVC',   emoji:'🐝' },
  { orth:'buzz',   sound:'z', pos:'final',   shape:'CVC',   emoji:'🐝' },
  { orth:'fizz',   sound:'z', pos:'final',   shape:'CVC',   emoji:'🥤' },
  { orth:'jazz',   sound:'z', pos:'final',   shape:'CVC',   emoji:'🎷' },

  // Final — CCVC (cluster + short vowel + /z/)
  { orth:'quiz',   sound:'z', pos:'final',   shape:'CCVC',  emoji:'📝' },

  // Final — CCVVC (cluster + long/tense vowel + /z/)
  { orth:'freeze', sound:'z', pos:'final',   shape:'CCVVC', emoji:'🧊' },
  { orth:'fries',  sound:'z', pos:'final',   shape:'CCVVC', emoji:'🍟' },
  { orth:'prize',  sound:'z', pos:'final',   shape:'CCVVC', emoji:'🏆' },

  // Final — CVVCC (diphthong + /z/)
  { orth:'toys',   sound:'z', pos:'final',   shape:'CVVCC', emoji:'🧸' },
  { orth:'boys',   sound:'z', pos:'final',   shape:'CVVCC', emoji:'👦' },

  // /ʃ/
  // Initial — CV + CVV
  { orth:'shoe',   sound:'sh', pos:'initial', shape:'CV',   emoji:'👟' },
  { orth:'shore',  sound:'sh', pos:'initial', shape:'CV',   emoji:'🏖️' },
  { orth:'show',   sound:'sh', pos:'initial', shape:'CVV',  emoji:'🎭' },
  { orth:'shy',    sound:'sh', pos:'initial', shape:'CVV',  emoji:'😳' },

  // Initial — CVC
  { orth:'ship',   sound:'sh', pos:'initial', shape:'CVC',  emoji:'🚢' },
  { orth:'shop',   sound:'sh', pos:'initial', shape:'CVC',  emoji:'🏬' },
  { orth:'shed',   sound:'sh', pos:'initial', shape:'CVC',  emoji:'🧰' },
  { orth:'shin',   sound:'sh', pos:'initial', shape:'CVC',  emoji:'🦵' },
  { orth:'shark',  sound:'sh', pos:'initial', shape:'CVC',  emoji:'🦈' },
  { orth:'sheep',  sound:'sh', pos:'initial', shape:'CVC',  emoji:'🐑' },
  { orth:'shell',  sound:'sh', pos:'initial', shape:'CVC',  emoji:'🐚' },
  { orth:'shut',   sound:'sh', pos:'initial', shape:'CVC',  emoji:'🚪' },

  // Initial — CVVC (diphthongs)
  { orth:'shout',  sound:'sh', pos:'initial', shape:'CVVC', emoji:'📣' },
  { orth:'shade',  sound:'sh', pos:'initial', shape:'CVVC', emoji:'🕶️' },
  { orth:'shine',  sound:'sh', pos:'initial', shape:'CVVC', emoji:'🌞' },

  // Initial — CVCC / CVVCC
  { orth:'shift',  sound:'sh', pos:'initial', shape:'CVCC',  emoji:'🕒' },
  { orth:'shocks', sound:'sh', pos:'initial', shape:'CVCC',  emoji:'⚡' },
  { orth:'shouts', sound:'sh', pos:'initial', shape:'CVVCC', emoji:'📣' },
  { orth:'shakes', sound:'sh', pos:'initial', shape:'CVVCC', emoji:'🥤' },

  // Initial — CCVC / CCVVC
  { orth:'shrub',  sound:'sh', pos:'initial', shape:'CCVC',  emoji:'🌿' },
  { orth:'shrug',  sound:'sh', pos:'initial', shape:'CCVC',  emoji:'🤷' },
  { orth:'shred',  sound:'sh', pos:'initial', shape:'CCVC',  emoji:'🧀' },
  // removed: shrine (religious/cultural symbol)
  { orth:'shroud', sound:'sh', pos:'initial', shape:'CCVVC', emoji:'🧣' },

  // Medial (OTHER)
  { orth:'tissue', sound:'sh', pos:'medial',  shape:'OTHER', emoji:'🤧' },
  { orth:'fishing',sound:'sh', pos:'medial',  shape:'OTHER', emoji:'🎣' },

  // Final — CVC
  { orth:'fish',   sound:'sh', pos:'final',   shape:'CVC',   emoji:'🐟' },
  { orth:'dish',   sound:'sh', pos:'final',   shape:'CVC',   emoji:'🍽️' },
  { orth:'bush',   sound:'sh', pos:'final',   shape:'CVC',   emoji:'🌿' },
  { orth:'wash',   sound:'sh', pos:'final',   shape:'CVC',   emoji:'🧼' },

  // Final — CCVC
  { orth:'brush',  sound:'sh', pos:'final',   shape:'CCVC',  emoji:'🖌️' },
  { orth:'flash',  sound:'sh', pos:'final',   shape:'CCVC',  emoji:'📸' },
  { orth:'crash',  sound:'sh', pos:'final',   shape:'CCVC',  emoji:'💥' },
  { orth:'trash',  sound:'sh', pos:'final',   shape:'CCVC',  emoji:'🗑️' },

  // /ʒ/
  // Note: English /ʒ/ is rare in monosyllables. We include a few good, imageable items.
  // Final (these support CVC+CVVC shape filtering)
  { orth:'rouge',   sound:'zh', pos:'final',  shape:'CVC',  emoji:'💄' },
  { orth:'beige',   sound:'zh', pos:'final',  shape:'CVVC', emoji:'👕' },

  // Medial (typically multisyllabic -> OTHER)
  { orth:'treasure',sound:'zh', pos:'medial', shape:'OTHER',emoji:'🪙' },
  { orth:'measure', sound:'zh', pos:'medial', shape:'OTHER',emoji:'📏' },
  { orth:'vision',  sound:'zh', pos:'medial', shape:'OTHER',emoji:'👀' },
  // removed: usual (abstract)
  { orth:'television',sound:'zh', pos:'medial', shape:'OTHER',emoji:'📺' },

  // /h/
  // Initial — CV / CVV
  // removed: ha (interjection)
  { orth:'hay',   sound:'h', pos:'initial', shape:'CVV',  emoji:'🌾' },
  { orth:'hi',    sound:'h', pos:'initial', shape:'CVV',  emoji:'👋' },
  { orth:'hey',   sound:'h', pos:'initial', shape:'CVV',  emoji:'👋' },

  // Initial — CVC
  { orth:'hat',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🎩' },
  { orth:'hen',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🐔' },
  { orth:'ham',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🍖' },
  { orth:'hog',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🐖' },
  { orth:'hop',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🐇' },
  { orth:'hot',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🔥' },
  { orth:'hut',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🛖' },
  { orth:'hug',   sound:'h', pos:'initial', shape:'CVC',  emoji:'🤗' },
  { orth:'hill',  sound:'h', pos:'initial', shape:'CVC',  emoji:'⛰️' },
  { orth:'hawk',  sound:'h', pos:'initial', shape:'CVC',  emoji:'🦅' },
  { orth:'horn',  sound:'h', pos:'initial', shape:'CVC',  emoji:'📯' },

  // Initial — CVVC (diphthong + single coda)
  { orth:'house', sound:'h', pos:'initial', shape:'CVVC', emoji:'🏠' },
  { orth:'home',  sound:'h', pos:'initial', shape:'CVVC', emoji:'🏡' },
  { orth:'hive',  sound:'h', pos:'initial', shape:'CVVC', emoji:'🐝' },
  { orth:'hole',  sound:'h', pos:'initial', shape:'CVVC', emoji:'🕳️' },
  { orth:'hail',  sound:'h', pos:'initial', shape:'CVVC', emoji:'🌨️' },
  { orth:'hose',  sound:'h', pos:'initial', shape:'CVVC', emoji:'🚿' },

  // Initial — CVCC (monophthong + CC)
  { orth:'hand',  sound:'h', pos:'initial', shape:'CVCC', emoji:'✋' },
  { orth:'hump',  sound:'h', pos:'initial', shape:'CVCC', emoji:'🐪' },
  { orth:'helm',  sound:'h', pos:'initial', shape:'CVCC', emoji:'🪖' },
  { orth:'help',  sound:'h', pos:'initial', shape:'CVCC', emoji:'🆘' },
  // removed: husk (too niche)

  // Initial — CVVCC (diphthong + CC)
  { orth:'hound', sound:'h', pos:'initial', shape:'CVVCC',emoji:'🐶' },
  { orth:'hoist', sound:'h', pos:'initial', shape:'CVVCC',emoji:'🏗️' },

  // Other (multi-syllable / edge cases)
  { orth:'horse', sound:'h', pos:'initial', shape:'OTHER',emoji:'🐴' },

  // -----------------------------
  // AFFRICATES
  // /tʃ/
  // /tʃ/ (ch)
  // Initial — CV / CVV
  { orth:'chew',   sound:'ch', pos:'initial', shape:'CV',   emoji:'🍬' },
  { orth:'chair',  sound:'ch', pos:'initial', shape:'CVV',  emoji:'🪑' },
  { orth:'chai',   sound:'ch', pos:'initial', shape:'CVV',  emoji:'🍵' },
  { orth:'chow',   sound:'ch', pos:'initial', shape:'CVV',  emoji:'🍲' },

  // Initial — CVC
  { orth:'cheese', sound:'ch', pos:'initial', shape:'CVC',  emoji:'🧀' },
  { orth:'chip',   sound:'ch', pos:'initial', shape:'CVC',  emoji:'🍟' },
  { orth:'chick',  sound:'ch', pos:'initial', shape:'CVC',  emoji:'🐥' },
  { orth:'chop',   sound:'ch', pos:'initial', shape:'CVC',  emoji:'🍖' },
  { orth:'chalk',  sound:'ch', pos:'initial', shape:'CVC',  emoji:'🖍️' },

  // Initial — CVVC / CVCC / CVVCC
  { orth:'chain',  sound:'ch', pos:'initial', shape:'CVVC', emoji:'⛓️' },
  { orth:'chase',  sound:'ch', pos:'initial', shape:'CVVC', emoji:'🏃' },
  { orth:'chomp',  sound:'ch', pos:'initial', shape:'CVCC', emoji:'🍔' },
  { orth:'child',  sound:'ch', pos:'initial', shape:'CVVCC',emoji:'🧒' },

  // Final
  { orth:'watch',  sound:'ch', pos:'final',   shape:'CVC',  emoji:'⌚' },
  { orth:'beach',  sound:'ch', pos:'final',   shape:'CVC',  emoji:'🏖️' },
  { orth:'torch',  sound:'ch', pos:'final',   shape:'CVC',  emoji:'🔦' },
  { orth:'porch',  sound:'ch', pos:'final',   shape:'CVC',  emoji:'🏠' },

  { orth:'roach',  sound:'ch', pos:'final',   shape:'CVVC', emoji:'🪳' },
  { orth:'couch',  sound:'ch', pos:'final',   shape:'CVVC', emoji:'🛋️' },
  { orth:'coach',  sound:'ch', pos:'final',   shape:'CVVC', emoji:'🚌' },

  { orth:'lunch',  sound:'ch', pos:'final',   shape:'CVCC', emoji:'🍱' },
  { orth:'bench',  sound:'ch', pos:'final',   shape:'CVCC', emoji:'🪑' },

  // Final (onset clusters) — CCVC
  { orth:'switch', sound:'ch', pos:'final',   shape:'CCVC', emoji:'💡' },
  { orth:'stitch', sound:'ch', pos:'final',   shape:'CCVC', emoji:'🪡' },
  { orth:'clutch', sound:'ch', pos:'final',   shape:'CCVC', emoji:'🚗' },
  { orth:'crutch', sound:'ch', pos:'final',   shape:'CCVC', emoji:'🩼' },

  // /dʒ/ (j)
  // Initial — CV / CVV
  { orth:'jar',    sound:'j',  pos:'initial', shape:'CV',   emoji:'🫙' },
  { orth:'jay',    sound:'j',  pos:'initial', shape:'CVV',  emoji:'🐦' },
  { orth:'joy',    sound:'j',  pos:'initial', shape:'CVV',  emoji:'🎉' },

  // Initial — CVC
  { orth:'jeep',   sound:'j',  pos:'initial', shape:'CVC',  emoji:'🚙' },
  { orth:'juice',  sound:'j',  pos:'initial', shape:'CVC',  emoji:'🧃' },
  { orth:'jam',    sound:'j',  pos:'initial', shape:'CVC',  emoji:'🫙' },
  { orth:'jet',    sound:'j',  pos:'initial', shape:'CVC',  emoji:'✈️' },
  { orth:'jug',    sound:'j',  pos:'initial', shape:'CVC',  emoji:'🏺' },
  { orth:'jog',    sound:'j',  pos:'initial', shape:'CVC',  emoji:'👟' },

  // Initial — CVVC / CVCC
  { orth:'joke',   sound:'j',  pos:'initial', shape:'CVVC', emoji:'😂' },
  { orth:'jeans',  sound:'j',  pos:'initial', shape:'CVCC', emoji:'👖' },

  // Final
  { orth:'badge',  sound:'j',  pos:'final',   shape:'CVC',  emoji:'🪪' },
  { orth:'hedge',  sound:'j',  pos:'final',   shape:'CVC',  emoji:'🌿' },

  { orth:'bridge', sound:'j',  pos:'final',   shape:'CCVC', emoji:'🌉' },
  { orth:'fridge', sound:'j',  pos:'final',   shape:'CCVC', emoji:'🧊' },
  { orth:'stage',  sound:'j',  pos:'final',   shape:'CCVVC',emoji:'🎤' },
  { orth:'hinge',  sound:'j',  pos:'final',   shape:'CVCC', emoji:'🚪' },

  // -----------------------------
  // APPROXIMANTS
  // /l/
  // (includes some cluster words where /l/ is the second consonant in the onset)
  // CV + CVV
  { orth:'loo',    sound:'l', pos:'initial', shape:'CV',   emoji:'🚽' },
  { orth:'lay',    sound:'l', pos:'initial', shape:'CVV',  emoji:'🛌' },
  { orth:'lie',    sound:'l', pos:'initial', shape:'CVV',  emoji:'🛏️' },

  // CVC + CVVC
  { orth:'leg',    sound:'l', pos:'initial', shape:'CVC',  emoji:'🦵' },
  { orth:'leaf',   sound:'l', pos:'initial', shape:'CVC',  emoji:'🍃' },
  { orth:'log',    sound:'l', pos:'initial', shape:'CVC',  emoji:'🪵' },
  { orth:'lock',   sound:'l', pos:'initial', shape:'CVC',  emoji:'🔒' },
  { orth:'lamb',   sound:'l', pos:'initial', shape:'CVC',  emoji:'🐑' },
  { orth:'lamp',   sound:'l', pos:'initial', shape:'CVCC', emoji:'💡' },
  { orth:'lake',   sound:'l', pos:'initial', shape:'CVVC', emoji:'🏞️' },
  { orth:'light',  sound:'l', pos:'initial', shape:'CVVC', emoji:'💡' },
  { orth:'loud',   sound:'l', pos:'initial', shape:'CVVC', emoji:'🔊' },
  { orth:'lane',   sound:'l', pos:'initial', shape:'CVVC', emoji:'🛣️' },

  // CCVC + CCVVC (clusters)
  { orth:'clock',  sound:'l', pos:'initial', shape:'CCVC',  emoji:'⏰' },
  { orth:'sled',   sound:'l', pos:'initial', shape:'CCVC',  emoji:'🛷' },
  { orth:'slide',  sound:'l', pos:'initial', shape:'CCVVC', emoji:'🛝' },
  { orth:'slate',  sound:'l', pos:'initial', shape:'CCVVC', emoji:'🪨' },

  // Final /l/ (including /l/ in final clusters)
  { orth:'pool',   sound:'l', pos:'final',   shape:'CVC',   emoji:'🏊' },
  { orth:'tail',   sound:'l', pos:'final',   shape:'CVVC',  emoji:'🐒' },
  { orth:'snail',  sound:'l', pos:'final',   shape:'CCVVC', emoji:'🐌' },
  { orth:'trail',  sound:'l', pos:'final',   shape:'CCVVC', emoji:'🥾' },
  { orth:'golf',   sound:'l', pos:'final',   shape:'CVCC',  emoji:'⛳' },
  { orth:'cold',   sound:'l', pos:'final',   shape:'CVVCC', emoji:'🥶' },

  { orth:'lion',   sound:'l', pos:'initial', shape:'OTHER', emoji:'🦁' },

  // /r/ (UK /r/)
  // We DO include clusters where /r/ is the 2nd consonant in the onset (e.g. /tr/, /dr/).

  // CV + CVV
  { orth:'raw',    sound:'r', pos:'initial', shape:'CV',   emoji:'🥩' },
  { orth:'rye',    sound:'r', pos:'initial', shape:'CVV',  emoji:'🌾' },

  // CVC + CVVC
  { orth:'ring',   sound:'r', pos:'initial', shape:'CVC',  emoji:'💍' },
  { orth:'rat',    sound:'r', pos:'initial', shape:'CVC',  emoji:'🐀' },
  { orth:'rock',   sound:'r', pos:'initial', shape:'CVC',  emoji:'🪨' },
  { orth:'rail',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🚈' },
  { orth:'race',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🏁' },
  { orth:'rice',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🍚' },
  { orth:'ride',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🚲' },
  { orth:'rope',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🪢' },
  { orth:'rain',   sound:'r', pos:'initial', shape:'CVVC', emoji:'🌧️' },

  // CVCC + CVVCC
  { orth:'rest',   sound:'r', pos:'initial', shape:'CVCC',  emoji:'🛌' },
  { orth:'roast',  sound:'r', pos:'initial', shape:'CVVCC', emoji:'🍗' },

  // CCVC + CCVVC (clusters)
  { orth:'trap',   sound:'r', pos:'initial', shape:'CCVC',  emoji:'🪤' },
  { orth:'drop',   sound:'r', pos:'initial', shape:'CCVC',  emoji:'💧' },
  { orth:'treat',  sound:'r', pos:'initial', shape:'CCVC',  emoji:'🍬' },
  { orth:'drain',  sound:'r', pos:'initial', shape:'CCVVC', emoji:'🚰' },

  { orth:'rocket', sound:'r', pos:'initial', shape:'OTHER', emoji:'🚀' },

  // /j/ ("y" sound) — stored as sound:'y'
  // UK-only. Word-final /j/ is rare; focus on initial + a few medial OTHER.
  // CV + CVV
  { orth:'yew',    sound:'y', pos:'initial', shape:'CV',    emoji:'🌲' },
  { orth:'year',   sound:'y', pos:'initial', shape:'CVV',   emoji:'📅' },
  // removed: yay (interjection)

  // CVC + CVVC
  { orth:'yam',    sound:'y', pos:'initial', shape:'CVC',   emoji:'🍠' },
  { orth:'yarn',   sound:'y', pos:'initial', shape:'CVC',   emoji:'🧶' },
  { orth:'yard',   sound:'y', pos:'initial', shape:'CVC',   emoji:'🏡' },
  { orth:'yawn',   sound:'y', pos:'initial', shape:'CVC',   emoji:'🥱' },
  { orth:'yacht',  sound:'y', pos:'initial', shape:'CVC',   emoji:'⛵' },
  { orth:'yule',   sound:'y', pos:'initial', shape:'CVC',   emoji:'🎄' },

  { orth:'yolk',   sound:'y', pos:'initial', shape:'CVVC',  emoji:'🥚' },

  // CVCC + CVVCC
  { orth:'yelp',   sound:'y', pos:'initial', shape:'CVCC',  emoji:'🐶' },

  // Medial (OTHER)
  { orth:'onion',  sound:'y', pos:'medial',  shape:'OTHER', emoji:'🧅' },
  { orth:'canyon', sound:'y', pos:'medial',  shape:'OTHER', emoji:'🏜️' },

  { orth:'yoyo',   sound:'y', pos:'initial', shape:'OTHER', emoji:'🪀' },

  // /w/
  // UK-only. Many imageable initial /w/ targets, plus clusters with /w/ as the 2nd consonant (sw-, tw-, kw-).
  // CV + CVV
  // removed: woo (interjection)
  { orth:'way',    sound:'w', pos:'initial', shape:'CVV',   emoji:'🛣️' },
  { orth:'wow',    sound:'w', pos:'initial', shape:'CVV',   emoji:'🎆' },

  // CVC + CVVC
  { orth:'web',    sound:'w', pos:'initial', shape:'CVC',   emoji:'🕸️' },
  { orth:'wet',    sound:'w', pos:'initial', shape:'CVC',   emoji:'💧' },
  { orth:'wax',    sound:'w', pos:'initial', shape:'CVC',   emoji:'🕯️' },
  { orth:'wall',   sound:'w', pos:'initial', shape:'CVC',   emoji:'🧱' },
  { orth:'worm',   sound:'w', pos:'initial', shape:'CVC',   emoji:'🪱' },
  { orth:'wing',   sound:'w', pos:'initial', shape:'CVC',   emoji:'🪽' },
  { orth:'wheel',  sound:'w', pos:'initial', shape:'CVC',   emoji:'🛞' },

  { orth:'wave',   sound:'w', pos:'initial', shape:'CVVC',  emoji:'🌊' },
  { orth:'wait',   sound:'w', pos:'initial', shape:'CVVC',  emoji:'⏳' },
  { orth:'whale',  sound:'w', pos:'initial', shape:'CVVC',  emoji:'🐋' },

  // CVCC + CVVCC
  { orth:'wasp',   sound:'w', pos:'initial', shape:'CVCC',  emoji:'🐝' },
  { orth:'wind',   sound:'w', pos:'initial', shape:'CVCC',  emoji:'🌬️' },
  { orth:'whisk',  sound:'w', pos:'initial', shape:'CVCC',  emoji:'🥣' },
  { orth:'waste',  sound:'w', pos:'initial', shape:'CVVCC', emoji:'🗑️' },
  { orth:'waist',  sound:'w', pos:'initial', shape:'CVVCC', emoji:'👖' },

  // CCVC + CCVVC (clusters containing /w/)
  { orth:'swan',   sound:'w', pos:'initial', shape:'CCVC',  emoji:'🦢' },
  { orth:'swim',   sound:'w', pos:'initial', shape:'CCVC',  emoji:'🏊' },

  { orth:'twin',   sound:'w', pos:'initial', shape:'CCVC',  emoji:'👯' },
  { orth:'queen',  sound:'w', pos:'initial', shape:'CCVC',  emoji:'👑' },
  { orth:'sweet',  sound:'w', pos:'initial', shape:'CCVC',  emoji:'🍬' },

  // Medial (OTHER)
  { orth:'flower', sound:'w', pos:'medial',  shape:'OTHER', emoji:'🌸' },
  { orth:'towel',  sound:'w', pos:'medial',  shape:'OTHER', emoji:'🧻' },

];

export const WORD_BANK = RAW.map((e) => ({
  ...e,
  // Prefer explicit hex if provided, otherwise derive from emoji.
  hex: e.hex ? String(e.hex) : emojiToHexSequence(e.emoji)
}));

// Small helper: allow tiny toggles if you ever want plurals to share icons.
export function normalizeHex(hex){
  // Keep backwards compatibility with earlier toggles.
  if (hex === '26F5_toggle') return '26F5';
  return hex;
}
