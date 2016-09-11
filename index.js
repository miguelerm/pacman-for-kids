
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-container', { preload: preload, create: create, update: update, render: render });

var pad1;
var letters = ['a', 'e', 'i', 'o', 'u'];
var index = 0;
var pacman;
var letter;
var cursor;
var chomp;
var isAudioPlaying;
var isAnimationPlaying;

function preload() {

    game.load.spritesheet('pacman', 'assets/sprites/pacman-spritesheet.png', 32, 32);
    game.load.audio('pacman-chomp', 'assets/audio/sound-effects/pacman-chomp.ogg');

    letters.forEach(function (l){
        game.load.image(l, 'assets/pics/' + l + '.png');
    });
}

function getRandomLocation() {
    var x = game.world.randomX;
    var y = game.world.randomY;
    if (x > 750) x = 750;
    if (y > 550) y = 550;
    return { x: x, y: y };
}

function create() {

    var location = getRandomLocation();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 800, 600);

    pacman = game.add.sprite(location.x, location.y, 'pacman', 4);
    pacman.anchor.set(0.5);

    chomp = game.add.audio('pacman-chomp');
    chomp.loopFull(0.4);

    location = getRandomLocation();
    letter = game.add.sprite(location.x, location.y, letters[index], 2);

    game.physics.arcade.enable([pacman, letter]);

    letter.body.immovable = true;

    pacman.animations.add('bite');
    pacman.animations.play('bite', 30, true);

    cursor = game.input.keyboard.createCursorKeys();
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
}

function update() {

    var isMoving = false;

    pacman.body.velocity.x = 0;
    pacman.body.velocity.y = 0;

    if (left())
    {
        pacman.body.velocity.x = -240;
        pacman.angle = 180;
        isMoving = true;
    }
    else if (right())
    {
        pacman.body.velocity.x = 240;
        pacman.angle = 0;
        isMoving = true;
    }

    if (up())
    {
        pacman.body.velocity.y = -240;
        pacman.angle = 270;
        isMoving = true;
    }
    else if (down())
    {
        pacman.body.velocity.y = 240;
        pacman.angle = 90;
        isMoving = true;
    }

    if (isMoving) {
        if (!isAudioPlaying) {
            chomp.resume();
            isAudioPlaying = true;
        }
        if (pacman.animations.paused) {
            pacman.animations.paused = false;
        }

    } else {
        chomp.pause();
        isAudioPlaying = false;
        pacman.animations.paused = true;
    }

    screenWrap(pacman);

    game.physics.arcade.collide(pacman, letter, eatLetter);
}

function left() {
    return cursor.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
}

function right() {
    return cursor.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
}

function up() {
    return cursor.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
}

function down() {
    return cursor.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;
}

function eatLetter() {
    index++;

    if (index >= letters.length) {
        index = 0;
    }

    var location = getRandomLocation();
    letter.loadTexture(letters[index]);
    letter.x = location.x;
    letter.y = location.y;
}

function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}

function render() {

}
