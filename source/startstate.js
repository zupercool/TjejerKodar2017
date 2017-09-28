var startState = {
    
};

startState.preload = function(){
   
};

startState.create = function(){
    var textStyle = {
        fill: "white",
        font: "14px Arial",
        align: "center"}
    
    this.startText = game.add.text(game.width*0.5, game.height*0.4, "Press z to start the game", textStyle);
    this.startText.anchor.setTo(0.5, 0.5);
    this.startText.fixedToCamera = true;  
};

startState.update = function(){
    this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    if (this.zKey.isDown){
        game.state.start("MainGame");
        }    
};