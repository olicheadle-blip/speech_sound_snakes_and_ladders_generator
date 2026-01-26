export const UK_CLASSIC_TEMPLATE = [
  // ladders (bottom -> top)
  { kind:'ladder', from:2,  to:23 },
  { kind:'ladder', from:8,  to:34 },
  { kind:'ladder', from:20, to:77 },
  { kind:'ladder', from:32, to:68 },
  { kind:'ladder', from:41, to:79 },
  { kind:'ladder', from:74, to:92 },
  { kind:'ladder', from:80, to:99 },

  // snakes (head -> tail)
  // removed 15->4
  { kind:'snake', from:29, to:10 },
  { kind:'snake', from:24, to:6 },
  { kind:'snake', from:54, to:34 },
  { kind:'snake', from:62, to:19 },
  { kind:'snake', from:87, to:36 },
  { kind:'snake', from:93, to:73 },
  { kind:'snake', from:95, to:75 },
  { kind:'snake', from:98, to:79 },
];

// lane offsets to reduce overlap a touch (endpoints unchanged)
export const LANES = [-14, -7, 0, 7, 14];

// ladders protrude into cells slightly so endpoints are obvious
export const INSETS = {
  ladder:{ start:0.30, end:0.30 }, // longer than before
  snake:{  start:0.36, end:0.36 }
};
