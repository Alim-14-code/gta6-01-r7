// Coral Dusk — a seeded PRNG (mulberry32). Same algorithm as main.ts, so the
// browser game and the dossier simulation agree on every random draw.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeRng(seed) {
    var next = mulberry32(seed);
    return {
      next: next,
      range: function (lo, hi) { return lo + next() * (hi - lo); },
      int: function (lo, hi) { return Math.floor(lo + next() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; }
    };
  }
  CoralDusk.mulberry32 = mulberry32;
  CoralDusk.makeRng = makeRng;
})(typeof window !== 'undefined' ? window : globalThis);
