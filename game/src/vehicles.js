// Coral Dusk — vehicles: the player's coral convertible, seeded traffic and
// the police cruisers that chase it. All movement is deterministic per seed.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  var COLORS = ['#ffd166', '#3ee6d8', '#b388ff', '#f2f2f2', '#ff9e6d', '#7bd88a'];
  function makePlayer() {
    return {
      kind: 'player', x: 120, y: 620, angle: -Math.PI / 2, speed: 0,
      color: CoralDusk.PALETTE.car, wanted: 0, hidden: false
    };
  }
  function makeTraffic(seed, count) {
    var rng = CoralDusk.makeRng(seed + 101);
    var cars = [], i, road;
    for (i = 0; i < count; i++) {
      road = rng.pick(CoralDusk.ROADS_X);
      cars.push({
        kind: 'traffic', x: road + rng.range(-8, 8), y: Math.round(rng.range(60, 680)),
        angle: rng.pick([0, Math.PI / 2, Math.PI, -Math.PI / 2]),
        speed: CoralDusk.TRAFFIC_SPEED * rng.range(0.7, 1.15),
        color: COLORS[i % COLORS.length], honk: false
      });
    }
    return cars;
  }
  function makePolice(count) {
    var cars = [], i;
    for (i = 0; i < count; i++) {
      cars.push({
        kind: 'police', x: 1120 - i * 60, y: 140 + i * 40,
        angle: Math.PI, speed: 0, color: CoralDusk.PALETTE.police, siren: true
      });
    }
    return cars;
  }
  function stepCar(car, dt, bounds) {
    car.x += Math.cos(car.angle) * car.speed * dt;
    car.y += Math.sin(car.angle) * car.speed * dt;
    if (car.x < 20) car.x = 20;
    if (car.x > bounds.w - 20) car.x = bounds.w - 20;
    if (car.y < 20) car.y = 20;
    if (car.y > bounds.h - 20) car.y = bounds.h - 20;
  }
  function chase(police, player, dt) {
    var dx = player.x - police.x, dy = player.y - police.y;
    var want = Math.atan2(dy, dx);
    var diff = want - police.angle;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    police.angle += Math.max(-2.4 * dt, Math.min(2.4 * dt, diff));
    police.speed = CoralDusk.POLICE_SPEED;
    stepCar(police, dt, { w: CoralDusk.WIDTH, h: CoralDusk.HEIGHT });
  }
  CoralDusk.makePlayer = makePlayer;
  CoralDusk.makeTraffic = makeTraffic;
  CoralDusk.makePolice = makePolice;
  CoralDusk.stepCar = stepCar;
  CoralDusk.chase = chase;
})(typeof window !== 'undefined' ? window : globalThis);
