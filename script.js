class Direction { // Speichere alle möglichen Richtungen in einer Klasse

    constructor(name) { // Sage, welche Parameter beim Initialisieren der Klasse übergeben werden müssen
        this.name = name // Setze den Parameter "name" auf die Variable "name" für die jeweilige Instanz der Klasse
    }

    static UP = new Direction('UP') // Sage, dass die Variable "UP" statisch erreichbar ist
    static DOWN = new Direction('DOWN') // Sage, dass die Variable "DOWN" statisch erreichbar ist
    static LEFT = new Direction('LEFT') // Sage, dass die Veriable "LEFT" statisch erreichbar ist
    static RIGHT = new Direction('RIGHT') // Sage, dass die Variable "RIGHT" statisch erreichbar ist

}

let canvas = document.getElementById('snake-canvas') // Definiere die Variable "canvas", indem man das Canvas vom HTML-Code bekommt
let context = canvas.getContext('2d') // Definiere die Variable "context", indem man den Kontext des Canvas auf 2 Dimensionen setzt
let rows = 20 // Definiere die Variable "rows", indem man festsetzt wieviele Zeilen das Spiel haben soll
let columns = 30 // Definiere die Variable "columns", indem man festsetzt wieviele Spalten das Spiel haben soll
let snake = [{x: 10, y: 15}] // Definiere die Variable "snake", indem man ein Array erstellt, welches die komplette Schlange beinhaltet, die in eizelnen Elementen gespeichert wird, die in Objekten mit der X und Y Position in das Array übergeben wird
let food // Definiere die Variable "food", indem man sie nicht Initialisiert!
let cellWidth = canvas.width / columns // Definiere die Variable "cellWidth", indem man definiert, wie weit ein Element sein soll
let cellHeight = canvas.height / rows // Definiere die Variable "cellHeight", indem man definiert, wie hoch ein Element sein soll
let direction = Direction.LEFT // Definiere die Variable "direction", indem man die Ausgangsrichtung auf links setzt
let foodCollected = false // Definiere die Variable "foodCollected", indem man sie auf false setzt!

placeFood() // Führe "placeFood()" aus
setInterval(gameLoop, 200) // Sage dem Code, dass alle 200ms das Spiel wiederholt werden soll
document.addEventListener('keydown', keyDown) // Registriere die Tastatur-Steuerung
draw() // Führe "draw()" aus

function draw() { // Male alle Elemente auf das Canvas
    context.fillStyle = 'black' // Setze die Farbe auf Schwarz
    context.fillRect(0, 0, canvas.width, canvas.height) // Fülle das gesammte Canvas
    context.fillStyle = 'white' // Setze die Farbe auf Weiß
    snake.forEach(part => add(part.x, part.y)) // Male die komplette Schlange
    context.fillStyle = 'yellow' // Setze die Farbe auf Gelb
    add(food.x, food.y) // Male das Essen
    requestAnimationFrame(draw) // Sage dem Code, das diese Funktion animiert sein soll (oder so in der art, kein plan, was genau das macht... )
}

function gameOver() { // Überprüfe, ob die Schlange gegen eine Wand läuft
    let firstPart = snake[0] // Definiere das erste Element der Schlange
    let otherParts = snake.slice(1) // Definiere alle anderen Elemente der Schlange
    let duplicatePart = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y) // Überprüfe, ob ein Element mehrfach existiert
    if(snake[0].x < 0 || snake[0].x > columns - 1 || snake[0].y < 0 || snake[0].y > rows - 1 || duplicatePart) { // Überprüfe, ob die Schlange die Wand berührt oder ein Element mehrfach existiert
        placeFood() // Platzere ein neues Essen
        snake = [{x: 20, y: 15}] // Platziere die Schlange neu
        direction = Direction.LEFT // Setze die Richtung auf links
    }
}

function placeFood() { // Platziere ein neues Essen
    let randomX = Math.floor(Math.random() * columns) // Generiere eine zufällige Zahl für die X Position
    let randomY = Math.floor(Math.random() * rows) // Generiere eine zufällige Zahl für die Y Position
    food = {x: randomX, y: randomY} // Setze die X und Y Position vom Essen
}

function add(x, y) { // Füge ein Element zum Spiel hinzu
    context.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1) // Male das Element auf dem Canvas
}

function shiftSnake() { // Bewege alles Elemente der Schlange
    for(let i = snake.length - 1; i > 0; i--) { // Wiederhole für jedes Element
        const part = snake[i] // Definiere das aktuelle Element
        const lastPart = snake[i - 1] // Definiere das vorherige Element
        part.x = lastPart.x // Setze die X Position vom aktuellem Element auf die vom vorherigem Element
        part.y = lastPart.y // Setze die Y Position vom aktuellem Element auf die vom verherigem Element
    }
}

function gameLoop() { // Logik der Schlange und vom Essen
    gameOver() // Simuliere Game Over um alles korrekt zu laden
    if(foodCollected) { // Überprüfe, ob die Schlange ein Essen aufgesammelt hat
        snake = [{x: snake[0].x, y: snake[0].y}, ...snake] // Verlängere die Schlange um 1 Element
        foodCollected = false // Sage der Schlange, dass die kein weiteres Essen aufgesammelt hat
    }
    shiftSnake() // Bewege alles Elemente der Schlange
    if(direction == Direction.LEFT) snake[0].x-- // Bewege die Schlange nach Links
    if(direction == Direction.RIGHT) snake[0].x++ // Bewege die Schlange nach Rechts
    if(direction == Direction.UP) snake[0].y-- // Bewege die Schlange nach Oben
    if(direction == Direction.DOWN) snake[0].y++ // Bewege die Schlange nach Unten
    if(snake[0].x == food.x && snake[0].y == food.y) { // Überprüfe, ob die Schlange ein Essen einsammeln kann
        foodCollected = true // Sage der Schlange, dass sie ein Essen aufsammeln soll
        placeFood() // Platziere ein neues Essen
    }
}

function keyDown(event) { // Überprüfe, welche Taste gedrückt wird
    if(event.keyCode == 65) direction = Direction.LEFT // Wenn Taste "A" gedrückt wird, setze die Richtung auf links
    if(event.keyCode == 87) direction = Direction.UP // Wenn Taste "W" gedrückt wird, setze die Richtung auf oben
    if(event.keyCode == 68) direction = Direction.RIGHT // Wenn Taste "D" gedrückt wird, setze die Richtung auf rechts
    if(event.keyCode == 83) direction = Direction.DOWN // Wenn Taste "S" gedrückt wird, setze die Richtung auf unten
}