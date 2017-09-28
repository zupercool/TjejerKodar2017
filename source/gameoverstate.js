var gameOverState = {
    
};

gameOverState.preload = function () {
    
};

gameOverState.create = function () {
    var textStyleGameOver = {
        fill: "white",
        font: "36px Arial",
        align: "center"}
    
    var textStyleGameOver2 = {
        fill: "white",
        font: "14px Arial",
        align: "center"}
    
    this.GameOverText = game.add.text(game.width*0.5, game.height*0.4, "GAME OVER", textStyleGameOver);
    this.GameOverText.anchor.setTo(0.5, 0.5);
    this.GameOverText.fixedToCamera = true;      
    
    this.GameOverText2 = game.add.text(game.width*0.5, game.height*0.6, "(Press z to start over)", textStyleGameOver2);
    this.GameOverText2.anchor.setTo(0.5, 0.5);
    this.GameOverText2.fixedToCamera = true;  
};

gameOverState.update = function () {
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    if (this.zKey.isDown){
        game.state.start("MainGame");
        }
};