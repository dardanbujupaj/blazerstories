
var gameState = {
    preload: preload,
    create: create,
    update: update,
    render: render
}
var bg
var character, floor
var speed = 4
var arrows

var sprite
var map, floorLayer

let tileIndex = 0
var createMapMode = false
var weaponNumber = 1
var weaponType = 'arrow'
var fireRate = 300;
var nextFire = 0;

var enemyCreateRate = 500;
var levelNumber = 1
var jumps = 0
var lookRight = true
var allowJump = true
var isDead = false
var weaponSpeed = 600

var levelEndX

//enemies:
var enemies
var enemyBullet
var livingEnemies = [];
var enemyType = 'pacmanLauncher'
var nextEnemy = 0;
var enemySpawnRAte = 4000
var firingTimer1 = 0;

var enemyShitroller


function preload() {
    console.log("preload")
    var test = game.load.image('test', 'assets/test.png')

    game.load.image('groundTile1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_001.png')
    game.load.image('groundTile2', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_002.png')
    game.load.image('groundTile6', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_006.png')
    game.load.image('groundTile7', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_007.png')
    game.load.image('groundTile8', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_008.png')
    game.load.image('enemy1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_040.png')

    game.load.image('char', 'assets/images/mainC.png')
    game.load.image('background', 'assets/images/BG.png')
    game.load.image('arrow2', 'assets/arrow_minecraft_1.png')
    game.load.image('arrow', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_070.png')
    game.load.spritesheet('explosion', 'assets/animations/explosion1.png', 216, 209, 15)
    //enemy:
    game.load.image('enemyBullet1', 'assets/kenney_platformerpack_industrial/PNG/Default_size/platformIndustrial_041.png')
    game.load.spritesheet('pacmanBullet','assets/images/bullet.png', 41, 32, 3)
    game.load.spritesheet('shitroller1','assets/images/shitroller.png', 42, 31, 3)//SHIT SKATEBOARD
    game.load.image('pacmanLauncher', 'assets/images/bulletshooter.png')
    //leftWalkAnimation = player.animations.add('left', [4,5,6,7], 10, true);
    //rightWalkAnimation = player.animations.add('right', [8,9,10,11], 10, true);


    game.world.setBounds(0,0,2300,600)
    preloadMap()
}

function create() {
    bg = game.add.tileSprite(-200, -500, 2400, 1200, 'background');

    console.log("create")
    //game.stage.backgroundColor = '#FFFF21';
    // Press ESC to go to menu
    let menu = game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    menu.onDown.add(() => {
        //game.state.start("menu")
        game.paused = !game.paused

    })

    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.OVERLAP_BIAS = 0

    floor = game.add.group()
    floor.enableBody = true

    // dynamic floormap
    createMap()
    createWeapon()

    createLevel(1)
    createEnemies()
    createEnemyBullets()
    createEnemyShitRollers()

    //c = game.add.sprite(40, 0, 'test')

// create character model, initiate it
    character = game.add.sprite(320, 240, 'char');
    game.physics.arcade.enable(character)
    character.body.gravity.y = 1500
    character.body.collideWorldBounds = true;
    character.anchor.setTo(0.5, 0.5)
    game.camera.follow(character)

    //Switch weapon on Q toggle
    let toggleWeapon = game.input.keyboard.addKey(Phaser.Keyboard.Q)
    toggleWeapon.onDown.add(() => switchWeapon())

    stateText = game.add.text(800, 300, ' ', {font: '84px Arial', fill: "#fff"})
    stateText.anchor.setTo(0.5, 0.5)
    stateText.visible = false;
}

function update() {

    if (endOfMap()){
      stateText.text = "Finished Map " + mapName;
      stateText.visible = true;
    }
    bg.tilePosition.set(game.camera.x * 0.5, game.camera.y * 0.5)
    character.body.velocity.x = 0 // make him still as long as nothing happens
    if (createMapMode) {
        updateMapMarker()
    } else {
        if (game.input.activePointer.isDown) {
            fire(weaponType);
        }
    }
    if (character.body.onFloor()){
      gameOver()
    }
    game.physics.arcade.collide(floor, character,
      function(floor, character) {
        jumps = 0;
        allowJump = true
        console.log("touching floor, jumps=0, allowJump = true")
        /*if(character.body.touching.down == true){ //TRYING TO GET COLLISION TO WORK: FROM SIDE OF PLATFORM
          jumps = 0;
          allowJump = true
          console.log("touching floor, jumps=0, allowJump = true")
          }
        else {
          if (character.body.touching.left == true || character.body.touching.right == true) {
          jumps = 1;
          allowJump = true
          console.log("touching floor, jumps=1, allowJump = true")
        }}*/
      }
  )// character + floor collision: Wall jumps only 1 additional, ground 2 addiditional
    game.physics.arcade.collide(floorLayer, character,

      function(floorLayer, character){ //TRYING TO GET COLLISION TO WORK: FROM SIDES OF PLATFORMS
        jumps = 0;
        allowJump = true
        //console.log("touching floorLayer, jumps=0, allowJump = true")
        //console.log("up: " + floorLayer.body.touching.up + "  down: " + floorLayer.body.touching.down + "  right: " + floorLayer.body.touching.right + "  left: " + floorLayer.body.touching.left)
        /*
        if(floorLayer.body.touching.up == true){
          jumps = 0;
          allowJump = true;
          console.log("touching floorLayer, jumps=0, allowJump = true")
        }
        if (floorLayer.body.touching.left == true || floorLayer.body.touching.right == true) {
          jumps = 1;
          allowJump = true;
          console.log("touching floorLayer side, jumps=1, allowJump = true")
        }
        else{
          allowJump = true
        }*/
      }
  )// character + floor collision: Wall jumps only 1 additional, ground 2 addiditional


    if (game.time.now > firingTimer1){
      enemyBulletFires();
      firingTimer1 = game.time.now + 1500
    }


    game.physics.arcade.collide(enemies, floorLayer)
    game.physics.arcade.collide(floor, floorLayer)
    game.physics.arcade.collide(enemies, map)
    game.physics.arcade.collide(enemyShitrollers, floorLayer)
    game.physics.arcade.collide(enemyShitrollers, character,
      function(character, enemyShitrollers){
        enemyShitrollers.kill();
        destroySprite(enemyShitrollers);
        if(character.body.touching.up == true){
          //enemyShitrollers.body.velocity.y -= 200
        }
        else {
          gameOver();
        }
  })

    game.physics.arcade.collide(enemyBullets, character,
      function(character, enemyBullets){
      enemyBullets.kill();
      destroySprite(enemyBullets);
      if(character.body.touching.down == true){
        character.body.velocity.y -= 800
      }
      else {
        gameOver();
      }
    })
    game.physics.arcade.collide(enemies, character,
      function(character, enemies){
      jumps = 0;
      allowJump = true;
      //if(enemies.body.touching.up == true){character.velocity.y -= 200}
      console.log("up: " + enemies.body.touching.up + "  down: " + enemies.body.touching.down + "  right: " + enemies.body.touching.right + "  left: " + enemies.body.touching.left)
      if(enemies.body.touching.up == false && (enemies.body.touching.left == true || enemies.body.touching.right == true || enemies.body.touching.down == true))
      {gameOver()}
      else {
        if (character.body.velocity.y >=-580){character.body.velocity.y -= 600}
      }

    }
  )// enemies + character collision BOUNCE IF ON TOP, OTHERWISE "GAME OVER"

    //game.physics.arcade.collide(arrows, floorLayer, function(arrows){arrows.kill();})
    game.physics.arcade.overlap(arrows, floor, function(arrows){arrows.kill();})
    game.physics.arcade.overlap(arrows, enemies, function(arrows, enemies){arrows.kill(); destroySprite(enemies);})//if shot hits an enemy, kill enemy (1 shot), kill bullet
    game.physics.arcade.collide(arrows, map, function(arrows){arrows.kill();})


    if (game.input.keyboard.downDuration(Phaser.Keyboard.E, 1)) //Create test enemy to the right of the character
      {
        var random = game.rnd.integerInRange(0, 1)
        if (random == 1){
          enemyType = 'shitroller1'
          createShitroller(character.x + 300, character.y -50, enemyType)
        }
        else
        {
          enemyType = 'pacmanLauncher';
          createSingleEnemy(character.x + 200, character.y - 50, enemyType)
        }

      }

  if (game.input.keyboard.isDown(Phaser.Keyboard.A)) //WALK LEFT
    {
        //character.x -= speed;
        character.body.velocity.x -= 200
        character.angle = -3;
        lookRight = false
        //character.play('leftWalkAnimation') = implement once spritesheet is done

    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.D)) //WALK RIGHT
    {
        //character.x += speed;
        character.body.velocity.x += 200
        character.angle = 3;
        lookRight = true
        //character.play('rightWalkAnimation') = implement once spritesheet is done

    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.W)) //"GO UP, LOOK UP" - USELESS
    {
        //character.body.velocity.y -= speed;
        character.angle = 10;
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.S)) //"GO DOWN, LOOK DOWN" - USELESS
    {
        character.body.velocity.y += speed;
        character.angle = -5;
    }
  if (game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 1)) //JUMP, double jump
    {
        //ADD ANIMATION

        if (jumps < 2 && allowJump){
          jumps++
          console.log("jumps used:" + jumps)
          character.body.velocity.setTo(character.body.velocity.x, -530)
        }
        else {
          jumps = 0
          allowJump = false
        }
        //character.body.velocity.setTo(character.body.velocity.x, -530);
    }
}

function render() {
    game.debug.text(game.input.mousePointer.x + "/" + game.input.mousePointer.y, 0, 15)
    game.debug.text("bullets: " + arrows.countLiving(), 0, 45)
    game.debug.text("weaponNumber: " + weaponNumber, 0, 60)
    game.debug.text("weaponType: " + weaponType, 0, 75)
    game.debug.text("allowJump?: " + allowJump, 0, 90)
}

function createLevel(levelNumber){ //TEST TILES
  //load file "levelNumber" case 1 case 2 case 3
  levelEndX = 2200
  if (levelNumber == 1){
    floor.create(0, 360, 'groundTile1');
    floor.create(0, 400, 'groundTile2');
    floor.create(200, 120, 'groundTile6');
    floor.create(-60, 120, 'groundTile7');
    floor.create(900, 170, 'groundTile8');
  }
}

function explode(enemy){ //explosion at enemy position.
  console.log("BOOM at enemy.x:"+ enemy.x +" and enemy.y: "+ enemy.y)
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
function bounce(){
  character.velocity.y -= 600
}

function createEnemies(){
  enemies = game.add.group()
  enemies.enableBody = true
  //sprite(character.x + 200, character.y - 150, 'enemy1')
  enemies.physicsBodyType = Phaser.Physics.ARCADE;

  enemies.createMultiple(50, enemyType)
  //enemies.anchor.setTo(0.5, 0.5)
  enemies.setAll('collideWorldBounds', true);
  enemies.setAll('anchor.x', 0.5);
  enemies.setAll('anchor.y', 0.5);
  //enemies.setAll('gravity', 500)
  //enemies.setAll('outOfBoundsKill', false);
}

function createSingleEnemy(x, y, enemyType){
    //enemies.add.sprite(x, y, enemyType);
  if (game.time.now > nextEnemy && enemies.countDead() > 0)
  {
    console.log("create Enemy:" + enemyType)
      //enemiess.createMultiple(50, weaponType);
      nextEnemy = game.time.now + enemyCreateRate;
      var enemy = enemies.getFirstDead();
      enemy.anchor.setTo(0.5,0.5)
      enemy.body.gravity.y = 500
      enemy.reset(x, y);
      //enemy.body.velocity.x = -1 * (enemy.x-character.x)/6 //move towards character
    }
}


function switchWeapon(){
  weaponNumber++
  if (weaponNumber > 2){
    weaponNumber = 1;
  }
  if(weaponNumber == 1){weaponType = 'arrow'; weaponSpeed = 600}
  if(weaponNumber == 2){weaponType = 'arrow2'; weaponSpeed = 900}
  createWeapon()
}

function createWeapon(){
  arrows = game.add.group();
  arrows.enableBody = true;
  arrows.physicsBodyType = Phaser.Physics.ARCADE;
  arrows.createMultiple(50, weaponType);
  arrows.setAll('checkWorldBounds', true);
  arrows.setAll('outOfBoundsKill', true);
}

function fire(weaponType) {
    if (game.time.now > nextFire && arrows.countDead() > 0 && isDead == false)
    {
      console.log("fire")
        //arrows.createMultiple(50, weaponType);
        nextFire = game.time.now + fireRate;
        var shot = arrows.getFirstDead();
        shot.scale.setTo(0.5,0.5)
        shot.anchor.setTo(0.5,0.5)
        //shot.rotation = game.physics.arcade.angleToPointer(character)
        shot.reset(character.x, character.y);
        var direction
        if (lookRight){direction = 1; shot.rotation = 0}else{direction = -1; shot.rotation = 3.14}
        game.physics.arcade.moveToXY(shot, character.x+100*direction, character.y, weaponSpeed);
    }
}
function createEnemyBullets(){ //under create() called once
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, 'pacmanBullet');
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);
}

function createEnemyShitRollers(){
  enemyShitrollers = game.add.group();
  enemyShitrollers.enableBody = true;
  enemyShitrollers.physicsBodyType = Phaser.Physics.ARCADE;
  enemyShitrollers.createMultiple(30, 'shitroller1');
  enemyShitrollers.setAll('anchor.x', 0.5);
  enemyShitrollers.setAll('anchor.y', 0.5);
  enemyShitrollers.setAll('outOfBoundsKill', true);
  enemyShitrollers.setAll('checkWorldBounds', true);
}

function createShitroller(x, y){
  if (game.time.now > nextEnemy && enemyShitrollers.countDead() > 0)
  {
    console.log("create Enemy:" + enemyType)
      //enemiess.createMultiple(50, weaponType);
      nextEnemy = game.time.now + enemyCreateRate;
      enemyShitroller = enemyShitrollers.getFirstDead();
      enemyShitroller.body.gravity.y = 500
      enemyShitroller.reset(x, y)
      enemyShitroller.animations.add('shitroller1', [0,1,2,3,2,1])
      enemyShitroller.play('shitroller1', 16,  true, false)
  //enemyShitroller = enemyShitrollers.getFirstExists(false)
      game.physics.arcade.moveToXY(enemyShitroller, character.body.x , character.body.y, 100);}
}

function enemyBulletFires(){
  enemyBullet = enemyBullets.getFirstExists(false)
  livingEnemies.length = 0;
  //enemyBullet.scale.set(0.5)
  enemies.forEachAlive(function(enemy){
    livingEnemies.push(enemy);
  })
  if (enemyBullet && livingEnemies.length > 0){
    var random = game.rnd.integerInRange(0, livingEnemies.length-1) //for the game i dont want random.. i want all to fire at same rate.. beginning when in screen
    var shooter = livingEnemies[random];

    var enemyShootDirection;
    //if (shooter.body.x < character.x){enemyShootDirection = 1; }else{enemyShootDirection = -1;enemyBullet.scale.x *= -1}
    if (shooter.body.x > character.x){enemyShootDirection = -1; enemyBullet.scale.x = -1}else{enemyShootDirection = 1;}
    //enemyBullet.anchor.setTo(0.5, 0.5)
    enemyBullet.reset(shooter.body.x, shooter.body.y) //spawn bullet at enemy
    enemyBullet.animations.add('pacmanBullet', [0,1,2,3,2,1])
    enemyBullet.play('pacmanBullet', 16,  true, false)
    game.physics.arcade.moveToXY(enemyBullet,shooter.body.x+enemyShootDirection,shooter.body.y,180); //move bullet horizontally from enemy
  }
}

// Map stuff
function preloadMap() {
    // loading tilesets
    game.load.image('testTileImage', '../assets/test.png')
    // game.load.image('secondTileset', '../assets/seconttileset.png')
    // load Map JSON?
}

// Map stuff

function preloadMap() {
    // loading tilesets
    game.load.image('testTileImage', 'assets/images/row.png')
    // game.load.image('secondTileset', '../assets/seconttileset.png')

    // load Map JSON?

}

function createMap() {
    map = game.add.tilemap()
    map.addTilesetImage('testTileImage')
    floorLayer = map.create('layer1', 50, 50, 32, 32)

    try {
        createMapTiles(JSON.parse(localStorage.mapData))
    } catch (e) {
        console.debug("failed to load mapdata", e)
        createMapTiles(getMockupMap())
    }

    map.setCollisionByExclusion([], true, floorLayer)

    // add Tiles
    //gameObject.input.addMoveCallback(function () {
    //    let pointer = gameObject.input.mousePointer
    //    if (pointer.isDown) {
    //        let tile = map.putTileWorldXY(0, pointer.x, pointer.y, layer)
    //    }
    //})
    let toggleKey = game.input.keyboard.addKey(Phaser.Keyboard.M)
    toggleKey.onDown.add(() => createMapMode = !createMapMode)

    let up = game.input.keyboard.addKey(Phaser.Keyboard.UP)
    up.onDown.add(() => tileIndex++)

    let down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    down.onDown.add(() => tileIndex--)

    let exportKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    exportKey.onDown.add(() => {
        if (createMapMode) {
            exportMapDataAlert()
        }
    })
}

let saveMapTimeout

function updateMapMarker() {
    let pointer = game.input.mousePointer
    if (pointer.isDown) {
        let tileId
        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            tileId = -1
        } else {
            tileId = tileIndex
        }
        let tile = map.putTileWorldXY(tileId, pointer.worldX, pointer.worldY, 32, 32, floorLayer)



        clearTimeout(saveMapTimeout)
        saveMapTimeout = setTimeout(saveCurrentMap, 1000)
    }

}

function loadMapData() {


}

function exportMapDataAlert() {
    console.log("export")
    var a = document.createElement("a")
    var file = new Blob([localStorage.mapData], {type: 'text/json'})
    a.href = URL.createObjectURL(file)
    a.download = "map.json"
    a.click()
    console.log(a)
}


function saveCurrentMap() {
    var data = []
    console.log(floorLayer.layer.data)
    floorLayer.layer.data.forEach( row => {
        row.forEach ( tile => {
            data.push({index: tile.index, x: tile.x, y:tile.y})
        })
    })

    localStorage.mapData = JSON.stringify(data)
}

function createMapTiles(tiles) {
    tiles.forEach ( tile => {
        map.putTile(tile.index, tile.x, tile.y, floorLayer)
    })
}

function getMockupMap() {
    var data = []

    // Mockup map
    for (let i = 0; i < 20; i++) {
        data.push({index: 0, x: i, y:10})
    }
    for (let i = 22; i < 50; i++) {
        data.push({index: 0, x: i, y:15})
    }

    for (let i = 25; i < 90; i++) {
        data.push({index: 0, x: i, y:12})
    }

    return data
}
function endOfMap(){
  if (character.body.x >= levelEndX){
    stateText.text = "Yay you finished level x";
    stateText.visible = true;
    return true;
  }
  return false
}

function gameOver(){
  character.kill()
  isDead = true
  bg.kill();

  stateText.text = "Game Over";
  stateText.visible = true;
  game.stage.backgroundColor = '#992d2d';

}
