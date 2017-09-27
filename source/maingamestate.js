// Create an empty object
var mainGameState = { };
    
// Add the preload function
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('player-ship', 'assets/images/player-ship.png');
    game.load.image('asteroid', 'assets/images/fish.png');
    game.load.audio('main-game-music', 'assets/music/maingame.mp3');
};

// Add the create function
mainGameState.create = function () {
    //background
    game.add.sprite(0, 0, 'space-bg');
    
    //Timer to handle asteroids
    this.asteroidTimer = 2.0;
    this.asteroids = game.add.group();
    
    //music
    var music = game.add.audio('main-game-music');
    //music.play();
    
    //physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //spaceship
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.95;
    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.scale.setTo(0.2, 0.2);
    this.playerShip.anchor.setTo(0.5, 0.5);
    
    this.cursors = game.input.keyboard.createCursorKeys();
    
    game.physics.arcade.enable(this.playerShip);
};

// Add the update function
mainGameState.update = function () {
    //styrning
    if (this.cursors.right.isDown) {
        this.playerShip.body.velocity.x = 200;
    } else if (this.cursors.left.isDown) {
        this.playerShip.body.velocity.x = -200;
    } else {
        this.playerShip.body.velocity.x = 0;
    }
    if (this.playerShip.x > game.width && this.playerShip.body.velocity.x > 0) {
        this.playerShip.body.velocity.x = 0;
    } else if (this.playerShip.x < 0 && this.playerShip.body.velocity.x < 0) {
        this.playerShip.body.velocity.x = 0;
    }
    
    //asteroider
    this.asteroidTimer -= game.time.physicsElapsed;
    
    if ( this.asteroidTimer <= 0.0 ) {
        this.spawnAsteroid();
        this.asteroidTimer = 2.0;
    }
    
    for (var i=0; i<this.asteroids.children.length; i++) {
        if ((this.asteroids.children[i].y) > (game.height)) {
            this.asteroids.children[i].destroy();
        }
    }
};

mainGameState.spawnAsteroid = function () {
    var asteroidX = game.rnd.integerInRange(50, 350);
    var asteroidScale = 0.2//game.rnd.integerInRange(0.05, 0.06);
    var asteroidRotate = game.rnd.integerInRange(-20, 20);
    
    this.asteroid = game.add.sprite(asteroidX, 0, 'asteroid');
    this.asteroid.anchor.setTo(0, 0);
    this.asteroid.scale.setTo(asteroidScale, asteroidScale);
    game.physics.arcade.enable(this.asteroid);
    this.asteroid.body.velocity.y = 100;
    this.asteroid.body.angularVelocity = asteroidRotate;
    this.asteroids.add(this.asteroid);
}