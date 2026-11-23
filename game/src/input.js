// Coral Dusk — keyboard input. Arrows/WASD drive, Space brakes, M starts the
// next mission, H ducks into an alley to cool the wanted level.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  function makeInput() {
    return { up: false, down: false, left: false, right: false, brake: false, mission: false, hide: false };
  }
  function bindInput(input) {
    if (typeof document === 'undefined') return function () {};
    var down = function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === 'arrowup' || k === 'w') input.up = true;
      if (k === 'arrowdown' || k === 's') input.down = true;
      if (k === 'arrowleft' || k === 'a') input.left = true;
      if (k === 'arrowright' || k === 'd') input.right = true;
      if (k === ' ') { input.brake = true; e.preventDefault(); }
      if (k === 'm') input.mission = true;
      if (k === 'h') input.hide = true;
    };
    var up = function (e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === 'arrowup' || k === 'w') input.up = false;
      if (k === 'arrowdown' || k === 's') input.down = false;
      if (k === 'arrowleft' || k === 'a') input.left = false;
      if (k === 'arrowright' || k === 'd') input.right = false;
      if (k === ' ') input.brake = false;
      if (k === 'm') input.mission = false;
      if (k === 'h') input.hide = false;
    };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return function () {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }
  CoralDusk.makeInput = makeInput;
  CoralDusk.bindInput = bindInput;
})(typeof window !== 'undefined' ? window : globalThis);
