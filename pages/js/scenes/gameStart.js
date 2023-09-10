/**
 * @extends Phaser.Scene
 */

var t = 0;
let createCar = true;

var gameStartBackgroundMusic;

class gameStart extends Phaser.Scene {
    constructor() {
        super("gameStart");
    }
    preload() {
        this.load.image("background", "../../assets/img/gameStart/background.png");
        this.load.spritesheet("player", "../../assets/img/global/player-1.png", {frameWidth: 80, frameHeight: 110, startFrame: 0, endFrame: 3});
        this.load.spritesheet("car", "../../assets/img/global/car.png", {frameWidth: 170, frameHeight: 390, startFrame: 0, endFrame: 6});
        this.load.audio('gameStartBackgroundMusic', ['../../assets/audio/2020-03-22_-_8_Bit_Surf_-_FesliyanStudios.com_-_David_Renda.mp3', '../../assets/audio/2020-03-22_-_8_Bit_Surf_-_FesliyanStudios.com_-_David_Renda.ogg']);
        this.load.audio("gameStart", ["../../assets/audio/game-start-6104.mp3", "../../assets/audio/game-start-6104.ogg"])
    }
    create() {
        this.background = this.add.tileSprite(0, -1800, 800, 2400, "background").setOrigin(0, 0);
        this.title = this.add.text(400, 200, "行人地獄大挑戰", {
            fontFamily: "Minecraft_AE",
            fontSize: "60px",
            color: "#ffffff"
        }).setOrigin(0.5, 0.5);
        this.subtitle = this.add.text(400, 300, "你能走多遠", {
            fontFamily: "Minecraft_AE",
            fontSize: "30px",
            color: "#ffffff"
        }).setOrigin(0.5, 0.5);
        this.startGame = this.add.text(400, 500, "按下空白鍵開始遊戲", {
            fontFamily: "Minecraft_AE",
            fontSize: "30px",
            color: "#ffffaa",
        }).setOrigin(0.5, 0.5);

        this.player = this.add.sprite(150, 400, "player", 0).setScale(1.3)

        gameStartBackgroundMusic = this.sound.add('gameStartBackgroundMusic');
        gameStartBackgroundMusic.play('',0,1,true)

        this.gameStart = this.sound.add("gameStart");

    }
    update() {
        this.background.tilePositionY -= 1;
        t++;
        if (t % 60 == 0) {
            t = 0;
            this.startGame.visible = !this.startGame.visible;
        }
        if (t % 10 == 0) {
            // player 換圖
            this.player.setFrame((this.player.frame.name + 1) % 4);
        }

        // 隨機生成車子
        if (Phaser.Math.Between(0, 200) && createCar) {
            this.car = this.add.sprite(Phaser.Math.Between(320, 480), 800, "car", 0);
            this.car.setFrame(Phaser.Math.Between(0, 6));
            createCar = false;
            this.tweens.add({
                targets: this.car,
                y: -400,
                duration: Phaser.Math.Between(320, 2000),
                ease: "Linear",
                onComplete: () => {
                    this.car.destroy();
                    createCar = true;
                }
            });
        }
        

        if (this.input.keyboard.addKey("SPACE").isDown) {
            this.gameStart.play();
            this.scene.start("mainGame");
        }
        
    }
}