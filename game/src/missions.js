// Coral Dusk — the six story missions. Each has a target point on the map, a
// par time and a wanted bump; completing one in order unlocks the next.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  var TARGETS = [
    { x: 1120, y: 60 }, { x: 60, y: 130 }, { x: 60, y: 620 },
    { x: 920, y: 140 }, { x: 1160, y: 300 }, { x: 1180, y: 620 }
  ];
  function makeMissions() {
    return CoralDusk.MISSIONS.map(function (m, i) {
      return {
        id: m.id, name: m.name, target: m.target, par: m.par,
        x: TARGETS[i].x, y: TARGETS[i].y,
        state: i === 0 ? 'active' : 'locked', seconds: null, wantedPeak: 0
      };
    });
  }
  function activeMission(missions) {
    var i;
    for (i = 0; i < missions.length; i++) if (missions[i].state === 'active') return missions[i];
    return null;
  }
  function completeMission(missions, mission, seconds, wantedPeak) {
    mission.state = 'done';
    mission.seconds = Math.round(seconds * 10) / 10;
    mission.wantedPeak = wantedPeak;
    var next = missions[mission.id];
    if (next) next.state = 'active';
    return next;
  }
  function dossier(missions) {
    var done = missions.filter(function (m) { return m.state === 'done'; });
    var best = done.length ? Math.min.apply(null, done.map(function (m) { return m.seconds; })) : null;
    var peak = done.length ? Math.max.apply(null, done.map(function (m) { return m.wantedPeak; })) : 0;
    return {
      completed: done.length, total: missions.length,
      bestSeconds: best, wantedPeak: peak,
      missions: done.map(function (m) { return { name: m.name, seconds: m.seconds, wantedPeak: m.wantedPeak }; })
    };
  }
  CoralDusk.makeMissions = makeMissions;
  CoralDusk.activeMission = activeMission;
  CoralDusk.completeMission = completeMission;
  CoralDusk.dossier = dossier;
})(typeof window !== 'undefined' ? window : globalThis);
