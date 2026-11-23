// Coral Dusk — the game loop: state, fixed-step updates, wanted level, mission
// flow and the ?scene= stills the shot driver captures.
(function (global) {
  'use strict';
  var CD = global.CoralDusk || (global.CoralDusk = {});
  function buildState() {
    var city = CD.buildCity(CD.SEED);
    var missions = CD.makeMissions();
    return {
      city: city, player: CD.makePlayer(),
      traffic: CD.makeTraffic(CD.SEED, 14),
      police: CD.makePolice(2),
      people: CD.makePeople(CD.SEED, 18),
      missions: missions, input: CD.makeInput(),
      time: 0, missionTime: 0, done: false, scene: null
    };
  }
  function inAlley(state) {
    var p = state.player, a, i;
    for (i = 0; i < state.city.alleys.length; i++) {
      a = state.city.alleys[i];
      if (p.x > a.x && p.x < a.x + a.w && p.y > a.y && p.y < a.y + a.h) return true;
    }
    return false;
  }
  function step(state, dt) {
    var p = state.player, input = state.input, i, car, m;
    if (input.left) p.angle -= 2.6 * dt;
    if (input.right) p.angle += 2.6 * dt;
    if (input.up) p.speed = Math.min(CD.PLAYER_SPEED, p.speed + 500 * dt);
    else if (input.down) p.speed = Math.max(-120, p.speed - 400 * dt);
    else p.speed *= Math.max(0, 1 - 1.6 * dt);
    if (input.brake) p.speed *= Math.max(0, 1 - 4 * dt);
    CD.stepCar(p, dt, { w: CD.WIDTH, h: CD.HEIGHT });
    for (i = 0; i < state.traffic.length; i++) {
      car = state.traffic[i];
      CD.stepCar(car, dt, { w: CD.WIDTH, h: CD.HEIGHT });
      if (Math.abs(car.x - p.x) < 26 && Math.abs(car.y - p.y) < 16 && p.speed > 60) {
        if (p.wanted < CD.WANTED_MAX) p.wanted++;
        car.speed *= 0.5;
        CD.siren();
      }
    }
    for (i = 0; i < state.police.length; i++) {
      if (p.wanted > 0) CD.chase(state.police[i], p, dt);
    }
    CD.stepPeople(state.people, dt);
    if (input.hide && inAlley(state) && p.wanted > 0) {
      p.wanted = Math.max(0, p.wanted - dt);
      p.hidden = true;
    } else { p.hidden = false; }
    state.time += dt;
    state.missionTime += dt;
    m = CD.activeMission(state.missions);
    if (m) {
      var d = Math.hypot(p.x - m.x, p.y - m.y);
      if (d < 40) {
        CD.chime();
        var next = CD.completeMission(state.missions, m, state.missionTime, Math.ceil(p.wanted));
        state.missionTime = 0;
        if (!next) { state.done = true; }
        else { p.wanted = Math.min(CD.WANTED_MAX, p.wanted + 1); }
      }
    }
  }
  function draw(state, ctx) {
    var m = CD.activeMission(state.missions);
    var target = m ? { x: m.x, y: m.y } : { x: 1180, y: 620 };
    CD.drawScene(ctx, {
      city: state.city, people: state.people, traffic: state.traffic,
      police: state.police, player: state.player, target: target
    });
    var mm = Math.floor(state.time / 60), ss = Math.floor(state.time % 60);
    var clock = (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
    CD.drawHud(ctx, {
      player: state.player,
      missionIndex: Math.min(6, state.missions.filter(function (x) { return x.state === 'done'; }).length + 1),
      missionName: m ? m.name : 'All done',
      clock: clock, target: target
    });
    if (state.done) CD.drawDossier(ctx, CD.dossier(state.missions));
  }
  function sceneState(scene) {
    var state = buildState();
    state.scene = scene;
    if (scene === 'start') {
      state.player.x = 120; state.player.y = 620; state.player.angle = -Math.PI / 2;
    } else if (scene === 'drive') {
      state.player.x = 520; state.player.y = 300; state.player.angle = 0; state.player.speed = 300;
      state.input.up = true;
      step(state, 0.5); step(state, 0.5);
    } else if (scene === 'chase') {
      state.player.x = 720; state.player.y = 460; state.player.angle = Math.PI / 2; state.player.speed = 380;
      state.player.wanted = 3;
      state.police[0].x = 640; state.police[0].y = 460;
      state.police[1].x = 720; state.police[1].y = 380;
      step(state, 0.4); step(state, 0.4);
    } else if (scene === 'mission') {
      var missions = state.missions;
      CD.completeMission(missions, missions[0], 142.5, 1);
      CD.completeMission(missions, missions[1], 188.2, 2);
      CD.completeMission(missions, missions[2], 231.7, 2);
      state.done = true;
    }
    return state;
  }
  function start() {
    if (typeof document === 'undefined') return null;
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    var params = new URLSearchParams(window.location.search || '');
    var scene = params.get('scene');
    var state = scene ? sceneState(scene) : buildState();
    CD.bindInput(state.input);
    draw(state, ctx);
    if (scene) return state;
    var last = 0;
    var frame = function (t) {
      var dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      step(state, dt);
      draw(state, ctx);
      if (!state.done) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return state;
  }
  CD.buildState = buildState;
  CD.step = step;
  CD.draw = draw;
  CD.sceneState = sceneState;
  CD.start = start;
  if (typeof document !== 'undefined') start();
})(typeof window !== 'undefined' ? window : globalThis);
