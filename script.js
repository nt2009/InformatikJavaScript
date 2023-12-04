let canvas = document.getElementById('snake-canvas')
let context = canvas.getContext('2d')
let startButton = document.getElementById('start-button')
let isStarted = false
let areaWidth = canvas.width / 20
let areaHeight = canvas.height / 20

class Direction {
    
    constructor(name) {
        this.name = name
    }

    static UP = new Direction('UP')
    static DOWN = new Direction('DOWN')
    static RIGHT = new Direction("RIGHT")
    static LEFT = new Direction("LEFT")

}

let snakeBasicItem;
const placeSnakeBasicItem = () => {
    let x = Math.floor(Math.random() * 20)
    let y = Math.floor(Math.random() * 20)
    snakeBasicItem = {
        positionX: x,
        positionY: y
    }
}

const drawElement = (x, y) => {
    context.fillRect(x * areaWidth, y * areaHeight, areaWidth - 1, areaHeight - 1)
}

placeSnakeBasicItem()
const initialUpdateScreen = () => {
    context.fillStyle = 'white'
    drawElement(snakeBasicItem.positionX, snakeBasicItem.positionY)
    requestAnimationFrame(updateScreen)
}

const updateScreen = () => {
    placeSnakeBasicItem()
    drawElement(snakeBasicItem.positionX, snakeBasicItem.positionY)
}

const onStartClick = () => {
    context.fillStyle = 'aqua'
    context.fillRect(0, 0, canvas.width, canvas.height)
    initialUpdateScreen()
}
startButton.addEventListener('click', onStartClick)

let snakeDirection = Direction.RIGHT
const handleKeyInput = (event) => {
    if(!(isStarted)) return
    if(event.keyCode == 87) {
        snakeDirection = Direction.UP
        updateScreen()
    }
    if(event.keyCode == 65) {
        snakeDirection = Direction.LEFT
    }
    if(event.keyCode == 83) {
        snakeDirection = Direction.DOWN
    }
    if(event.keyCode == 68) {
        snakeDirection = Direction.RIGHT
    }
    console.log(snakeDirection)
}
document.addEventListener('keydown', handleKeyInput)