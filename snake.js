// 게임 캔버스 설정
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기 및 타일 크기 설정
const canvasSize = 600;
const gridSize = 30;
const tileCount = canvasSize / gridSize;

// 이미지 불러오기
const snakeImage = new Image();
snakeImage.src = 'snake.png';

const foodImage = new Image();
foodImage.src = 'eggs.png';

const backgroundImage = new Image();
backgroundImage.src = 'ground.jpg';

// 게임 상태 초기화
let snake, direction, nextDirection, food, gameOver, score, speed, isSpeedBoosted;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    gameOver = false;
    score = 0;
    speed = 200; // 기본 속도 설정 (초기 속도 감소)
    isSpeedBoosted = false;
}

// 방향키 이벤트 처리
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
        case "Enter":
            if (gameOver) {
                initGame();
                gameLoop();
            }
            break;
        case " ":
            if (!isSpeedBoosted) {
                speed = 100; // 속도 증가
                isSpeedBoosted = true;
            }
            break;
    }
});

// 스페이스바 떼면 속도 복구
document.addEventListener("keyup", (event) => {
    if (event.key === " ") {
        speed = 200; // 원래 속도로 복구
        isSpeedBoosted = false;
    }
});

// 게임 로직 업데이트
function update() {
    if (gameOver) return;

    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 경계 충돌 체크
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        alert("게임 오버! 당신의 점수는 : " + score + " , 다시 시작하려면 Enter를 누르세요.");
        return;
    }

    // 뱀 자신과 충돌 체크
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
            alert("게임 오버! 당신의 점수는 : " + score + " , 다시 시작하려면 Enter를 누르세요.");
            return;
        }
    }

    // 음식을 먹었는지 확인
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// 게임 그리기
function draw() {
    if (gameOver) return;

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    snake.forEach((segment) => {
        ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("점수 : " + score, canvasSize - 100, 20);
}

// 게임 루프 실행
function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, speed);
    }
}

// 모든 이미지가 로드된 후 게임 시작
backgroundImage.onload = foodImage.onload = snakeImage.onload = () => {
    initGame();
    gameLoop();
};
