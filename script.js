let rowSetting = document.getElementById('setting-row')
let columnSetting = document.getElementById('setting-column')
rowSetting.value = 20
columnSetting.value = 30

/*
* Mögliche Richtungen für die Schlange
*/
const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT', 
    RIGHT: 'RIGHT'
}

let canvas = document.getElementById('snake-canvas')
let context = canvas.getContext('2d')
let rows = rowSetting.value
let columns = columnSetting.value
let snake = [{x: 10, y: 15}]
let food
let cellWidth = canvas.width / columns
let cellHeight = canvas.height / rows
let direction = Direction.LEFT
let foodCollected = false
let isStarted = false
let startButton = document.getElementById('start-button')
let settingSubmitButton = document.getElementById('setting-submit-button')
let settingResetButton = document.getElementById('setting-reset-button')
let image = new Image()
let itemPickupCount = 0
let pickupAudio = new Audio('assets/audio/snake-eat.mp3')
let errorAudio = new Audio('assets/audio/snake-error.mp3')

image.src = './assets/img/background-paused.png'
placeFood()

let gameInterval = setInterval(gameLoop, 100)
document.addEventListener('keydown', keyDown)
startButton.addEventListener('click', toggleGame)
settingSubmitButton.addEventListener('click', reloadSettings)
settingResetButton.addEventListener('click', resetSettings)
draw()

/*
* Malt alle Elemente auf das Canvas
*/
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

/*
* Überprüft ob der Spieler einen Fehler gemacht hat.
* Wenn ja wird das Spiel abgebrochen
*/
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

/*
* Setzt die Position vom Punkt, den es einzusammeln gilt, neu
*/
function placeFood() {
    let randomX = Math.floor(Math.random() * columns)
    let randomY = Math.floor(Math.random() * rows)
    food = {x: randomX, y: randomY}
}

/*
* Zeichnet ein Element auf dem Canvas mit etwas Abstand an den Seiten
*/
function add(x, y) {
    context.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1)
}

/*
* Bewegt die Schlange mit allen Elementen
*/
function shiftSnake() {
    for(let i = snake.length - 1; i > 0; i--) { 
        let part = snake[i]
        let lastPart = snake[i - 1]
        part.x = lastPart.x
        part.y = lastPart.y
    }
}

/*
* Wiederholt das Spiel in einem Regelmäßigem Abstand
*/
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
        gameInterval = setInterval(gameLoop, 95)
    }
    if(itemPickupCount == 10) {
        clearInterval(gameInterval)
        gameInterval = setInterval(gameLoop, 90)
    }
    if(itemPickupCount == 20) {
        isStarted = false
        clearInterval(gameInterval)
        if(document.exitFullscreen) document.exitFullscreen()
        image.src = './assets/img/background-won.png'
        canvas.classList.remove('active')
    }
}

/*
* Überprüft welche Taste gedrückt wurde
*/
function keyDown(event) {
    if(event.keyCode == 65) direction = Direction.LEFT
    if(event.keyCode == 87) direction = Direction.UP
    if(event.keyCode == 68) direction = Direction.RIGHT
    if(event.keyCode == 83) direction = Direction.DOWN
}

/*
* Logik um das Spiel zu starten oder zu stoppen
*/
function toggleGame(_event) {
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

function reloadSettings(_event) {
    rows = rowSetting.value
    columns = columnSetting.value
    cellWidth = canvas.width / columns
    cellHeight = canvas.height / rows4
    placeFood()
}

function resetSettings(_event) {
    rowSetting.value = 20
    columnSetting.value = 30
    rows = rowSetting.value
    columns = columnSetting.value
    cellWidth = canvas.width / columns
    cellHeight = canvas.height / rows
    placeFood()
}