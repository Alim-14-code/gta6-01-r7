// Coral Dusk — pedestrians: boardwalk strollers, joggers and a few
// sun-seekers, all placed and moved by the seeded RNG.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  var SHIRTS = ['#ff5da2', '#3ee6d8', '#ffd166', '#ffffff', '#b388ff', '#ff9e6d'];
  function makePeople(seed, count) {
    var rng = CoralDusk.makeRng(seed + 202);
    var people = [], i;
    for (i = 0; i < count; i++) {
      people.push({
        x: Math.round(rng.range(40, CoralDusk.WIDTH - 40)),
        y: Math.round(rng.range(100, 160)),
        dir: rng.pick([-1, 1]),
        speed: rng.range(18, 55),
        shirt: SHIRTS[i % SHIRTS.length],
        kind: rng.pick(['stroll', 'jog', 'stroll', 'sun'])
      });
    }
    return people;
  }
  function stepPeople(people, dt) {
    var p, i;
    for (i = 0; i < people.length; i++) {
      p = people[i];
      p.x += p.dir * p.speed * dt;
      if (p.x < 30) { p.x = 30; p.dir = 1; }
      if (p.x > CoralDusk.WIDTH - 30) { p.x = CoralDusk.WIDTH - 30; p.dir = -1; }
    }
  }
  CoralDusk.makePeople = makePeople;
  CoralDusk.stepPeople = stepPeople;
})(typeof window !== 'undefined' ? window : globalThis);
