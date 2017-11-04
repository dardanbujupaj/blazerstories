var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {
    console.log("preload")
    var test = game.load.image('test', 'assets/test.png')

}

var floor, c

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)

    floor = game.add.group()
    floor.enableBody = true

    for (var i = 0; i < 10; i++) {
        var tile = floor.create(i * 32, 300, 'test')
        tile.body.immovable = true
    }


    c = game.add.sprite(40, 0, 'test')
    game.physics.arcade.enable(c)
    c.body.gravity.y = 100


}

function update() {
    game.physics.arcade.collide(c, floor)
}
