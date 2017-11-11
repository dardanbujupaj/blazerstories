var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

var character, floor
var speed = 4
var arrows
var enemy
var sprite
var map, floorLayer
var createMapMode = false


var fireRate = 100;
var nextFire = 0;

function preload() {
    console.log("preload")
    var test = game.load.image('test', 'assets/test.png')

    game.world.setBounds(0,0,1280,600)
    game.load.image('groundTile1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_001.png')
    game.load.image('groundTile2', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_002.png')
    game.load.image('groundTile6', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_006.png')
    game.load.image('groundTile7', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_007.png')
    game.load.image('groundTile8', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_008.png')
    game.load.image('enemy1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_040.png')
    game.load.image('char', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_055.png')
    game.load.image('arrow2', 'assets/arrow_minecraft_1.png')

    game.load.image('arrow', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_070.png')
    game.load.spritesheet('explosion', 'assets/animations/explosion1.png', 216, 209, 15)


    preloadMap()
}

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)


    floor = game.add.group()
    floor.enableBody = true

    arrows = game.add.group();
    arrows.enableBody = true;

    enemy = game.add.group()
    enemy.enableBody = true

    // dynamic floormap
    createMap()


    floor.create(0, 360, 'groundTile1');
    floor.create(0, 400, 'groundTile2');
    floor.create(200, 120, 'groundTile6');
    floor.create(-60, 120, 'groundTile7');
    floor.create(900, 170, 'groundTile8');

    arrows.physicsBodyType = Phaser.Physics.ARCADE;
    arrows.createMultiple(50, 'arrow');

    arrows.setAll('checkWorldBounds', true);
    arrows.setAll('outOfBoundsKill', true);
    //c = game.add.sprite(40, 0, 'test')



    character = game.add.sprite(320, 240, 'char');
    game.physics.arcade.enable(character)
    character.body.gravity.y = 500
    character.body.collideWorldBounds = true;
    character.anchor.setTo(0.5, 0.5)
    game.camera.follow(character)

    createEnemy()
}

function update() {

    if (createMapMode) {
        updateMapMarker()
    } else {
        if (game.input.activePointer.isDown) {
            fire();
        }
    }


    game.physics.arcade.collide(character, floor)
    game.physics.arcade.collide(character, floorLayer)
    game.physics.arcade.collide(enemy, floorLayer)
    game.physics.arcade.collide(floor, floorLayer)
    game.physics.arcade.collide(enemy, map)
    game.physics.arcade.collide(enemy, character)
    game.physics.arcade.collide(arrows, floorLayer, function(arrows){arrows.kill();})
    game.physics.arcade.overlap(arrows, enemy, function(enemy, arrows){arrows.kill(); explode(enemy); enemy.kill();})
      //explode(enemy);
      //destroySprite(enemy)



    character.body.velocity.x = 0

    if (game.input.keyboard.downDuration(Phaser.Keyboard.E, 1))
      {
        createEnemy()
      }
  if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        //character.x -= speed;
        character.body.velocity.x -= 200
        character.angle = -15;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        //character.x += speed;
        character.body.velocity.x += 200
        character.angle = 15;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        character.y -= speed;
        character.angle = 25;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        character.y += speed;
        character.angle = -25;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        character.body.velocity.setTo(0, -400);
    }
    else
    {

        //character.rotation = 0;
    }

}

function render() {
    game.debug.text(game.input.mousePointer.x + "/" + game.input.mousePointer.y, 0, 15)
    game.debug.text("edit: " + createMapMode, 0, 30)
}

function fire() {

    if (game.time.now > nextFire && arrows.countDead() > 0)
    {
      console.log("fire")
        nextFire = game.time.now + fireRate;
        var shot = arrows.getFirstDead();
        shot.anchor.setTo(0.9,0.5)
        shot.rotation = game.physics.arcade.angleToPointer(character)
        shot.reset(character.x, character.y);
        game.physics.arcade.moveToPointer(shot, 300);
    }

}

function explode(enemy){
  console.log("BOOM")
  createAnimation(enemy.x, enemy.y)

  //enemy.events.onInputDown.add(destroySprite, this);
}
function createAnimation(x, y){
  sprite = game.add.sprite(x, y, 'explosion')
  sprite.anchor.setTo(0.5,0.5)
  sprite.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14])
  sprite.animations.play('explode', 15, false, true)
  sprite.scale.set(0.2)
  sprite.smoothed = false

}
function destroySprite (sprite){
  sprite.destroy()
}

function createEnemy(){
  enemy = game.add.sprite(500, 100, 'enemy1')
  game.physics.arcade.enable(enemy)
  enemy.body.gravity.y = 500
  enemy.body.collideWorldBounds = true;
  enemy.anchor.setTo(0.5, 0.5)
}



// Map stuff

function preloadMap() {
    // loading tilesets
    game.load.image('testTileImage', '../assets/test.png')
    // game.load.image('secondTileset', '../assets/seconttileset.png')

    // load Map JSON?

}

function createMap() {
    map = game.add.tilemap()
    map.addTilesetImage('testTileImage')
    floorLayer = map.create('layer1', 50, 50, 32, 32)

    // Mockup map
    for (let i = 0; i < 20; i++) {
        map.putTile(0, i, 10, floorLayer)
    }
    for (let i = 22; i < 50; i++) {
        map.putTile(0, i, 15, floorLayer)
    }

    for (let i = 25; i < 50; i++) {
        map.putTile(0, i, 12, floorLayer)
    }

    map.setCollision([0], true, floorLayer)

    // add Tiles
    //gameObject.input.addMoveCallback(function () {
    //    let pointer = gameObject.input.mousePointer
    //    if (pointer.isDown) {
    //        let tile = map.putTileWorldXY(0, pointer.x, pointer.y, layer)
    //    }
    //})
    let toggleKey = game.input.keyboard.addKey(Phaser.Keyboard.M)
    toggleKey.onDown.add(() => createMapMode = !createMapMode)
}

function updateMapMarker() {
    let pointer = game.input.mousePointer
    if (pointer.isDown) {
        let tileId
        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            tileId = -1
        } else {
            tileId = 0
        }
        let tile = map.putTileWorldXY(tileId, pointer.worldX, pointer.worldY, 32, 32, floorLayer)
    }

}
