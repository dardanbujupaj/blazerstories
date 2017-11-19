var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('game', gameState)
game.state.add('menu', menuState)

game.state.start('game')
