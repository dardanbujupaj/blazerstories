var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var character, floor
var speed = 4
var arrow
var enemy
var sprite

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
}

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)


    floor = game.add.group()
    floor.enableBody = true
    arrow = game.add.group();
    arrow.enableBody = true;

    enemy = game.add.group()
    enemy.enableBody = true

    for (var i = 0; i < 30; i++) {
        var tile = floor.create(i * 32, 300, 'test')
        tile.body.immovable = true
    }
    floor.create(0, 360, 'groundTile1');
    floor.create(0, 400, 'groundTile2');
    floor.create(200, 120, 'groundTile6');
    floor.create(-60, 120, 'groundTile7');
    floor.create(900, 170, 'groundTile8');

    arrow.physicsBodyType = Phaser.Physics.ARCADE;
    arrow.createMultiple(50, 'arrow');
    arrow.setAll('checkWorldBounds', true);
    arrow.setAll('outOfBoundsKill', true);
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

  if (game.input.activePointer.isDown)
      {
          fire();
      }

    game.physics.arcade.collide(character, floor)
    game.physics.arcade.collide(enemy, floor)
    game.physics.arcade.collide(enemy, character)
    if (game.physics.arcade.collide(arrow, enemy)){
      explode(enemy);
      destroySprite(enemy)

    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.E))
      {
        createEnemy()
      }
  if (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        character.x -= speed;
        character.angle = -15;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        character.x += speed;
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
function fire() {

    if (game.time.now > nextFire && arrow.countDead() > 0)
    {
      console.log("fire")
        nextFire = game.time.now + fireRate;
        var shot = arrow.getFirstDead();
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
