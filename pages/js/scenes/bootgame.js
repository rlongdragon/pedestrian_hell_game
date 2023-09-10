/**
 * @extends Phaser.Scene
 */
class bootGame extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }
    preload() {
        // font
        this.load.bitmapFont('font', '../../assets/font/Cubic_11_1.010_R.ttf', '../../assets/font/Minecraft_changed.ttf');
    }
    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("gameStart");
    }
}