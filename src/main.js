var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var character, floor
var speed = 4

function preload() {
    console.log("preload")
    var test = game.load.image('test', 'assets/test.png')

    game.world.setBounds(0,0,1280,600)
    game.load.image('groundTile1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_001.png')
    game.load.image('groundTile2', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_002.png')
    game.load.image('groundTile6', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_006.png')
    game.load.image('groundTile7', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_007.png')
    game.load.image('groundTile8', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_008.png')
    game.load.image('char', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_055.png')

}

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)

    floor = game.add.group()
    floor.enableBody = true

    for (var i = 0; i < 20; i++) {
        var tile = floor.create(i * 32, 300, 'test')
        tile.body.immovable = true
    }


    //c = game.add.sprite(40, 0, 'test')

    game.add.sprite(0, 360, 'groundTile1');
    game.add.sprite(0, 400, 'groundTile2');
    game.add.sprite(200, 120, 'groundTile6');
    game.add.sprite(-60, 120, 'groundTile7');
    game.add.sprite(900, 170, 'groundTile8');

    character = game.add.sprite(320, 240, 'char');
    game.physics.arcade.enable(character)
    character.body.gravity.y = 100
    character.anchor.setTo(0.5, 0.5)
    game.camera.follow(character)
}

function update() {

    game.physics.arcade.collide(character, floor)

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        character.x -= speed;
        character.angle = -15;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        character.x += speed;
        character.angle = 15;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        character.y -= speed;
        character.angle = 75;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        character.y += speed;
        character.angle = -75;
    }
    else
    {
        character.rotation = 0;
    }

}
