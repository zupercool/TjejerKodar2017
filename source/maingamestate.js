// Create an empty object
var mainGameState = { };
    
// Add the preload function
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('player-ship', 'assets/images/player-ship.png');
};

// Add the create function
mainGameState.create = function () {
    game.add.sprite(0, 0, 'space-bg');
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.scale.setTo(0.2, 0.2);
    this.playerShip.anchor.setTo(0.5, 0.5);
};

// Add the update function
mainGameState.update = function () {

};