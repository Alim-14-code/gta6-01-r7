// Coral Dusk — the HUD: wanted stars, mission timer, minimap and the end
// dossier. Drawing is pure canvas, no assets.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  function star(ctx, x, y, r, filled) {
    var i, a;
    ctx.beginPath();
    for (i = 0; i < 10; i++) {
      a = -Math.PI / 2 + (i * Math.PI) / 5;
      var rr = i % 2 === 0 ? r : r * 0.45;
      var px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = filled ? '#ffd166' : 'rgba(255,255,255,0.25)';
    ctx.fill();
  }
  function drawHud(ctx, state) {
    var P = CoralDusk.PALETTE, i;
    ctx.save();
    ctx.fillStyle = 'rgba(20,8,40,0.72)';
    ctx.fillRect(16, 16, 300, 92);
    ctx.fillStyle = P.text;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('CORAL DUSK', 28, 44);
    for (i = 0; i < CoralDusk.WANTED_MAX; i++) star(ctx, 36 + i * 26, 72, 10, i < state.player.wanted);
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Mission ' + state.missionIndex + '/6 — ' + state.missionName, 28, 96);
    ctx.fillStyle = 'rgba(20,8,40,0.72)';
    ctx.fillRect(CoralDusk.WIDTH - 196, 16, 180, 56);
    ctx.fillStyle = P.text;
    ctx.font = 'bold 22px system-ui, monospace';
    ctx.fillText(state.clock, CoralDusk.WIDTH - 182, 52);
    drawMinimap(ctx, state);
    ctx.restore();
  }
  function drawMinimap(ctx, state) {
    var x0 = CoralDusk.WIDTH - 196, y0 = 84, s = 0.12;
    ctx.fillStyle = 'rgba(20,8,40,0.72)';
    ctx.fillRect(x0, y0, 180, 96);
    ctx.strokeStyle = CoralDusk.PALETTE.roadLine;
    var i;
    for (i = 0; i < CoralDusk.ROADS_X.length; i++) {
      ctx.beginPath();
      ctx.moveTo(x0 + CoralDusk.ROADS_X[i] * s, y0);
      ctx.lineTo(x0 + CoralDusk.ROADS_X[i] * s, y0 + 86);
      ctx.stroke();
    }
    ctx.fillStyle = CoralDusk.PALETTE.car;
    ctx.fillRect(x0 + state.player.x * s - 3, y0 + state.player.y * s - 3, 6, 6);
    ctx.fillStyle = CoralDusk.PALETTE.neonCyan;
    ctx.beginPath();
    ctx.arc(x0 + state.target.x * s, y0 + state.target.y * s, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
  function drawDossier(ctx, d) {
    var P = CoralDusk.PALETTE;
    ctx.save();
    ctx.fillStyle = 'rgba(20,8,40,0.88)';
    ctx.fillRect(340, 150, 600, 420);
    ctx.fillStyle = P.text;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.fillText('DOSSIER — CORAL DUSK', 380, 200);
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Missions completed: ' + d.completed + ' / ' + d.total, 380, 250);
    ctx.fillText('Best time: ' + (d.bestSeconds === null ? '—' : d.bestSeconds + 's'), 380, 285);
    ctx.fillText('Peak wanted: ' + d.wantedPeak + ' stars', 380, 320);
    d.missions.forEach(function (m, i) {
      ctx.fillText((i + 1) + '. ' + m.name + ' — ' + m.seconds + 's, ' + m.wantedPeak + '★', 380, 355 + i * 28);
    });
    ctx.restore();
  }
  CoralDusk.drawHud = drawHud;
  CoralDusk.drawDossier = drawDossier;
})(typeof window !== 'undefined' ? window : globalThis);
