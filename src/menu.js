var menuState = {
    preload: function () {
        console.log(game)
    },
    create: function () {
        console.debug("created menuState")


        let quitMenu = game.input.keyboard.addKey(Phaser.Keyboard.ESC)
        quitMenu.onDown.add(() => game.state.start('game'))
    },
    render: function () {
        game.debug.text("menu", 350, 300)
    }


}
