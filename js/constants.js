// Game constants: texture defs, upgrade defs, enemy types, spawn tables
const PLAYER_POLY = [16,0, 32,32, 16,26, 0,32];
const ENEMY_POLY  = [16,32, 32,0, 16,8, 0,0];
const ELITE_POLY  = [20,40, 40,0, 20,10, 0,0];
const BOSS_POLY   = [40,80, 80,0, 40,20, 0,0];

const TEXTURE_DEFS = {
    // Player & clone (defaults — overwritten by GameScene.createPlayerTexture)
    player:    { w: 32, h: 32, steps: [['stroke',3,0xffffff],['strokePoly',PLAYER_POLY],['fill',0x00aaff],['fillPrev'],['fill',0x88ccff],['circle',16,16,6],['fill',0xff6600],['circle',12,28,3],['circle',20,28,3]] },
    cloneShip: { w: 32, h: 32, steps: [['stroke',3,0xffffff],['strokePoly',PLAYER_POLY],['fill',0x00ff00],['fillPrev'],['fill',0x88ff88],['circle',16,16,6],['fill',0xffff00],['circle',12,28,3],['circle',20,28,3]] },

    // Asteroid
    asteroid: { w: 32, h: 32, steps: [['fill',0x8b7355],['fillPoly',[16,0,28,8,32,20,24,32,8,32,0,20,4,8]],['fill',0x6b5344],['circle',10,12,3],['circle',22,18,4],['circle',14,24,2]] },

    // Regular enemies
    enemy:            { w: 32, h: 32, steps: [['fill',0xff3333],['fillPoly',ENEMY_POLY],['fill',0xffff00],['circle',8,4,2],['circle',24,4,2]] },
    enemyDarkRed:     { w: 32, h: 32, steps: [['stroke',2,0xffffff],['strokePoly',ENEMY_POLY],['fill',0xaa0000],['fillPrev'],['fill',0xff0000],['circle',8,4,2],['circle',24,4,2]] },
    enemyPulsingRed:  { w: 32, h: 32, steps: [['stroke',3,0xffffff],['strokePoly',ENEMY_POLY],['fill',0xaa0000],['fillPrev'],['fill',0xff0000],['circle',8,4,2],['circle',24,4,2]] },

    // Elite enemies
    eliteEnemy:          { w: 40, h: 40, steps: [['fill',0x9933ff],['fillPoly',ELITE_POLY],['fill',0x7700cc],['rect',15,15,10,20]] },
    enemyDarkPurple:     { w: 40, h: 40, steps: [['stroke',2,0xffffff],['strokePoly',ELITE_POLY],['fill',0x660099],['fillPrev'],['fill',0x440066],['rect',15,15,10,20]] },
    enemyPulsingPurple:  { w: 40, h: 40, steps: [['stroke',3,0xffffff],['strokePoly',ELITE_POLY],['fill',0x660099],['fillPrev'],['fill',0x440066],['rect',15,15,10,20]] },

    // Bosses
    boss:        { w: 80, h: 80, steps: [['fill',0x666666],['fillPoly',BOSS_POLY],['fill',0x444444],['rect',10,30,15,40],['rect',55,30,15,40],['fill',0xff0000],['circle',40,40,15]] },
    bossDark:    { w: 80, h: 80, steps: [['stroke',3,0xffffff],['strokePoly',BOSS_POLY],['fill',0x333333],['fillPrev'],['fill',0x222222],['rect',10,30,15,40],['rect',55,30,15,40],['fill',0xaa0000],['circle',40,40,15]] },
    bossPulsing: { w: 80, h: 80, steps: [['stroke',4,0xffffff],['strokePoly',BOSS_POLY],['fill',0x333333],['fillPrev'],['fill',0x222222],['rect',10,30,15,40],['rect',55,30,15,40],['fill',0xaa0000],['circle',40,40,15]] },

    // Projectiles
    bullet:      { w: 12, h: 16, steps: [['fill',0x00ffff],['rect',3,0,6,16],['fill',0xffffff],['rect',5,2,2,12]] },
    enemyBullet: { w: 12, h: 12, steps: [['fill',0xff0000],['rect',3,0,6,12],['fill',0xff6600],['rect',5,2,2,8]] },

    // Powerups
    powerupShield: { w: 32, h: 32, steps: [['fill',0x0088ff],['circle',16,16,14],['fill',0x004488],['circle',16,16,10],['fill',0x00ffff],['fillPoly',[16,6,26,16,16,26,6,16]]] },
    powerupRapid:  { w: 32, h: 32, steps: [['fill',0xffff00],['circle',16,16,14],['fill',0x888800],['rect',8,10,16,4],['rect',8,18,16,4]] },
    powerupMulti:  { w: 32, h: 32, steps: [['fill',0x00ff00],['circle',16,16,14],['fill',0x006600],['fillPoly',[16,6,22,22,16,18,10,22]]] },
    powerupLasers: { w: 32, h: 32, steps: [['fill',0x00ff00],['circle',16,16,14],['stroke',3,0xccffcc],['line',10,22,4,10],['line',22,22,28,10],['stroke',1,0xffffff,0.8],['line',10,22,4,10],['line',22,22,28,10]] },
    healthPickup:  { w: 32, h: 32, steps: [['fill',0xffffff],['circle',16,16,14],['fill',0xff0000],['rect',12,6,8,20],['rect',6,12,20,8]] },

    // Effects
    star:     { w: 4, h: 4, steps: [['fill',0xffffff],['circle',2,2,2]] },
    particle: { w: 8, h: 8, steps: [['fill',0xffff00],['circle',4,4,4],['fill',0xff6600],['circle',4,4,2]] },

    // Gems (small = 18x18, medium = 26x26, large = 34x34)
    gemSmall:      { w: 18, h: 18, steps: [['stroke',2,0xffffff],['strokeCircle',9,9,7],['fill',0x00aaff],['circle',9,9,6],['fill',0x88ccff],['circle',8,8,3]] },
    gemSmallGreen: { w: 18, h: 18, steps: [['stroke',2,0xffffff],['strokeCircle',9,9,7],['fill',0x00ff00],['circle',9,9,6],['fill',0x88ff88],['circle',8,8,3]] },
    gemSmallGold:  { w: 18, h: 18, steps: [['stroke',2,0xffffff],['strokeCircle',9,9,7],['fill',0xffd700],['circle',9,9,6],['fill',0xffff00],['circle',8,8,3]] },
    gemMediumBlue: { w: 26, h: 26, steps: [['stroke',2,0xffffff],['strokeCircle',13,13,10],['fill',0x00aaff],['circle',13,13,9],['fill',0x88ccff],['circle',11,11,4]] },
    gemMedium:     { w: 26, h: 26, steps: [['stroke',2,0xffffff],['strokeCircle',13,13,10],['fill',0x00ff00],['circle',13,13,9],['fill',0x88ff88],['circle',11,11,4]] },
    gemMediumGold: { w: 26, h: 26, steps: [['stroke',2,0xffffff],['strokeCircle',13,13,10],['fill',0xffd700],['circle',13,13,9],['fill',0xffff00],['circle',11,11,4]] },
    gemLarge:      { w: 34, h: 34, steps: [['stroke',3,0xffffff],['strokeCircle',17,17,13],['fill',0xffd700],['circle',17,17,12],['fill',0xffff00],['circle',14,14,5]] },

    // Upgrade icons
    upgradePiercing:  { w: 32, h: 16, steps: [['fill',0x00ffff],['rect',4,6,24,4],['fill',0xff0000],['circle',24,8,6],['fill',0x00ffff],['rect',24,6,12,4]] },
    upgradeDrones:    { w: 32, h: 32, steps: [['fill',0x00aaff],['circle',16,16,6],['fill',0xffff00],['circle',4,4,3],['circle',28,4,3],['circle',4,28,3],['circle',28,28,3]] },
    upgradeRear:      { w: 32, h: 32, steps: [['fill',0xff6600],['tri',16,24,8,8,24,8]] },
    upgradeSidecannon:{ w: 32, h: 32, steps: [['fill',0xff6600],['tri',6,16,12,8,12,24],['tri',26,16,20,8,20,24]] },
    upgradeExplosive: { w: 32, h: 32, steps: [['fill',0xffff00],['circle',16,16,10],['fill',0xff6600],['fillPoly',[16,2,20,12,30,12,22,18,26,28,16,22,6,28,10,18,2,12,12,12]]] },
    upgradeLightning: { w: 32, h: 32, steps: [['fill',0xffff00],['fillPoly',[18,2,10,16,16,16,14,30,22,14,16,14]]] },
    upgradeVampiric:  { w: 32, h: 32, steps: [['fill',0xff0000],['circle',10,10,8],['circle',22,10,8],['fillPoly',[4,12,16,28,28,12]],['fill',0xffffff],['rect',11,14,3,5],['rect',18,14,3,5]] },
    upgradeShield:    { w: 32, h: 32, steps: [['fill',0x0088ff],['circle',16,18,12],['fill',0x00ffff],['fillPoly',[16,6,26,16,16,26,6,16]]] },
    upgradeMagnet:    { w: 32, h: 32, steps: [['fill',0xff00ff],['rect',8,4,6,12],['rect',18,4,6,12],['rect',6,16,20,4],['fill',0xaa00aa],['circle',16,26,4]] },
    upgradeThorns:    { w: 32, h: 32, steps: [['fill',0x00aa00],['circle',16,16,12],['fill',0xff0000],['tri',16,2,12,10,20,10],['tri',16,30,12,22,20,22],['tri',2,16,10,12,10,20],['tri',30,16,22,12,22,20]] },
    upgradeGarlic:    { w: 32, h: 32, steps: [['fill',0xeeeeee],['circle',16,16,12],['fill',0xdddddd],['circle',16,10,4],['circle',12,14,3],['circle',20,14,3],['circle',14,20,3],['circle',18,20,3],['fill',0x9966ff,0.6],['stroke',2,0x9966ff,0.8],['strokeCircle',16,16,14]] },
    upgradeNuke:      { w: 32, h: 32, steps: [['fill',0xff6600],['circle',16,16,14],['fill',0xffff00],['fillPoly',[16,4,20,12,28,12,22,18,24,26,16,22,8,26,10,18,4,12,12,12]],['fill',0xff0000],['rect',10,10,12,3],['rect',10,10,3,3],['rect',19,19,3,3],['rect',10,19,12,3]] },
    upgradeClone:     { w: 32, h: 16, steps: [['fill',0x00aaff],['fillPoly',[8,0,16,16,8,12,0,16]],['fill',0x0088cc],['fillPoly',[24,0,32,16,24,12,16,16]]] },
    upgradeGiant:     { w: 32, h: 32, steps: [['fill',0xffaa00],['rect',10,4,12,24],['rect',6,8,20,4],['fill',0xffffff],['tri',16,2,10,8,22,8]] },
    upgradeBerserker: { w: 32, h: 32, steps: [['fill',0xff0000],['circle',16,16,12],['fill',0xffaa00],['circle',10,12,3],['circle',22,12,3],['stroke',2,0xffffff],['openStroke',[8,22,16,26,24,22]]] }
};

const UPGRADE_DEFS = [
    { key: 'piercing',   name: 'Piercing Rounds',  displayName: 'Piercing',     desc: 'Bullets pass through enemies',    max: 3 },
    { key: 'drones',     name: 'Orbital Drones',    displayName: 'Drones',       desc: 'Drones orbit and fire at enemies', max: 5 },
    { key: 'rear',       name: 'Rear Turret',       displayName: 'Rear Turret',  desc: 'Auto-fires behind you',           max: 5 },
    { key: 'explosive',  name: 'Explosive Rounds',  displayName: 'Explosive',    desc: 'Bullets explode on impact',       max: 5 },
    { key: 'lightning',  name: 'Chain Lightning',    displayName: 'Lightning',    desc: 'Lightning arcs to nearby enemies', max: 5 },
    { key: 'vampiric',   name: 'Vampiric',          displayName: 'Vampiric',     desc: 'Heal on kills',                   max: 3 },
    { key: 'shield',     name: 'Shield Battery',     displayName: 'Shield',       desc: '+1 Max Shield',                   max: 99 },
    { key: 'magnet',     name: 'Magnetic Field',     displayName: 'Magnet',       desc: 'Increased pickup range',          max: 99 },
    { key: 'garlic',     name: 'Garlic',             displayName: 'Garlic',       desc: 'Damages enemies in aura',         max: 5 },
    { key: 'nuke',       name: 'Screen Nuke',        displayName: 'Nuke',         desc: 'Press Z to clear screen',         max: 5 },
    { key: 'clone',      name: 'Clone Mirror',       displayName: 'Clone',        desc: 'Clone copies your shots',         max: 1 },
    { key: 'giant',      name: 'Giant Mode',          displayName: 'Giant',        desc: 'Bigger, stronger, slower',        max: 5 },
    { key: 'berserker',  name: 'Berserker',           displayName: 'Berserker',    desc: 'More damage at low health',       max: 3 },
    { key: 'sidecannon', name: 'Side Turret',         displayName: 'Side Turret',  desc: 'Auto-fires to the side',          max: 2, requires: 'rear' }
];

const WEAPON_DEFS = [
    {
        name: 'Default',
        baseCooldown: 300,
        rapidFireCooldown: 150,
        bulletSpeed: 500,
        maxRangeFraction: null,
    },
    {
        name: 'Shotgun',
        baseCooldown: 750,
        rapidFireCooldown: 300,
        bulletSpeed: 600,
        maxRange: 250,
        spread: [
            { xOffset: 0, vx: -220 },
            { xOffset: 0, vx: -75 },
            { xOffset: 0, vx: 75 },
            { xOffset: 0, vx: 220 },
        ],
    },
];

const ENEMY_TYPES = {
    lightRed:      { texture: 'enemy',              health: 1,  hardHealth: 1,  score: 10,  gem: 'gemSmall',      gemXp: 5,  elite: false, damage: 10, radius: 15 },
    darkRed:       { texture: 'enemyDarkRed',        health: 5,  hardHealth: 8,  score: 20,  gem: 'gemSmallGreen', gemXp: 7,  elite: false, damage: 10, radius: 15 },
    pulsingRed:    { texture: 'enemyPulsingRed',     health: 10, hardHealth: 15, score: 30,  gem: 'gemSmallGold',  gemXp: 10, elite: false, damage: 10, radius: 15, pulsing: true },
    lightPurple:   { texture: 'eliteEnemy',           health: 5,  hardHealth: 8,  score: 50,  gem: 'gemMediumBlue', gemXp: 25, elite: true,  damage: 8,  radius: 19 },
    darkPurple:    { texture: 'enemyDarkPurple',      health: 15, hardHealth: 20, score: 75,  gem: 'gemMedium',     gemXp: 30, elite: true,  radius: 19, burstOverride: 3 },
    pulsingPurple: { texture: 'enemyPulsingPurple',   health: 25, hardHealth: 30, score: 100, gem: 'gemMediumGold', gemXp: 35, elite: true,  damage: 15, radius: 19, burstOverride: 7, pulsing: true }
};

// Each entry: [scoreThreshold, [[cumProb, type], ...]]
// Checked in order — first entry where score < threshold is used; last entry is the fallback
const SPAWN_TABLE = [
    [1000,  [[95, 'lightRed'], [100, 'lightPurple']]],
    [2000,  [[50, 'lightRed'], [70, 'darkRed'], [90, 'lightPurple'], [100, 'darkPurple']]],
    [3000,  [[35, 'lightRed'], [65, 'darkRed'], [85, 'lightPurple'], [100, 'darkPurple']]],
    [4000,  [[20, 'lightRed'], [50, 'darkRed'], [55, 'pulsingRed'], [75, 'lightPurple'], [95, 'darkPurple'], [100, 'pulsingPurple']]],
    [5000,  [[15, 'lightRed'], [40, 'darkRed'], [50, 'pulsingRed'], [65, 'lightPurple'], [90, 'darkPurple'], [100, 'pulsingPurple']]],
    [6000,  [[10, 'lightRed'], [30, 'darkRed'], [45, 'pulsingRed'], [60, 'lightPurple'], [90, 'darkPurple'], [100, 'pulsingPurple']]],
    [7000,  [[5, 'lightRed'],  [20, 'darkRed'], [40, 'pulsingRed'], [55, 'lightPurple'], [85, 'darkPurple'], [100, 'pulsingPurple']]],
    [8000,  [[5, 'lightRed'],  [17, 'darkRed'], [37, 'pulsingRed'], [52, 'lightPurple'], [80, 'darkPurple'], [100, 'pulsingPurple']]],
    [9000,  [[5, 'lightRed'],  [15, 'darkRed'], [35, 'pulsingRed'], [50, 'lightPurple'], [75, 'darkPurple'], [100, 'pulsingPurple']]],
    [Infinity, [[5, 'lightRed'], [15, 'darkRed'], [35, 'pulsingRed'], [50, 'lightPurple'], [70, 'darkPurple'], [100, 'pulsingPurple']]]
];

function getSpawnType(score) {
    const roll = Phaser.Math.Between(1, 100);
    const table = SPAWN_TABLE.find(([threshold]) => score < threshold)[1];
    return table.find(([cum]) => roll <= cum)[1];
}
