const canvas = document.getElementById("game"); // Выборка канваса
const ctx = canvas.getContext("2d"); // Выбор контекста игры

// Изображения

const ground = new Image(); // Создание объекта
ground.src = "img/ground.png"; // Указываем нужное изображение

const apple = new Image();
apple.src = "img/apple.png";

const carrot = new Image();
carrot.src = "img/carrot.png";

const booter = new Image();
booter.src = "img/booter.png";

const foods = [apple, booter, carrot];
let randfood = Math.floor((Math.random() * foods.length));

const lose = new Image();
lose.src = "img/lose.png";

// Аудио

const lose_sound = new Audio();
lose_sound.src = "audio/lose_sound.mp3" // Указываем нужное аудио

const score_sound = new Audio();
score_sound.src = "audio/score_sound.wav"

// -------------------------------------------------------------------------------

let box = 32; 

let score = 0;

let speedSnake = 100;

let level = 1;

let gameName = 'SNAKE';

let food = {
    x : Math.floor((Math.random() * 17 + 1)) * box,
    y : Math.floor((Math.random() * 15 + 3)) * box,
};

// Первоначальная координата змейки

let snake = [];
snake[0] = {
    x : 9 * 32, 
    y : 10 * 32,
};

// Назначение клавиш для управления змейкой

document.addEventListener("keydown", direction);     // При нажатии на какую-либо кнопку вызывается метод direction

let dir;

function direction(event) {                          
    if (event.keyCode == 37 && dir != "right")
        dir = "left";
    else if (event.keyCode == 38 && dir != "down")
        dir = "up";
    else if (event.keyCode == 39 && dir != "left")
        dir = "right";
    else if (event.keyCode == 40 && dir != "up")
        dir = "down";
}

// Функция-условие конца игры в случае, когда змейка ест свой хвост

function eatTail (head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            ctx.drawImage(lose, box * 2, box * 4);
            lose_sound.play();
            clearInterval(game);
        }
    }
}

// Отображение содержимого игры

function drawGame() {
    ctx.drawImage(ground, 0, 0); // Отображение заднего плана 

    

    ctx.drawImage(foods[randfood], food.x, food.y);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "#005C00" : "#00CD00";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "white";
    ctx.font = "43px Arial";
    ctx.fillText(score, box * 2.5, box * 1.63);

    ctx.font = "35px Arial";
    ctx.fillText(gameName, box * 13.50, box * 1.63);

    ctx.font = "35px Arial";
    ctx.fillText("Lvl: " + level, box * 5.00, box * 1.63);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (snakeX == food.x && snakeY == food.y) {
        
        score++;
       
        if (score === 5 || score === 10 || score === 15 || score === 20){
            level++;
            speedSnake -= 20;
        }
            
        score_sound.play();

        food = {
            x : Math.floor((Math.random() * 17 + 1)) * box,
            y : Math.floor((Math.random() * 15 + 3)) * box,
        };
    } else {
        snake.pop();
    }

   

    // Функция-условие конца игры в случае, когда змейка выходит за допустимые блоки

    if (snakeX < box || snakeX > box * 17
        || snakeY < 3 * box || snakeY > box * 17) {
        ctx.drawImage(lose, box * 2, box * 4);
        lose_sound.play();
        clearInterval(game);
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x : snakeX,
        y : snakeY,
    };

    eatTail(newHead, snake);
    
    snake.unshift(newHead);
}

let game = setInterval(drawGame, speedSnake); // Запуск функции drawGame с помощью интервала для отображения всего происходящего