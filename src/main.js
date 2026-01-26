import './style.css';
import { createSnakesLaddersApp } from './lib/app.js';

createSnakesLaddersApp({
  canvasId: 'c',
  noteId: 'note',
  controls: {
    dialectId: 'dialect',
    sound1Id: 'sound1',
    sound2Id: 'sound2',
    sound3Id: 'sound3',
    positionId: 'position',
    shapeId: 'shape',
    themeId: 'theme',
    generateBtnId: 'btnGenerate',
    downloadBtnId: 'btnDownload',
    printBtnId: 'btnPrint'
  }
});
