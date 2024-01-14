const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
const canvasSize = 400;
const delay = 100; // Ändern Sie dies je nach gewünschter Geschwindigkeit. Größere Werte bedeuten eine langsamere Bewegung.

let snake = [{ x: 10, y: 10 }];
let direction = "right";
let gameRunning = false;
let isGameOver = false;

function draw() {
  if(gameRunning) {
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  
    // Draw game border
    ctx.strokeStyle = "#000";
    ctx.strokeRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    ctx.fillStyle = "#00f";
    snake.forEach(segment => {
      drawCircle(segment.x * boxSize + boxSize / 2, segment.y * boxSize + boxSize / 2, boxSize / 2);
    });
    //snake.forEach(segment => {
    //  ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    //});

    // Move snake
    const head = { ...snake[0] };
    switch (direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }
    snake.unshift(head);

    // Check for collision
    if (
      head.x < 0 || head.x >= canvasSize / boxSize ||
      head.y < 0 || head.y >= canvasSize / boxSize ||
      checkCollisionWithBorder(head.x, head.y)
    ) {
      //alert("Game Over!");
      resetGame();
      return;
    }
    
    function checkCollisionWithBorder(x, y) {
      return x < 0 || x >= canvasSize / boxSize || y < 0 || y >= canvasSize / boxSize;
    }
    

    // Check for self-collision
    if (checkSelfCollision()) {
      //alert("Game Over!");
      resetGame();
      return;
    }

    // Check for food
    if (head.x === food.x && head.y === food.y) {
      generateFood();
    } else {
      snake.pop();
    }

    // Draw food
    ctx.fillStyle = "#f00";
    //ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
    // Draw food as apple
    drawApple(food.x, food.y);


    setTimeout(() => {
      requestAnimationFrame(draw);
    }, delay);

  }
}

function drawApple(x, y) {
  const appleRadius = boxSize / 2;
  const appleX = x * boxSize + boxSize / 2;
  const appleY = y * boxSize + boxSize / 2;

  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.arc(appleX, appleY, appleRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function checkSelfCollision() {
  const [head, ...body] = snake;
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / boxSize)),
    y: Math.floor(Math.random() * (canvasSize / boxSize))
  };
}

function resetGame() {
  isGameOver = true;
  document.getElementById("snakeImg").style.display = "inline";
  document.getElementById("gameCanvas").style.transform = "translateY(-100px)";
  gameRunning = false;
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  generateFood();
  drawStartScreen();
}

function startGame(){
  isGameOver = false;
  document.getElementById("snakeImg").style.display = "none";
  document.getElementById("gameCanvas").style.transform = "translateY(100px)";
  gameRunning = true;
  let food;
  generateFood();
  draw();
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";

  if (isGameOver){
    ctx.fillStyle = "red";
    let text = "Game Over!";
    let textWidth = ctx.measureText(text).width;
  
    // Zentrieren Sie den Text horizontal und vertikal
    let x = (canvasSize - textWidth) / 2;
    let y = canvasSize / 2;
  
    ctx.fillText(text, x, y);

    setTimeout(()=>{
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      text = "Zum Neustart Pfeiltaste drücken.";
      textWidth = ctx.measureText(text).width;
      x = (canvasSize - textWidth) / 2;
      y = canvasSize / 2;
      ctx.fillText(text, x, y);
    }, 1000)
  }else{
    const text = "Durch Drücken einer Pfeiltaste Spiel starten";
    const textWidth = ctx.measureText(text).width;

    // Zentrieren Sie den Text horizontal und vertikal
    const x = (canvasSize - textWidth) / 2;
    const y = canvasSize / 2;

    ctx.fillText(text, x, y);
  }
  

  //const snakeImage = new Image();
  //snakeImage.src = '/Users/benni/Desktop/WebTechnologie/eine-schlange-mit-langem-schwanz-und-weissem-hintergrund_900396-22170.jpg.avif'; 
  

  //snakeImage.onload = function () {
    //ctx.drawImage(snakeImage, 0, 0, canvasSize, canvasSize);
}

//Startbildschirm anzeigen
drawStartScreen();

// Handle keyboard input
document.addEventListener("keydown", event => {
  if(!gameRunning){
    // Spiel starten, wenn es noch nicht läuft
    startGame();
  }

  switch (event.key) {
    case "ArrowUp":
      if (direction == "down"){
        break;
      }
      direction = "up";
      break;
    case "ArrowDown":
      if (direction == "up"){
        break;
      }
      direction = "down";
      break;
    case "ArrowLeft":
      if (direction == "right"){
        break;
      }
      direction = "left";
      break;
    case "ArrowRight":
      if (direction == "left"){
        break;
      }
      direction = "right";
      break;
  }
});
