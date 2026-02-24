
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.gameMode = data.gameMode || 'normal';
        this.shipShape = data.shipShape || 0;
        this.shipColor = data.shipColor || 0x00aaff;
        this.engineColor = data.engineColor || 0xff6600;
        this.weaponType = data.weaponType || 0;
        this.score = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.playerLevel = 1;
        this.bossCount = 0;
        this.godMode = false;
        this.isGameOver = false;
        this.isPaused = false;
        this.pauseText = null;
        
        // XP System
        this.xp = 0;
        this.xpToNextLevel = 100;
        
        // Powerup timers
        this.rapidFireActive = false;
        this.multiShotActive = false;
        this.shieldStacks = 1;
        this.maxShieldStacks = 1;
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
        this.shootCooldown = WEAPON_DEFS[this.weaponType].baseCooldown;
        
        // Enemy spawn timers
        this.lastEnemySpawn = 0;
        this.lastAsteroidSpawn = 0;
        this.enemySpawnRate = 2000;
        this.asteroidSpawnRate = 1500;
        
        // Enemy scaling - mode specific
        this.gameStartTime = 0;
        this.lastSpawnIncreaseTime = 0;
        this.lastAsteroidHpIncrease = 0;
        this.baseBossHp = 50;
        this.baseAsteroidHp = 2;
        this.pauseTimeOffset = 0;
        
        // Mode-specific settings
        if (this.gameMode === 'hard') {
            this.spawnIncreaseInterval = 45000; // 45 seconds
            this.maxUpgradeSlots = 5;
            this.spawnRateCap = 50; // Minimum spawn interval
        } else {
            this.spawnIncreaseInterval = 60000; // 60 seconds
            this.maxUpgradeSlots = 999; // Unlimited
            this.spawnRateCap = 200; // Minimum spawn interval
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
        
        // Vampiric cooldown
        this.lastVampiricHealTime = 0;

        // Shield hit invincibility
        this.lastShieldHitTime = 0;

        // Shield regen
        this.lastShieldRegenTime = 0;

        // Flood mode (post-boss-3)
        this.floodMode = false;
        this.floodModeStartTime = 0;
        this.floodHealthMultiplier = 1;
        this.lastFloodHealthDouble = 0;

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

        // Create player texture based on customization
        this.createPlayerTexture(this.shipShape, this.shipColor, this.engineColor);

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
        this.waveBullets = new Map();

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
        
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.input.keyboard.on('keydown-ESC', () => this.togglePause());

        this.setupDebugControls();

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

    createPlayerTexture(shapeIndex, shipColor, engineColor) {
        if (this.textures.exists('player')) {
            this.textures.remove('player');
        }
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        drawShipShape(graphics, shapeIndex, shipColor, engineColor);
        graphics.generateTexture('player', 32, 32);

        // Also create clone ship with same shape but green
        const cloneGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        drawShipShape(cloneGraphics, shapeIndex, 0x00ff00, 0xffff00, { cockpitColor: 0x88ff88 });
        cloneGraphics.generateTexture('cloneShip', 32, 32);
    }

    createPlayer() {
        const startX = this.gameWidth / 2;
        const startY = this.gameHeight - 100;
        
        this.player = this.physics.add.sprite(startX, startY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(5, 11, 10);
        
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

    setupDebugControls() {
        // God mode (P key)
        this.pKey.on('down', () => {
            this.godMode = !this.godMode;
            this.showMessage(this.godMode ? 'GOD MODE ON' : 'GOD MODE OFF', this.godMode ? '#ffff00' : '#ffffff');
        });

        // Add score (O key)
        this.oKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.oKey.on('down', () => {
            this.score += 500;
            this.showMessage('+500 SCORE', '#ffff00');
        });

        // Instant level up button (invisible, bottom left)
        const debugButton = this.add.text(60, this.gameHeight - 30, '', {
            fontSize: '16px', fill: '#ffff00', fontFamily: 'Arial', fontStyle: 'bold',
            backgroundColor: 'rgba(0,0,0,0)', padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        debugButton.on('pointerdown', () => this.levelUp());
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
        
        // Timer text
        this.timerText = this.add.text(this.gameWidth / 2, 55, 'Time: 0:00', {
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
        
        // Shield stacks indicator (bottom right, shifts left if nuke exists)
        this.shieldIcon = this.add.image(this.gameWidth - 40, this.gameHeight - 40, 'upgradeShield');
        this.shieldIcon.setScale(1.5);
        this.shieldIcon.setVisible(false);
        this.shieldStackText = this.add.text(this.gameWidth - 40, this.gameHeight - 20, '', {
            fontSize: '16px',
            fill: '#00ffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.shieldStackText.setVisible(false);

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

        // Set all UI elements above game objects
        const uiDepth = 100;
        [this.scoreText, this.healthText, this.levelText, this.xpBarBg, this.xpBar, this.xpText,
         this.timerText, this.rapidText, this.multiText, this.lasersText,
         this.nukeIcon, this.nukeCooldownText, this.shieldIcon, this.shieldStackText,
         this.slotsText].forEach(el => {
            if (el) el.setDepth(uiDepth);
        });
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

    getGameTime() {
        return this.time.now - (this.pauseTimeOffset || 0);
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

        // Update timer display
        const elapsed = time - this.gameStartTime - (this.pauseTimeOffset || 0);
        const totalSeconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);

        // Update enemy scaling
        this.updateEnemyScaling(time);

        // Shield regen
        this.updateShieldRegen();

        // Update starfield
        this.stars.children.iterate((star) => {
            star.y += star.speed;
            if (star.y > this.gameHeight) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, this.gameWidth);
            }
        });

        // Player movement
        const giantSpeeds = [300, 275, 245, 215, 185, 155];
        const speed = giantSpeeds[this.upgrades.giant] || 155;
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
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.spaceKey.isDown || this.input.activePointer.isDown) {
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

        this.updateGarlicAura();

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

        // Spawn boss - 3 bosses at 1000, 5000, 10000 points
        const bossThresholds = [1000, 5000, 10000];
        if (this.bossCount < 3 && this.score >= bossThresholds[this.bossCount] && (!this.boss || this.boss.countActive(true) === 0)) {
            console.log('Attempting to spawn boss, score:', this.score);
            this.spawnBoss();
        }

        // Enemy AI
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active) {
                // Elite enemies shoot in bursts
                if (enemy.isElite) {
                    const now = this.getGameTime();
                    const bulletsPerBurst = enemy.bulletsPerBurst || 3;
                    
                    if (enemy.isBurstShooting) {
                        // In the middle of a burst - fire remaining shots with delay
                        if (enemy.burstCount < bulletsPerBurst && now >= enemy.nextBurstShot) {
                            this.enemyShoot(enemy);
                            enemy.burstCount++;
                            enemy.nextBurstShot = now + (enemy.enemyType === 'pulsingPurple' ? 300 : 200);
                        } else if (enemy.burstCount >= bulletsPerBurst) {
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
                // Boss shoots once per second
                const now = this.getGameTime();
                if (!boss.lastShotTime) boss.lastShotTime = now;
                if (now >= boss.lastShotTime + 1000) {
                    this.bossShoot(boss);
                    boss.lastShotTime = now;
                }
                
                // Boss moves side to side using velocity (not time-based position)
                // Use sine wave to oscillate velocity - amplitude increases with each boss
                if (!boss.oscillateTime) boss.oscillateTime = 0;
                boss.oscillateTime += delta;
                
                // Scale amplitude with boss count (150 base, +50 per boss, capped at screen bounds)
                const baseAmplitude = 150;
                const amplitudeIncrement = 75;
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

        // Update shield stacks indicator
        if (this.maxShieldStacks > 0) {
            this.shieldIcon.setVisible(true);
            this.shieldStackText.setVisible(true);
            this.shieldStackText.setText(`${this.shieldStacks}/${this.maxShieldStacks}`);
            this.shieldIcon.setAlpha(0.3);
            // Position: shift left if nuke is visible
            const hasNuke = this.upgrades.nuke > 0;
            const shieldX = hasNuke ? this.gameWidth - 100 : this.gameWidth - 40;
            this.shieldIcon.setPosition(shieldX, this.gameHeight - 40);
            this.shieldStackText.setPosition(shieldX, this.gameHeight - 20);
        }

        // Check game over
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    updateGarlicAura() {
        if (this.upgrades.garlic <= 0 || !this.player.active) {
            if (this.garlicAura) {
                this.garlicAura.destroy();
                this.garlicAura = null;
            }
            return;
        }

        const auraRadius = 40 + (this.upgrades.garlic * 25);
        const damagePerTick = (1 + this.upgrades.garlic) * this.getGiantMultiplier();

        if (!this.garlicAura) {
            this.garlicAura = this.add.circle(this.player.x, this.player.y, auraRadius, 0x9966ff, 0.2);
        } else {
            this.garlicAura.setRadius(auraRadius);
        }

        const gameTime = this.getGameTime();
        if (gameTime - this.garlicLastDamageTime > 500) {
            const damageInRange = (group, onKill) => {
                group.children.iterate((target) => {
                    if (!target || !target.active) return;
                    const dx = target.x - this.player.x;
                    const dy = target.y - this.player.y;
                    if (Math.sqrt(dx * dx + dy * dy) < auraRadius) {
                        target.health -= damagePerTick;
                        if (target.health <= 0) onKill(target);
                    }
                });
            };

            damageInRange(this.enemies, (e) => this.destroyEnemy(e));
            damageInRange(this.asteroids, (a) => this.destroyAsteroid(a, false, null));
            damageInRange(this.boss, (b) => this.destroyBoss(b));
            this.garlicLastDamageTime = gameTime;
        }
    }

    updateShieldRegen() {
        if (this.upgrades.shield <= 0 || this.shieldStacks >= this.maxShieldStacks) return;
        const gameTime = this.getGameTime();
        // Regen intervals: level 1=10s, 2=5s, 3=4s, 4=3s, 5=2s
        const regenIntervals = [0, 10000, 5000, 4000, 3000, 2000];
        const interval = regenIntervals[this.upgrades.shield] || 2000;
        if (gameTime - this.lastShieldRegenTime >= interval) {
            this.shieldStacks++;
            this.shieldActive = true;
            this.lastShieldRegenTime = gameTime;
            this.activateShieldVisual();
        }
    }

    activateShieldVisual() {
        if (!this.shieldCircle) {
            this.shieldCircle = this.add.circle(0, 0, 22);
            this.shieldCircle.setFillStyle(0x000000, 0);
        }
        this.updateShieldVisual();
        this.shieldCircle.setPosition(this.player.x, this.player.y);
    }

    updateShieldVisual() {
        if (!this.shieldCircle) return;
        // Thicker stroke and brighter color with more stacks
        const thickness = 2 + this.shieldStacks;
        const alpha = Math.min(0.4 + this.shieldStacks * 0.15, 1);
        this.shieldCircle.setStrokeStyle(thickness, 0x0088ff, alpha);
    }

    updateEnemyScaling(time) {
        const elapsed = time - this.gameStartTime - (this.pauseTimeOffset || 0);

        // Flood mode: double enemy health every 15 seconds
        if (this.floodMode) {
            const gameTime = this.getGameTime();
            if (gameTime - this.lastFloodHealthDouble >= 12000) {
                this.floodHealthMultiplier *= 2;
                this.lastFloodHealthDouble = gameTime;
            }
        }

        // Spawn rate increases every mode-specific interval (skipped in flood mode)
        if (!this.floodMode && elapsed - this.lastSpawnIncreaseTime >= this.spawnIncreaseInterval) {
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
        
        // Asteroid HP increases every 1000 score points
        if (this.score >= this.lastAsteroidHpIncrease + 1000) {
            this.baseAsteroidHp += 1;
            this.lastAsteroidHpIncrease = this.score;
        }
    }
    
    getGiantMultiplier() {
        return 1 + (this.upgrades.giant * 0.25);
    }

    getDamageMultiplier() {
        let mult = 1 + (this.upgrades.giant * 0.25);
        if (this.upgrades.berserker > 0) {
            const healthPercent = this.health / this.maxHealth;
            let berserkerBonus = 0;
            if (healthPercent <= 0.8) berserkerBonus += 0.25;
            if (healthPercent <= 0.6) berserkerBonus += 0.25;
            if (healthPercent <= 0.4) berserkerBonus += 0.25;
            if (healthPercent <= 0.2) berserkerBonus += 0.25;
            mult += berserkerBonus * this.upgrades.berserker;
        }
        return mult;
    }

    handleExplosiveRound(bullet, x, y, excludeTarget = null) {
        if (!bullet.explosive) return;
        const radius = bullet.explosiveRadius || 70;
        const explosionDamage = (bullet.explosiveDamage || 3) * this.getGiantMultiplier();
        this.createExplosion(x, y, 15 + explosionDamage * 2, radius, true);

        const ring = this.add.circle(x, y, radius, 0xff4400, 0.3);
        this.tweens.add({
            targets: ring,
            alpha: 0,
            scale: 1.5,
            duration: 200,
            onComplete: () => ring.destroy()
        });

        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active && enemy !== excludeTarget) {
                const dx = enemy.x - x;
                const dy = enemy.y - y;
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

    addPulsingAnimation(target) {
        this.tweens.add({
            targets: target,
            alpha: 0.3,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
        const tintObj = { value: 1 };
        this.tweens.add({
            targets: tintObj,
            value: 0,
            duration: 300,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                if (!target.active) return;
                const tintValue = Phaser.Display.Color.ObjectToColor({
                    r: Math.floor(tintObj.value * 255),
                    g: 255,
                    b: 255
                }).color;
                target.setTint(tintValue);
            }
        });
    }

    shoot() {
        const x = this.player.x;
        const y = this.player.y - 20;
        const damageMult = this.getDamageMultiplier();
        const weapon = WEAPON_DEFS[this.weaponType];

        // Fire weapon from player position(s)
        this.fireWeaponPattern(x, y, damageMult, weapon);

        // Clone shots - clones copy player's weapon and temp upgrades
        this.clones.children.iterate((clone) => {
            if (clone && clone.active) {
                this.fireWeaponPattern(clone.x, clone.y - 20, damageMult, weapon);
            }
        });
    }

    fireWeaponPattern(x, y, damageMult, weapon) {
        // Determine fire positions (single or multi-shot powerup)
        let firePositions;
        if (this.multiShotActive) {
            firePositions = [
                { x: x - 25, vxBase: -100 },
                { x: x,      vxBase: 0 },
                { x: x + 25, vxBase: 100 },
            ];
        } else {
            firePositions = [{ x: x, vxBase: 0 }];
        }

        // Fire weapon pattern from each position
        for (const pos of firePositions) {
            if (weapon.spread) {
                for (const s of weapon.spread) {
                    this.createBullet(
                        pos.x + s.xOffset, y,
                        pos.vxBase + s.vx, -weapon.bulletSpeed,
                        damageMult
                    );
                }
            } else {
                this.createBullet(pos.x, y, pos.vxBase, -weapon.bulletSpeed, damageMult);
            }
        }
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
            bullet.lightningRange = 150 + (this.upgrades.lightning * 50); // 200, 250, or 300

            // Weapon range limit
            const weapon = WEAPON_DEFS[this.weaponType];
            if (weapon.maxRange) {
                bullet.spawnY = y;
                bullet.maxRange = weapon.maxRange;
            } else {
                bullet.maxRange = 0;
            }
        }
    }
    
    fireRearTurret() {
        const x = this.player.x;
        const y = this.player.y + 20;
        const damageMult = this.getDamageMultiplier();
        
        this.createBullet(x, y, 0, 500, damageMult);
    }
    
    fireSideCannons() {
        const damageMult = this.getDamageMultiplier();
        
        const y = this.player.y;
        
        // Level 1: Left cannon only
        // Level 2: Left and right cannons
        const leftX = this.player.x - 20;
        const rightX = this.player.x + 20;
        
        // Fire left cannon (always fires at level 1)
        this.createBullet(leftX, y, -500, 0, damageMult);

        // Fire right cannon (only at level 2)
        if (this.upgrades.sidecannon >= 2) {
            this.createBullet(rightX, y, 500, 0, damageMult);
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
        const droneDamageMult = this.getDamageMultiplier();
        this.drones.children.iterate((drone) => {
            if (drone && drone.active) {
                // Orbit around player
                drone.orbitAngle += 0.02;
                drone.x = this.player.x + Math.cos(drone.orbitAngle) * drone.orbitRadius;
                drone.y = this.player.y + Math.sin(drone.orbitAngle) * drone.orbitRadius;
                
                // Fire outward
                if (time % 500 < 20) {
                    const angle = drone.orbitAngle;
                    this.createBullet(drone.x, drone.y, Math.cos(angle) * 300, Math.sin(angle) * 300, droneDamageMult);
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
            this.spawnGem(enemy.x, enemy.y, enemy.gemType, enemy.gemXp);
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
                boss.health -= 25 * this.getGiantMultiplier();
                if (boss.health <= 0) {
                    this.destroyBoss(boss);
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

    createFloodModeText() {
        this.floodText = this.add.text(this.gameWidth / 2, this.gameHeight / 2 - 80, 'BONUS WAVES!!!', {
            fontSize: '48px',
            fill: '#ff4444',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0).setDepth(1000);

        this.tweens.add({
            targets: this.floodText,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.8, to: 1.1 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(20, this.gameWidth - 20);
        const typeName = getSpawnType(this.score);
        const def = ENEMY_TYPES[typeName];

        const spawnY = def.elite ? -40 : -20;
        const enemy = this.enemies.create(x, spawnY, def.texture);
        enemy.health = this.gameMode === 'hard' ? def.hardHealth : def.health;
        if (this.floodMode) enemy.health *= this.floodHealthMultiplier;
        enemy.maxHealth = enemy.health;
        enemy.scoreValue = def.score;
        enemy.gemType = def.gem;
        enemy.gemXp = def.gemXp;
        enemy.isElite = def.elite;
        if (def.damage) enemy.bulletDamage = def.damage;
        if (def.burstOverride) enemy.bulletsPerBurst = def.burstOverride;
        enemy.enemyType = typeName;
        enemy.body.setCircle(def.radius);
        if (def.pulsing) this.addPulsingAnimation(enemy);

        enemy.lastShotTime = this.getGameTime() + 2000;
        enemy.isBurstShooting = false;
        enemy.burstCount = 0;

        const vy = def.elite ? Phaser.Math.Between(100, 150) : Phaser.Math.Between(80, 120);
        enemy.setVelocityY(vy);
        if (def.elite) {
            const direction = this.player.x > x ? 1 : -1;
            enemy.setVelocityX(direction * Phaser.Math.Between(30, 50));
        } else {
            enemy.setVelocityX(Phaser.Math.Between(-20, 20));
        }
    }
    
    spawnAsteroid() {
        const x = Phaser.Math.Between(20, this.gameWidth - 20);
        const asteroid = this.asteroids.create(x, -20, 'asteroid');
        asteroid.setVelocityY(Phaser.Math.Between(50, 100));
        asteroid.setVelocityX(Phaser.Math.Between(-20, 20));
        asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50));
        asteroid.health = this.baseAsteroidHp;
        asteroid.scoreValue = 5;
        asteroid.gemType = 'small';
        asteroid.body.setCircle(15);
    }
    
    spawnBoss() {
        try {
            this.bossCount++;
            
            let bossTexture = 'boss';
            let bossHealth = 100;
            let bossScore = 500;
            
            if (this.bossCount === 1) {
                bossTexture = 'boss';
                bossHealth = this.gameMode === 'hard' ? 150 : 100;
                bossScore = 500;
            } else if (this.bossCount === 2) {
                bossTexture = 'bossDark';
                bossHealth = this.gameMode === 'hard' ? 600 : 500;
                bossScore = 2000;
            } else if (this.bossCount === 3) {
                bossTexture = 'bossPulsing';
                bossHealth = this.gameMode === 'hard' ? 1200 : 1000;
                bossScore = 5000;
            }
            
            const boss = this.boss.create(this.gameWidth / 2, -150, bossTexture);
            if (!boss) return;
            boss.setVelocityY(50);
            boss.health = bossHealth;
            boss.maxHealth = boss.health;
            boss.scoreValue = bossScore;
            boss.gemType = 'large';
            boss.oscillateTime = 0;
            boss.body.setCircle(37.5);
            
            // Create boss health bar
            boss.healthBarBg = this.add.rectangle(boss.x, boss.y - 50, 100, 10, 0x333333);
            boss.healthBarBg.setOrigin(0.5);
            boss.healthBar = this.add.rectangle(boss.x - 50, boss.y - 50, 100, 10, 0x00ff00);
            boss.healthBar.setOrigin(0, 0.5);
            
            if (this.bossCount === 3) {
                this.addPulsingAnimation(boss);
            }
            
            console.log('Boss spawned successfully');
        } catch (e) {
            console.error('Error spawning boss:', e);
        }
    }

    spawnPowerup(x, y) {
        // 15% chance for temp powerup (from enemies)
        if (Phaser.Math.Between(1, 100) <= 15) {
            const types = ['powerupShield', 'powerupRapid', 'powerupMulti', 'powerupLasers'];
            const type = types[Phaser.Math.Between(0, 3)];
            const powerup = this.powerups.create(x, y, type);
            powerup.setVelocityY(100);
            powerup.powerupType = type;
            powerup.magnetized = false;
            powerup.magnetSpeed = 400;
        }
    }
    
    spawnHealthPickup(x, y) {
        // 5% chance for health pickup (from asteroids)
        if (Phaser.Math.Between(0, 19) === 0) {
            const healthPickup = this.powerups.create(x, y, 'healthPickup');
            healthPickup.setVelocityY(100);
            healthPickup.powerupType = 'healthPickup';
            healthPickup.magnetized = false;
            healthPickup.magnetSpeed = 400;
        }
    }
    
    spawnGem(x, y, type, xpOverride) {
        // type can be a texture key (e.g. 'gemSmallGreen') or legacy name ('small','medium','large')
        let textureKey = type;
        let xpValue = xpOverride;
        if (type === 'small')  { textureKey = 'gemSmall';  xpValue = xpValue || 5; }
        if (type === 'medium') { textureKey = 'gemMedium';  xpValue = xpValue || 25; }
        if (type === 'large')  { textureKey = 'gemLarge';   xpValue = xpValue || 100; }

        const gem = this.gems.create(x, y, textureKey);
        if (gem) {
            gem.xpValue = xpValue;
            gem.setVelocity(Phaser.Math.Between(-20, 20), Phaser.Math.Between(50, 100));
            gem.magnetized = false;
            gem.magnetSpeed = 400;
        }
    }
    
    magnetizeGroup(group, magnetRadius) {
        group.children.iterate((item) => {
            if (!item || !item.active) return;
            const dx = this.player.x - item.x;
            const dy = this.player.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < magnetRadius) item.magnetized = true;
            if (item.magnetized) {
                item.magnetSpeed = Math.min(item.magnetSpeed * 1.001, 600);
                item.setVelocity((dx / dist) * item.magnetSpeed, (dy / dist) * item.magnetSpeed);
            }
        });
    }

    magnetizeGems() {
        const magnetRadius = 100 * (1 + (this.upgrades.magnet * 0.25));
        this.magnetizeGroup(this.gems, magnetRadius);
        this.magnetizeGroup(this.powerups, magnetRadius);
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
        
        // Check if we're in hard mode with limited slots
        const isHardMode = this.gameMode === 'hard';
        const canPickNewUpgrade = !isHardMode || this.upgradeSlotsUsed < this.maxUpgradeSlots;
        
        // Filter out maxed upgrades and those with unmet requirements
        let availableUpgrades = UPGRADE_DEFS.filter(u =>
            this.upgrades[u.key] < u.max && (!u.requires || this.upgrades[u.requires] > 0)
        );
        
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
            const pauseDuration = this.time.now - this.lastPauseTime;
            this.pauseTimeOffset += pauseDuration;

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
        } else if (card.upgradeKey === 'vampiric') {
            this.maxHealth -= 10;
            this.health = Math.min(this.health, this.maxHealth);
        } else if (card.upgradeKey === 'shield') {
            this.maxShieldStacks = 1 + this.upgrades.shield;
            this.shieldStacks = Math.min(this.shieldStacks + 1, this.maxShieldStacks);
            this.shieldActive = true;
            this.lastShieldRegenTime = this.getGameTime();
            this.activateShieldVisual();
        }
        
        // Hide cards
        this.hideUpgradeCards();
        
        // Resume game
        this.isPaused = false;
        const pauseDuration = this.time.now - this.lastPauseTime;
        this.pauseTimeOffset += pauseDuration;
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
        // Dark purple shoots 2-bullet spread
        if (enemy.enemyType === 'darkPurple') {
            for (const i of [-1, 1]) {
                const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20, 'enemyBullet');
                if (bullet) {
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    bullet.body.reset(enemy.x, enemy.y + 20);
                    bullet.setVelocity(enemy.body.velocity.x + i * 80, 300);
                    bullet.damage = enemy.bulletDamage;
                    bullet.isZigzag = false;
                }
            }
        } else {
            const bullet = this.enemyBullets.get(enemy.x, enemy.y + 20, 'enemyBullet');
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                bullet.body.reset(enemy.x, enemy.y + 20);
                bullet.damage = enemy.bulletDamage || 10;

                // Pulsing purple: wave pattern
                if (enemy.enemyType === 'pulsingPurple') {
                    bullet.setVelocity(0, 250);
                    this.waveBullets.set(bullet, { startX: enemy.x, phase: 0 });
                } else {
                    bullet.setVelocity(0, 300);
                    this.waveBullets.delete(bullet);
                }
            }
        }
    }

    bossShoot(boss) {
        // Determine spread based on boss count (1=3, 2=4, 3+=5)
        let bulletCount = 3;
        let bulletDamage = 15;
        if (this.bossCount === 2) {
            bulletCount = 4;
            bulletDamage = 30;
        } else if (this.bossCount >= 3) {
            bulletCount = 5;
            bulletDamage = 45;
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
                bullet.damage = bulletDamage;
                bullet.isBossBullet = true;
            }
        }
    }

    bulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        // Prevent piercing bullets from hitting the same enemy twice
        if (bullet.pierceCount > 0) {
            if (!bullet.hitEnemies) bullet.hitEnemies = new Set();
            if (bullet.hitEnemies.has(enemy)) return;
            bullet.hitEnemies.add(enemy);
        }

        // Deal damage
        const damage = bullet.damage || 1;
        enemy.health -= damage;
        
        // Chain lightning - triggers on hit, not just on death
        if (bullet.chainLightning) {
            const jumps = bullet.lightningJumps || 1;
            const range = bullet.lightningRange || 200;
            this.chainLightning(enemy.x, enemy.y, jumps, range, new Set([enemy]));
        }
        
        // Piercing
        if (bullet.pierceCount > 0) {
            bullet.pierceCount--;
        } else {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
        
        this.handleExplosiveRound(bullet, enemy.x, enemy.y, enemy);
        
        if (enemy.health <= 0) {
            this.destroyEnemy(enemy, null, bullet);
        }
    }
    
    destroyEnemy(enemy, fromLightning = false, killingBullet = null) {
        if (!enemy.active) return; // Prevent double-destroy (double gems)
        enemy.active = false; // Deactivate immediately to block any further calls
        this.createExplosion(enemy.x, enemy.y, 5);
        
        // Spawn gem
        if (enemy.gemType) {
            this.spawnGem(enemy.x, enemy.y, enemy.gemType, enemy.gemXp);
        }
        
        // Spawn powerup chance
        this.spawnPowerup(enemy.x, enemy.y);
        
        // Score
        this.score += enemy.scoreValue;
        
        // Vampiric healing - heal per kill (1s cooldown)
        if (this.upgrades.vampiric > 0) {
            const gameTime = this.getGameTime();
            if (gameTime - this.lastVampiricHealTime >= 750) {
                const healAmount = this.upgrades.vampiric; // 1, 2, or 3 HP
                this.health = Math.min(this.maxHealth, this.health + healAmount);
                this.lastVampiricHealTime = gameTime;
            }
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
            nearest.health -= 1 * this.getGiantMultiplier();
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

        // Prevent piercing bullets from hitting the same asteroid twice
        if (bullet.pierceCount > 0) {
            if (!bullet.hitEnemies) bullet.hitEnemies = new Set();
            if (bullet.hitEnemies.has(asteroid)) return;
            bullet.hitEnemies.add(asteroid);
        }

        const damage = bullet.damage || 1;
        asteroid.health -= damage;
        
        // Chain lightning - triggers on hit, not just on death
        if (bullet.chainLightning) {
            const jumps = bullet.lightningJumps || 1;
            const range = bullet.lightningRange || 200;
            this.chainLightning(asteroid.x, asteroid.y, jumps, range, new Set([asteroid]));
        }
        
        // Piercing
        if (bullet.pierceCount > 0) {
            bullet.pierceCount--;
        } else {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
        
        this.handleExplosiveRound(bullet, asteroid.x, asteroid.y);
        
        if (asteroid.health <= 0) {
            this.destroyAsteroid(asteroid, false, bullet);
        }
    }
    
    destroyAsteroid(asteroid, fromLightning = false, killingBullet = null) {
        if (!asteroid.active) return;
        asteroid.active = false;
        this.createExplosion(asteroid.x, asteroid.y, 6);
        
        // Spawn gem
        if (asteroid.gemType) {
            this.spawnGem(asteroid.x, asteroid.y, asteroid.gemType);
        }
        
        this.score += asteroid.scoreValue;
        
        // 5% chance for health pickup
        this.spawnHealthPickup(asteroid.x, asteroid.y);
        
        asteroid.destroy();
    }

    destroyBoss(boss) {
        this.createExplosion(boss.x, boss.y, 20);
        if (boss.gemType) {
            this.spawnGem(boss.x, boss.y, boss.gemType);
        }
        if (boss.healthBarBg) boss.healthBarBg.destroy();
        if (boss.healthBar) boss.healthBar.destroy();
        this.score += boss.scoreValue;
        boss.destroy();

        // Activate flood mode after 3rd boss is defeated
        if (this.bossCount >= 3 && !this.floodMode) {
            this.floodMode = true;
            this.floodModeStartTime = this.getGameTime();
            this.lastFloodHealthDouble = this.floodModeStartTime;
            this.enemySpawnRate = 10;
            this.createFloodModeText();
        }
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
        
        this.handleExplosiveRound(bullet, boss.x, boss.y);
        
        // Piercing doesn't work on boss
        bullet.setActive(false);
        bullet.setVisible(false);
        
        if (boss.health <= 0) {
            this.destroyBoss(boss);
        }
    }

    handlePlayerCollision(collider, damage, destroyCollider = true, shieldExplosion = true) {
        if (this.godMode) {
            if (destroyCollider) collider.destroy();
            return;
        }
        if (this.shieldStacks > 0 || this.shieldActive) {
            const gameTime = this.getGameTime();
            if (gameTime - this.lastShieldHitTime < 500) {
                if (destroyCollider) collider.destroy();
                return;
            }
            this.lastShieldHitTime = gameTime;
            this.shieldStacks = Math.max(0, this.shieldStacks - 1);
            if (this.shieldStacks <= 0) {
                this.shieldActive = false;
                if (this.shieldCircle) {
                    this.shieldCircle.destroy();
                    this.shieldCircle = null;
                }
            } else {
                this.updateShieldVisual();
            }
            if (shieldExplosion) this.createExplosion(this.player.x, this.player.y);
            if (destroyCollider) collider.destroy();
            return;
        }
        if (this.isInvincible) return;
        this.takeDamage(damage);
        if (destroyCollider) collider.destroy();
    }

    playerHitEnemy(player, enemy) { this.handlePlayerCollision(enemy, 20); }
    playerHitAsteroid(player, asteroid) { this.handlePlayerCollision(asteroid, 15); }
    playerHitBoss(player, boss) { this.handlePlayerCollision(boss, 30, false); }
    playerHitBullet(player, bullet) { this.handlePlayerCollision(bullet, 10, true, false); }

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
        const currentTime = this.getGameTime();

        switch (type) {
            case 'powerupShield':
                this.shieldStacks = Math.min(this.shieldStacks + 1, Math.max(1, this.maxShieldStacks));
                this.shieldActive = true;
                this.activateShieldVisual();
                break;
            case 'powerupRapid':
                this.rapidFireActive = true;
                this.shootCooldown = WEAPON_DEFS[this.weaponType].rapidFireCooldown;
                this.rapidFireExpireTime = currentTime + 10000;
                this.showMessage('RAPID FIRE', '#ffff00');
                if (this.rapidFireTimer) this.rapidFireTimer.remove();
                this.rapidFireTimer = this.time.delayedCall(10000, () => {
                    this.rapidFireActive = false;
                    this.shootCooldown = WEAPON_DEFS[this.weaponType].baseCooldown;
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
        const laserLength = 120; // length of the laser beam itself
        const damage = 3 * this.getGiantMultiplier();

        // Create two lasers - one up-left, one up-right (45 degree angles)
        const angles = [-Math.PI / 4, -3 * Math.PI / 4]; // -45° and -135°

        for (let i = 0; i < 2; i++) {
            const angle = angles[i];
            
            // Precompute full path with 5 bounces + extension
            const fullPath = this.computeFullLaserPath(this.player.x, this.player.y, angle, 5);
            
            // Calculate total path length
            let totalLength = 0;
            for (let j = 1; j < fullPath.length; j++) {
                const dx = fullPath[j].x - fullPath[j-1].x;
                const dy = fullPath[j].y - fullPath[j-1].y;
                totalLength += Math.sqrt(dx * dx + dy * dy);
            }
            
            // Create graphics for this laser
            const graphics = this.add.graphics();
            
            const laser = {
                path: fullPath, // Complete path points
                pathDistance: 0, // How far along the path we've traveled
                totalLength: totalLength, // Total length of path
                speed: speed,
                laserLength: laserLength,
                damage: damage,
                hitEnemies: new Set(),
                graphics: graphics,
                active: true,
                maxBounces: 5,
                bouncesCompleted: 0,
                offScreen: false
            };

            this.lasersArray.push(laser);
        }
    }

    computeFullLaserPath(startX, startY, angle, numBounces) {
        const path = [{ x: startX, y: startY, segment: 0 }];
        let currentX = startX;
        let currentY = startY;
        let currentAngle = angle;
        const margin = 5;
        
        for (let b = 0; b < numBounces; b++) {
            const vx = Math.cos(currentAngle);
            const vy = Math.sin(currentAngle);
            
            let distToWall = Infinity;
            let hitWall = null;
            
            if (vx < 0) {
                const dist = (margin - currentX) / vx;
                if (dist > 0 && dist < distToWall) { distToWall = dist; hitWall = 'left'; }
            }
            if (vx > 0) {
                const dist = (this.gameWidth - margin - currentX) / vx;
                if (dist > 0 && dist < distToWall) { distToWall = dist; hitWall = 'right'; }
            }
            if (vy < 0) {
                const dist = (margin - currentY) / vy;
                if (dist > 0 && dist < distToWall) { distToWall = dist; hitWall = 'top'; }
            }
            if (vy > 0) {
                const dist = (this.gameHeight - margin - currentY) / vy;
                if (dist > 0 && dist < distToWall) { distToWall = dist; hitWall = 'bottom'; }
            }
            
            currentX += vx * distToWall;
            currentY += vy * distToWall;
            path.push({ x: currentX, y: currentY, segment: b + 1 });
            
            if (hitWall === 'left' || hitWall === 'right') {
                currentAngle = Math.PI - currentAngle;
            } else {
                currentAngle = -currentAngle;
            }
        }
        
        // Add extension beyond last bounce to go off-screen (make it really long)
        const extLen = 2000;
        currentX += Math.cos(currentAngle) * extLen;
        currentY += Math.sin(currentAngle) * extLen;
        path.push({ x: currentX, y: currentY, segment: 6 });
        
        return path;
    }

    updateLasers(time, delta) {
        const dt = delta / 1000; // Convert to seconds

        for (let i = this.lasersArray.length - 1; i >= 0; i--) {
            const laser = this.lasersArray[i];

            if (!laser.active) {
                laser.graphics.destroy();
                this.lasersArray.splice(i, 1);
                continue;
            }

            // Move along the path
            laser.pathDistance += laser.speed * dt;

            // Get head position on path
            const headPos = this.getPointOnPath(laser.path, laser.pathDistance);
            const headX = headPos.x;
            const headY = headPos.y;
            
            // Track bounces completed
            if (headPos.segment > laser.bouncesCompleted) {
                laser.bouncesCompleted = headPos.segment;
                laser.hitEnemies.clear();
            }

            // Get tail position (laserLength behind head)
            const tailDist = Math.max(0, laser.pathDistance - laser.laserLength);
            const tailPos = this.getPointOnPath(laser.path, tailDist);
            const tailX = tailPos.x;
            const tailY = tailPos.y;

            // After 5 bounces (segment 5 or 6), wait until path is fully traveled then check off-screen
            if (laser.bouncesCompleted >= 5) {
                // Wait until the laser has traveled past the end of the path
                if (laser.pathDistance >= laser.totalLength) {
                    if (tailX < -50 || tailX > this.gameWidth + 50 ||
                        tailY < -50 || tailY > this.gameHeight + 50) {
                        laser.active = false;
                        laser.graphics.destroy();
                        this.lasersArray.splice(i, 1);
                        continue;
                    }
                }
            }

            // Store positions for drawing and collision
            laser.headX = headX;
            laser.headY = headY;
            laser.tailX = tailX;
            laser.tailY = tailY;

            // Check collisions
            this.checkLaserCollisions(laser);

            // Draw
            this.drawLaser(laser);
        }
    }

    getPointOnPath(path, distance) {
        let traveled = 0;
        
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segLen = Math.sqrt(dx * dx + dy * dy);
            
            if (traveled + segLen >= distance) {
                const t = (distance - traveled) / segLen;
                return {
                    x: p1.x + dx * t,
                    y: p1.y + dy * t,
                    segment: p1.segment
                };
            }
            traveled += segLen;
        }
        
        // Past end of path
        const last = path[path.length - 1];
        return { x: last.x, y: last.y, segment: last.segment };
    }

    getPathSegmentFull(path, startDist, endDist) {
        const result = [];
        let traveled = 0;
        
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segLen = Math.sqrt(dx * dx + dy * dy);
            
            const segStart = traveled;
            const segEnd = traveled + segLen;
            
            // Skip segments outside our range
            if (segEnd < startDist || segStart > endDist) {
                traveled += segLen;
                continue;
            }
            
            // Calculate visible portion of this segment
            const t1 = Math.max(0, (startDist - segStart) / segLen);
            const t2 = Math.min(1, (endDist - segStart) / segLen);
            
            if (result.length === 0 || i === 0) {
                result.push({
                    x: p1.x + dx * t1,
                    y: p1.y + dy * t1
                });
            }
            
            if (t2 > t1) {
                result.push({
                    x: p1.x + dx * t2,
                    y: p1.y + dy * t2
                });
            }
            
            traveled += segLen;
        }
        
        return result;
    }

    drawLaser(laser) {
        const graphics = laser.graphics;
        graphics.clear();

        // Get visible portion of path
        const tailDist = Math.max(0, laser.pathDistance - laser.laserLength);
        const headDist = laser.pathDistance;
        
        // Get all points along the visible portion
        const visiblePoints = this.getPathSegmentFull(laser.path, tailDist, headDist);
        
        if (visiblePoints.length < 2) return;

        // Draw gradient line through all visible points
        // Outer glow (darker green) - 12px
        graphics.lineStyle(12, 0x006600, 0.4);
        graphics.beginPath();
        graphics.moveTo(visiblePoints[0].x, visiblePoints[0].y);
        for (let i = 1; i < visiblePoints.length; i++) {
            graphics.lineTo(visiblePoints[i].x, visiblePoints[i].y);
        }
        graphics.strokePath();

        // Middle layer - 8px
        graphics.lineStyle(8, 0x009900, 0.6);
        graphics.beginPath();
        graphics.moveTo(visiblePoints[0].x, visiblePoints[0].y);
        for (let i = 1; i < visiblePoints.length; i++) {
            graphics.lineTo(visiblePoints[i].x, visiblePoints[i].y);
        }
        graphics.strokePath();

        // Core (bright green) - 4px
        graphics.lineStyle(4, 0x88cc88, 0.8);
        graphics.beginPath();
        graphics.moveTo(visiblePoints[0].x, visiblePoints[0].y);
        for (let i = 1; i < visiblePoints.length; i++) {
            graphics.lineTo(visiblePoints[i].x, visiblePoints[i].y);
        }
        graphics.strokePath();
        graphics.strokePath();
    }

    checkLaserCollisions(laser) {
        // Use actual beam line from tail to head
        const start = { x: laser.tailX, y: laser.tailY };
        const end = { x: laser.headX, y: laser.headY };
        
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
                        this.destroyBoss(boss);
                    }
                }
            }
        });
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
        // Green flash at hit location
        const flash = this.add.circle(x, y, 20, 0x00ff00, 0.8);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 1.5,
            duration: 150,
            onComplete: () => flash.destroy()
        });
        
        // Green particle burst at hit location
        const particles = this.add.particles(0, 0, 'particle', {
            speed: { min: 80, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 400,
            tint: 0x00ff00
        });
        particles.explode(12, x, y);
        
        // Auto-destroy after animation
        this.time.delayedCall(500, () => {
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
        this.shieldStacks = 0;
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
        this.shootCooldown = WEAPON_DEFS[this.weaponType].baseCooldown;

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
            if (bullet && bullet.active) {
                if (bullet.y < -10 || bullet.y > this.gameHeight + 10) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                } else if (bullet.maxRange > 0 && Math.abs(bullet.y - bullet.spawnY) >= bullet.maxRange) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            }
        });

        // Clean up enemy bullets
        this.enemyBullets.children.iterate((bullet) => {
            if (bullet && bullet.active) {
                // Pulsing purple bullets wave in sin pattern
                const wave = this.waveBullets.get(bullet);
                if (wave) {
                    wave.phase += this.game.loop.delta * 0.008;
                    bullet.x = wave.startX + Math.sin(wave.phase) * 120;
                    bullet.body.velocity.x = 0;
                }

                if (bullet.y < -10 || bullet.y > this.gameHeight + 10) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                    this.waveBullets.delete(bullet);
                }
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
        const currentTime = this.getGameTime();
        
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
                const def = UPGRADE_DEFS.find(d => d.key === key);
                const displayKey = def ? def.displayName : key.charAt(0).toUpperCase() + key.slice(1);
                if (!this.upgradeTexts[key]) {
                    // Create new text for this upgrade
                    this.upgradeTexts[key] = this.add.text(this.gameWidth - 20, yPos, `${displayKey}: ${value}`, {
                        fontSize: '14px',
                        fill: '#aaaaaa',
                        fontFamily: 'Arial',
                        fontStyle: 'bold'
                    }).setOrigin(1, 0).setDepth(100);
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
        
        // Cleanup flood mode text
        if (this.floodText) {
            this.floodText.destroy();
            this.floodText = null;
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
