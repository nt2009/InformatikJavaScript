const Settings = {
    ROWS: 20,
    COLUMNS: 30
}

const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT', 
    RIGHT: 'RIGHT'
}

let canvas = document.getElementById('snake-canvas')
let context = canvas.getContext('2d')
let rows = Settings.ROWS
let columns = Settings.COLUMNS
let snake = [{x: 10, y: 15}]
let food
let cellWidth = canvas.width / columns
let cellHeight = canvas.height / rows
let direction = Direction.LEFT
let foodCollected = false
let isStarted = false
let startButton = document.getElementById('start-button')
let image = new Image()
let itemPickupCount = 0
let pickupAudio = new Audio('assets/audio/snake-eat.mp3')
let errorAudio = new Audio('assets/audio/snake-error.mp3')

image.src = './assets/img/background-paused.png'
placeFood()

let gameInterval = setInterval(gameLoop, 100)
document.addEventListener('keydown', keyDown)
startButton.addEventListener('click', pressButton)
draw()

function draw() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height) 
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    if(isStarted) {
        context.fillStyle = 'blue'
        snake.forEach(part => add(part.x, part.y))
        context.fillStyle = '#c33f37'
        add(food.x, food.y)
        context.fillStyle = '#fc0307'
        context.font = '20px Open Sans'
        context.fillText(`Anzahl :  ${itemPickupCount}`, 10, 20)
    }
    requestAnimationFrame(draw)
}

function gameOver() {
    let firstPart = snake[0]
    let otherParts = snake.slice(1)
    let duplicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y)
    if(snake[0].x < 0 || snake[0].x > columns - 1 || snake[0].y < 0 || snake[0].y > rows - 1 || duplicatePart) {
        if(document.exitFullscreen) document.exitFullscreen()
        image.src = './assets/img/background-paused.png'
        placeFood()
        snake = [{x: 20, y: 15}]
        direction = Direction.LEFT
        startButton.innerText = 'Spiel starten'
        isStarted = false
        itemPickupCount = 0
        clearInterval(gameInterval)
        errorAudio.play()
        canvas.classList.remove('active')
    }
}

function placeFood() {
    let randomX = Math.floor(Math.random() * columns)
    let randomY = Math.floor(Math.random() * rows)
    food = {x: randomX, y: randomY}
}

function add(x, y) {
    context.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1)
}

function shiftSnake() {
    for(let i = snake.length - 1; i > 0; i--) { 
        let part = snake[i]
        let lastPart = snake[i - 1]
        part.x = lastPart.x
        part.y = lastPart.y
    }
}

function gameLoop() {
    if(!(isStarted)) return
    gameOver()
    if(foodCollected) {
        snake = [{x: snake[0].x, y: snake[0].y}, ...snake]
        foodCollected = false
    }
    shiftSnake()
    if(direction == Direction.LEFT) snake[0].x--
    if(direction == Direction.RIGHT) snake[0].x++
    if(direction == Direction.UP) snake[0].y--
    if(direction == Direction.DOWN) snake[0].y++
    if(snake[0].x == food.x && snake[0].y == food.y) {
        pickupAudio.play()
        foodCollected = true
        placeFood() 
        itemPickupCount += 1 
    }
    if(itemPickupCount == 5) {
        clearInterval(gameInterval)
        gameInterval = setInterval(gameLoop, 90)
    }
    if(itemPickupCount == 10) {
        clearInterval(gameInterval)
        gameInterval = setInterval(gameLoop, 80)
    }
    if(itemPickupCount == 20) {
        isStarted = false
        clearInterval(gameInterval)
        if(document.exitFullscreen) document.exitFullscreen()
        image.src = './assets/img/background-won.png'
        canvas.classList.remove('active')
    }
}

function keyDown(event) {
    if(event.keyCode == 65) direction = Direction.LEFT
    if(event.keyCode == 87) direction = Direction.UP
    if(event.keyCode == 68) direction = Direction.RIGHT
    if(event.keyCode == 83) direction = Direction.DOWN
}

function pressButton(_event) {
    if(!(isStarted)) {
        isStarted = true
        startButton.innerText = 'Spiel stoppen'
        image.src = './assets/img/background-started.png'
        if(canvas.requestFullscreen) canvas.requestFullscreen()
        canvas.classList.add('active')
        gameInterval = setInterval(gameInterval, 100)
    } else {
        isStarted = false
        startButton.innerText = 'Spiel starten'
        image.src = './assets/img/background-paused.png'
        snake = [{x: 20, y: 15}]
        direction = Direction.LEFT
        canvas.classList.remove('active')
        clearInterval(gameInterval)
    }
}
