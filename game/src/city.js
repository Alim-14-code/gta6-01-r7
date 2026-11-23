// Coral Dusk — the city: a beachfront grid of roads, buildings, the pier and
// the marina. Layout is fixed; decoration (windows, palms, neon) is seeded.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  var W = CoralDusk.WIDTH, H = CoralDusk.HEIGHT;
  var ROADS_X = [120, 320, 520, 720, 920, 1120];
  var ROADS_Y = [140, 300, 460, 620];
  var LANDMARKS = [
    { name: 'Pier', x: 1120, y: 60, w: 120, h: 40 },
    { name: 'Marina', x: 60, y: 620, w: 180, h: 60 },
    { name: 'Boardwalk', x: 60, y: 120, w: 1160, h: 20 },
    { name: 'Causeway', x: 1160, y: 300, w: 60, h: 360 }
  ];
  function buildCity(seed) {
    var rng = CoralDusk.makeRng(seed);
    var buildings = [];
    var i, j, x, y;
    for (i = 0; i < ROADS_X.length - 1; i++) {
      for (j = 0; j < ROADS_Y.length - 1; j++) {
        x = ROADS_X[i] + 24;
        y = ROADS_Y[j] + 24;
        buildings.push({
          x: x, y: y,
          w: ROADS_X[i + 1] - ROADS_X[i] - 48,
          h: ROADS_Y[j + 1] - ROADS_Y[j] - 48,
          lit: rng.next() > 0.45,
          neon: rng.pick(['#ff5da2', '#3ee6d8', '#ffd166', '#b388ff']),
          floors: rng.int(2, 9)
        });
      }
    }
    var palms = [];
    for (i = 0; i < 26; i++) {
      palms.push({ x: Math.round(rng.range(40, W - 40)), y: Math.round(rng.range(90, 130)), lean: rng.range(-0.25, 0.25) });
    }
    var alleys = [
      { x: 320, y: 300, w: 40, h: 160 }, { x: 720, y: 140, w: 40, h: 160 },
      { x: 920, y: 460, w: 40, h: 160 }, { x: 520, y: 460, w: 40, h: 160 }
    ];
    return { roadsX: ROADS_X, roadsY: ROADS_Y, landmarks: LANDMARKS, buildings: buildings, palms: palms, alleys: alleys };
  }
  function nearestRoad(x, y) {
    var bx = ROADS_X[0], by = ROADS_Y[0], d, best = Infinity, i;
    for (i = 0; i < ROADS_X.length; i++) { d = Math.abs(ROADS_X[i] - x); if (d < best) { best = d; bx = ROADS_X[i]; } }
    best = Infinity;
    for (i = 0; i < ROADS_Y.length; i++) { d = Math.abs(ROADS_Y[i] - y); if (d < best) { best = d; by = ROADS_Y[i]; } }
    return { x: bx, y: by };
  }
  CoralDusk.buildCity = buildCity;
  CoralDusk.nearestRoad = nearestRoad;
  CoralDusk.ROADS_X = ROADS_X;
  CoralDusk.ROADS_Y = ROADS_Y;
})(typeof window !== 'undefined' ? window : globalThis);
