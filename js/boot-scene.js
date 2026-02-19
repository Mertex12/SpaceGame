class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        for (const [key, def] of Object.entries(TEXTURE_DEFS)) {
            generateTextureFromDef(this, key, def);
        }
    }

    create() {
        this.scene.start('IntroScene');
    }
}
