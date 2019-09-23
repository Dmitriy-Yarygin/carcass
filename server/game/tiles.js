const startTile = {
  name: 'Town1',
  image: '/images/tiles/startTile.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'B', right: 'D', left: 'C' },
    { type: 'field', owner: 'C' },
    { type: 'road', owner: 'B', right: 'C', left: 'D' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' }, //, shields: false, miple: userID, points: null, occupied: userId},
    B: { name: 'road', x: '50%', y: '50%' },
    C: { name: 'field', x: '75%', y: '80%', disConnected: true }, // disconnected from town by road
    D: { name: 'field', x: '12%', y: '35%' }
  }
};
const town2 = {
  name: 'Town2',
  image: '/images/tiles/town2.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'B', right: 'E', left: 'F' },
    { type: 'road', owner: 'C', right: 'F', left: 'G' },
    { type: 'road', owner: 'D', right: 'G', left: 'E' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'road', x: '87%', y: '55%' },
    C: { name: 'road', x: '46%', y: '86%' },
    D: { name: 'road', x: '18%', y: '52%' },
    E: { name: 'field', x: '60%', y: '42%' },
    F: { name: 'field', x: '80%', y: '85%', disConnected: true },
    G: { name: 'field', x: '17%', y: '81%', disConnected: true }
  }
};
const town3 = {
  name: 'Town3',
  image: '/images/tiles/town3.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'field', x: '50%', y: '60%' }
  }
};
const town4 = { ...town3, name: 'Town4', image: '/images/tiles/town4.jpg' };

const monastery1 = {
  name: 'Mon1',
  image: '/images/tiles/monastery1.jpg',
  center: { type: 'monastery', owner: 'A' },
  sides: [
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' }
  ],
  places: {
    A: { name: 'monastery', x: '50%', y: '50%' },
    B: { name: 'field', x: '80%', y: '80%' }
  }
};
const monastery2 = {
  name: 'Mon2',
  image: '/images/tiles/monastery2.jpg',
  center: { type: 'monastery', owner: 'A' },
  sides: [
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'road', owner: 'C', right: 'B', left: 'B' },
    { type: 'field', owner: 'B' }
  ],
  places: {
    A: { name: 'monastery', x: '50%', y: '50%' },
    B: { name: 'field', x: '20%', y: '20%' },
    C: { name: 'road', x: '46%', y: '84%' }
  }
};

const town21 = {
  name: 'Town21',
  image: '/images/tiles/town21.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '30%', y: '20%', shields: 1 },
    B: { name: 'field', x: '60%', y: '60%' }
  }
};
const town22 = {
  name: 'Town22',
  image: '/images/tiles/town22.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'C', right: 'B', left: 'D' },
    { type: 'road', owner: 'C', right: 'D', left: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '30%', y: '20%', shields: 1 },
    B: { name: 'field', x: '45%', y: '55%' },
    C: { name: 'road', x: '70%', y: '70%' },
    D: { name: 'field', x: '85%', y: '85%', disConnected: true }
  }
};
const town23 = {
  name: 'Town23',
  image: '/images/tiles/town23.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'C', right: 'B', left: 'D' },
    { type: 'road', owner: 'C', right: 'D', left: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '30%', y: '20%' },
    B: { name: 'field', x: '45%', y: '55%' },
    C: { name: 'road', x: '70%', y: '70%' },
    D: { name: 'field', x: '85%', y: '85%', disConnected: true }
  }
};

const road24 = {
  name: 'Road24',
  image: '/images/tiles/road24.jpg',
  sides: [
    { type: 'field', owner: 'A' },
    { type: 'road', owner: 'B', right: 'A', left: 'C' },
    { type: 'field', owner: 'C' },
    { type: 'road', owner: 'B', right: 'C', left: 'A' }
  ],
  places: {
    A: { name: 'field', x: '25%', y: '25%' },
    B: { name: 'road', x: '53%', y: '53%' },
    C: { name: 'field', x: '75%', y: '75%' }
  }
};
const road25 = {
  name: 'Road25',
  image: '/images/tiles/road25.jpg',
  sides: [
    { type: 'field', owner: 'A' },
    { type: 'field', owner: 'A' },
    { type: 'road', owner: 'B', right: 'A', left: 'C' },
    { type: 'road', owner: 'B', right: 'C', left: 'A' }
  ],
  places: {
    A: { name: 'field', x: '75%', y: '30%' },
    B: { name: 'road', x: '45%', y: '50%' },
    C: { name: 'field', x: '25%', y: '75%' }
  }
};
const cross36 = {
  name: 'Cross36',
  image: '/images/tiles/cross36.jpg',
  sides: [
    { type: 'road', owner: 'A', right: 'H', left: 'E' },
    { type: 'road', owner: 'B', right: 'E', left: 'F' },
    { type: 'road', owner: 'C', right: 'F', left: 'G' },
    { type: 'road', owner: 'D', right: 'G', left: 'H' }
  ],
  places: {
    A: { name: 'road', x: '57%', y: '17%' },
    B: { name: 'road', x: '84%', y: '54%' },
    C: { name: 'road', x: '50%', y: '85%' },
    D: { name: 'road', x: '15%', y: '52%' },
    E: { name: 'field', x: '85%', y: '25%' },
    F: { name: 'field', x: '81%', y: '84%' },
    G: { name: 'field', x: '20%', y: '82%' },
    H: { name: 'field', x: '22%', y: '21%' }
  }
};
const cross37 = {
  name: 'Cross37',
  image: '/images/tiles/cross37.jpg',
  sides: [
    { type: 'road', owner: 'A', right: 'F', left: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'road', owner: 'C', right: 'B', left: 'E' },
    { type: 'road', owner: 'D', right: 'E', left: 'F' }
  ],
  places: {
    A: { name: 'road', x: '51%', y: '18%' },
    B: { name: 'field', x: '84%', y: '50%' },
    C: { name: 'road', x: '50%', y: '75%' },
    D: { name: 'road', x: '25%', y: '50%' },
    E: { name: 'field', x: '25%', y: '75%' },
    F: { name: 'field', x: '25%', y: '25%' }
  }
};
const road46 = {
  name: 'Road46',
  image: '/images/tiles/road46.jpg',
  sides: [
    { type: 'field', owner: 'A' },
    { type: 'road', owner: 'B', right: 'A', left: 'C' },
    { type: 'field', owner: 'C' },
    { type: 'road', owner: 'B', right: 'C', left: 'A' }
  ],
  places: {
    A: { name: 'field', x: '25%', y: '25%' },
    B: { name: 'road', x: '58%', y: '43%' },
    C: { name: 'field', x: '75%', y: '75%' }
  }
};
const road47 = { ...road25, name: 'Road47', image: '/images/tiles/road47.jpg' };

const town31 = {
  name: 'Town31',
  image: '/images/tiles/town31.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'C' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'field', x: '60%', y: '60%' },
    C: { name: 'town', x: '15%', y: '50%' }
  }
};
const town32 = {
  name: 'Town32',
  image: '/images/tiles/town32.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'C' },
    { type: 'field', owner: 'B' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'field', x: '50%', y: '50%' },
    C: { name: 'town', x: '50%', y: '85%' }
  }
};
const town33 = {
  name: 'Town33',
  image: '/images/tiles/town33.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'B', right: 'C', left: 'D' },
    { type: 'road', owner: 'B', right: 'D', left: 'C' },
    { type: 'field', owner: 'C' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'road', x: '60%', y: '60%' },
    C: { name: 'field', x: '25%', y: '60%' },
    D: { name: 'field', x: '80%', y: '80%', disConnected: true }
  }
};
const town34 = {
  name: 'Town34',
  image: '/images/tiles/town34.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'road', owner: 'C', right: 'B', left: 'D' },
    { type: 'road', owner: 'C', right: 'D', left: 'B' }
  ],
  places: {
    A: { name: 'town', x: '50%', y: '15%' },
    B: { name: 'field', x: '70%', y: '50%' },
    C: { name: 'road', x: '40%', y: '60%' },
    D: { name: 'field', x: '20%', y: '80%', disConnected: true }
  }
};

const town41 = {
  name: 'Town41',
  image: '/images/tiles/town41.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '35%', y: '15%', shields: 1 },
    B: { name: 'field', x: '50%', y: '85%' }
  }
};
const town42 = {
  name: 'Town42',
  image: '/images/tiles/town42.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '35%', y: '15%', shields: 1 }
  }
};
const town43 = {
  name: 'Town43',
  image: '/images/tiles/town43.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '25%', y: '25%' },
    B: { name: 'field', x: '60%', y: '60%' }
  }
};
const town44 = {
  name: 'Town44',
  image: '/images/tiles/town44.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'C', right: 'D', left: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '35%', y: '15%', shields: 1 },
    B: { name: 'field', x: '20%', y: '90%' },
    C: { name: 'road', x: '50%', y: '90%' },
    D: { name: 'field', x: '80%', y: '90%' }
  }
};
const town45 = {
  name: 'Town45',
  image: '/images/tiles/town45.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'road', owner: 'C', right: 'D', left: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '35%', y: '15%' },
    B: { name: 'field', x: '20%', y: '90%' },
    C: { name: 'road', x: '50%', y: '90%' },
    D: { name: 'field', x: '80%', y: '90%' }
  }
};

const town51 = {
  name: 'Town51',
  image: '/images/tiles/town51.jpg',
  sides: [
    { type: 'town', owner: 'A' },
    { type: 'town', owner: 'A' },
    { type: 'field', owner: 'B' },
    { type: 'town', owner: 'A' }
  ],
  places: {
    A: { name: 'town', x: '35%', y: '15%' },
    B: { name: 'field', x: '50%', y: '85%' }
  }
};

const town52 = {
  name: 'Town52',
  image: '/images/tiles/town52.jpg',
  sides: [
    { type: 'field', owner: 'A' },
    { type: 'town', owner: 'B' },
    { type: 'field', owner: 'C' },
    { type: 'town', owner: 'B' }
  ],
  places: {
    A: { name: 'field', x: '50%', y: '10%' },
    B: { name: 'town', x: '50%', y: '50%', shields: 1 },
    C: { name: 'field', x: '50%', y: '90%' }
  }
};
const town53 = {
  name: 'Town53',
  image: '/images/tiles/town53.jpg',
  sides: [
    { type: 'field', owner: 'A' },
    { type: 'town', owner: 'B' },
    { type: 'field', owner: 'A' },
    { type: 'town', owner: 'B' }
  ],
  places: {
    A: { name: 'field', x: '50%', y: '10%' },
    B: { name: 'town', x: '50%', y: '50%' },
    C: { name: 'field', x: '50%', y: '90%' }
  }
};

const uniqueTiles = [
  { quantity: 3, tile: startTile },
  // { quantity: 3, tile: town2 },
  // { quantity: 3, tile: town3 },
  // { quantity: 2, tile: town4 },

  { quantity: 4, tile: monastery1 }
  // { quantity: 2, tile: monastery2 }

  // { quantity: 2, tile: town21 },
  // { quantity: 2, tile: town22 },
  // { quantity: 3, tile: town23 },

  // { quantity: 4, tile: road24 },
  // { quantity: 3, tile: road25 },
  // { quantity: 1, tile: cross36 },
  // { quantity: 4, tile: cross37 },
  // { quantity: 4, tile: road46 },
  // { quantity: 6, tile: road47 },

  // { quantity: 2, tile: town31 },
  // { quantity: 3, tile: town32 },
  // { quantity: 3, tile: town33 },
  // { quantity: 3, tile: town34 },

  // { quantity: 1, tile: town41 },
  // { quantity: 1, tile: town42 },
  // { quantity: 3, tile: town43 },
  // { quantity: 2, tile: town44 },
  // { quantity: 1, tile: town45 },

  // { quantity: 3, tile: town51 },
  // { quantity: 2, tile: town52 },
  // { quantity: 1, tile: town53 }
];

module.exports = { startTile, uniqueTiles };
