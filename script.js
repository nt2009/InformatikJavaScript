let canvas = document.getElementById('snake-canvas')
let context = canvas.getContext('2d')
let startButton = document.getElementById('start-button')
let isStarted = false
let canvasWidth = canvas.width / 30
let canvasHeight = canvas.height / 20

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
function placeSnakeBasicItem() {
    let x = Math.floor(Math.random() * 20)
    let y = Math.floor(Math.random() * 20)
    snakeBasicItem = {
        positionX: x,
        positionY: y
    }
}

function drawElement(x, y) {
    context.fillRect(x * canvasWidth, y * canvasHeight, canvasWidth - 1, canvasHeight - 1)
}

function initializeScreen() {
    placeSnakeBasicItem()
    drawElement(snakeBasicItem.positionX, snakeBasicItem.positionY)
}

function updateScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black'
    placeSnakeBasicItem()
    drawElement(snakeBasicItem.positionX, snakeBasicItem.positionY)
}

function onStartClick() {
    if(isStarted) {
        isStarted = false
        startButton.innerText = 'Spiel starten'
        canvas.classList.remove('active')
    } else {
        isStarted = true
        startButton.innerText = 'Spiel stoppen'
        canvas.classList.add('active')
        initializeScreen()
    }
}
startButton.addEventListener('click', onStartClick)

let snakeDirection = Direction.RIGHT
function handleKeyInput(event) {
    if(!(isStarted)) return
    if(event.keyCode == 87) {
        snakeDirection = Direction.UP
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
}
document.addEventListener('keydown', handleKeyInput)

function loopGame() {
    if(!(isStarted)) return
    updateScreen()
}
setInterval(loopGame, 1500)