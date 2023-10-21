// ------------------------W7----------------------------------------
// Things done: 
// game where player can move
// added two kinds of collectible stars, default yellow, rare purple stars gives x10 points
// timer, and alerts to show points if dead or time runs out
// shootable enemies, which kill on collide, shooting enemies gives +10 score
// randomized spawntimes
// modified input keys: arrowkeys movement, aim with mouse-cursor, shoot with Mouse1, jump UP-arrow
// should fill criteria for 5 points
// ------------------------------------------------------------------

// Configuration object for Phaser game instance
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#47c3fc",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let score = 0;  // The player's score
let scoreText;  // Text object to display the score
let initialTime = 20;  // Initial time for the timer
let timerText;  // Text object to display the time
let bullets;  // Group to hold bullet objects
let scoresArray = []; // scoreboard

// Preload assets for the game
function preload ()
{
    this.load.image('rareStar', 'assets/rareStar.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('pumpkinDude', 'assets/pumpkin_dude.png');
    this.load.spritesheet('dude', 
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 });
    this.load.image('bullet', 'assets/bullet.png');
}

// Custom Game functions:
// Collect a regular star, update score
function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 1;
    scoreText.setText('Score: ' + score);
}

// Spawn a regular star at a random X position
function spawnStar() {
    let randomX = Phaser.Math.Between(0, config.width);
    let star = this.physics.add.image(randomX, 0, 'star');
    star.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    this.physics.add.collider(star, platforms);
    this.physics.add.overlap(player, star, collectStar, null, this);
    this.time.delayedCall(5000, deleteStar, [star], this);
    stars.add(star);
}

// Spawn a rare star at a random X position
function spawnRareStar() {
    let randomX = Phaser.Math.Between(0, config.width);
    let rareStar = this.physics.add.image(randomX, 0, 'rareStar');
    rareStar.setScale(1.5);
    this.physics.add.collider(rareStar, platforms);
    this.physics.add.overlap(player, rareStar, collectRareStar, null, this);
    this.time.delayedCall(5000, deleteStar, [rareStar], this);
    stars.add(rareStar);
}

// Collect a rare star, update score
function collectRareStar (player, rareStar)
{
    rareStar.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}
// Delete a star (either regular or rare)
function deleteStar(star) {
    star.destroy();
}

// Update the timer, check if time has run out
function updateCounter() {
    initialTime -= 1;
    timerText.setText('Time: ' + initialTime);

    if (initialTime <= 0) {
        alert('Time is up! Your score is: ' + score);
        resetGame();
    }
}

function addScoreToScoreboard(score) {
    // If the score is 0, exit the function early
    if (score === 0) {
        return;
    }
    var playerName = document.getElementById('playerName').value;
    if (!playerName) {
        playerName = 'Anonymous';
    }
    var newScoreEntry = { name: playerName, score: score };
    // Load existing scores from localStorage, or initialize to an empty array if null
    var scoresArray = JSON.parse(localStorage.getItem('scores')) || [];
    // Add new score to scores array
    scoresArray.push(newScoreEntry);
    // Sort scores array by score in descending order
    scoresArray.sort(function(a, b) {
        return b.score - a.score;
    });
    // Save sorted scores array back to localStorage
    localStorage.setItem('scores', JSON.stringify(scoresArray.slice(0, 5)));  // Keep only the top 5 scores
    // Update the displayed scoreboard
    updateScoreboard();
}

function updateScoreboard() {
    var scoresArray = JSON.parse(localStorage.getItem('scores')) || [];
    var ol = document.querySelector('#scorediv #Scoreboard ol');
    ol.innerHTML = '';  // Clear existing list items
    scoresArray.forEach(function(scoreEntry) {
        var li = document.createElement('li');
        li.textContent = scoreEntry.name + ': ' + scoreEntry.score;
        ol.appendChild(li);
    });
}

// only to be called through console if need be
function clearScoreboard() {
    localStorage.removeItem('scores');
    updateScoreboard();  // Update the displayed scoreboard
}

// Reset the game state on game end
function resetGame() {
    addScoreToScoreboard(score);
    score = 0;
    enemies.clear(true, true);
    stars.clear(true, true);
    rareStars.clear(true, true);
    scoreText.setText('Score: ' + score);
    player.setPosition(config.width / 2, config.height / 2);
    initialTime = 20;
    timerText.setText('Time: ' + initialTime);
}

// Spawn an enemy on a random platform
function spawnEnemy() {
    let platformsArray = platforms.getChildren();
    let randomPlatform = Phaser.Utils.Array.GetRandom(platformsArray);
    let platformBounds = randomPlatform.getBounds();
    
    let enemy = enemies.create(platformBounds.centerX, platformBounds.top - 20, 'pumpkinDude');
    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(enemies, player);
    enemy.setScale(1.75);
    enemy.setCollideWorldBounds(true);
}

// Shoot a bullet towards the mouse pointer
function shootBullet() {
    let bullet = bullets.create(player.x, player.y, 'bullet');
    let pointer = this.input.activePointer;
    let angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);
    let velocity = this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 800);
    bullet.setVelocity(velocity.x, velocity.y);
    this.time.delayedCall(2000, function() {
        bullet.destroy();
    }, [], this);
}

// Handle collision between player and enemy
function hitEnemy(player, enemy) {
    alert('Game ended! Your score is: ' + score);
    resetGame();
}

// Handle collision between bullet and enemy
function bulletHitEnemy(bullet, enemy) {
    score += 10;
    scoreText.setText('Score: ' + score);
    bullet.destroy();
    enemy.destroy();
}
// Setup Phaser Scene
function create ()
{
    updateScoreboard();
    // keypress conflict with spacebar and game
    document.getElementById('playerName').addEventListener('keydown', function(event) {
        event.stopPropagation();
    });

    
    platforms = this.physics.add.staticGroup();
    // Create platforms
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(200, 400, 'ground');
    platforms.create(400, 100, 'ground');
    platforms.create(750, 220, 'ground');

    // Create player and animations
    player = this.physics.add.sprite(400, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);
    player.body.setGravityY(800);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Add collision between the player and platforms
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    // Create a physics group for stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 0,
        setXY: { x: 400, y: 0, stepX: 100 }
    });
    rareStars = this.physics.add.group();

    // Set UI text
    this.add.image(16, 20, "star")
    scoreText = this.add.text(32, 8, 'Score: 0', { fontSize: '30px', fill: '#fff' });
    timerText = this.add.text(650, 8, 'Time: ' + initialTime, { fontSize: '30px', fill: '#fff' });

    // Setup the timer event
    this.time.addEvent({
        delay: 1000,
        callback: updateCounter,
        callbackScope: this,
        loop: true
    });

    // Set the bounce value for each star
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    });

    // Add collision between stars and platforms
    this.physics.add.collider(stars, platforms);
     // Add overlap between player and stars to collect stars
    this.physics.add.overlap(player, stars, collectStar, null, this);

    // Setup events to spawn stars and rare stars at intervals
    this.time.addEvent({ delay: 1000, callback: spawnStar, callbackScope: this, loop: true });
    this.time.addEvent({ delay: Phaser.Math.Between(5000, 10000), callback: spawnRareStar, callbackScope: this, loop: true });
    
    // Setup an event to spawn enemies at random intervals
    enemies = this.physics.add.group();
    this.time.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    // Setup mouse1 and space input to shoot bullets
    this.input.on('pointerdown', shootBullet, this);

    // Add game end feature between player and enemies
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    // Add collision between bullets and enemies
    bullets = this.physics.add.group();
    this.physics.add.collider(bullets, enemies, bulletHitEnemy, null, this);

}

// mainly contains control checking
function update ()
{
    // Check for input on arrow keys or on WASD keys
    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if ((cursors.up.isDown) && player.body.touching.down)
    {
        player.setVelocityY(-660);
    }

    if (player.y > config.height || player.x < 0 || player.x > config.width) {
        alert('Game ended! Your score is: ' + score);
        resetGame();
    }
}
