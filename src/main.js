var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    console.log("preload")
    var test = game.load.image('test', 'assets/c.png')

}

function create() {
    console.log("create")
    game.physics.startSystem(Phaser.Physics.ARCADE)
    var c = game.add.sprite(0,0,'test')
    game.physics.arcade.enable(c)
    c.body.gravity.y = 100

}

function update() {
}
