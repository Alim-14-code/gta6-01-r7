// Coral Dusk — the renderer: a sunset sky, the sea, the beachfront city and
// every car and pedestrian, drawn on one canvas.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  function drawScene(ctx, state) {
    var P = CoralDusk.PALETTE, W = CoralDusk.WIDTH, H = CoralDusk.HEIGHT;
    var sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, P.skyTop); sky.addColorStop(0.55, P.skyMid); sky.addColorStop(1, P.skyLow);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);
    ctx.fillStyle = P.sun;
    ctx.beginPath(); ctx.arc(1060, 150, 58, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = P.sea;
    ctx.fillRect(0, 0, W, 60);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(0, 58, W, 3);
    ctx.fillStyle = P.sand;
    ctx.fillRect(0, 60, W, 70);
    drawCity(ctx, state.city);
    drawPeople(ctx, state.people);
    drawCars(ctx, state.traffic);
    drawCars(ctx, state.police);
    drawPlayer(ctx, state.player);
    drawTarget(ctx, state.target);
  }
  function drawCity(ctx, city) {
    var P = CoralDusk.PALETTE, i, b;
    ctx.fillStyle = P.sidewalk;
    ctx.fillRect(0, 130, CoralDusk.WIDTH, 590);
    ctx.fillStyle = P.road;
    for (i = 0; i < city.roadsX.length; i++) ctx.fillRect(city.roadsX[i] - 26, 130, 52, 590);
    for (i = 0; i < city.roadsY.length; i++) ctx.fillRect(0, city.roadsY[i] - 26, CoralDusk.WIDTH, 52);
    ctx.strokeStyle = P.roadLine; ctx.setLineDash([18, 16]); ctx.lineWidth = 2;
    for (i = 0; i < city.roadsX.length; i++) {
      ctx.beginPath(); ctx.moveTo(city.roadsX[i], 130); ctx.lineTo(city.roadsX[i], 720); ctx.stroke();
    }
    for (i = 0; i < city.roadsY.length; i++) {
      ctx.beginPath(); ctx.moveTo(0, city.roadsY[i]); ctx.lineTo(CoralDusk.WIDTH, city.roadsY[i]); ctx.stroke();
    }
    ctx.setLineDash([]);
    for (i = 0; i < city.buildings.length; i++) {
      b = city.buildings[i];
      ctx.fillStyle = P.building;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      if (b.lit) {
        ctx.fillStyle = b.neon;
        ctx.fillRect(b.x + 4, b.y + 4, b.w - 8, 4);
        ctx.fillStyle = P.buildingLit;
        ctx.fillRect(b.x + 8, b.y + 14, 6, 8);
        ctx.fillRect(b.x + b.w - 14, b.y + 14, 6, 8);
      }
    }
    ctx.fillStyle = '#2f7d4f';
    for (i = 0; i < city.palms.length; i++) {
      var p = city.palms[i];
      ctx.beginPath(); ctx.moveTo(p.x, 128); ctx.lineTo(p.x + p.lean * 40, 108); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,93,162,0.9)';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('BOARDWALK', 70, 118);
    ctx.fillStyle = P.neonCyan;
    ctx.fillText('MARINA', 70, 640);
  }
  function drawPeople(ctx, people) {
    var i, p;
    for (i = 0; i < people.length; i++) {
      p = people[i];
      ctx.fillStyle = p.shirt;
      ctx.fillRect(p.x - 3, p.y - 8, 6, 12);
      ctx.fillStyle = '#f2c98a';
      ctx.beginPath(); ctx.arc(p.x, p.y - 11, 3, 0, 2 * Math.PI); ctx.fill();
    }
  }
  function drawCars(ctx, cars) {
    var i;
    for (i = 0; i < cars.length; i++) drawCar(ctx, cars[i]);
  }
  function drawCar(ctx, car) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = car.color;
    ctx.fillRect(-16, -8, 32, 16);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(-6, -8, 12, 16);
    if (car.kind === 'police') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-16, -8, 8, 16);
      ctx.fillStyle = '#ff3b30';
      ctx.beginPath(); ctx.arc(0, -6, 3, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#3a86ff';
      ctx.beginPath(); ctx.arc(0, 6, 3, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.restore();
  }
  function drawPlayer(ctx, player) {
    drawCar(ctx, player);
    ctx.save();
    ctx.fillStyle = '#ffd9ec';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('YOU', player.x - 12, player.y - 22);
    ctx.restore();
  }
  function drawTarget(ctx, target) {
    ctx.save();
    ctx.strokeStyle = CoralDusk.PALETTE.neonCyan;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(target.x, target.y, 18, 0, 2 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(target.x, target.y, 6, 0, 2 * Math.PI); ctx.fill();
    ctx.restore();
  }
  CoralDusk.drawScene = drawScene;
})(typeof window !== 'undefined' ? window : globalThis);
