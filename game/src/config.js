// Coral Dusk — shared constants. One source of truth for the game and its dossier.
(function (global) {
  'use strict';
  var CoralDusk = global.CoralDusk || (global.CoralDusk = {});
  CoralDusk.SEED = 1337;
  CoralDusk.WIDTH = 1280;
  CoralDusk.HEIGHT = 720;
  CoralDusk.MISSIONS = [
    { id: 1, name: 'Sunset Pickup', target: 'Pick up Maya at the pier', par: 150 },
    { id: 2, name: 'Boardwalk Dash', target: 'Race the boardwalk in 3 laps', par: 195 },
    { id: 3, name: 'Marina Heist', target: 'Lift the yacht keys, lose the tail', par: 240 },
    { id: 4, name: 'Rooftop Signal', target: 'Light the rooftop beacon', par: 285 },
    { id: 5, name: 'Harbor Chase', target: 'Outrun the harbor patrol', par: 330 },
    { id: 6, name: 'Dawn Getaway', target: 'Reach the causeway before dawn', par: 375 }
  ];
  CoralDusk.WANTED_MAX = 5;
  CoralDusk.PLAYER_SPEED = 420;
  CoralDusk.TRAFFIC_SPEED = 150;
  CoralDusk.POLICE_SPEED = 380;
  CoralDusk.PALETTE = {
    skyTop: '#2a1042', skyMid: '#7b2d6e', skyLow: '#ff7e5f',
    sun: '#feb47b', sea: '#1d6f8e', sand: '#f2c98a',
    road: '#2e2a3a', roadLine: '#ffd166', sidewalk: '#4a3f66',
    building: '#3a2b5c', buildingLit: '#ffd166', neonPink: '#ff5da2',
    neonCyan: '#3ee6d8', car: '#ff6f91', police: '#3a86ff', text: '#ffd9ec'
  };
})(typeof window !== 'undefined' ? window : globalThis);
