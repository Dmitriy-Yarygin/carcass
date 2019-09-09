const startTile = {
  name: 'Town1',
  monastery: false,
  sides: [
    { type: 'town', owner: 'A', players: [] },
    { type: 'road', owner: 'B', players: [] },
    { type: 'field', owner: 'C', players: [] },
    { type: 'road', owner: 'B', players: [] }
  ]
};
const town2 = {
  name: 'Town2',
  monastery: false,
  sides: [
    { type: 'field', owner: 'B', players: [] },
    { type: 'town', owner: 'A', players: [] },
    { type: 'field', owner: 'B', players: [] },
    { type: 'field', owner: 'B', players: [] }
  ]
};
const monastery1 = {
  name: 'Mon1',
  monastery: true,
  sides: [
    { type: 'field', owner: 'A', players: [] },
    { type: 'field', owner: 'A', players: [] },
    { type: 'field', owner: 'A', players: [] },
    { type: 'field', owner: 'A', players: [] }
  ]
};

const uniqueTiles = [
  { quantity: 1, tile: startTile },
  { quantity: 2, tile: town2 },
  { quantity: 1, tile: monastery1 }
];

module.exports = { startTile, uniqueTiles };
