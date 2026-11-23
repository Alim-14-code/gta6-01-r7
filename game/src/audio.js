// Coral Dusk — sound: a tiny WebAudio synth (engine hum, siren, pickup
// chime). No audio files; silence when the browser has no AudioContext.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  var ctx = null;
  function audio() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }
  function beep(freq, seconds, type, gain) {
    var ac = audio();
    if (!ac) return;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.08, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + seconds);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + seconds);
  }
  function siren() {
    beep(660, 0.4, 'sawtooth', 0.05);
    setTimeout(function () { beep(520, 0.4, 'sawtooth', 0.05); }, 180);
  }
  function chime() {
    beep(880, 0.18, 'sine', 0.09);
    setTimeout(function () { beep(1318, 0.28, 'sine', 0.09); }, 120);
  }
  function engine(speed) {
    var ac = audio();
    if (!ac) return;
    beep(60 + speed * 0.12, 0.12, 'triangle', 0.03);
  }
  CoralDusk.beep = beep;
  CoralDusk.siren = siren;
  CoralDusk.chime = chime;
  CoralDusk.engine = engine;
})(typeof window !== 'undefined' ? window : globalThis);
