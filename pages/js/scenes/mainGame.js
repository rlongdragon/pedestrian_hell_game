/**
 * @extends Phaser.Scene
 */
let mainGameBackgroundMusic;

speed = 1;
score = 0;
t = 0;
can = true;

face = 0;
mode = 0;

key_down = ""

create_Car = true;
create = 300


left = 300;
right = 480;

obstacles_data = [ // [pos, x, y, offsetX, offsetY, interval, left]
    [115, 130, 90, 0, 60, 200, 320],
    [115, 50, 50, 50, 240, 200, 320],
    [170, 120, 20, 20, 40, 200, 320],
]

let left_create_obstacle = 250
let left_obstacle_interval = 0

let right_create_obstacle = 250
let right_obstacle_interval = 0

let obstacles = []

let playSound = true

class mainGame extends Phaser.Scene {
    constructor() {
        super("mainGame");
    }
    preload() {
        this.load.spritesheet("road_background", "../../assets/img/global/road_background.png", { frameWidth: 800, frameHeight: 600, startFrame: 0, endFrame: 2 });
        this.load.spritesheet("all_player", "../../assets/img/global/all_player-1.png", { frameWidth: 80, frameHeight: 111, startFrame: 0, endFrame: 15 });
        this.load.spritesheet("car", "../../assets/img/global/car.png", { frameWidth: 170, frameHeight: 390, startFrame: 0, endFrame: 6 });

        for (let i = 1; i <= 8; i++) {
            this.load.image(`obstacle${i}`, `../../assets/img/global/obstacle/${i}.png`)
        }
        this.load.audio('mainGameBackgroundMusic', ['../../assets/audio/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3', '../../assets/audio/2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.ogg']);
        this.load.audio("gameOver", ["../../assets/audio/toink-8bit-84481.mp3", "../../assets/audio/toink-8bit-84481.ogg"])
        this.load.audio("gameOverBackGroundMusic", ["../../assets/audio/chiptune-alarm-clock-112869.mp3", "../../assets/audio/chiptune-alarm-clock-112869.ogg"])
        this.load.audio("levelUp", ["../../assets/audio/jump_c_02-102843.mp3", "../../assets/audio/jump_c_02-102843.ogg"])

        for (let i = 1; i <= 13; i++) {
            this.load.audio(`hornSound${i}`, [`../../assets/audio/hornSound/hornSound_${i}.mp3`, `../../assets/audio/hornSound/hornSound${i}.ogg`])
        }
    }
    create() {
        this.background1 = this.add.sprite(0, 0, "road_background", 0).setOrigin(0, 0)
        this.background2 = this.add.sprite(0, -600, "road_background", 1).setOrigin(0, 0);
        this.player = this.add.sprite(150, 400, "all_player", 0).setOrigin(0.5, 1).setScale(1.3);;
        this.scoreText = this.add.text(20, 20, `分數: ${score}`, {
            fontFamily: "Minecraft_AE",
            fontSize: "30px",
            color: "#ffffaa"
        })
        this.speedShow = this.add.text(20, 60, `速度: ${speed}`, {
            fontFamily: "Minecraft_AE",
            fontSize: "30px",
            color: "#ffffaa"
        })

        // 如果要讓物件可以被碰撞，必須先啟用物理引擎
        this.physics.add.existing(this.player);
        this.player.body.setSize(50, 10);
        // this.player.body.setCollideWorldBounds(true);

        mainGameBackgroundMusic = this.sound.add('mainGameBackgroundMusic');
        gameStartBackgroundMusic.pause();
        mainGameBackgroundMusic.play('', 0, 1, true)
        mainGameBackgroundMusic.loop = true;

        this.gameOver = this.sound.add("gameOver");

        this.gameOverBackGroundMusic = this.sound.add("gameOverBackGroundMusic");
    }
    update() {
        function checkCollision() {
            for (let i = 0; i < obstacles.length; i++) {
                let obstacle = obstacles[i];
                if (this.physics.collide(this.player, obstacle)) {
                    let ret = []

                    if (this.player.y > obstacle.y) {
                        ret.push("b")
                    } else {
                        ret.push("t")
                    }

                    if (this.player.x > obstacle.x) {
                        ret.push("r")
                    } else {
                        ret.push("l")
                    }

                    return ret
                }
            }
            return [0, 0]
        }


        score += Math.floor(speed) * 0.012;
        // 顯示小數點後兩位
        this.scoreText.setText(`分數: ${score.toFixed(2)}`);
        speed += 0.0002;
        this.speedShow.setText(`速度: ${ Math.floor(speed)}`);
        // console.log(speed - speed.toFixed(0))
        if (speed -  Math.floor(speed) > 0.9988 && playSound) {
            playSound = false
            this.sound.add("levelUp").play('', 0, 1, false)            
        } else if (speed - Math.floor(speed) < 0.9988) {
            playSound = true
        }

        let will_collide = checkCollision.call(this);
        // console.log(will_collide)
        if (this.input.keyboard.addKey("A").isDown || this.input.keyboard.addKey("LEFT").isDown) {
            if (key_down != "A") {
                key_down = "A";
                t = 21;
                this.player.body.setSize(20, 10);
                this.player.body.offset.y = this.player.height - 50
            }
            if (this.player.x > 100 && will_collide[1] != "r") this.player.x -= Math.floor(speed) + 2;
            if (will_collide == "b") this.player.x -= Math.floor(speed)
            face = 2;
        } else if (this.input.keyboard.addKey("D").isDown || this.input.keyboard.addKey("RIGHT").isDown) {
            if (key_down != "D") {
                key_down = "D";
                t = 21;
                this.player.body.setSize(20, 10);
                this.player.body.offset.y = this.player.height - 50
            }
            if (this.player.x < 700 && will_collide[1] != "l") this.player.x += Math.floor(speed) + 2;
            face = 1;
        } else if (this.input.keyboard.addKey("W").isDown || this.input.keyboard.addKey("UP").isDown) {
            if (key_down != "W") {
                key_down = "W";
                t = 21;
                this.player.body.setSize(50, 10);
                this.player.body.offset.y = this.player.height - 50
            }
            // console.log(will_collide[0])
            if (this.player.y > 100 && will_collide[0] != "b") this.player.y -= Math.floor(speed) + 2;
            else this.player.y += Math.floor(speed)
            face = 0;
        } else if (this.input.keyboard.addKey("S").isDown || this.input.keyboard.addKey("DOWN").isDown) {
            if (key_down != "S") {
                key_down = "S";
                t = 21;
                this.player.body.setSize(50, 10);
                this.player.body.offset.y = this.player.height - 50
            }
            if (this.player.y < 500 && will_collide[0] != "t") this.player.y += Math.floor(speed) + 2;
            face = 3;
        } else {
            face = 0;
            if (key_down != "") {
                key_down = "";
                this.player.body.setSize(50, 10);
                this.player.body.offset.y = this.player.height - 50
                t = 21;
            }

            if (will_collide[0] == "b") {
                this.player.y += Math.floor(speed) + 1

                if (this.player.y > 650) {
                    this.physics.pause();
                    this.scene.pause();
                    mainGameBackgroundMusic.pause();
                    this.gameOver.play();
                    this.gameOverBackGroundMusic.play('', 0, 1, true)
                    this.add.text(400, 200, "Game Over\n你還真是跟不上潮流阿", {
                        fontFamily: "Minecraft_AE",
                        fontSize: "50px",
                        color: "#ff9999"
                    }).setAlign('center').setOrigin(0.5, 0.5);

                    this.add.text(400, 300, `分數: ${score.toFixed(2)}`, {
                        fontFamily: "Minecraft_AE",
                        fontSize: "40px",
                        color: "#ffffaa"
                    }).setOrigin(0.5, 0.5);

                    this.add.text(400, 500, "按下F5重新開始人生", {
                        fontFamily: "Minecraft_AE",
                        fontSize: "50px",
                        color: "#ffffaa"
                    }).setOrigin(0.5, 0.5);

                    this.physics.start()
                    this.input.keyboard.addKey("SPACE").on("down", () => {
                        this.scene.start("game_start");
                    });

                }
                this.player.body.setSize(50, 10);
                this.player.body.offset.y = this.player.height - 50
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            if (this.physics.collide(this.player, obstacle)) {
                this.player.y += Math.floor(speed) + 1
            }
        }

        t += 1;
        // console.log(t);
        if (t > 10 * (1 / speed)) {
            mode = (mode + 1) % 4;
            t = 0;
            this.player.setFrame(mode * 4 + face);
        }

        // 隨機生成車子
        create -= 1;
        if ((Phaser.Math.Between(0, 200) == 0 || create == 0) && create_Car) {
            create = 300;
            // console.log("create car");
            this.sound.add(`hornSound${Phaser.Math.Between(1, 13)}`).play('', 0, 1, false)
            this.car = this.add.sprite(Phaser.Math.Between(left, right), 1000, "car", 0);
            this.car.setFrame(Phaser.Math.Between(0, 6));
            create_Car = false;

            this.physics.add.existing(this.car);
            this.car.body.setSize(170, 390);

            this.car.setDepth(this.player.depth + 1);

            this.physics.add.collider(this.player, this.car, () => {
                // console.log("game over");
                this.scene.pause();
                mainGameBackgroundMusic.pause();
                this.gameOver.play();
                this.gameOverBackGroundMusic.play('', 0, 1, true)
                // this.scene.start("game_over");
                this.add.text(400, 200, "Game Over\n你成為每日交通事故人數之一了", {
                    fontFamily: "Minecraft_AE",
                    fontSize: "50px",
                    color: "#ff9999"
                }).setAlign('center').setOrigin(0.5, 0.5).setDepth(this.car.depth + 1);

                this.add.text(400, 300, `分數: ${score.toFixed(2)}`, {
                    fontFamily: "Minecraft_AE",
                    fontSize: "40px",
                    color: "#ffffaa"
                }).setOrigin(0.5, 0.5).setDepth(this.car.depth + 1);

                this.add.text(400, 500, "按下F5重新開始人生", {
                    fontFamily: "Minecraft_AE",
                    fontSize: "50px",
                    color: "#ffffaa"
                }).setOrigin(0.5, 0.5).setDepth(this.car.depth + 1);

                this.physics.start()
                this.input.keyboard.addKey("SPACE").on("down", () => {
                    this.scene.start("game_start");
                }
                );

            });
            this.tweens.add({
                targets: this.car,
                y: -400,
                duration: Phaser.Math.Between(320, 2000),
                ease: "Linear",
                onComplete: () => {
                    this.car.destroy();
                    create_Car = true;
                }
            });
        }

        // 隨機生成障礙物 
        left_create_obstacle -= 1;
        left_obstacle_interval -= 1;
        if ((Phaser.Math.Between(0, 120) == 0 || left_create_obstacle == 0) && left_obstacle_interval <= 0) {
            left_create_obstacle = 500;
            // console.log("create obstacle");

            // 隨機選擇障礙物
            let type = Phaser.Math.Between(0, 2);
            // let type = 2

            // console.log(type);
            // console.log(obstacles_data[type]);

            obstacles.push(this.add.image(obstacles_data[type][0], -600, `obstacle${type + 1}`));
            obstacles[obstacles.length - 1].t = type;
            left_obstacle_interval = obstacles_data[type][6];

            // 設至碰撞箱
            this.physics.add.existing(obstacles[obstacles.length - 1]);
            obstacles[obstacles.length - 1].body.setSize(obstacles_data[type][1], obstacles_data[type][2]);
            obstacles[obstacles.length - 1].body.offset.x = obstacles_data[type][3];
            obstacles[obstacles.length - 1].body.offset.y = obstacles_data[type][4];

        }

        right_create_obstacle -= 1;
        right_obstacle_interval -= 1;
        if ((Phaser.Math.Between(0, 120) == 0 || right_create_obstacle == 0) && right_obstacle_interval <= 0) {
            right_create_obstacle = 500;
            // console.log("create obstacle");

            // 隨機選擇障礙物
            let type = Phaser.Math.Between(0, 2);
            // let type = 2

            // console.log(type);
            // console.log(obstacles_data[type]);

            obstacles.push(this.add.image(800 - obstacles_data[type][0], -600, `obstacle${type + 1}`));
            obstacles[obstacles.length - 1].t = type;
            right_obstacle_interval = obstacles_data[type][6];

            // 設至碰撞箱
            this.physics.add.existing(obstacles[obstacles.length - 1]);
            obstacles[obstacles.length - 1].body.setSize(obstacles_data[type][1], obstacles_data[type][2]);
            obstacles[obstacles.length - 1].body.offset.x = obstacles_data[type][3];
            obstacles[obstacles.length - 1].body.offset.y = obstacles_data[type][4];

        }

        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            obstacle.y += Math.floor(speed);


            if (this.player.y < obstacle.y + obstacles_data[obstacle.t][4] / 2 - (obstacles_data[obstacle.t][2] / 2)) {
                // console.log(obstacle.t);
                obstacle.setDepth(this.player.depth + 1);
            }

            if (obstacle.y > 1000) {
                obstacle.destroy();
                obstacles.splice(i, 1);
                i--;
            }
        }

        this.scoreText.setDepth(10000);
        this.speedShow.setDepth(9999);
        this.player.setDepth(9998);


        this.background1.y += Math.floor(speed);
        this.background2.y += Math.floor(speed);

        // 如果background2的y座標小於-600，就把background2的y座標設為0 並且隨機換圖
        if (this.background2.y > 600) {
            this.background2.y = -600 + Math.floor(speed);
            if (can) {
                this.background2.setFrame(Phaser.Math.Between(0, 2));
                can = false;
            } else {
                can = true;
            }
        }
        if (this.background1.y > 600) {
            this.background1.y = -600 + Math.floor(speed);
            if (can) {
                this.background1.setFrame(Phaser.Math.Between(0, 2));
                can = false;
            }
            else {
                can = true;
            }
        }
    }
}