var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('game', gameState)
game.state.add('menu', menuState)

<<<<<<< HEAD
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
    //leftWalkAnimation = player.animations.add('left', [4,5,6,7], 10, true);
    //rightWalkAnimation = player.animations.add('right', [8,9,10,11], 10, true);
    preloadMap()
}

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.OVERLAP_BIAS = 0

    floor = game.add.group()
    floor.enableBody = true

    // dynamic floormap
    createMap()
    createWeapon()

    createLevel(1)
    createEnemies()

    //c = game.add.sprite(40, 0, 'test')

    character = game.add.sprite(320, 240, 'char');
    game.physics.arcade.enable(character)
    character.body.gravity.y = 1500
    character.body.collideWorldBounds = true;
    character.anchor.setTo(0.5, 0.5)
    game.camera.follow(character)

    let toggleWeapon = game.input.keyboard.addKey(Phaser.Keyboard.Q)
    toggleWeapon.onDown.add(() => switchWeapon())


}

function update() {

    if (createMapMode) {
        updateMapMarker()
    } else {
        if (game.input.activePointer.isDown) {
            fire(weaponType);
        }
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

    game.physics.arcade.collide(enemies, floorLayer)
    game.physics.arcade.collide(floor, floorLayer)
    game.physics.arcade.collide(enemies, map)
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
    game.physics.arcade.collide(arrows, map, function(arrows){arrows.kill();})
    //kill(); dont know why this is here
    console.log("arrows.x:"+ arrows.x + " and arrows.y: "+ arrows.y)
      //explode(enemy);
      //destroySprite(enemy)
    character.body.velocity.x = 0

    if (game.input.keyboard.downDuration(Phaser.Keyboard.E, 1)) //Create test enemy to the right of the character
      {
        createSingleEnemy(character.x + 200, character.y - 150, 'enemy1')
      }

  if (game.input.keyboard.isDown(Phaser.Keyboard.A)) //WALK LEFT
    {
        //character.x -= speed;
        character.body.velocity.x -= 200
        character.angle = -15;
        lookRight = false
        //character.play('leftWalkAnimation') = implement once spritesheet is done
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.D)) //WALK RIGHT
    {
        //character.x += speed;
        character.body.velocity.x += 200
        character.angle = 15;
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

      enemy.body.velocity.x = -1 * (enemy.x-character.x)/3 //move towards character
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

    for (let i = 25; i < 50; i++) {
        data.push({index: 0, x: i, y:12})
    }

    return data
}
function gameOver(){
  character.kill()
  isDead = true
  game.stage.backgroundColor = '#992d2d';
}
=======
game.state.start('game')
>>>>>>> 246639268da59f3487fa0ce2ba5a17eda0bcb04d
