class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        
        // Ship customization defaults
        this.selectedShape = 0;
        this.selectedColor = 4; // Blue by default
        this.selectedEngineColor = 1; // Orange by default
        this.selectedWeapon = 0; // Default weapon

        // Colors array
        this.colors = [
            { name: 'Red', hex: 0xFF0000, css: '#ff0000' },
            { name: 'Orange', hex: 0xFFA500, css: '#ffa500' },
            { name: 'Yellow', hex: 0xFFFF00, css: '#ffff00' },
            { name: 'Green', hex: 0x00FF00, css: '#00ff00' },
            { name: 'Blue', hex: 0x0066FF, css: '#0066ff' },
            { name: 'Indigo', hex: 0x4B0082, css: '#4b0082' },
            { name: 'Violet', hex: 0x8B00FF, css: '#8b00ff' }
        ];

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
        const titleText = this.add.text(this.gameWidth / 2, 40, 'SPACE GAME', {
            fontSize: '56px',
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

        // ===== SINGLE PREVIEW BOX =====
        const boxX = this.gameWidth / 2;
        const boxY = 240;
        const boxSize = 100;
        const arrowSpacing = 50;
        const shipScale = 2.5;
        
        // Main preview box
        this.add.rectangle(boxX, boxY, boxSize, boxSize, 0x222233).setStrokeStyle(3, 0x444455);
        
        // Ship preview graphics - offset to center it (origin is top-left of 32x32, so offset by half scaled size)
        this.shipPreview = this.add.graphics();
        this.shipPreview.setPosition(boxX - 16 * shipScale, boxY - 16 * shipScale);
        this.shipPreview.setScale(shipScale);
        
        // ===== ROW 1: SHAPE ARROWS (top) =====
        const row1Y = boxY - arrowSpacing;
        
        // Label on far left
        this.add.text(boxX - boxSize/2 - 160, row1Y, 'Shape', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        // Left arrow (left side of box)
        const leftShapeArrow = this.add.text(boxX - boxSize/2 - 30, row1Y, '<', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Right arrow (right side of box)
        const rightShapeArrow = this.add.text(boxX + boxSize/2 + 30, row1Y, '>', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        leftShapeArrow.on('pointerdown', () => {
            this.selectedShape = (this.selectedShape - 1 + 5) % 5;
            this.updateShipPreview();
        });
        
        rightShapeArrow.on('pointerdown', () => {
            this.selectedShape = (this.selectedShape + 1) % 5;
            this.updateShipPreview();
        });

        // ===== ROW 2: SHIP COLOR ARROWS (middle) =====
        const row2Y = boxY;
        
        // Label on far left
        this.add.text(boxX - boxSize/2 - 160, row2Y, 'Ship Color', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        // Left arrow (left side of box)
        const leftColorArrow = this.add.text(boxX - boxSize/2 - 30, row2Y, '<', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Right arrow (right side of box)
        const rightColorArrow = this.add.text(boxX + boxSize/2 + 30, row2Y, '>', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        leftColorArrow.on('pointerdown', () => {
            this.selectedColor = (this.selectedColor - 1 + 7) % 7;
            this.updateShipPreview();
        });
        
        rightColorArrow.on('pointerdown', () => {
            this.selectedColor = (this.selectedColor + 1) % 7;
            this.updateShipPreview();
        });

        // ===== ROW 3: ENGINE COLOR ARROWS (bottom) =====
        const row3Y = boxY + arrowSpacing;
        
        // Label on far left
        this.add.text(boxX - boxSize/2 - 160, row3Y, 'Engine Color', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        
        // Left arrow (left side of box)
        const leftEngineArrow = this.add.text(boxX - boxSize/2 - 30, row3Y, '<', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Right arrow (right side of box)
        const rightEngineArrow = this.add.text(boxX + boxSize/2 + 30, row3Y, '>', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        leftEngineArrow.on('pointerdown', () => {
            this.selectedEngineColor = (this.selectedEngineColor - 1 + 7) % 7;
            this.updateShipPreview();
        });
        
        rightEngineArrow.on('pointerdown', () => {
            this.selectedEngineColor = (this.selectedEngineColor + 1) % 7;
            this.updateShipPreview();
        });

        // ===== ROW 4: WEAPON SELECTION (below preview) =====
        const row4Y = boxY + arrowSpacing * 2;

        // Label on far left
        this.add.text(boxX - boxSize/2 - 160, row4Y, 'Weapon', {
            fontSize: '18px',
            fill: '#888888',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);

        // Weapon name text (centered between arrows)
        this.weaponNameText = this.add.text(boxX, row4Y, WEAPON_DEFS[this.selectedWeapon].name, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Left arrow
        const leftWeaponArrow = this.add.text(boxX - boxSize/2 - 30, row4Y, '<', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Right arrow
        const rightWeaponArrow = this.add.text(boxX + boxSize/2 + 30, row4Y, '>', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        leftWeaponArrow.on('pointerdown', () => {
            this.selectedWeapon = (this.selectedWeapon - 1 + WEAPON_DEFS.length) % WEAPON_DEFS.length;
            this.weaponNameText.setText(WEAPON_DEFS[this.selectedWeapon].name);
        });

        rightWeaponArrow.on('pointerdown', () => {
            this.selectedWeapon = (this.selectedWeapon + 1) % WEAPON_DEFS.length;
            this.weaponNameText.setText(WEAPON_DEFS[this.selectedWeapon].name);
        });

        // ===== DIFFICULTY SELECTION =====
        this.add.text(this.gameWidth / 2, 480, 'Select Difficulty', {
            fontSize: '20px',
            fill: '#aaaaaa',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Normal Mode Button
        const normalButton = this.createButton(this.gameWidth / 2 - 150, 530, 'Normal Mode', 0x00aa00, () => {
            this.startGame('normal');
        });

        // Hard Mode Button
        const hardButton = this.createButton(this.gameWidth / 2 + 150, 530, 'Hard Mode', 0xaa0000, () => {
            this.startGame('hard');
        });

        // Normal Mode Description
        this.add.text(this.gameWidth / 2 - 150, 580, 'Standard gameplay\nNo limits', {
            fontSize: '14px',
            fill: '#888888',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        // Hard Mode Description
        this.add.text(this.gameWidth / 2 + 150, 580, 'Faster enemy scaling\nLimited upgrades', {
            fontSize: '14px',
            fill: '#888888',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
        
        // Initial preview update
        this.updateShipPreview();
    }

    updateShipPreview() {
        this.shipPreview.clear();
        this.drawShipPreview(this.shipPreview, this.selectedShape, this.colors[this.selectedColor].hex, this.colors[this.selectedEngineColor].hex);
    }

    drawShipPreview(graphics, shapeIndex, shipColor, engineColor) {
        graphics.clear();
        drawShipShape(graphics, shapeIndex, shipColor, engineColor, { lineWidth: 2, engineY: 26 });
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
            this.scene.start('GameScene', {
                gameMode: mode,
                shipShape: this.selectedShape,
                shipColor: this.colors[this.selectedColor].hex,
                engineColor: this.colors[this.selectedEngineColor].hex,
                weaponType: this.selectedWeapon
            });
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
