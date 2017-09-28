// Create an empty object
var mainGameState = {
    
};
  


// Add the preload function
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('player-ship', 'assets/images/player-ship.png');
    game.load.image('asteroid', 'assets/images/fish.png');
    game.load.image('bullet', 'assets/images/bullet-fire.png');
    
    game.load.audio('main-game-music', 'assets/music/maingame.mp3');
    game.load.audio('player_fire', 'assets/audio/player_fire_01.mp3');
    game.load.audio('asteroid_hit', 'assets/audio/asteroid_hit_01.mp3');
    game.load.audio('asteroid_death', 'assets/audio/asteroid_death_01.mp3');
    game.load.audio('player_hit', 'assets/audio/player_hit_01.mp3');
};



// Add the create function
mainGameState.create = function () {
    //background
    game.add.sprite(0, 0, 'space-bg');
    
    //player score
    var textStyleText = {
        fill: "white",
        font: "18px Arial",
        align: "center"
    }
    var textStyleNumber = {
        fill: "white",
        font: "16px Arial",
        align: "center"
    }
    this.playerScore = 0;
    this.playerScoreText = game.add.text(game.width*0.13, game.height*0.05, "SCORE", textStyleText);
    this.playerScoreNumber = game.add.text(game.width*0.13, game.height*0.1, this.playerScore, textStyleNumber);
    this.playerScoreText.anchor.setTo(0.5, 0.5);
    this.playerScoreNumber.anchor.setTo(0.5, 0.5);
    this.playerScoreText.fixedToCamera = true;
    this.playerScoreNumber.FixedToCamera = true;
    
    this.playerLives = 3;
    this.playerLivesText = game.add.text(game.width*0.9, game.height*0.05, "LIVES", textStyleText);
    this.playerLivesNumber = game.add.text(game.width*0.9, game.height*0.1, this.playerLives, textStyleNumber);
    this.playerLivesText.anchor.setTo(0.5, 0.5);
    this.playerLivesNumber.anchor.setTo(0.5, 0.5);
    this.playerLivesText.fixedToCamera = true;
    this.playerLivesNumber.fixedToCamera = true;
    
    //Asteroids
    this.asteroidTimer = 0;
    this.asteroids = game.add.group();
    
    //Bullets
    this.bulletTimer = 0;
    this.bullets = game.add.group();
    
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
    if (this.playerShip.body.velocity.y != 0){
            this.playerShip.body.velocity.y = 0;
        }
    
    //Bullets
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.bulletTimer -= game.time.physicsElapsed;
    
    if (this.fireKey.isDown && this.bulletTimer <= 0.0) {
        this.shootBullets();
        this.bulletTimer = 0.3;
        }
    
    //asteroider
    this.asteroidTimer -= game.time.physicsElapsed;
    
    if ( this.asteroidTimer <= 0.0 ) {
        this.spawnAsteroid();
        this.asteroidTimer = 2.0;
    }
    
    //Delete whats outside the screen
    for (var i=0; i<this.asteroids.children.length; i++) {
        if ((this.asteroids.children[i].y) > (game.height)) {
            this.asteroids.children[i].destroy();
        }
    }
    
    for (var i=0; i<this.bullets.children.length; i++) {
        if (this.bullets.children[i].y < 0) {
            this.bullets.children[i].destroy();
            }
    }
    
    //Collisions
    game.physics.arcade.collide(this.asteroids, this.bullets, mainGameState.onAsteroidBulletCollision, null, this);
    
    game.physics.arcade.collide(this.asteroids, this.playerShip, mainGameState.onAsteroidPlayerCollision, null, this);
    
    //lives and score
    this.playerScoreNumber.setText(this.playerScore);
    this.playerLivesNumber.setText(this.playerLives);
    if (this.playerLives < 1) {
        mainGameState.gameOver();
        }
};



mainGameState.shootBullets = function () {
    var bulletX = this.playerShip.position.x - 14;
    this.bullet = game.add.sprite(bulletX, game.height*0.8, 'bullet');
    game.physics.arcade.enable(this.bullet);
    this.bullet.body.velocity.y = -100;
    this.bullets.add(this.bullet);
    var player_fire = game.add.audio('player_fire');
    //player_fire.play();
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
};



//asteroid, bullet
mainGameState.onAsteroidBulletCollision = function (object1, object2) {
    object1.pendingDestroy = true;
    object2.pendingDestroy = true;
    var asteroid_hit = game.add.audio('asteroid_hit');
    //asteroid_hit.play();
    this.playerScore += 10;
    //var asteroid_death = game.add.audio('asteroid_death');
    //asteroid_death.play();
};



mainGameState.destroyAsteroid = function(asteroid){
    asteroid.pendingDestroy = true;
    playerScore += 10;
};



//asteroid, player
mainGameState.onAsteroidPlayerCollision = function (object1, object2) {
    if (object1.key.includes("asteroid")){
        object1.pendingDestroy = true;
        } else {
        object2.pendingDestroy = true;
        }
    
    this.playerLives --;
    var player_hit = game.add.audio('player_hit');
    //player_hit.play();
};



mainGameState.gameOver = function() {
    console.log("GAME OVER!");
    game.state.start("GameOver");
};



