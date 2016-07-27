// Enemies our player must avoid
var Enemy = function() {
    /**
    * @description Constructor for enemies that must be avoided. Enemies move across the gameboard at varying speeds and reset after leaving the gameboard.
    * @constructor
    * @param {string} sprite - The image file used for enemies
    * @param {int} x - Initial position along x axis, offscreen to the left by 110px
    * @param {int} y - Initial y position, generates values of 60, 145, 230, 315, or 400px, uses randomization from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    * @param {int} width - Width value of hitbox for enemies, used for collision detection
    * @param {int} height - Height value of hitbox for enemies, used for collision detection
    * @param {double} speed - Generated value for speed between 100 and 200, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    */
    this.sprite = 'images/enemy-bug.png';
    this.x = -110;
    this.y = 60 + (Math.floor(Math.random() * (4)) * 85);
    this.width = 85;
    this.height = 85;
    this.speed = Math.random() * (200 - 100) + 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    /**
    * @description Updates Enemy object location as gameloop runs, moving them across the screen based on Enemy's speed value
    * @param {double} dt - a time delta between ticks, used to maintain speed across different computers, from engine.js
    */
    this.x = this.x + (this.speed * dt);
    if (this.x > 500) {
        this.reset();
    };
};

Enemy.prototype.reset = function() {
    /**
    * @description Resets each Enemy after it leaves the righthand side of the gameboard, generating a new speed value for it
    */
    this.x = -110;
    this.y = 60 + (Math.floor(Math.random() * (4)) * 85); // Sets a new random row value
    this.speed = Math.random() * 200 + 100; // Generates a speed value between 100 and 300, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
};

Enemy.prototype.render = function() {
    /**
    * @description Uses the sprite value defined in constructor for each Enemy, set at initial x/y values
    */
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function() {
    /**
    * @description Constructor for player, set at predetermined starting position
    * @constructor
    * @param {string} sprite - The image file used for enemies
    * @param {int} height - Height value of hitbox for enemies, used for collision detection
    * @param {int} width - Width value of hitbox for enemies, used for collision detection
    * @param {int} x - Initial position along x axis, in middle column
    * @param {int} y - Initial position along y axis, in bottom row
    */
    this.sprite = 'images/char-boy.png';
    this.height = 60; // Width value adjusted to make collisions 'tighter' than full game tile size
    this.width = 60; // Height value adjusted to make collisions 'tighter' than full game tile size
    this.x = 202; // Sets initial x value to column 2 (of 0-4), with each column being 101px wide
    this.y = 400; // Sets initial y value to row 5 (of 0-5), with each row being 85px long
};

Player.prototype.update = function() {
    /**
    * @description Update function for player, used to check for collisions with enemies using Axis-aligned bounging box from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    * @description Loops over all Enemy objects in allEnemies array, performing Axis-aligned bounding box logic operations, which returns True when collision is detected between Player and an Enemy
    */
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + allEnemies[i].width &&
            this.x + this.width > allEnemies[i].x &&
            this.y < allEnemies[i].y + allEnemies[i].height &&
            this.height + this.y > allEnemies[i].y) {
                this.x = 202; // Reset to default X value when collision detected
                this.y = 400; // Reset to default Y value when collision detected
        };
    };
};

Player.prototype.handleInput = function(keyCode) {
    /**
    * @description Input handler, responsible for moving player and performing logic operations to detect if player is on edge of gameboard, preventing movement off of gameboard
    * @description Also handles winning conditions, checking if player is on top tile area after moving up
    * @param {int} stepvert - Height of each row; each 'step' up/down moves the player this much
    * @param {int} stephoriz - Width of each column; each 'step' left/right moves the player this much
    */
    var STEPVERT = 85;
    var STEPHORIZ = 101;
    switch (keyCode) {
        case 'up':
            this.y = this.y - STEPVERT;
            if (this.y < 60) { // Checks if player is on top game tile, fulfilling winning conditions
                this.x = 202; // Resets x value if game is won
                this.y = 400; // Resets y value if game is won
            };
            break;
        case 'down':
            if (this.y > 399) { // Checks if player is on bottom game tile
                break; // Does nothing, disallowing player from exiting gameboard
            };
            this.y = this.y + STEPVERT;
            break;
        case 'left':
            if (this.x < 101) { // Checks if player is on leftmost game tile
                break; // Does nothing, disallowing player from exiting gameboard
            };
            this.x = this.x - STEPHORIZ;
            break;
        case 'right':
            if (this.x > 303) { // Checks if player is on rightmost game tile
                break; // Does nothing, disallowing player from exiting gameboard
            };
            this.x = this.x + STEPHORIZ;
            break;
    };
};

Player.prototype.render = function() {
    /**
    * @description Renders player sprite at current x & y coordinates
    */
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Instantiating Enemy and Player objects; all Enemy objects added to allEnemies array, a list of Enemy objects
var inky = new Enemy;
var pinky = new Enemy;
var binky = new Enemy;
var other = new Enemy;
var allEnemies = [inky, pinky, binky, other];
var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
