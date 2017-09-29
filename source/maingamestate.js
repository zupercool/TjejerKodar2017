// Create an empty object
var mainGameState = {
    
};
  


// Add the preload function
mainGameState.preload = function () {
    console.log("Pre-loading the Game");
    game.load.image('space-bg', 'assets/images/space-bg.jpg');
    game.load.image('player-ship', 'assets/images/player-ship.png');
    game.load.image('asteroid', 'assets/images/fish.png');
    game.load.image('bullet_fire', 'assets/images/bullet-fire.png');
    game.load.image('taco', 'assets/images/taco.png');
    //game.load.image('');
    game.load.audio('main-game-music', 'assets/music/maingame.mp3');
    game.load.audio('player_fire', 'assets/audio/player_fire_01.mp3');
    game.load.audio('asteroid_hit', 'assets/audio/asteroid_hit_01.mp3');
    game.load.audio('asteroid_death', 'assets/audio/asteroid_death_01.mp3');
    game.load.audio('player_hit', 'assets/audio/player_hit_01.mp3');
};



// Add the create function
mainGameState.create = function () {
    // Background
    //game.add.sprite(0, 0, 'space-bg');
    

    
    //TODO: make a print_score() function mm
    var textStyleText = {fill: "white", font: "18px Arial", align: "center"}
    var textStyleNumber = {fill: "white", font: "16px Arial", align: "center"}
    
    // Player score and lives
    this.playerLives = 3;
    this.playerScore = 0;
    this.printScore(textStyleText, textStyleNumber);
    this.printLives(textStyleText, textStyleNumber);
    
    // Level
    this.level = 1;
    
    // Asteroids
    this.asteroidTimerTemp = 0;
    this.asteroidTimer = 2.0;
    this.asteroidSpeed = 100;
    this.asteroids = game.add.group();
    
    // Bullets
    this.bulletTimerTemp = 0;
    this.bulletTimer = 0.3;
    this.bulletTimerBoost = 0.6;
    this.bulletSpeed = 100;
    this.bulletSpeedBoost = 150;
    this.bullets = game.add.group();
    
    // Boost
    this.boostTimerTemp = 5.0;
    this.boostTimer = 5.0;
    this.boostSpeed = 100;
    this.boosts = game.add.group();
    
    // Music
    var music = game.add.audio('main-game-music');
    //music.play();
    
    // Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    // Spaceship
    var shipX = game.width * 0.5;
    var shipY = game.height * 0.9;
    this.playerShip = game.add.sprite(shipX, shipY, 'player-ship');
    this.playerShip.scale.setTo(0.2, 0.2);
    this.playerShip.anchor.setTo(0.5, 0.5);
    
    this.cursors = game.input.keyboard.createCursorKeys();
    
    game.physics.arcade.enable(this.playerShip);
    this.playerShip.body.immovable = true;
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
    
    //Bullets
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.bulletTimerTemp -= game.time.physicsElapsed;
    if (this.fireKey.isDown && this.bulletTimerTemp <= 0.0) {
        this.shootBullets(this.bulletSpeed, 'bullet_fire');
        this.bulletTimerTemp = this.bulletTimer;
        }
    
    // Asteroids
    this.asteroidTimerTemp -= game.time.physicsElapsed;
    if (this.asteroidTimerTemp <= 0.0) {
        this.spawnAsteroid();
        this.asteroidTimerTemp = this.asteroidTimer;
    }
    
    // Boost
    this.boostTimerTemp -= game.time.physicsElapsed;
    if (this.boostTimerTemp <= 0.0) {
        this.spawnBoost();
        this.boostTimerTemp = this.boostTimer;
    }
    //TODO
    
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
    for (var i=0; i<this.boosts.children.length; i++) {
        if (this.boosts.children[i].y > (game.height)) {
            this.boosts.children[i].destroy();
            }
    }
    
    //Collisions
    game.physics.arcade.collide(this.asteroids, this.bullets, mainGameState.onAsteroidBulletCollision, null, this);
    game.physics.arcade.collide(this.asteroids, this.playerShip, mainGameState.onAsteroidPlayerCollision, null, this);
    game.physics.arcade.collide(this.boosts, this.playerShip, mainGameState.onBoostPlayerCollision, null, this);
    
    // Lives and score
    this.playerScoreNumber.setText(this.playerScore);
    this.playerLivesNumber.setText(this.playerLives);
    if (this.playerScore > this.level*10) {
        this.level += 1;
        this.asteroidSpeed = this.asteroidSpeed*1.05;
        this.asteroidTimer = this.asteroidTimer*0.95;
        }
    
    if (this.playerLives < 1) {
        mainGameState.gameOver();
        } 
};



mainGameState.printLives = function (textStyleText, textStyleNumber) {
    this.playerLivesText = game.add.text(game.width*0.9, game.height*0.05, "LIVES", textStyleText);
    this.playerLivesNumber = game.add.text(game.width*0.9, game.height*0.1, this.playerLives, textStyleNumber);
    this.playerLivesText.anchor.setTo(0.5, 0.5);
    this.playerLivesNumber.anchor.setTo(0.5, 0.5);
    this.playerLivesText.fixedToCamera = true;
    this.playerLivesNumber.fixedToCamera = true;
}

mainGameState.printScore = function (textStyleText, textStyleNumber) {
    this.playerScoreText = game.add.text(game.width*0.13, game.height*0.05, "SCORE", textStyleText);
    this.playerScoreNumber = game.add.text(game.width*0.13, game.height*0.1, this.playerScore, textStyleNumber);
    this.playerScoreText.anchor.setTo(0.5, 0.5);
    this.playerScoreNumber.anchor.setTo(0.5, 0.5);
    this.playerScoreText.fixedToCamera = true;
    this.playerScoreNumber.FixedToCamera = true;
};



mainGameState.shootBullets = function (bulletSpeed, bulletSprite) {
    var bulletX = this.playerShip.position.x - 14;
    this.bullet = game.add.sprite(bulletX, game.height*0.8, bulletSprite);
    game.physics.arcade.enable(this.bullet);
    this.bullet.body.velocity.y = -bulletSpeed;
    this.bullets.add(this.bullet);
    var player_fire = game.add.audio('player_fire');
    //player_fire.play();
};



mainGameState.spawnAsteroid = function () {
    var asteroidX = game.rnd.integerInRange(50, 350);
    var asteroidScale = 0.17//game.rnd.integerInRange(0.05, 0.06);
    var asteroidRotate = game.rnd.integerInRange(-20, 20);
    this.asteroid = game.add.sprite(asteroidX, 0, 'asteroid');
    this.asteroid.anchor.setTo(0, 0);
    this.asteroid.scale.setTo(asteroidScale, asteroidScale);
    game.physics.arcade.enable(this.asteroid);
    this.asteroid.body.velocity.y = this.asteroidSpeed;
    this.asteroid.body.angularVelocity = asteroidRotate;
    this.asteroids.add(this.asteroid);
};

mainGameState.spawnBoost = function () {
    var boostX = game.rnd.integerInRange(50, 350);
    var boostScale = 0.15
    this.boost = game.add.sprite(boostX, 0, 'taco');
    this.boost.anchor.setTo(0, 0);
    this.boost.scale.setTo(boostScale, boostScale);
    game.physics.arcade.enable(this.boost);
    this.boost.body.velocity.y = this.boostSpeed;
    this.boosts.add(this.boost);
};


// Asteroid and bullet collision
//TODO: Asteroiden ska inte dö vid första skottet
mainGameState.onAsteroidBulletCollision = function (object1, object2) {
    if ((object1.key.includes("asteroid") && object2.key.includes("bullet")) || (object2.key.includes("asteroid") && object1.key.includes("bullet"))){
        object1.pendingDestroy = true;
        object2.pendingDestroy = true;
        var asteroid_hit = game.add.audio('asteroid_hit');
        //asteroid_hit.play();
        this.playerScore += 10;
    }    
};


// Destroy asteroid
mainGameState.destroyAsteroid = function(asteroid){
    asteroid.pendingDestroy = true;
    //var asteroid_death = game.add.audio('asteroid_death');
    //asteroid_death.play();
    playerScore += 10;
};



// Asteroid and player collision
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



mainGameState.onBoostPlayerCollision = function (object1, object2) {
    if (object1.key.includes("boost")){
        object1.pendingDestroy = true;
        } else {
        object2.pendingDestroy = true;
        }
    this.bulletSpeed = this.bulletSpeed*1.1;
};



mainGameState.gameOver = function() {
    console.log("GAME OVER!");
    game.state.start("GameOver");
};



