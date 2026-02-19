// Phaser 3 Space Shooter Game - Roguelike Edition
// Complete game with all assets generated programmatically

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;

        // Background
        this.add.rectangle(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth, this.gameHeight, 0x000011);

        // Starfield
        this.stars = this.physics.add.group();
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.gameWidth);
            const y = Phaser.Math.Between(0, this.gameHeight);
            const star = this.stars.create(x, y, 'star');
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.speed = Phaser.Math.FloatBetween(0.5, 2);
        }

        // Title
        const titleText = this.add.text(this.gameWidth / 2, 150, 'SPACE GAME', {
            fontSize: '72px',
            fill: '#00ffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Title glow effect
        this.tweens.add({
            targets: titleText,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Subtitle
        this.add.text(this.gameWidth / 2, 220, 'Choose Your Difficulty', {
            fontSize: '24px',
            fill: '#aaaaaa',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Normal Mode Button
        const normalButton = this.createButton(this.gameWidth / 2 - 150, 380, 'Normal Mode', 0x00aa00, () => {
            this.startGame('normal');
        });

        // Hard Mode Button
        const hardButton = this.createButton(this.gameWidth / 2 + 150, 380, 'Hard Mode', 0xaa0000, () => {
            this.startGame('hard');
        });

        // Normal Mode Description
        this.add.text(this.gameWidth / 2 - 150, 460, 'Standard gameplay\nNo limits', {
            fontSize: '16px',
            fill: '#888888',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        // Hard Mode Description
        this.add.text(this.gameWidth / 2 + 150, 460, 'Faster enemy scaling\nLimited upgrades', {
            fontSize: '16px',
            fill: '#888888',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    }

    createButton(x, y, text, color, callback) {
        const width = 220;
        const height = 60;

        const bg = this.add.rectangle(x, y, width, height, color);
        bg.setStrokeStyle(3, 0xffffff);
        bg.setInteractive({ useHandCursor: true });

        const label = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Hover effects
        bg.on('pointerover', () => {
            bg.setFillStyle(color, 0.8);
            bg.setScale(1.05);
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(color, 1);
            bg.setScale(1);
        });

        bg.on('pointerdown', () => {
            this.selectionMade = true;
            callback();
        });

        return bg;
    }

    startGame(mode) {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', { gameMode: mode });
        });
    }

    update(time, delta) {
        // Animate stars
        this.stars.children.iterate((star) => {
            star.y += star.speed;
            if (star.y > this.gameHeight) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, this.gameWidth);
            }
        });
    }
}

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create all textures programmatically
        this.createPlayerTexture();
        this.createCloneTexture();
        this.createAsteroidTexture();
        this.createEnemyTexture();
        this.createEliteEnemyTexture();
        this.createBossTexture();
        this.createBulletTexture();
        this.createEnemyBulletTexture();
        this.createPowerupShieldTexture();
        this.createPowerupRapidTexture();
        this.createPowerupMultiTexture();
        this.createPowerupLasersTexture();
        this.createHealthPickupTexture();
        this.createStarTexture();
        this.createParticleTexture();
        
        // Gem textures
        this.createGemSmallTexture();
        this.createGemMediumTexture();
        this.createGemLargeTexture();
        
        // Upgrade icon textures
        this.createUpgradePiercingTexture();
        this.createUpgradeDronesTexture();
        this.createUpgradeRearTexture();
        this.createUpgradeSideCannonTexture();
        this.createUpgradeExplosiveTexture();
        this.createUpgradeLightningTexture();
        this.createUpgradeVampiricTexture();
        this.createUpgradeShieldTexture();
        this.createUpgradeMagnetTexture();
        this.createUpgradeThornsTexture();
        this.createUpgradeGarlicTexture();
        this.createUpgradeNukeTexture();
        this.createUpgradeCloneTexture();
        this.createUpgradeGiantTexture();
        this.createUpgradeBerserkerTexture();
    }

    createPlayerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw white outline
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 0);
        graphics.lineTo(32, 32);
        graphics.lineTo(16, 26);
        graphics.lineTo(0, 32);
        graphics.closePath();
        graphics.strokePath();
        
        // Draw spaceship body
        graphics.fillStyle(0x00aaff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 0);
        graphics.lineTo(32, 32);
        graphics.lineTo(16, 26);
        graphics.lineTo(0, 32);
        graphics.closePath();
        graphics.fillPath();
        
        // Draw cockpit
        graphics.fillStyle(0x88ccff, 1);
        graphics.fillCircle(16, 16, 6);
        
        // Draw engine glow
        graphics.fillStyle(0xff6600, 1);
        graphics.fillCircle(12, 28, 3);
        graphics.fillCircle(20, 28, 3);
        
        graphics.generateTexture('player', 32, 32);
    }

    createCloneTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw white outline
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 0);
        graphics.lineTo(32, 32);
        graphics.lineTo(16, 26);
        graphics.lineTo(0, 32);
        graphics.closePath();
        graphics.strokePath();
        
        // Draw spaceship body - GREEN instead of blue
        graphics.fillStyle(0x00ff00, 1);
        graphics.beginPath();
        graphics.moveTo(16, 0);
        graphics.lineTo(32, 32);
        graphics.lineTo(16, 26);
        graphics.lineTo(0, 32);
        graphics.closePath();
        graphics.fillPath();
        
        // Draw cockpit
        graphics.fillStyle(0x88ff88, 1);
        graphics.fillCircle(16, 16, 6);
        
        // Draw engine glow
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(12, 28, 3);
        graphics.fillCircle(20, 28, 3);
        
        graphics.generateTexture('cloneShip', 32, 32);
    }

    createAsteroidTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw irregular asteroid shape
        graphics.fillStyle(0x8b7355, 1);
        graphics.beginPath();
        graphics.moveTo(16, 0);
        graphics.lineTo(28, 8);
        graphics.lineTo(32, 20);
        graphics.lineTo(24, 32);
        graphics.lineTo(8, 32);
        graphics.lineTo(0, 20);
        graphics.lineTo(4, 8);
        graphics.closePath();
        graphics.fillPath();
        
        // Add some craters
        graphics.fillStyle(0x6b5344, 1);
        graphics.fillCircle(10, 12, 3);
        graphics.fillCircle(22, 18, 4);
        graphics.fillCircle(14, 24, 2);
        
        graphics.generateTexture('asteroid', 32, 32);
    }

    createEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw enemy ship
        graphics.fillStyle(0xff3333, 1);
        graphics.beginPath();
        graphics.moveTo(16, 32);
        graphics.lineTo(32, 0);
        graphics.lineTo(16, 8);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();
        
        // Draw engine glow
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(8, 4, 2);
        graphics.fillCircle(24, 4, 2);
        
        graphics.generateTexture('enemy', 32, 32);
    }

    createEliteEnemyTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw elite enemy ship (larger, purple)
        graphics.fillStyle(0x9933ff, 1);
        graphics.beginPath();
        graphics.moveTo(20, 40);
        graphics.lineTo(40, 0);
        graphics.lineTo(20, 10);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();
        
        // Draw wing details
        graphics.fillStyle(0x7700cc, 1);
        graphics.fillRect(15, 15, 10, 20);
        
        graphics.generateTexture('eliteEnemy', 40, 40);
    }

    createBossTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw boss ship (massive)
        graphics.fillStyle(0x666666, 1);
        graphics.beginPath();
        graphics.moveTo(40, 80);
        graphics.lineTo(80, 0);
        graphics.lineTo(40, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();
        
        // Draw cannons
        graphics.fillStyle(0x444444, 1);
        graphics.fillRect(10, 30, 15, 40);
        graphics.fillRect(55, 30, 15, 40);
        
        // Draw core
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(40, 40, 15);
        
        graphics.generateTexture('boss', 80, 80);
    }

    createBulletTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw bullet (cyan laser)
        graphics.fillStyle(0x00ffff, 1);
        graphics.fillRect(3, 0, 6, 16);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(5, 2, 2, 12);
        
        graphics.generateTexture('bullet', 12, 16);
    }

    createEnemyBulletTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw enemy bullet (red plasma)
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(3, 0, 6, 12);
        graphics.fillStyle(0xff6600, 1);
        graphics.fillRect(5, 2, 2, 8);
        
        graphics.generateTexture('enemyBullet', 12, 12);
    }

    createPowerupShieldTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw shield powerup
        graphics.fillStyle(0x0088ff, 1);
        graphics.fillCircle(16, 16, 14);
        graphics.fillStyle(0x004488, 1);
        graphics.fillCircle(16, 16, 10);
        graphics.fillStyle(0x00ffff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 6);
        graphics.lineTo(26, 16);
        graphics.lineTo(16, 26);
        graphics.lineTo(6, 16);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('powerupShield', 32, 32);
    }

    createPowerupRapidTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw rapid fire powerup
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(16, 16, 14);
        graphics.fillStyle(0x888800, 1);
        graphics.fillRect(8, 10, 16, 4);
        graphics.fillRect(8, 18, 16, 4);
        
        graphics.generateTexture('powerupRapid', 32, 32);
    }

    createPowerupMultiTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw multi-shot powerup
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(16, 16, 14);
        graphics.fillStyle(0x006600, 1);
        graphics.beginPath();
        graphics.moveTo(16, 6);
        graphics.lineTo(22, 22);
        graphics.lineTo(16, 18);
        graphics.lineTo(10, 22);
        graphics.closePath();
        graphics.fillPath();
        
        graphics.generateTexture('powerupMulti', 32, 32);
    }

    createPowerupLasersTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw lasers powerup - green circle with laser beam icons
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(16, 16, 14);
        
        // Draw two diagonal laser beams
        graphics.lineStyle(3, 0xccffcc, 1);
        // Up-left beam
        graphics.beginPath();
        graphics.moveTo(10, 22);
        graphics.lineTo(4, 10);
        graphics.strokePath();
        // Up-right beam
        graphics.beginPath();
        graphics.moveTo(22, 22);
        graphics.lineTo(28, 10);
        graphics.strokePath();
        
        // Glow effect on beams
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.beginPath();
        graphics.moveTo(10, 22);
        graphics.lineTo(4, 10);
        graphics.strokePath();
        graphics.beginPath();
        graphics.moveTo(22, 22);
        graphics.lineTo(28, 10);
        graphics.strokePath();
        
        graphics.generateTexture('powerupLasers', 32, 32);
    }

    createHealthPickupTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // White background circle
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(16, 16, 14);
        
        // Red cross
        graphics.fillStyle(0xff0000, 1);
        // Vertical bar
        graphics.fillRect(12, 6, 8, 20);
        // Horizontal bar
        graphics.fillRect(6, 12, 20, 8);
        
        graphics.generateTexture('healthPickup', 32, 32);
    }

    createStarTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw star
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(2, 2, 2);
        
        graphics.generateTexture('star', 4, 4);
    }

    createParticleTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Draw explosion particle
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.fillStyle(0xff6600, 1);
        graphics.fillCircle(4, 4, 2);
        
        graphics.generateTexture('particle', 8, 8);
    }

    // Gem textures
    createGemSmallTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // White outline
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeCircle(9, 9, 7);
        // Blue gem
        graphics.fillStyle(0x00aaff, 1);
        graphics.fillCircle(9, 9, 6);
        // Inner highlight
        graphics.fillStyle(0x88ccff, 1);
        graphics.fillCircle(8, 8, 3);
        graphics.generateTexture('gemSmall', 18, 18);
    }

    createGemMediumTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // White outline
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeCircle(13, 13, 10);
        // Green gem
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillCircle(13, 13, 9);
        // Inner highlight
        graphics.fillStyle(0x88ff88, 1);
        graphics.fillCircle(11, 11, 4);
        graphics.generateTexture('gemMedium', 26, 26);
    }

    createGemLargeTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // White outline
        graphics.lineStyle(3, 0xffffff, 1);
        graphics.strokeCircle(17, 17, 13);
        // Gold gem
        graphics.fillStyle(0xffd700, 1);
        graphics.fillCircle(17, 17, 12);
        // Inner highlight
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(14, 14, 5);
        graphics.generateTexture('gemLarge', 34, 34);
    }

    // Upgrade icon textures
    createUpgradePiercingTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00ffff, 1);
        graphics.fillRect(4, 6, 24, 4);
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(24, 8, 6);
        graphics.fillStyle(0x00ffff, 1);
        graphics.fillRect(24, 6, 12, 4);
        graphics.generateTexture('upgradePiercing', 32, 16);
    }

    createUpgradeDronesTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00aaff, 1);
        graphics.fillCircle(16, 16, 6);
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(4, 4, 3);
        graphics.fillCircle(28, 4, 3);
        graphics.fillCircle(4, 28, 3);
        graphics.fillCircle(28, 28, 3);
        graphics.generateTexture('upgradeDrones', 32, 32);
    }

    createUpgradeRearTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff6600, 1);
        graphics.fillTriangle(16, 24, 8, 8, 24, 8);
        graphics.generateTexture('upgradeRear', 32, 32);
    }

    createUpgradeSideCannonTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff6600, 1);
        // Left pointing triangle (tip on left)
        graphics.fillTriangle(6, 16, 12, 8, 12, 24);
        // Right pointing triangle (tip on right, with space)
        graphics.fillTriangle(26, 16, 20, 8, 20, 24);
        graphics.generateTexture('upgradeSidecannon', 32, 32);
    }

    createUpgradeExplosiveTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(16, 16, 10);
        graphics.fillStyle(0xff6600, 1);
        graphics.beginPath();
        graphics.moveTo(16, 2);
        graphics.lineTo(20, 12);
        graphics.lineTo(30, 12);
        graphics.lineTo(22, 18);
        graphics.lineTo(26, 28);
        graphics.lineTo(16, 22);
        graphics.lineTo(6, 28);
        graphics.lineTo(10, 18);
        graphics.lineTo(2, 12);
        graphics.lineTo(12, 12);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('upgradeExplosive', 32, 32);
    }

    createUpgradeLightningTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffff00, 1);
        graphics.beginPath();
        graphics.moveTo(18, 2);
        graphics.lineTo(10, 16);
        graphics.lineTo(16, 16);
        graphics.lineTo(14, 30);
        graphics.lineTo(22, 14);
        graphics.lineTo(16, 14);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('upgradeLightning', 32, 32);
    }

    createUpgradeVampiricTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        // Draw heart using two circles and a triangle
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(10, 10, 8);
        graphics.fillCircle(22, 10, 8);
        graphics.beginPath();
        graphics.moveTo(4, 12);
        graphics.lineTo(16, 28);
        graphics.lineTo(28, 12);
        graphics.closePath();
        graphics.fillPath();
        // Fangs
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(11, 14, 3, 5);
        graphics.fillRect(18, 14, 3, 5);
        graphics.generateTexture('upgradeVampiric', 32, 32);
    }

    createUpgradeShieldTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x0088ff, 1);
        graphics.fillCircle(16, 18, 12);
        graphics.fillStyle(0x00ffff, 1);
        graphics.beginPath();
        graphics.moveTo(16, 6);
        graphics.lineTo(26, 16);
        graphics.lineTo(16, 26);
        graphics.lineTo(6, 16);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('upgradeShield', 32, 32);
    }

    createUpgradeMagnetTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff00ff, 1);
        graphics.fillRect(8, 4, 6, 12);
        graphics.fillRect(18, 4, 6, 12);
        graphics.fillRect(6, 16, 20, 4);
        graphics.fillStyle(0xaa00aa, 1);
        graphics.fillCircle(16, 26, 4);
        graphics.generateTexture('upgradeMagnet', 32, 32);
    }

    createUpgradeThornsTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00aa00, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xff0000, 1);
        graphics.fillTriangle(16, 2, 12, 10, 20, 10);
        graphics.fillTriangle(16, 30, 12, 22, 20, 22);
        graphics.fillTriangle(2, 16, 10, 12, 10, 20);
        graphics.fillTriangle(30, 16, 22, 12, 22, 20);
        graphics.generateTexture('upgradeThorns', 32, 32);
    }

    createUpgradeGarlicTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xeeeeee, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xdddddd, 1);
        graphics.fillCircle(16, 10, 4);
        graphics.fillCircle(12, 14, 3);
        graphics.fillCircle(20, 14, 3);
        graphics.fillCircle(14, 20, 3);
        graphics.fillCircle(18, 20, 3);
        graphics.fillStyle(0x9966ff, 0.6);
        graphics.lineStyle(2, 0x9966ff, 0.8);
        graphics.strokeCircle(16, 16, 14);
        graphics.generateTexture('upgradeGarlic', 32, 32);
    }

    createUpgradeNukeTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff6600, 1);
        graphics.fillCircle(16, 16, 14);
        graphics.fillStyle(0xffff00, 1);
        graphics.beginPath();
        graphics.moveTo(16, 4);
        graphics.lineTo(20, 12);
        graphics.lineTo(28, 12);
        graphics.lineTo(22, 18);
        graphics.lineTo(24, 26);
        graphics.lineTo(16, 22);
        graphics.lineTo(8, 26);
        graphics.lineTo(10, 18);
        graphics.lineTo(4, 12);
        graphics.lineTo(12, 12);
        graphics.closePath();
        graphics.fillPath();
        // Draw Z key shape
        graphics.fillStyle(0xff0000, 1);
        graphics.fillRect(10, 10, 12, 3);
        graphics.fillRect(10, 10, 3, 3);
        graphics.fillRect(19, 19, 3, 3);
        graphics.fillRect(10, 19, 12, 3);
        graphics.generateTexture('upgradeNuke', 32, 32);
    }

    createUpgradeCloneTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x00aaff, 1);
        graphics.beginPath();
        graphics.moveTo(8, 0);
        graphics.lineTo(16, 16);
        graphics.lineTo(8, 12);
        graphics.lineTo(0, 16);
        graphics.closePath();
        graphics.fillPath();
        graphics.fillStyle(0x0088cc, 1);
        graphics.beginPath();
        graphics.moveTo(24, 0);
        graphics.lineTo(32, 16);
        graphics.lineTo(24, 12);
        graphics.lineTo(16, 16);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('upgradeClone', 32, 16);
    }

    createUpgradeGiantTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffaa00, 1);
        graphics.fillRect(10, 4, 12, 24);
        graphics.fillRect(6, 8, 20, 4);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillTriangle(16, 2, 10, 8, 22, 8);
        graphics.generateTexture('upgradeGiant', 32, 32);
    }

    createUpgradeBerserkerTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(16, 16, 12);
        graphics.fillStyle(0xffaa00, 1);
        graphics.fillCircle(10, 12, 3);
        graphics.fillCircle(22, 12, 3);
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.beginPath();
        graphics.moveTo(8, 22);
        graphics.lineTo(16, 26);
        graphics.lineTo(24, 22);
        graphics.strokePath();
        graphics.generateTexture('upgradeBerserker', 32, 32);
    }

    create() {
        this.scene.start('IntroScene');
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.gameMode = data.gameMode || 'normal';
        this.score = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.playerLevel = 1;
        this.bossCount = 0;
        this.godMode = false;
        this.isGameOver = false;
        this.isPaused = false;
        
        // XP System
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        // Powerup timers
        this.rapidFireActive = false;
        this.multiShotActive = false;
        this.shieldActive = false;
        this.isInvincible = false;
        this.rapidFireTimer = null;
        this.multiShotTimer = null;
        
        // Powerup expiration times (for countdown display)
        this.rapidFireExpireTime = 0;
        this.multiShotExpireTime = 0;
        this.lasersExpireTime = 0;
        
        // Lasers powerup state
        this.lasersActive = false;
        this.lasersTimer = null;
        this.lasersLastFireTime = 0;
        this.lasersArray = []; // Active laser objects
        
        // Shooting cooldowns
        this.lastShotTime = 0;
        this.shootCooldown = 250;
        
        // Enemy spawn timers
        this.lastEnemySpawn = 0;
        this.lastAsteroidSpawn = 0;
        this.enemySpawnRate = 2000;
        this.asteroidSpawnRate = 1500;
        
        // Enemy scaling - mode specific
        this.gameStartTime = 0;
        this.lastScalingTime = 0;
        this.lastSpawnIncreaseTime = 0;
        this.enemyHealthMultiplier = 1;
        this.pauseTimeOffset = 0;
        
        // Mode-specific settings
        if (this.gameMode === 'hard') {
            this.healthScaleInterval = 30000; // 30 seconds
            this.spawnIncreaseInterval = 60000; // 60 seconds
            this.maxUpgradeSlots = 5;
            this.spawnRateCap = 100; // Minimum spawn interval
        } else {
            this.healthScaleInterval = 45000; // 45 seconds
            this.spawnIncreaseInterval = 75000; // 75 seconds
            this.maxUpgradeSlots = 999; // Unlimited
            this.spawnRateCap = 300; // Minimum spawn interval
        }
        
        // Upgrade slots (Hard Mode only)
        this.upgradeSlotsUsed = 0;
        
        // Permanent upgrades (roguelike)
        this.upgrades = {
            piercing: 0,
            drones: 0,
            rear: 0,
            explosive: 0,
            lightning: 0,
            vampiric: 0,
            shield: 0,
            magnet: 0,
            garlic: 0,
            nuke: 0,
            clone: 0,
            giant: 0,
            berserker: 0,
            sidecannon: 0
        };
        
        // Garlic aura tracking
        this.garlicLastDamageTime = 0;
        this.garlicAura = null;
        
        // Berserker aura (fire effect at max tier)
        this.berserkerAura = null;
        
        // Shield visual
        this.shieldCircle = null;
        
        // Nuke cooldown
        this.nukeCooldown = 0;
        this.nukeMaxCooldown = 60000; // 60 seconds
        
        // Rear turret timer
        this.lastRearShot = 0;
        
        // Side cannon timer
        this.lastSideCannonShot = 0;
    }

    create() {
        // Get game dimensions from config, not scale (scale can differ from actual)
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        
        // Start timing
        this.gameStartTime = this.time.now;

        // Create starfield background
        this.createStarfield();

        // Create player
        this.createPlayer();

        // Create groups
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100
        });

        this.enemyBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 100
        });

        this.enemies = this.physics.add.group();
        this.asteroids = this.physics.add.group();
        this.boss = this.physics.add.group();
        this.powerups = this.physics.add.group();
        this.gems = this.physics.add.group();
        this.drones = this.physics.add.group();
        this.clones = this.physics.add.group();
        
        // Create particle emitter
        this.createParticles();

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        
        // Toggle god mode with P
        this.pKey.on('down', () => {
            this.godMode = !this.godMode;
            this.showMessage(this.godMode ? 'GOD MODE ON' : 'GOD MODE OFF', this.godMode ? '#ffff00' : '#ffffff');
        });
        
        // Add score with O (debug)
        this.oKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.oKey.on('down', () => {
            this.score += 500;
            this.showMessage('+500 SCORE', '#ffff00');
        });
        
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // ESC to pause
        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });

        // Setup collisions
        this.setupCollisions();

        // Create UI
        this.createUI();
        
        // Create upgrade cards (hidden initially)
        this.createUpgradeUI();
    }

    createStarfield() {
        this.stars = this.physics.add.group();
        
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.gameWidth);
            const y = Phaser.Math.Between(0, this.gameHeight);
            const star = this.stars.create(x, y, 'star');
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.speed = Phaser.Math.FloatBetween(0.25, 2);
        }
    }

    createPlayer() {
        const startX = this.gameWidth / 2;
        const startY = this.gameHeight - 100;
        
        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Apply giant mode if upgraded
        if (this.upgrades.giant > 0) {
            const scale = 1 + (this.upgrades.giant * 0.25);
            this.player.setScale(scale);
        }
        
        // Listen for post-update (runs after physics)
        this.events.on('postupdate', () => {
            if (this.isGameOver || !this.player || !this.player.active) return;
            // Update shield position after physics
            if (this.shieldActive && this.shieldCircle) {
                this.shieldCircle.setPosition(this.player.x, this.player.y);
            }
            // Update garlic aura position after physics
            if (this.garlicAura) {
                this.garlicAura.setPosition(this.player.x, this.player.y);
            }
            // Update berserker tint based on health
            if (this.upgrades.berserker > 0) {
                const healthPercent = this.health / this.maxHealth;
                let tier = 0;
                if (healthPercent <= 0.8) tier++;
                if (healthPercent <= 0.6) tier++;
                if (healthPercent <= 0.4) tier++;
                if (healthPercent <= 0.2) tier++;
                
                // Apply red tint based on tier (0-4)
                // Tier 0: no tint, Tier 4: full red
                const tintIntensity = tier * 0.25;
                this.player.setTint(Phaser.Display.Color.GetColor(
                    255,
                    Math.floor(255 * (1 - tintIntensity)),
                    Math.floor(255 * (1 - tintIntensity))
                ));
                
                // Fiery aura at max tier (tier 4)
                if (tier >= 4) {
                    const auraRadius = 30 + Math.sin(this.time.now / 100) * 5;
                    if (!this.berserkerAura) {
                        this.berserkerAura = this.add.circle(this.player.x, this.player.y, auraRadius, 0xff4400, 0.4);
                    } else {
                        this.berserkerAura.setPosition(this.player.x, this.player.y);
                        this.berserkerAura.setRadius(auraRadius);
                    }
                } else if (this.berserkerAura) {
                    this.berserkerAura.destroy();
                    this.berserkerAura = null;
                }
            } else {
                this.player.clearTint();
                if (this.berserkerAura) {
                    this.berserkerAura.destroy();
                    this.berserkerAura = null;
                }
            }
        });
    }

    createParticles() {
        this.particles = this.add.particles(0, 0, 'particle', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 500
        });
    }

    setupCollisions() {
        // Bullets hit enemies
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
        
        // Bullets hit asteroids
        this.physics.add.overlap(this.bullets, this.asteroids, this.bulletHitAsteroid, null, this);
        
        // Bullets hit boss
        this.physics.add.overlap(this.bullets, this.boss, this.bulletHitBoss, null, this);
        
        // Player collides with enemies
        this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);
        
        // Player collides with asteroids
        this.physics.add.overlap(this.player, this.asteroids, this.playerHitAsteroid, null, this);
        
        // Player collides with boss
        this.physics.add.overlap(this.player, this.boss, this.playerHitBoss, null, this);
        
        // Player collides with enemy bullets
        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHitBullet, null, this);
        
        // Player collides with powerups
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
        
        // Player collides with gems
        this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
    }

    createUI() {
        // Score text (top right)
        this.scoreText = this.add.text(this.gameWidth - 20, 20, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        
        // Health text (top left)
        this.healthText = this.add.text(20, 20, 'Health: 100', {
            fontSize: '24px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        
        // Level text (below health)
        this.levelText = this.add.text(20, 50, 'Level: 1', {
            fontSize: '20px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        
        // XP Bar background
        this.xpBarBg = this.add.rectangle(this.gameWidth / 2, 30, 400, 20, 0x333333);
        
        // XP Bar fill
        this.xpBar = this.add.rectangle(this.gameWidth / 2 - 200, 30, 0, 20, 0x00aaff);
        this.xpBar.setOrigin(0, 0.5);
        
        // XP Text
        this.xpText = this.add.text(this.gameWidth / 2, 30, 'XP: 0/100', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Active upgrade indicators
        this.rapidText = this.add.text(this.gameWidth - 20, 50, '', {
            fontSize: '18px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(1, 0);
        
        this.multiText = this.add.text(this.gameWidth - 20, 80, '', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(1, 0);

        this.lasersText = this.add.text(this.gameWidth - 20, 110, '', {
            fontSize: '18px',
            fill: '#00ff00',
            fontFamily: 'Arial'
        }).setOrigin(1, 0);
        
        // Upgrade level indicators (created dynamically)
        this.upgradeTexts = {};
        
        // Track order of acquired upgrades
        this.acquiredUpgrades = [];
        
        // Nuke cooldown indicator (bottom right)
        this.nukeIcon = this.add.image(this.gameWidth - 40, this.gameHeight - 40, 'upgradeNuke');
        this.nukeIcon.setScale(1.5);
        this.nukeIcon.setVisible(false);
        this.nukeIcon.setAlpha(0.3);
        
        // Nuke cooldown text
        this.nukeCooldownText = this.add.text(this.gameWidth - 40, this.gameHeight - 40, '', {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.nukeCooldownText.setVisible(false);
        
        // Debug button (bottom left) - instant level up (invisible but clickable)
        this.debugButton = this.add.text(60, this.gameHeight - 30, '', {
            fontSize: '16px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0,0,0,0)',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
        this.debugButton.setInteractive({ useHandCursor: true });
        this.debugButton.on('pointerdown', () => {
            this.levelUp();
        });

        // Mode indicator (only show slots in hard mode, on the right side)
        if (this.gameMode === 'hard') {
            // Upgrade slots indicator - right side, above upgrade list
            this.slotsText = this.add.text(this.gameWidth - 20, 120, `Slots: 0/${this.maxUpgradeSlots}`, {
                fontSize: '16px',
                fill: '#ff8800',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(1, 0);
        }
    }

    createUpgradeUI() {
        // Semi-transparent background
        this.upgradeBg = this.add.rectangle(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            this.gameWidth, 
            this.gameHeight, 
            0x000000, 
            0.8
        );
        this.upgradeBg.setVisible(false);
        this.upgradeBg.setDepth(100);
        
        // Level up text
        this.levelUpText = this.add.text(this.gameWidth / 2, 100, 'LEVEL UP!', {
            fontSize: '48px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.levelUpText.setVisible(false);
        this.levelUpText.setDepth(101);
        
        // Upgrade cards container
        this.upgradeCards = [];
        const cardWidth = 200;
        const cardHeight = 280;
        const startX = (this.gameWidth - (cardWidth * 3 + 40)) / 2 + cardWidth / 2;
        
        for (let i = 0; i < 3; i++) {
            const x = startX + i * (cardWidth + 20);
            const y = this.gameHeight / 2;
            
            // Card background
            const card = this.add.rectangle(x, y, cardWidth, cardHeight, 0x333333);
            card.setStrokeStyle(2, 0x666666);
            card.setVisible(false);
            card.setDepth(101);
            card.setInteractive({ useHandCursor: true });
            card.on('pointerdown', () => {
                this.selectUpgrade(i);
            });
            
            // Card icon
            const icon = this.add.image(x, y - 60, 'upgradePiercing');
            icon.setVisible(false);
            icon.setDepth(102);
            
            // Card title
            const title = this.add.text(x, y, 'Upgrade Name', {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            title.setVisible(false);
            title.setDepth(102);
            
            // Card description
            const desc = this.add.text(x, y + 50, 'Description', {
                fontSize: '14px',
                fill: '#aaaaaa',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 180 }
            }).setOrigin(0.5);
            desc.setVisible(false);
            desc.setDepth(102);
            
            // Card level indicator
            const level = this.add.text(x, y + 100, 'Level: 1', {
                fontSize: '16px',
                fill: '#ffff00',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            level.setVisible(false);
            level.setDepth(102);
            
            // Card key hint
            const keyHint = this.add.text(x, y + 120, `[${i + 1}]`, {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            keyHint.setVisible(false);
            keyHint.setDepth(102);
            
            this.upgradeCards.push({
                bg: card,
                icon: icon,
                title: title,
                description: desc,
                level: level,
                keyHint: keyHint,
                upgradeKey: null
            });
        }
        
        // Input keys for upgrade selection
        this.input.keyboard.on('keydown-ONE', () => this.selectUpgrade(0));
        this.input.keyboard.on('keydown-TWO', () => this.selectUpgrade(1));
        this.input.keyboard.on('keydown-THREE', () => this.selectUpgrade(2));
    }

    update(time, delta) {
        // Handle game over - skip game logic but keep enemies moving
        if (this.isGameOver) {
            // Keep enemies and asteroids moving
            this.enemies.children.iterate((enemy) => {
                if (enemy && enemy.active) {
                    enemy.y += enemy.body.velocity.y * (delta / 1000);
                    if (enemy.y > this.gameHeight + 50) {
                        enemy.destroy();
                    }
                }
            });
            this.asteroids.children.iterate((asteroid) => {
                if (asteroid && asteroid.active) {
                    asteroid.y += asteroid.body.velocity.y * (delta / 1000);
                    if (asteroid.y > this.gameHeight + 50) {
                        asteroid.destroy();
                    }
                }
            });
            this.boss.children.iterate((boss) => {
                if (boss && boss.active) {
                    boss.y += boss.body.velocity.y * (delta / 1000);
                    if (boss.y > this.gameHeight + 50) {
                        if (boss.healthBarBg) boss.healthBarBg.destroy();
                        if (boss.healthBar) boss.healthBar.destroy();
                        boss.destroy();
                    }
                }
            });
            return;
        }
        
        // Handle pause state - skip game logic but allow boss to maintain position
        if (this.isPaused || (this.upgradeBg && this.upgradeBg.visible)) {
            return;
        }

        // Update enemy scaling
        this.updateEnemyScaling(time);

        // Update starfield
        this.stars.children.iterate((star) => {
            star.y += star.speed;
            if (star.y > this.gameHeight) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, this.gameWidth);
            }
        });

        // Player movement
        const baseSpeed = 300;
        const speed = baseSpeed * (1 - (this.upgrades.giant * 0.15));
        this.player.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.setVelocityY(speed);
        }

        // Shooting
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.spaceKey.isDown) {
            if (time > this.lastShotTime + this.shootCooldown) {
                this.shoot();
                this.lastShotTime = time;
            }
        }
        
        // Nuke
        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            this.activateNuke(time);
        }

        // Debug: Fire lasers with M key
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
            this.fireLasers();
        }

        // Lasers powerup - fire every 2 seconds
        if (this.lasersActive && time > this.lasersLastFireTime + 2000) {
            this.fireLasers();
            this.lasersLastFireTime = time;
        }
        
        // Rear turret
        if (this.upgrades.rear > 0) {
            const rearCooldown = 1000 / this.upgrades.rear;
            if (time > this.lastRearShot + rearCooldown) {
                this.fireRearTurret();
                this.lastRearShot = time;
            }
        }
        
        // Side cannons (fire at same rate as rear)
        if (this.upgrades.sidecannon > 0 && this.upgrades.rear > 0) {
            const rearCooldown = 1000 / this.upgrades.rear;
            if (time > this.lastSideCannonShot + rearCooldown) {
                this.fireSideCannons();
                this.lastSideCannonShot = time;
            }
        }
        
        // Update drones
        this.updateDrones(time);
        
        // Update clones
        this.updateClones();

        // Garlic aura - only for main player
        if (this.upgrades.garlic > 0 && this.player.active) {
            const auraRadius = 40 + (this.upgrades.garlic * 25); // 65, 90, 115, 140, 165
            const damagePerTick = 1 + this.upgrades.garlic; // 2, 3, 4, 5, 6 damage every 0.5s
            
            // Create aura visual if needed
            if (!this.garlicAura) {
                this.garlicAura = this.add.circle(this.player.x, this.player.y, auraRadius, 0x9966ff, 0.2);
            } else {
                this.garlicAura.setRadius(auraRadius);
            }
            
            // Deal damage every 0.5 seconds
            if (time - this.garlicLastDamageTime > 500) {
                this.enemies.children.iterate((enemy) => {
                    if (enemy && enemy.active) {
                        const dx = enemy.x - this.player.x;
                        const dy = enemy.y - this.player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < auraRadius) {
                            enemy.health -= damagePerTick;
                            if (enemy.health <= 0) {
                                this.destroyEnemy(enemy);
                            }
                        }
                    }
                });
                
                // Also damage asteroids
                this.asteroids.children.iterate((asteroid) => {
                    if (asteroid && asteroid.active) {
                        const dx = asteroid.x - this.player.x;
                        const dy = asteroid.y - this.player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < auraRadius) {
                            asteroid.health -= damagePerTick;
                            if (asteroid.health <= 0) {
                                this.destroyAsteroid(asteroid, false, null);
                            }
                        }
                    }
                });
                
                // Also damage boss
                this.boss.children.iterate((boss) => {
                    if (boss && boss.active) {
                        const dx = boss.x - this.player.x;
                        const dy = boss.y - this.player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < auraRadius) {
                            boss.health -= damagePerTick;
                            if (boss.health <= 0) {
                                this.createExplosion(boss.x, boss.y, 20);
                                if (boss.gemType) {
                                    this.spawnGem(boss.x, boss.y, boss.gemType);
                                }
                                if (boss.healthBarBg) boss.healthBarBg.destroy();
                                if (boss.healthBar) boss.healthBar.destroy();
                                this.score += boss.scoreValue;
                                boss.destroy();
                            }
                        }
                    }
                });
                this.garlicLastDamageTime = time;
            }
        } else if (this.garlicAura) {
            this.garlicAura.destroy();
            this.garlicAura = null;
        }

        // Spawn enemies
        if (time > this.lastEnemySpawn + this.enemySpawnRate) {
            this.spawnEnemy();
            this.lastEnemySpawn = time;
        }

        // Spawn asteroids
        if (time > this.lastAsteroidSpawn + this.asteroidSpawnRate) {
            this.spawnAsteroid();
            this.lastAsteroidSpawn = time;
        }

        // Spawn boss - first at 1000, then every 2000 more points
        if (this.score >= 1000 + (this.bossCount * 2000) && (!this.boss || this.boss.countActive(true) === 0)) {
            console.log('Attempting to spawn boss, score:', this.score);
            this.spawnBoss();
        }

        // Enemy AI
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active) {
                // Elite enemies shoot in bursts
                if (enemy.isElite) {
                    const now = this.time.now;
                    
                    if (enemy.isBurstShooting) {
                        // In the middle of a burst - fire remaining shots with delay
                        if (enemy.burstCount < 3 && now >= enemy.nextBurstShot) {
                            this.enemyShoot(enemy);
                            enemy.burstCount++;
                            enemy.nextBurstShot = now + 200; // 200ms between burst shots
                        } else if (enemy.burstCount >= 3) {
                            // Burst complete, wait for next burst
                            enemy.isBurstShooting = false;
                            enemy.lastShotTime = now + 1500; // 1.5 seconds between bursts
                        }
                    } else if (now >= enemy.lastShotTime) {
                        // Start new burst
                        enemy.isBurstShooting = true;
                        enemy.burstCount = 0;
                        this.enemyShoot(enemy);
                        enemy.burstCount = 1;
                        enemy.nextBurstShot = now + 200;
                    }
                }
                
                // Remove if off screen
                if (enemy.y > this.gameHeight + 50) {
                    enemy.destroy();
                }
            }
        });

        // Boss AI
        this.boss.children.iterate((boss) => {
            if (boss && boss.active) {
                // Boss shoots multiple bullets
                if (Phaser.Math.Between(0, 60) === 0) {
                    this.bossShoot(boss);
                }
                
                // Boss moves side to side using velocity (not time-based position)
                // Use sine wave to oscillate velocity - amplitude increases with each boss
                if (!boss.oscillateTime) boss.oscillateTime = 0;
                boss.oscillateTime += delta;
                
                // Scale amplitude with boss count (150 base, +50 per boss, capped at screen bounds)
                const baseAmplitude = 150;
                const amplitudeIncrement = 50;
                const maxAmplitude = (this.gameWidth / 2) - 40; // Keep boss fully on screen
                const amplitude = Math.min(baseAmplitude + (this.bossCount - 1) * amplitudeIncrement, maxAmplitude);
                
                const targetX = this.gameWidth / 2 + Math.sin(boss.oscillateTime / 500) * amplitude;
                const diff = targetX - boss.x;
                boss.setVelocityX(diff * 5); // Smooth follow
                
                // Keep boss at lower position (y position 120)
                if (boss.y < 120) {
                    boss.setVelocityY(50);
                } else if (boss.y > 120) {
                    boss.setVelocityY(-50);
                } else {
                    boss.setVelocityY(0);
                }
                
                // Update health bar position and fill (if exists)
                if (boss.healthBarBg && boss.healthBar && boss.maxHealth > 0) {
                    boss.healthBarBg.setPosition(boss.x, boss.y - 50);
                    
                    const healthPercent = boss.health / boss.maxHealth;
                    boss.healthBar.width = 100 * Math.max(0, healthPercent);
                    boss.healthBar.setPosition(boss.x - 50, boss.y - 50);
                    
                    // Color based on health percentage
                    if (healthPercent > 0.5) {
                        boss.healthBar.setFillStyle(0x00ff00); // Green
                    } else if (healthPercent > 0.2) {
                        boss.healthBar.setFillStyle(0xffff00); // Yellow
                    } else {
                        boss.healthBar.setFillStyle(0xff0000); // Red
                    }
                }
            }
        });

        // Magnetize gems
        this.magnetizeGems();

        // Update lasers
        this.updateLasers(time, delta);

        // Clean up off-screen objects
        this.cleanupObjects();

        // Update UI
        this.updateUI();
        
        // Update nuke cooldown
        if (this.nukeCooldown > 0) {
            this.nukeCooldown -= delta;
        }
        
        // Update nuke icon visualization
        if (this.upgrades.nuke > 0) {
            this.nukeIcon.setVisible(true);
            const maxCooldown = 60000 / this.upgrades.nuke;
            const cooldownProgress = Math.max(0, 1 - (this.nukeCooldown / maxCooldown));
            this.nukeIcon.setAlpha(0.3 + (cooldownProgress * 0.7));
            
            if (this.nukeCooldown > 0) {
                this.nukeCooldownText.setVisible(true);
                this.nukeCooldownText.setText(Math.ceil(this.nukeCooldown / 1000).toString());
                this.nukeCooldownText.setAlpha(0.8);
            } else {
                this.nukeCooldownText.setVisible(false);
            }
        }

        // Check game over
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    updateEnemyScaling(time) {
        const elapsed = time - this.gameStartTime - (this.pauseTimeOffset || 0);
        
        // Health scales every mode-specific interval
        if (elapsed - this.lastScalingTime >= this.healthScaleInterval) {
            this.enemyHealthMultiplier *= 1.20;
            this.lastScalingTime = elapsed;
            
            // Visual feedback - flash message
            this.showScalingMessage();
        }
        
        // Spawn rate increases every mode-specific interval
        if (elapsed - this.lastSpawnIncreaseTime >= this.spawnIncreaseInterval) {
            this.enemySpawnRate = Math.max(this.spawnRateCap, this.enemySpawnRate - 200);
            this.lastSpawnIncreaseTime = elapsed;
            
            // Show spawn rate message
            const text = this.add.text(this.gameWidth / 2, this.gameHeight / 2 - 50, 
                `Enemy Spawn Rate +`, {
                fontSize: '24px',
                fill: '#ff8800',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: text,
                alpha: 0,
                y: text.y - 50,
                duration: 2000,
                onComplete: () => text.destroy()
            });
        }
    }
    
    showScalingMessage() {
        const text = this.add.text(this.gameWidth / 2, this.gameHeight / 2 - 100, 
            `Enemy Health +15%`, {
            fontSize: '24px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    shoot() {
        const x = this.player.x;
        const y = this.player.y - 20;
        
        // Apply damage multiplier from giant mode
        let damageMult = 1 + (this.upgrades.giant * 0.25);
        
        // Apply berserker bonus based on health
        if (this.upgrades.berserker > 0) {
            const healthPercent = this.health / this.maxHealth;
            let berserkerBonus = 0;
            if (healthPercent <= 0.8) berserkerBonus += 0.25;
            if (healthPercent <= 0.6) berserkerBonus += 0.25;
            if (healthPercent <= 0.4) berserkerBonus += 0.25;
            if (healthPercent <= 0.2) berserkerBonus += 0.25;
            damageMult += berserkerBonus * this.upgrades.berserker;
        }

        if (this.multiShotActive) {
            // 3-way spread shot
            const bulletOffsets = [-25, 0, 25];
            const xVelocities = [-100, 0, 100];
            
            for (let i = 0; i < 3; i++) {
                this.createBullet(x + bulletOffsets[i], y, xVelocities[i], -500, damageMult);
            }
        } else {
            // Single shot
            this.createBullet(x, y, 0, -500, damageMult);
        }
        
        // Clone shots - clones copy player's temp upgrades
        this.clones.children.iterate((clone) => {
            if (clone && clone.active) {
                if (this.multiShotActive) {
                    // 3-way spread shot
                    const bulletOffsets = [-25, 0, 25];
                    const xVelocities = [-100, 0, 100];
                    
                    for (let i = 0; i < 3; i++) {
                        this.createBullet(clone.x + bulletOffsets[i], clone.y - 20, xVelocities[i], -500, damageMult);
                    }
                } else {
                    // Single shot
                    this.createBullet(clone.x, clone.y - 20, 0, -500, damageMult);
                }
            }
        });
    }
    
    createBullet(x, y, vx, vy, damageMult = 1) {
        const bullet = this.bullets.get(x, y, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocity(vx, vy);
            bullet.damage = damageMult;
            bullet.pierceCount = this.upgrades.piercing * 2; // 2, 4, or 6 pierces
            bullet.explosive = this.upgrades.explosive > 0;
            bullet.explosiveRadius = 40 + (this.upgrades.explosive * 30); // 70, 100, 130, 160, 190
            bullet.explosiveDamage = this.upgrades.explosive * 3; // 3, 6, 9, 12, 15
            bullet.chainLightning = this.upgrades.lightning > 0; // Has chain lightning
            bullet.lightningJumps = 1 + (this.upgrades.lightning * 2); // 3, 5, or 7 jumps
            bullet.lightningRange = 200 + (this.upgrades.lightning * 50); // 200, 250, or 300
        }
    }
    
    fireRearTurret() {
        const x = this.player.x;
        const y = this.player.y + 20;
        
        // Apply damage multiplier from giant mode
        let damageMult = 1 + (this.upgrades.giant * 0.25);
        
        // Apply berserker bonus based on health
        if (this.upgrades.berserker > 0) {
            const healthPercent = this.health / this.maxHealth;
            let berserkerBonus = 0;
            if (healthPercent <= 0.8) berserkerBonus += 0.25;
            if (healthPercent <= 0.6) berserkerBonus += 0.25;
            if (healthPercent <= 0.4) berserkerBonus += 0.25;
            if (healthPercent <= 0.2) berserkerBonus += 0.25;
            damageMult += berserkerBonus * this.upgrades.berserker;
        }
        
        // Single shot backwards (no temporary upgrades affect rear turret)
        const bullet = this.bullets.get(x, y, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocity(0, 500);
            bullet.damage = damageMult;
            bullet.pierceCount = this.upgrades.piercing * 2;
            bullet.explosive = this.upgrades.explosive > 0;
            bullet.explosiveRadius = 40 + (this.upgrades.explosive * 30);
            bullet.explosiveDamage = this.upgrades.explosive * 3;
            bullet.chainLightning = this.upgrades.lightning > 0;
            bullet.lightningJumps = 1 + (this.upgrades.lightning * 2);
            bullet.lightningRange = 200 + (this.upgrades.lightning * 50);
        }
    }
    
    fireSideCannons() {
        // Calculate damage multiplier (same as rear turret)
        let damageMult = 1 + (this.upgrades.giant * 0.25);
        
        // Apply berserker bonus based on health
        if (this.upgrades.berserker > 0) {
            const healthPercent = this.health / this.maxHealth;
            let berserkerBonus = 0;
            if (healthPercent <= 0.8) berserkerBonus += 0.25;
            if (healthPercent <= 0.6) berserkerBonus += 0.25;
            if (healthPercent <= 0.4) berserkerBonus += 0.25;
            if (healthPercent <= 0.2) berserkerBonus += 0.25;
            damageMult += berserkerBonus * this.upgrades.berserker;
        }
        
        const y = this.player.y;
        
        // Level 1: Left cannon only
        // Level 2: Left and right cannons
        const leftX = this.player.x - 20;
        const rightX = this.player.x + 20;
        
        // Fire left cannon (always fires at level 1)
        this.createSideBullet(leftX, y, -500, 0, damageMult);
        
        // Fire right cannon (only at level 2)
        if (this.upgrades.sidecannon >= 2) {
            this.createSideBullet(rightX, y, 500, 0, damageMult);
        }
    }
    
    createSideBullet(x, y, vx, vy, damageMult) {
        const bullet = this.bullets.get(x, y, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocity(vx, vy);
            bullet.damage = damageMult;
            bullet.pierceCount = this.upgrades.piercing * 2;
            bullet.explosive = this.upgrades.explosive > 0;
            bullet.explosiveRadius = 40 + (this.upgrades.explosive * 30);
            bullet.explosiveDamage = this.upgrades.explosive * 3;
            bullet.chainLightning = this.upgrades.lightning > 0;
            bullet.lightningJumps = 1 + (this.upgrades.lightning * 2);
            bullet.lightningRange = 200 + (this.upgrades.lightning * 50);
        }
    }
    
    updateDrones(time) {
        const droneCount = this.upgrades.drones;
        if (droneCount === 0) return;
        
        // Create drones if needed
        const currentDrones = this.drones.countActive();
        if (currentDrones < droneCount) {
            for (let i = currentDrones; i < droneCount; i++) {
                const drone = this.drones.create(this.player.x, this.player.y, 'bullet');
                drone.orbitRadius = 60;
            }
            // Recalculate all drone angles to be equidistant
            let idx = 0;
            this.drones.children.iterate((existingDrone) => {
                if (existingDrone && existingDrone.active) {
                    existingDrone.orbitAngle = (idx / droneCount) * Math.PI * 2;
                    idx++;
                }
            });
        }
        
        // Update drone positions and shooting
        let index = 0;
        const droneDamageMult = 1 + (this.upgrades.giant * 0.25);
        this.drones.children.iterate((drone) => {
            if (drone && drone.active) {
                // Orbit around player
                drone.orbitAngle += 0.02;
                drone.x = this.player.x + Math.cos(drone.orbitAngle) * drone.orbitRadius;
                drone.y = this.player.y + Math.sin(drone.orbitAngle) * drone.orbitRadius;
                
                // Fire outward
                if (time % 500 < 20) {
                    const angle = drone.orbitAngle;
                    const vx = Math.cos(angle) * 300;
                    const vy = Math.sin(angle) * 300;
                    const bullet = this.bullets.get(drone.x, drone.y, 'bullet');
                    if (bullet) {
                        bullet.setActive(true);
                        bullet.setVisible(true);
                        bullet.setVelocity(vx, vy);
                        bullet.damage = droneDamageMult;
                        bullet.pierceCount = this.upgrades.piercing * 2;
                        bullet.explosive = this.upgrades.explosive > 0;
                        bullet.explosiveRadius = 40 + (this.upgrades.explosive * 30);
                        bullet.explosiveDamage = this.upgrades.explosive * 3;
                        bullet.chainLightning = this.upgrades.lightning > 0;
                        bullet.lightningJumps = 1 + (this.upgrades.lightning * 2);
                        bullet.lightningRange = 200 + (this.upgrades.lightning * 50);
                    }
                }
                index++;
            }
        });
    }
    
    updateClones() {
        const cloneCount = this.upgrades.clone;
        if (cloneCount === 0) return;
        
        // Create/update clones
        const currentClones = this.clones.countActive();
        const targetClones = cloneCount;
        
        if (currentClones < targetClones) {
            for (let i = currentClones; i < targetClones; i++) {
                const clone = this.clones.create(this.player.x, this.player.y, 'cloneShip');
                clone.setAlpha(0.3);
                clone.setScale(0.8);
                clone.cloneIndex = i;
            }
        }
        
        // Position clones - all clones mirror player's movement
        this.clones.children.iterate((clone) => {
            if (clone && clone.active) {
                // Level 1: Mirror on opposite side
                clone.x = this.gameWidth - this.player.x;
                clone.y = this.player.y;
                
                /* Level 2 (commented out): Two mirror clones
                if (cloneCount === 1) {
                    // Level 1: Mirror on opposite side
                    clone.x = this.gameWidth - this.player.x;
                    clone.y = this.player.y;
                } else {
                    // Level 2: Two mirror clones
                    // Clone 0: Horizontal mirror (opposite side)
                    // Clone 1: Diagonal mirror (opposite corner area)
                    if (clone.cloneIndex === 0) {
                        clone.x = this.gameWidth - this.player.x;
                        clone.y = this.player.y;
                    } else {
                        // Mirror to opposite corner, but keep some distance
                        clone.x = this.gameWidth - this.player.x;
                        clone.y = Math.max(50, Math.min(this.gameHeight - 50, this.gameHeight - this.player.y));
                    }
                }
                */
            }
        });
    }
    
    activateNuke(time) {
        if (this.upgrades.nuke === 0) return;
        if (this.nukeCooldown > 0) {
            this.showMessage(`Nuke on cooldown: ${Math.ceil(this.nukeCooldown / 1000)}s`, '#ff0000');
            return;
        }
        
        // Destroy all enemies and asteroids
        const enemiesToDestroy = this.enemies.getChildren().filter(e => e && e.active);
        enemiesToDestroy.forEach((enemy) => {
            this.createExplosion(enemy.x, enemy.y);
            this.spawnGem(enemy.x, enemy.y, enemy.isElite ? 'medium' : 'small');
            enemy.destroy();
        });
        
        // Get array of asteroids first to avoid iteration issues
        const asteroidsToDestroy = this.asteroids.getChildren().filter(a => a && a.active);
        asteroidsToDestroy.forEach((asteroid) => {
            this.createExplosion(asteroid.x, asteroid.y);
            this.spawnGem(asteroid.x, asteroid.y, 'small');
            asteroid.destroy();
        });
        
        this.boss.children.iterate((boss) => {
            if (boss && boss.active) {
                boss.health -= 25;
                if (boss.health <= 0) {
                    this.createExplosion(boss.x, boss.y, 20);
                    this.spawnGem(boss.x, boss.y, 'large');
                    if (boss.healthBarBg) boss.healthBarBg.destroy();
                    if (boss.healthBar) boss.healthBar.destroy();
                    boss.destroy();
                    this.score += boss.scoreValue;
                }
            }
        });
        
        // Screen flash effect
        const flash = this.add.rectangle(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            this.gameWidth, 
            this.gameHeight, 
            0xffffff, 
            0.8
        );
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        
        // Set cooldown
        const baseCooldown = 60000;
        this.nukeCooldown = baseCooldown / this.upgrades.nuke;
        
        this.showMessage('NUKE ACTIVATED!', '#ffff00');
    }
    
    showMessage(text, color) {
        const msg = this.add.text(this.gameWidth / 2, this.gameHeight / 2, text, {
            fontSize: '32px',
            fill: color,
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: msg,
            alpha: 0,
            y: msg.y - 50,
            duration: 1500,
            onComplete: () => msg.destroy()
        });
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(20, this.gameWidth - 20);
        
        if (this.score > 500 && Phaser.Math.Between(0, 4) === 0) {
            // Spawn elite enemy
            const enemy = this.enemies.create(x, -40, 'eliteEnemy');
            enemy.setVelocityY(Phaser.Math.Between(100, 150));
            enemy.setVelocityX(Phaser.Math.Between(-30, 30));
            enemy.health = Math.floor(3 * this.enemyHealthMultiplier);
            enemy.maxHealth = enemy.health;
            enemy.scoreValue = 50;
            enemy.isElite = true;
            enemy.gemType = 'medium';
            enemy.lastShotTime = this.time.now + 2000; // 2 second delay before first shot
            enemy.isBurstShooting = false;
            enemy.burstCount = 0;
        } else {
            // Spawn regular enemy
            const enemy = this.enemies.create(x, -20, 'enemy');
            enemy.setVelocityY(Phaser.Math.Between(80, 120));
            enemy.setVelocityX(Phaser.Math.Between(-20, 20));
            enemy.health = Math.floor(1 * this.enemyHealthMultiplier);
            enemy.maxHealth = enemy.health;
            enemy.scoreValue = 10;
            enemy.isElite = false;
            enemy.gemType = 'small';
        }
    }

    spawnAsteroid() {
        const x = Phaser.Math.Between(20, this.gameWidth - 20);
        const asteroid = this.asteroids.create(x, -20, 'asteroid');
        asteroid.setVelocityY(Phaser.Math.Between(50, 100));
        asteroid.setVelocityX(Phaser.Math.Between(-20, 20));
        asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));
        asteroid.health = Math.floor(2 * this.enemyHealthMultiplier);
        asteroid.scoreValue = 5;
        asteroid.gemType = 'small';
    }

    spawnBoss() {
        try {
            this.bossCount++;
            const boss = this.boss.create(this.gameWidth / 2, -150, 'boss');
            if (!boss) return;
            boss.setVelocityY(50);
            boss.health = Math.floor((50 + (this.bossCount * 25)) * this.enemyHealthMultiplier);
            boss.maxHealth = boss.health;
            boss.scoreValue = 500 + (this.bossCount * 250);
            boss.gemType = 'large';
            boss.oscillateTime = 0;
            
            // Create boss health bar
            boss.healthBarBg = this.add.rectangle(boss.x, boss.y - 50, 100, 10, 0x333333);
            boss.healthBarBg.setOrigin(0.5);
            boss.healthBar = this.add.rectangle(boss.x - 50, boss.y - 50, 100, 10, 0x00ff00);
            boss.healthBar.setOrigin(0, 0.5);
            
            console.log('Boss spawned successfully');
        } catch (e) {
            console.error('Error spawning boss:', e);
        }
    }

    spawnPowerup(x, y) {
        // 20% chance for temp powerup (from enemies)
        if (Phaser.Math.Between(0, 4) === 0) {
            const types = ['powerupShield', 'powerupRapid', 'powerupMulti', 'powerupLasers'];
            const type = types[Phaser.Math.Between(0, 3)];
            const powerup = this.powerups.create(x, y, type);
            powerup.setVelocityY(100);
            powerup.powerupType = type;
        }
    }
    
    spawnHealthPickup(x, y) {
        // 5% chance for health pickup (from asteroids)
        if (Phaser.Math.Between(0, 19) === 0) {
            const healthPickup = this.powerups.create(x, y, 'healthPickup');
            healthPickup.setVelocityY(100);
            healthPickup.powerupType = 'healthPickup';
        }
    }
    
    spawnGem(x, y, type) {
        let gem;
        let xpValue;
        
        switch(type) {
            case 'small':
                gem = this.gems.create(x, y, 'gemSmall');
                xpValue = 5;
                break;
            case 'medium':
                gem = this.gems.create(x, y, 'gemMedium');
                xpValue = 15;
                break;
            case 'large':
                gem = this.gems.create(x, y, 'gemLarge');
                xpValue = 50;
                break;
        }
        
        if (gem) {
            gem.xpValue = xpValue;
            gem.setVelocity(Phaser.Math.Between(-20, 20), Phaser.Math.Between(50, 100));
            gem.magnetized = false;
            gem.magnetSpeed = 200;
        }
    }
    
    magnetizeGems() {
        const baseRadius = 100;
        const magnetRadius = baseRadius * (1 + (this.upgrades.magnet * 0.25));
        
        this.gems.children.iterate((gem) => {
            if (gem && gem.active) {
                const dx = this.player.x - gem.x;
                const dy = this.player.y - gem.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // If within magnet radius, mark as magnetized
                if (dist < magnetRadius) {
                    gem.magnetized = true;
                }
                
                // If magnetized, always track toward player and speed up
                if (gem.magnetized) {
                    // Slowly increase speed every frame
                    gem.magnetSpeed = Math.min(gem.magnetSpeed * 1.001, 600);
                    
                    // Always move toward player
                    const speed = gem.magnetSpeed;
                    gem.setVelocity(
                        (dx / dist) * speed,
                        (dy / dist) * speed
                    );
                }
            }
        });
        
        // Also magnetize powerups and health pickups
        this.powerups.children.iterate((powerup) => {
            if (powerup && powerup.active) {
                const dx = this.player.x - powerup.x;
                const dy = this.player.y - powerup.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < magnetRadius) {
                    const speed = 400;
                    powerup.setVelocity(
                        (dx / dist) * speed,
                        (dy / dist) * speed
                    );
                }
            }
        });
    }
    
    collectGem(player, gem) {
        this.xp += gem.xpValue;
        gem.destroy();
        
        // Check for level up
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.xp -= this.xpToNextLevel;
        if (this.xp < 0) this.xp = 0;
        this.playerLevel++;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.2);
        
        if (this.playerLevel > 20) {
            this.xp = Math.min(this.xp, this.xpToNextLevel - 1);
            return;
        }
        
        // Pause game
        this.isPaused = true;
        this.lastPauseTime = this.time.now;
        this.physics.world.pause();
        
        // Show upgrade cards
        this.showUpgradeCards();
    }
    
    showUpgradeCards() {
        // Show background
        this.upgradeBg.setVisible(true);
        this.levelUpText.setVisible(true);
        
        // Generate all available upgrades
        const allUpgrades = [
            { key: 'piercing', name: 'Piercing Rounds', desc: 'Bullets pass through enemies', max: 3 },
            { key: 'drones', name: 'Orbital Drones', desc: 'Drones orbit and fire at enemies', max: 5 },
            { key: 'rear', name: 'Rear Turret', desc: 'Auto-fires behind you', max: 5 },
            { key: 'explosive', name: 'Explosive Rounds', desc: 'Bullets explode on impact', max: 5 },
            { key: 'lightning', name: 'Chain Lightning', desc: 'Lightning arcs to nearby enemies', max: 5 },
            { key: 'vampiric', name: 'Vampiric', desc: 'Heal on kills', max: 3 },
            { key: 'shield', name: 'Shield Battery', desc: '+1 Max Shield', max: 99 },
            { key: 'magnet', name: 'Magnetic Field', desc: 'Increased pickup range', max: 99 },
            { key: 'garlic', name: 'Garlic', desc: 'Damages enemies in aura', max: 5 },
            { key: 'nuke', name: 'Screen Nuke', desc: 'Press Z to clear screen', max: 5 },
            { key: 'clone', name: 'Clone Mirror', desc: 'Clone copies your shots', max: 1 },
            { key: 'giant', name: 'Giant Mode', desc: 'Bigger, stronger, slower', max: 5 },
            { key: 'berserker', name: 'Berserker', desc: 'More damage at low health', max: 3 },
            { key: 'sidecannon', name: 'Side Turret', desc: 'Auto-fires to the side', max: 2 }
        ];
        
        // Check if we're in hard mode with limited slots
        const isHardMode = this.gameMode === 'hard';
        const canPickNewUpgrade = !isHardMode || this.upgradeSlotsUsed < this.maxUpgradeSlots;
        
        // Filter out upgrades that are already at max level
        let availableUpgrades = allUpgrades.filter(u => this.upgrades[u.key] < u.max);
        
        // Side cannon requires rear cannon to be unlocked first
        availableUpgrades = availableUpgrades.filter(u => {
            if (u.key === 'sidecannon') {
                return this.upgrades.rear > 0;
            }
            return true;
        });
        
        // In hard mode, only show upgrades we haven't picked yet (new upgrades take a slot)
        // If slots are full, only show level-ups to existing upgrades
        if (isHardMode) {
            if (canPickNewUpgrade) {
                // Show all available upgrades (both new and level-ups)
                // New upgrades will consume a slot
            } else {
                // Slots full - only show upgrades we've already acquired (level-ups only)
                availableUpgrades = availableUpgrades.filter(u => this.acquiredUpgrades.includes(u.key));
            }
        }
        
        // If no upgrades available, show message
        if (availableUpgrades.length === 0) {
            this.isPaused = false;
            this.pauseTimeOffset = 0;
            this.lastPauseTime = 0;
            this.physics.world.resume();
            this.hideUpgradeCards();
            this.showMessage('All upgrades maxed!', '#ffff00');
            return;
        }
        
        // Shuffle and pick 3 (or fewer if not enough available)
        const shuffled = Phaser.Utils.Array.Shuffle(availableUpgrades);
        
        // Determine how many cards to show
        let selected = shuffled.slice(0, Math.min(3, shuffled.length));
        
        // In hard mode, if fewer than 3 upgrade choices, fill with +50 HP heal cards
        if (isHardMode && selected.length < 3) {
            const healCard = { 
                key: 'heal50', 
                name: '+50 Health', 
                desc: 'Instantly heal 50 HP', 
                max: 99,
                isHeal: true 
            };
            while (selected.length < 3) {
                selected.push(healCard);
            }
        }
        
        // Show cards
        for (let i = 0; i < 3; i++) {
            const card = this.upgradeCards[i];
            
            if (i < selected.length) {
                const upgrade = selected[i];
                
                // Check if this is a new upgrade (takes a slot in hard mode)
                const isNewUpgrade = isHardMode && canPickNewUpgrade && !this.acquiredUpgrades.includes(upgrade.key) && !upgrade.isHeal;
                
                if (upgrade.isHeal) {
                    // Heal card
                    card.upgradeKey = 'heal50';
                    card.bg.setVisible(true);
                    card.bg.setFillStyle(0x00aa00);
                    card.icon.setTexture('healthPickup');
                    card.icon.setVisible(true);
                    card.title.setText(upgrade.name);
                    card.title.setVisible(true);
                    card.description.setText(upgrade.desc);
                    card.description.setVisible(true);
                    card.level.setText('Can pick multiple times');
                    card.level.setVisible(true);
                    card.keyHint.setVisible(true);
                    card.keyHint.setText(`[${i + 1}]`);
                    card.isHealCard = true;
                } else {
                    // Regular upgrade card
                    const currentLevel = this.upgrades[upgrade.key];
                    
                    card.upgradeKey = upgrade.key;
                    card.bg.setVisible(true);
                    card.bg.setFillStyle(isNewUpgrade ? 0x664400 : 0x333333);
                    card.icon.setTexture(`upgrade${upgrade.key.charAt(0).toUpperCase() + upgrade.key.slice(1)}`);
                    card.icon.setVisible(true);
                    card.title.setText(upgrade.name);
                    card.title.setVisible(true);
                    card.description.setText(upgrade.desc);
                    card.description.setVisible(true);
                    card.level.setText(`Current Level: ${currentLevel}${upgrade.max < 99 ? '/' + upgrade.max : ''}`);
                    card.level.setVisible(true);
                    card.keyHint.setVisible(true);
                    card.keyHint.setText(`[${i + 1}]`);
                    card.isHealCard = false;
                    card.isNewUpgrade = isNewUpgrade;
                }
            } else {
                // Hide unused cards
                card.bg.setVisible(false);
                card.icon.setVisible(false);
                card.title.setVisible(false);
                card.description.setVisible(false);
                card.level.setVisible(false);
                card.keyHint.setVisible(false);
                card.upgradeKey = null;
                card.isHealCard = false;
                card.isNewUpgrade = false;
            }
        }
    }
    
    selectUpgrade(index) {
        if (!this.isPaused) return;
        
        const card = this.upgradeCards[index];
        if (!card.upgradeKey) return;
        
        // Handle heal card
        if (card.isHealCard) {
            this.health = Math.min(this.maxHealth, this.health + 50);
            this.showMessage('+50 HP', '#00ff00');
            
            // Hide cards
            this.hideUpgradeCards();
            
            // Resume game
            this.isPaused = false;
            this.pauseTimeOffset += this.time.now - this.lastPauseTime;
            this.physics.world.resume();
            return;
        }
        
        // Apply upgrade
        this.upgrades[card.upgradeKey]++;
        
        // Track order if this is a new upgrade
        if (!this.acquiredUpgrades.includes(card.upgradeKey)) {
            this.acquiredUpgrades.push(card.upgradeKey);
            
            // In hard mode, new upgrades use a slot
            if (this.gameMode === 'hard' && card.isNewUpgrade) {
                this.upgradeSlotsUsed++;
                this.updateSlotsDisplay();
            }
        }
        
        // Apply immediate effects
        if (card.upgradeKey === 'giant') {
            const scale = 1 + (this.upgrades.giant * 0.25);
            this.player.setScale(scale);
        } else if (card.upgradeKey === 'shield') {
            this.shieldActive = true;
            // Create shield visual
            if (!this.shieldCircle) {
                this.shieldCircle = this.add.circle(0, 0, 22);
                this.shieldCircle.setFillStyle(0x000000, 0);
                this.shieldCircle.setStrokeStyle(3, 0x0088ff, 0.8);
            }
            this.shieldCircle.setPosition(this.player.x, this.player.y);
        }
        
        // Hide cards
        this.hideUpgradeCards();
        
        // Resume game
        this.isPaused = false;
        this.pauseTimeOffset += this.time.now - this.lastPauseTime;
        this.physics.world.resume();
    }
    
    updateSlotsDisplay() {
        if (this.slotsText) {
            this.slotsText.setText(`Slots: ${this.upgradeSlotsUsed}/${this.maxUpgradeSlots}`);
        }
    }
    
    hideUpgradeCards() {
        this.upgradeBg.setVisible(false);
        this.levelUpText.setVisible(false);
        
        for (const card of this.upgradeCards) {
            card.bg.setVisible(false);
            card.icon.setVisible(false);
            card.title.setVisible(false);
            card.description.setVisible(false);
            card.level.setVisible(false);
            card.keyHint.setVisible(false);
            card.upgradeKey = null;
        }
    }
    
    togglePause() {
        // Don't pause if game over or level up screen is showing
        if (this.isGameOver || this.upgradeBg.visible) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.lastPauseTime = this.time.now;
            this.physics.world.pause();
            // Show pause text
            if (!this.pauseText) {
                this.pauseText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, 'PAUSED\nPress ESC to resume', {
                    fontSize: '48px',
                    fill: '#ffff00',
                    fontFamily: 'Arial',
                    fontStyle: 'bold',
                    align: 'center'
                }).setOrigin(0.5);
                this.pauseText.setDepth(200);
            }
            this.pauseText.setVisible(true);
        } else {
            // Track accumulated pause time
            this.pauseTimeOffset += this.time.now - this.lastPauseTime;
            this.physics.world.resume();
            if (this.pauseText) {
                this.pauseText.setVisible(false);
            }
        }
    }

    enemyShoot(enemy) {
        const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20, 'enemyBullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(300);
            bullet.setVelocityX((this.player.x - enemy.x) / 10);
        }
    }

    bossShoot(boss) {
        // Determine spread based on boss count (1=3, 2=4, 3+=5)
        let bulletCount = 3;
        if (this.bossCount === 2) {
            bulletCount = 4;
        } else if (this.bossCount >= 3) {
            bulletCount = 5;
        }
        
        const startI = -Math.floor(bulletCount / 2);
        const endI = Math.floor(bulletCount / 2);
        
        for (let i = startI; i <= endI; i++) {
            const bullet = this.enemyBullets.get(boss.x + i * 20, boss.y + 40, 'enemyBullet');
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.setVelocityY(400);
                bullet.setVelocityX(i * 50);
            }
        }
    }

    bulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;
        
        // Deal damage
        const damage = bullet.damage || 1;
        enemy.health -= damage;
        
        // Chain lightning - triggers on hit, not just on death
        if (bullet.chainLightning) {
            const jumps = bullet.lightningJumps || 1;
            const range = bullet.lightningRange || 200;
            this.chainLightning(enemy.x, enemy.y, jumps, range, new Set());
        }
        
        // Piercing
        if (bullet.pierceCount > 0) {
            bullet.pierceCount--;
        } else {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
        
        // Explosive rounds (from bullet property)
        if (bullet.explosive) {
            const radius = bullet.explosiveRadius || 70;
            const explosionDamage = bullet.explosiveDamage || 3;
            this.createExplosion(enemy.x, enemy.y, 15 + (bullet.explosiveDamage || 3) * 2, radius, true);
            
            // Visual ring for explosive impact
            const ring = this.add.circle(enemy.x, enemy.y, radius, 0xff4400, 0.3);
            this.tweens.add({
                targets: ring,
                alpha: 0,
                scale: 1.5,
                duration: 200,
                onComplete: () => ring.destroy()
            });
            
            // Damage nearby enemies
            this.enemies.children.iterate((otherEnemy) => {
                if (otherEnemy && otherEnemy.active && otherEnemy !== enemy) {
                    const dx = otherEnemy.x - enemy.x;
                    const dy = otherEnemy.y - enemy.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < radius) {
                        otherEnemy.health -= explosionDamage;
                        if (otherEnemy.health <= 0) {
                            this.destroyEnemy(otherEnemy, false, null);
                        }
                    }
                }
            });
        }
        
        if (enemy.health <= 0) {
            this.destroyEnemy(enemy, null, bullet);
        }
    }
    
    destroyEnemy(enemy, fromLightning = false, killingBullet = null) {
        this.createExplosion(enemy.x, enemy.y, 5);
        
        // Spawn gem
        if (enemy.gemType) {
            this.spawnGem(enemy.x, enemy.y, enemy.gemType);
        }
        
        // Spawn powerup chance
        this.spawnPowerup(enemy.x, enemy.y);
        
        // Score
        this.score += enemy.scoreValue;
        
        // Vampiric healing - heal per kill
        if (this.upgrades.vampiric > 0) {
            const healAmount = this.upgrades.vampiric; // 1, 2, or 3 HP
            this.health = Math.min(this.maxHealth, this.health + healAmount);
        }
        
        enemy.destroy();
    }
    
    chainLightning(x, y, jumps, radius, hitEnemies) {
        if (jumps <= 0) return;
        
        // Find nearest enemy or asteroid
        let nearest = null;
        let nearestDist = radius;
        let targetType = null;
        
        // Check enemies
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active && !hitEnemies.has(enemy)) {
                const dx = enemy.x - x;
                const dy = enemy.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                    targetType = 'enemy';
                }
            }
        });
        
        // Check asteroids
        this.asteroids.children.iterate((asteroid) => {
            if (asteroid && asteroid.active && !hitEnemies.has(asteroid)) {
                const dx = asteroid.x - x;
                const dy = asteroid.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = asteroid;
                    targetType = 'asteroid';
                }
            }
        });
        
        if (nearest) {
            // Mark as hit to prevent infinite loops
            hitEnemies.add(nearest);
            
            // Draw lightning effect
            const lightning = this.add.graphics();
            lightning.lineStyle(3, 0xffff00);
            lightning.lineBetween(x, y, nearest.x, nearest.y);
            
            // Fade out the lightning line
            this.tweens.add({
                targets: lightning,
                alpha: 0,
                duration: 300,
                onComplete: () => lightning.destroy()
            });
            
            // Damage target
            nearest.health -= 1;
            if (nearest.health <= 0) {
                if (targetType === 'enemy') {
                    this.destroyEnemy(nearest, true); // true = from lightning
                } else {
                    this.destroyAsteroid(nearest, true); // true = from lightning
                }
            }
            
            // Chain to next with delay (150ms between jumps)
            this.time.delayedCall(150, () => {
                this.chainLightning(nearest.x, nearest.y, jumps - 1, radius, hitEnemies);
            });
        }
    }

    bulletHitAsteroid(bullet, asteroid) {
        if (!bullet.active || !asteroid.active) return;
        
        const damage = bullet.damage || 1;
        asteroid.health -= damage;
        
        // Chain lightning - triggers on hit, not just on death
        if (bullet.chainLightning) {
            const jumps = bullet.lightningJumps || 1;
            const range = bullet.lightningRange || 200;
            this.chainLightning(asteroid.x, asteroid.y, jumps, range, new Set());
        }
        
        // Piercing
        if (bullet.pierceCount > 0) {
            bullet.pierceCount--;
        } else {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
        
        // Explosive rounds
        if (bullet.explosive) {
            const radius = bullet.explosiveRadius || 70;
            const explosionDamage = bullet.explosiveDamage || 3;
            this.createExplosion(asteroid.x, asteroid.y, 15 + explosionDamage * 2, radius, true);
            
            // Visual ring for explosive impact
            const ring = this.add.circle(asteroid.x, asteroid.y, radius, 0xff4400, 0.3);
            this.tweens.add({
                targets: ring,
                alpha: 0,
                scale: 1.5,
                duration: 200,
                onComplete: () => ring.destroy()
            });
        }
        
        if (asteroid.health <= 0) {
            this.destroyAsteroid(asteroid, false, bullet);
        }
    }
    
    destroyAsteroid(asteroid, fromLightning = false, killingBullet = null) {
        this.createExplosion(asteroid.x, asteroid.y, 6);
        
        // Spawn gem
        if (asteroid.gemType) {
            this.spawnGem(asteroid.x, asteroid.y, asteroid.gemType);
        }
        
        this.score += asteroid.scoreValue;
        
        // 5% chance for health pickup
        this.spawnHealthPickup(asteroid.x, asteroid.y);
        
        // Vampiric healing - works on asteroids too
        if (this.upgrades.vampiric > 0) {
            const healAmount = this.upgrades.vampiric; // 1, 2, or 3 HP
            this.health = Math.min(this.maxHealth, this.health + healAmount);
        }
        
        asteroid.destroy();
    }

    bulletHitBoss(bullet, boss) {
        if (!bullet.active || !boss.active) return;
        
        const damage = bullet.damage || 1;
        boss.health -= damage;
        
        // Chain lightning - triggers on hit
        if (bullet.chainLightning) {
            const jumps = bullet.lightningJumps || 1;
            const range = bullet.lightningRange || 200;
            this.chainLightning(boss.x, boss.y, jumps, range, new Set());
        }
        
        // Explosive rounds
        if (bullet.explosive) {
            const radius = bullet.explosiveRadius || 70;
            const explosionDamage = bullet.explosiveDamage || 3;
            this.createExplosion(boss.x, boss.y, 15 + explosionDamage * 2, radius, true);
            
            // Visual ring for explosive impact
            const ring = this.add.circle(boss.x, boss.y, radius, 0xff4400, 0.3);
            this.tweens.add({
                targets: ring,
                alpha: 0,
                scale: 1.5,
                duration: 200,
                onComplete: () => ring.destroy()
            });
            
            // Damage nearby enemies
            this.enemies.children.iterate((enemy) => {
                if (enemy && enemy.active) {
                    const dx = enemy.x - boss.x;
                    const dy = enemy.y - boss.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < radius) {
                        enemy.health -= explosionDamage;
                        if (enemy.health <= 0) {
                            this.destroyEnemy(enemy);
                        }
                    }
                }
            });
        }
        
        // Piercing doesn't work on boss
        bullet.setActive(false);
        bullet.setVisible(false);
        
        if (boss.health <= 0) {
            this.createExplosion(boss.x, boss.y, 20);
            
            // Spawn gem
            if (boss.gemType) {
                this.spawnGem(boss.x, boss.y, boss.gemType);
            }
            
            if (boss.healthBarBg) boss.healthBarBg.destroy();
            if (boss.healthBar) boss.healthBar.destroy();
            this.score += boss.scoreValue;
            boss.destroy();
        }
    }

    playerHitEnemy(player, enemy) {
        if (this.godMode) {
            enemy.destroy();
            return;
        }
        
        if (this.shieldActive) {
            this.shieldActive = false;
            if (this.shieldCircle) {
                this.shieldCircle.destroy();
                this.shieldCircle = null;
            }
            this.createExplosion(player.x, player.y);
            enemy.destroy();
            return;
        }
        
        // Skip if invincible
        if (this.isInvincible) {
            return;
        }
        
        // Take damage - 20 HP per enemy hit
        this.takeDamage(20);
        enemy.destroy();
    }
    
    playerHitAsteroid(player, asteroid) {
        if (this.godMode) {
            asteroid.destroy();
            return;
        }
        
        if (this.shieldActive) {
            this.shieldActive = false;
            if (this.shieldCircle) {
                this.shieldCircle.destroy();
                this.shieldCircle = null;
            }
            this.createExplosion(player.x, player.y);
            asteroid.destroy();
            return;
        }
        
        // Skip if invincible
        if (this.isInvincible) {
            return;
        }
        
        // Take damage - 15 HP per asteroid hit
        this.takeDamage(15);
        asteroid.destroy();
    }

    playerHitBoss(player, boss) {
        if (this.godMode) {
            return;
        }
        
        if (this.shieldActive) {
            this.shieldActive = false;
            if (this.shieldCircle) {
                this.shieldCircle.destroy();
                this.shieldCircle = null;
            }
            this.createExplosion(player.x, player.y);
            return;
        }
        
        // Skip if invincible
        if (this.isInvincible) {
            return;
        }
        
        // Take damage - 30 HP per boss contact
        this.takeDamage(30);
    }

    playerHitBullet(player, bullet) {
        if (this.godMode) {
            bullet.destroy();
            return;
        }
        
        if (this.shieldActive) {
            this.shieldActive = false;
            if (this.shieldCircle) {
                this.shieldCircle.destroy();
                this.shieldCircle = null;
            }
            bullet.destroy();
            return;
        }
        
        // Skip if invincible
        if (this.isInvincible) {
            return;
        }
        
        // Take damage - 10 HP per bullet hit
        this.takeDamage(10);
        bullet.destroy();
    }

    takeDamage(amount) {
        this.health -= amount;
        this.cameras.main.shake(200, 0.01);
        
        // Brief invulnerability - flashing effect
        this.isInvincible = true;
        this.player.setAlpha(0.3);
        this.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 100,
            yoyo: true,
            repeat: 9,
            onComplete: () => {
                if (this.player.active) {
                    this.player.setAlpha(1);
                    this.isInvincible = false;
                }
            }
        });
        
        if (this.health <= 0) {
            this.health = 0;
            this.healthText.setText('Health: 0');
            this.gameOver();
        }
    }

    collectPowerup(player, powerup) {
        const type = powerup.powerupType;
        const currentTime = this.time.now;
        
        switch (type) {
            case 'powerupShield':
                this.shieldActive = true;
                // Create shield visual
                if (!this.shieldCircle) {
                    this.shieldCircle = this.add.circle(0, 0, 22);
                    this.shieldCircle.setFillStyle(0x000000, 0);
                    this.shieldCircle.setStrokeStyle(3, 0x0088ff, 0.8);
                }
                this.shieldCircle.x = this.player.x;
                this.shieldCircle.y = this.player.y;
                break;
            case 'powerupRapid':
                this.rapidFireActive = true;
                this.shootCooldown = 150;
                this.rapidFireExpireTime = currentTime + 10000;
                this.showMessage('RAPID FIRE', '#ffff00');
                if (this.rapidFireTimer) this.rapidFireTimer.remove();
                this.rapidFireTimer = this.time.delayedCall(10000, () => {
                    this.rapidFireActive = false;
        this.shootCooldown = 350;
                    this.rapidFireTimer = null;
                });
                break;
            case 'powerupMulti':
                this.multiShotActive = true;
                this.multiShotExpireTime = currentTime + 10000;
                this.showMessage('MULTI SHOT', '#00ff00');
                if (this.multiShotTimer) this.multiShotTimer.remove();
                this.multiShotTimer = this.time.delayedCall(10000, () => {
                    this.multiShotActive = false;
                    this.multiShotTimer = null;
                });
                break;
            case 'powerupLasers':
                this.lasersActive = true;
                this.lasersExpireTime = currentTime + 10000;
                this.showMessage('LASERS', '#00ff00');
                if (this.lasersTimer) this.lasersTimer.remove();
                this.lasersTimer = this.time.delayedCall(10000, () => {
                    this.lasersActive = false;
                    this.lasersTimer = null;
                    // Note: Don't cleanup lasers - let them continue until they go off-screen
                });
                // Fire initial lasers immediately
                this.fireLasers();
                this.lasersLastFireTime = currentTime;
                break;
            case 'healthPickup':
                // Heal 25 HP (capped at max health)
                this.health = Math.min(this.maxHealth, this.health + 25);
                this.showMessage('+25 HP', '#00ff00');
                break;
        }
        
        powerup.destroy();
    }

    createExplosion(x, y, count = 8, radius = 0, isExplosive = false) {
        if (isExplosive) {
            // Explosive bullet impact - bigger, orange/yellow flames
            this.particles.explode(count * 3, x, y);
        } else {
            // Enemy death - smaller, red/orange
            this.particles.explode(count * 5, x, y);
        }
    }

    fireLasers() {
        const speed = 450; // pixels per second
        const totalLength = 240; // laser length in pixels
        const damage = 3;

        // Create two lasers - one up-left, one up-right (45 degree angles)
        const angles = [-Math.PI / 4, -3 * Math.PI / 4]; // -45° and -135°

        for (let i = 0; i < 2; i++) {
            const angle = angles[i];
            
            // Precompute the full bounce path
            const path = this.computeLaserPath(this.player.x, this.player.y, angle, totalLength);
            
            // Create graphics for this laser
            const graphics = this.add.graphics();

            const laser = {
                path: path, // Array of {x, y} points forming the complete path
                totalLength: this.calculatePathLength(path), // Total length of path
                currentLength: 0, // How much of the laser is currently visible
                speed: speed,
                damage: damage,
                hitEnemies: new Set(), // Track which enemies have been hit
                graphics: graphics,
                active: true,
                phase: 'growing', // 'growing', 'lingering', 'fading'
                fadeProgress: 0, // How much has faded from the front
                lingerTimer: 0 // Timer for lingering phase (in seconds)
            };

            this.lasersArray.push(laser);
        }
    }

    computeLaserPath(startX, startY, angle, maxLength) {
        const path = [{ x: startX, y: startY }];
        let currentX = startX;
        let currentY = startY;
        let currentAngle = angle;
        let remainingLength = maxLength;
        let bounces = 0;
        const maxBounces = 5;
        const margin = 5;
        
        while (remainingLength > 0 && bounces < maxBounces) {
            // Calculate direction
            const vx = Math.cos(currentAngle);
            const vy = Math.sin(currentAngle);
            
            // Find distance to nearest wall
            let distToWall = Infinity;
            let hitWall = null;
            
            // Check left wall
            if (vx < 0) {
                const dist = (margin - currentX) / vx;
                if (dist > 0 && dist < distToWall) {
                    distToWall = dist;
                    hitWall = 'left';
                }
            }
            // Check right wall
            if (vx > 0) {
                const dist = (this.gameWidth - margin - currentX) / vx;
                if (dist > 0 && dist < distToWall) {
                    distToWall = dist;
                    hitWall = 'right';
                }
            }
            // Check top wall
            if (vy < 0) {
                const dist = (margin - currentY) / vy;
                if (dist > 0 && dist < distToWall) {
                    distToWall = dist;
                    hitWall = 'top';
                }
            }
            // Check bottom wall
            if (vy > 0) {
                const dist = (this.gameHeight - margin - currentY) / vy;
                if (dist > 0 && dist < distToWall) {
                    distToWall = dist;
                    hitWall = 'bottom';
                }
            }
            
            // If we can't travel the full remaining length
            if (distToWall < remainingLength) {
                // Move to wall
                currentX += vx * distToWall;
                currentY += vy * distToWall;
                remainingLength -= distToWall;
                
                // Add bounce point
                path.push({ x: currentX, y: currentY });
                
                // Reflect angle
                if (hitWall === 'left' || hitWall === 'right') {
                    currentAngle = Math.PI - currentAngle;
                } else {
                    currentAngle = -currentAngle;
                }
                
                bounces++;
            } else {
                // Can reach full length without bouncing
                currentX += vx * remainingLength;
                currentY += vy * remainingLength;
                path.push({ x: currentX, y: currentY });
                remainingLength = 0;
            }
        }
        
        // If we ran out of bounces but still have length, extend to edge
        if (remainingLength > 0) {
            const vx = Math.cos(currentAngle);
            const vy = Math.sin(currentAngle);
            currentX += vx * remainingLength;
            currentY += vy * remainingLength;
            path.push({ x: currentX, y: currentY });
        }
        
        return path;
    }

    calculatePathLength(path) {
        let length = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i-1].x;
            const dy = path[i].y - path[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    updateLasers(time, delta) {
        const dt = delta / 1000; // Convert to seconds

        for (let i = this.lasersArray.length - 1; i >= 0; i--) {
            const laser = this.lasersArray[i];

            if (!laser.active) {
                // Remove inactive lasers
                laser.graphics.destroy();
                this.lasersArray.splice(i, 1);
                continue;
            }

            if (laser.phase === 'growing') {
                // Growing phase - laser extending from ship
                laser.currentLength += laser.speed * dt;
                
                if (laser.currentLength >= laser.totalLength) {
                    laser.currentLength = laser.totalLength;
                    laser.phase = 'lingering'; // Switch to lingering phase
                    laser.lingerTimer = 2.0; // Linger for 2 seconds fully visible
                }
            } else if (laser.phase === 'lingering') {
                // Lingering phase - laser fully visible
                laser.lingerTimer -= dt;
                
                if (laser.lingerTimer <= 0) {
                    laser.phase = 'fading'; // Start fade out phase
                }
            } else if (laser.phase === 'fading') {
                // Fading phase - laser retracting (tail leaving screen)
                laser.fadeProgress += laser.speed * dt;
                
                // Check if laser is fully off-screen
                if (laser.fadeProgress >= laser.totalLength) {
                    laser.active = false;
                    laser.graphics.destroy();
                    this.lasersArray.splice(i, 1);
                    continue;
                }
            }

            // Check collisions with enemies/asteroids/boss
            this.checkLaserCollisions(laser);

            // Draw the laser
            this.drawLaser(laser);
        }
    }

    drawLaser(laser) {
        const graphics = laser.graphics;
        graphics.clear();

        // Calculate visible portion of the path
        const startDist = laser.fadeOut ? laser.fadeProgress : 0;
        const endDist = laser.fadeOut ? laser.totalLength : laser.currentLength;
        
        const visiblePath = this.getPathSegment(laser.path, startDist, endDist);
        
        if (visiblePath.length < 2) return;

        // Draw gradient line
        // Outer glow (darker green) - 12px
        graphics.lineStyle(12, 0x00aa00, 0.6);
        graphics.beginPath();
        graphics.moveTo(visiblePath[0].x, visiblePath[0].y);
        for (let i = 1; i < visiblePath.length; i++) {
            graphics.lineTo(visiblePath[i].x, visiblePath[i].y);
        }
        graphics.strokePath();

        // Middle layer - 8px
        graphics.lineStyle(8, 0x00dd00, 0.8);
        graphics.beginPath();
        graphics.moveTo(visiblePath[0].x, visiblePath[0].y);
        for (let i = 1; i < visiblePath.length; i++) {
            graphics.lineTo(visiblePath[i].x, visiblePath[i].y);
        }
        graphics.strokePath();

        // Core (bright green) - 4px
        graphics.lineStyle(4, 0xccffcc, 1);
        graphics.beginPath();
        graphics.moveTo(visiblePath[0].x, visiblePath[0].y);
        for (let i = 1; i < visiblePath.length; i++) {
            graphics.lineTo(visiblePath[i].x, visiblePath[i].y);
        }
        graphics.strokePath();
    }

    getPathSegment(path, startDist, endDist) {
        const result = [];
        let currentDist = 0;
        
        // Find start point
        let startPoint = null;
        let startIndex = 0;
        let startT = 0;
        
        for (let i = 0; i < path.length - 1; i++) {
            const dx = path[i+1].x - path[i].x;
            const dy = path[i+1].y - path[i].y;
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            if (currentDist + segLength >= startDist) {
                // Start is on this segment
                const t = (startDist - currentDist) / segLength;
                startPoint = {
                    x: path[i].x + dx * t,
                    y: path[i].y + dy * t
                };
                startIndex = i;
                startT = t;
                break;
            }
            
            currentDist += segLength;
        }
        
        if (!startPoint) {
            // Start is past the end of path
            return result;
        }
        
        result.push(startPoint);
        
        // Add intermediate points
        currentDist = startDist;
        for (let i = startIndex; i < path.length - 1; i++) {
            const dx = path[i+1].x - path[i].x;
            const dy = path[i+1].y - path[i].y;
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            // If this is the first segment after start, account for partial segment
            if (i === startIndex && startT > 0) {
                const remainingLength = segLength * (1 - startT);
                if (currentDist + remainingLength >= endDist) {
                    // End is on this segment
                    const t = startT + (endDist - currentDist) / segLength;
                    result.push({
                        x: path[i].x + dx * t,
                        y: path[i].y + dy * t
                    });
                    return result;
                }
                currentDist += remainingLength;
                result.push(path[i+1]);
            } else {
                if (currentDist + segLength >= endDist) {
                    // End is on this segment
                    const t = (endDist - currentDist) / segLength;
                    result.push({
                        x: path[i].x + dx * t,
                        y: path[i].y + dy * t
                    });
                    return result;
                }
                currentDist += segLength;
                result.push(path[i+1]);
            }
        }
        
        return result;
    }

    checkLaserCollisions(laser) {
        // Get visible portion of path for collision detection
        const startDist = laser.fadeOut ? laser.fadeProgress : 0;
        const endDist = laser.fadeOut ? laser.totalLength : laser.currentLength;
        
        // Check each segment of the visible path against enemies/asteroids/boss
        let currentDist = 0;
        
        for (let i = 0; i < laser.path.length - 1; i++) {
            const p1 = laser.path[i];
            const p2 = laser.path[i+1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segLength = Math.sqrt(dx * dx + dy * dy);
            
            // Check if this segment is within the visible range
            const segStart = currentDist;
            const segEnd = currentDist + segLength;
            
            if (segEnd < startDist || segStart > endDist) {
                // Segment is outside visible range
                currentDist += segLength;
                continue;
            }
            
            // Calculate visible portion of this segment
            const visibleStartT = Math.max(0, (startDist - segStart) / segLength);
            const visibleEndT = Math.min(1, (endDist - segStart) / segLength);
            
            const start = {
                x: p1.x + dx * visibleStartT,
                y: p1.y + dy * visibleStartT
            };
            const end = {
                x: p1.x + dx * visibleEndT,
                y: p1.y + dy * visibleEndT
            };
            
            // Check against enemies
            this.enemies.children.iterate((enemy) => {
                if (enemy && enemy.active && !laser.hitEnemies.has(enemy)) {
                    if (this.lineIntersectsCircle(start, end, enemy, 16)) {
                        enemy.health -= laser.damage;
                        laser.hitEnemies.add(enemy);
                        this.createLaserHitVFX(enemy.x, enemy.y);

                        if (enemy.health <= 0) {
                            this.destroyEnemy(enemy);
                        }
                    }
                }
            });

            // Check against asteroids
            this.asteroids.children.iterate((asteroid) => {
                if (asteroid && asteroid.active && !laser.hitEnemies.has(asteroid)) {
                    if (this.lineIntersectsCircle(start, end, asteroid, 16)) {
                        asteroid.health -= laser.damage;
                        laser.hitEnemies.add(asteroid);
                        this.createLaserHitVFX(asteroid.x, asteroid.y);

                        if (asteroid.health <= 0) {
                            this.destroyAsteroid(asteroid);
                        }
                    }
                }
            });

            // Check against boss
            this.boss.children.iterate((boss) => {
                if (boss && boss.active && !laser.hitEnemies.has(boss)) {
                    if (this.lineIntersectsCircle(start, end, boss, 40)) {
                        boss.health -= laser.damage;
                        laser.hitEnemies.add(boss);
                        this.createLaserHitVFX(boss.x, boss.y);

                        if (boss.health <= 0) {
                            this.createExplosion(boss.x, boss.y, 20);
                            if (boss.gemType) {
                                this.spawnGem(boss.x, boss.y, boss.gemType);
                            }
                            if (boss.healthBarBg) boss.healthBarBg.destroy();
                            if (boss.healthBar) boss.healthBar.destroy();
                            this.score += boss.scoreValue;
                            boss.destroy();
                        }
                    }
                }
            });
            
            currentDist += segLength;
        }
    }

    lineIntersectsCircle(tail, head, circle, radius) {
        // Check if line segment intersects circle
        const x1 = tail.x;
        const y1 = tail.y;
        const x2 = head.x;
        const y2 = head.y;
        const cx = circle.x;
        const cy = circle.y;
        
        // Vector from tail to head
        const dx = x2 - x1;
        const dy = y2 - y1;
        
        // Vector from tail to circle center
        const fx = x1 - cx;
        const fy = y1 - cy;
        
        // Quadratic equation coefficients
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = (fx * fx + fy * fy) - radius * radius;
        
        // Discriminant
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
            return false;
        }
        
        // Check if intersection points are within line segment
        const discriminantSqrt = Math.sqrt(discriminant);
        const t1 = (-b - discriminantSqrt) / (2 * a);
        const t2 = (-b + discriminantSqrt) / (2 * a);
        
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    }

    createLaserHitVFX(x, y) {
        // Small green particle burst at hit location
        const particles = this.add.particles(0, 0, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 300,
            tint: 0x00ff00
        });
        particles.explode(5, x, y);
        
        // Auto-destroy after animation
        this.time.delayedCall(400, () => {
            particles.destroy();
        });
    }

    cleanupLasers() {
        // Destroy all active lasers
        for (const laser of this.lasersArray) {
            if (laser.graphics) {
                laser.graphics.destroy();
            }
        }
        this.lasersArray = [];
    }

    resetPlayer() {
        this.player.setPosition(this.gameWidth / 2, this.gameHeight - 100);
        this.player.setVelocity(0);
        this.shieldActive = false;
        this.rapidFireActive = false;
        this.multiShotActive = false;
        if (this.rapidFireTimer) {
            this.rapidFireTimer.remove();
            this.rapidFireTimer = null;
        }
        if (this.multiShotTimer) {
            this.multiShotTimer.remove();
            this.multiShotTimer = null;
        }
        this.rapidFireExpireTime = 0;
        this.multiShotExpireTime = 0;
        this.lasersExpireTime = 0;
        this.shootCooldown = 350;

        // Cleanup lasers
        this.lasersActive = false;
        if (this.lasersTimer) {
            this.lasersTimer.remove();
            this.lasersTimer = null;
        }
        this.cleanupLasers();
        
        // Brief invulnerability - flashing effect
        this.player.setAlpha(0.3);
        this.tweens.add({
            targets: this.player,
            alpha: 1,
            duration: 150,
            yoyo: true,
            repeat: 13,
            onComplete: () => {
                if (this.player.active) {
                    this.player.setAlpha(1);
                }
            }
        });
    }

    cleanupObjects() {
        // Clean up bullets
        this.bullets.children.iterate((bullet) => {
            if (bullet && bullet.active && (bullet.y < -10 || bullet.y > this.gameHeight + 10)) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        // Clean up enemy bullets
        this.enemyBullets.children.iterate((bullet) => {
            if (bullet && bullet.active && (bullet.y < -10 || bullet.y > this.gameHeight + 10)) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });

        // Clean up asteroids
        this.asteroids.children.iterate((asteroid) => {
            if (asteroid && asteroid.y > this.gameHeight + 50) {
                asteroid.destroy();
            }
        });

        // Clean up powerups
        this.powerups.children.iterate((powerup) => {
            if (powerup && powerup.y > this.gameHeight + 50) {
                powerup.destroy();
            }
        });
        
        // Clean up gems
        this.gems.children.iterate((gem) => {
            if (gem && gem.y > this.gameHeight + 50) {
                gem.destroy();
            }
        });
    }

    updateUI() {
        this.scoreText.setText('Score: ' + this.score);
        this.healthText.setText('Health: ' + this.health);
        this.levelText.setText('Level: ' + this.playerLevel);
        
        // Update XP bar
        if (this.playerLevel >= 20) {
            this.xpBar.width = 400;
            this.xpText.setText('XP: MAX');
        } else {
            const xpPercent = this.xp / this.xpToNextLevel;
            this.xpBar.width = 400 * xpPercent;
            this.xpText.setText(`XP: ${this.xp}/${this.xpToNextLevel}`);
        }
        
        // Active powerups with countdown timers
        const currentTime = this.time.now;
        
        if (this.rapidFireActive) {
            const rapidTimeLeft = Math.ceil((this.rapidFireExpireTime - currentTime) / 1000);
            this.rapidText.setText(`RAPID ${rapidTimeLeft}s`);
        } else {
            this.rapidText.setText('');
        }
        
        if (this.multiShotActive) {
            const multiTimeLeft = Math.ceil((this.multiShotExpireTime - currentTime) / 1000);
            this.multiText.setText(`MULTI ${multiTimeLeft}s`);
        } else {
            this.multiText.setText('');
        }

        if (this.lasersActive) {
            const lasersTimeLeft = Math.ceil((this.lasersExpireTime - currentTime) / 1000);
            this.lasersText.setText(`LASERS ${lasersTimeLeft}s`);
        } else {
            this.lasersText.setText('');
        }

        // Upgrade levels (dynamic list from top to bottom)
        // First, destroy texts for upgrades that are now 0
        for (const key of Object.keys(this.upgradeTexts)) {
            if (this.upgrades[key] <= 0) {
                if (this.upgradeTexts[key]) {
                    this.upgradeTexts[key].destroy();
                }
                delete this.upgradeTexts[key];
            }
        }
        
        // Now rebuild the list - iterate in acquisition order
        let yPos = 140;
        for (const key of this.acquiredUpgrades) {
            const value = this.upgrades[key];
            if (value > 0) {
                let displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                // Special case for rear and sidecannon
                if (key === 'rear') displayKey = 'Rear Turret';
                if (key === 'sidecannon') displayKey = 'Side Turret';
                if (!this.upgradeTexts[key]) {
                    // Create new text for this upgrade
                    this.upgradeTexts[key] = this.add.text(this.gameWidth - 20, yPos, `${displayKey}: ${value}`, {
                        fontSize: '14px',
                        fill: '#aaaaaa',
                        fontFamily: 'Arial',
                        fontStyle: 'bold'
                    }).setOrigin(1, 0);
                } else {
                    // Update existing text and position
                    this.upgradeTexts[key].setText(`${displayKey}: ${value}`);
                    this.upgradeTexts[key].y = yPos;
                }
                yPos += 20;
            }
        }
    }

    gameOver() {
        this.isGameOver = true;
        
        // Create player explosion
        this.createExplosion(this.player.x, this.player.y, 20);
        this.player.destroy();
        
        // Cleanup garlic aura
        if (this.garlicAura) {
            this.garlicAura.destroy();
            this.garlicAura = null;
        }
        
        // Cleanup berserker aura
        if (this.berserkerAura) {
            this.berserkerAura.destroy();
            this.berserkerAura = null;
        }
        
        // Cleanup shield circle
        if (this.shieldCircle) {
            this.shieldCircle.destroy();
            this.shieldCircle = null;
        }

        // Cleanup lasers
        this.lasersActive = false;
        if (this.lasersTimer) {
            this.lasersTimer.remove();
            this.lasersTimer = null;
        }
        this.cleanupLasers();
        
        const gameOverText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const finalScoreText = this.add.text(this.gameWidth / 2, this.gameHeight / 2 + 60, 
            'Final Score: ' + this.score, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(this.gameWidth / 2, this.gameHeight / 2 + 120, 
            'Press R to restart', {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start('IntroScene');
        });
    }
}

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