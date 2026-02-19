// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, IntroScene, GameScene]
};

// Create the game
const game = new Phaser.Game(config);