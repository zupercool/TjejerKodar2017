// Create an empty object
var mainGameState = { };
    
// Add the preload function
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
};

// Add the create function
mainGameState.create = function () {
    game.add.sprite(0, 0, 'space-bg');
};

// Add the update function
mainGameState.update = function () {

};