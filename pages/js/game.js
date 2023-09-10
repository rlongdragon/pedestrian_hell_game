const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    scene: [
        bootGame, gameStart, mainGame
    ],
    smoothed: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // 關閉重力
            debug: false // 設置為 true 可以在渲染時顯示碰撞框線條，方便調試
        }
    },
    render: {
        options: {
          depth: true,
          depthSort: true
        }
      }
}

loadFont("Cubic_11", "../../assets/font/Cubic_11_1.010_R.ttf");
loadFont("Minecraft_AE", "../../assets/font/Minecraft_changed.ttf");

var Game = new Phaser.Game(config);

