const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById('game-container');
const crosshair = document.getElementById('crosshair');
let pointX = window.innerWidth / 2;
let pointY = window.innerHeight / 2;
ctx.fillStyle = "grey";
let setup = false;
let isRunning = false;
let frame = 0
let zombies = []
ctx.fillStyle = 'lightblue'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);
let chance = 0.01;
let cursor_captured = false;
let zombieId = 0;
let clicks = 1;
let waitingOnCapture = false;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const textCanvas = document.getElementById("textCanvas");
const textCtx = textCanvas.getContext("2d");
ctx.fillStyle = "transparent";
textCanvas.style.display = 'block';
canvas.style.display = 'block';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

let dead = false;

let score = 0;

 textCtx.fillStyle = '#ff0000';
textCtx.textAlign = 'center';
textCtx.textBaseline = 'middle';

let username = prompt("Hello! Please enter username:", "Player");

console.log(textCanvas.style.display)
function resizeCanvas() {
    canvas.width = window.innerWidth || 800;
    canvas.height = window.innerHeight || 600;
}
resizeCanvas();

function updatePerspectivePoints() {
    p1.x = canvas.width * .30; p1.y = canvas.height * .1;
    p2.x = canvas.width * .30; p2.y = canvas.height * .75;
    p3.x = 0;                  p3.y = canvas.height;
    p4.x = canvas.width * .70; p4.y = canvas.height * .1;
    p5.x = canvas.width * .70; p5.y = canvas.height * .75;
    p6.x = canvas.width;       p6.y = 0;
    p7.x = canvas.width;       p7.y = 0;
    p8.x = canvas.width;       p8.y = canvas.height;
    p9.x = 0;                  p9.y = 0;
}


function rect(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
};

class zombie {
    constructor(id, x, y, w, h) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    };

    draw(ctx) {
        this.w+=0.25
        this.h+=0.25
        this.x-=0.25/2
        this.y-=0.25/2
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
};

function drawTs() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    setTsUp()
    zombies.forEach(zombie => zombie.draw(ctx))
}

const clampToRange = (num) => Math.min(Math.max(num, 0.2), 0.8);
{
p1 = {x: canvas.width*.30, y: canvas.height*.1}
p2 = {x: canvas.width*.30, y: canvas.height*.75}
p3 = {x: 0, y: canvas.height}

p6 = {x: canvas.width,y: canvas.height*.0}
p7 = {x: canvas.width, y:canvas.height*.0}
p4 = {x: canvas.width*.70,y: canvas.height*.1}
p5 = {x: canvas.width*.70, y:canvas.height*.75}
p8 = {x: canvas.width,y:canvas.height}

p9 = {x: 0, y: canvas.height*.0}
p10 = {x: canvas.width, y: canvas.height*0.1}
} //point defs

function finnaSetFloorUp() {
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p8.x, p8.y)
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath(); 
    ctx.fillStyle = '#96b830';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}
function finnaSetLeftWallUp() {
    ctx.beginPath()
    ctx.lineTo(p9.x, p9.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x,p3.y)
    ctx.closePath(); 
    ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 0.1;
    // ctx.stroke();
}

function finnaSetRightWallUp() {
    ctx.beginPath()
    ctx.moveTo(p6.x, p6.y)
    ctx.lineTo(p7.x, p7.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p8.x, p8.y)
    ctx.closePath(); 
    ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 0.1;
    // ctx.stroke();
}
function finnaSetBackUp() {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath(); 
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 0.1;
    // ctx.stroke();
}
function finnaSetCeilingUp() {
    ctx.beginPath()
    ctx.moveTo(p9.x, p9.y)
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p7.x, p7.y);
    ctx.closePath(); 
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function setTsUp() {
    finnaSetLeftWallUp();
    finnaSetRightWallUp();
    finnaSetBackUp();
    finnaSetCeilingUp();
    finnaSetFloorUp();

    if (dead) {
        textCanvas.style.display = 'block';
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textCtx.font = 'bold 50px Arial';
        textCtx.fillStyle = 'black';
        textCtx.fillText('You Died!', textCanvas.width/2, textCanvas.height/2);
        showScore();
        // canvas.releasePointerCapture();
        return; 
    }

    if (setup && !cursor_captured) {
        textCanvas.style.display = 'block';
        textCtx.font = 'bold 30px Arial';
        textCtx.fillStyle = '#ff0000';
        textCtx.fillText('click to resume', textCanvas.width/2, textCanvas.height/2);
    }

    if (!setup) {
        canvas.style.display = 'block';
        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(`Welcome to Zinsi, ${username}!`, textCanvas.width/2, textCanvas.height/2);
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle("Zinsi is not space invaders.\nClick to start, and click zombies to destroy them\nas they rush towards you.\nDon\'t let them get too close!\nGo for a high score.", canvas.width/2, canvas.height/2)
        setup = true;
    }

    showScore();
}

function checkIfDead() {
    for (const z of zombies) {
        if (z.w > canvas.width*0.26) {
            dead = true;
            break;
        }
    }
}

function deleteTs(op) {
    zombies = zombies.filter(zombie => zombie !== op)
    drawTs()
}

function showScore() {
    score = Math.round(frame/100);
    ctx.font = 'bold 55px Arial'
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, canvas.width*0.1, canvas.height*0.1)
}

function updateCrosshairPosition() {
    crosshair.style.left = `${pointX}px`;
    crosshair.style.top = `${pointY}px`;
}

function main() {
    frame++;
    // console.log(frame);
    checkIfDead();
    if ((Math.random() < score/250) && (zombies.length < (5 + score/10)) && !dead) {
        zombieId++;
        zombies.push(new zombie(
            zombieId, 
            canvas.width * clampToRange(Math.random()),
            canvas.height * 0.43,
            canvas.width * .08,
            canvas.height * .3
        ));
    } else if (dead) {

    }
    if (isRunning) {
        textCanvas.style.display = 'none';
    }
    drawTs()
    if (cursor_captured && !dead) {
        requestAnimationFrame(main);
    } else {
        zombies = [];
        drawTs();
        isRunning = false;
    }
}







canvas.addEventListener('click', async () => {
    if (document.pointerLockElement !== canvas && !waitingOnCapture && !dead) {
        waitingOnCapture = true;
        
        textCanvas.style.display = 'block';
        textCtx.font = 'bold 150px Arial';
        textCtx.fillStyle = '#ff0000';
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';

        let count = 3;
        
        const drawNumber = (num) => {
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textCtx.fillText(num.toString(), textCanvas.width / 2, textCanvas.height / 2);
        };

        drawNumber(count);

        await new Promise((resolve) => {
            const timer = setInterval(() => {
                count--;
                if (count > 0) {
                    drawNumber(count);
                } else {
                    clearInterval(timer);
                    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
                    textCanvas.style.display = 'none';
                    resolve();
                }
            }, 1000);
        });

        canvas.requestPointerLock();
        waitingOnCapture = false;
        return;
    }

    const target = zombies
        .filter(z => pointX >= z.x && pointX <= z.x + z.w && pointY >= z.y && pointY <= z.y + z.h)
        .reduce((lowest, current) => (!lowest || current.id < lowest.id ? current : lowest), null);

    if (target) {
        clicks += 0.25;
        zombies = zombies.filter(z => z.id !== target.id);
    }
});






document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        cursor_captured = true;
        pointX = container.clientWidth / 2;
        pointY = container.clientHeight / 2;
        updateCrosshairPosition();
        console.log("Awsrdaoi8sfiyaghwfighyuwaafiwugyafwigyFAQGIUY")

        crosshair.style.display = 'block';
        document.addEventListener('mousemove', moveLocked, false);
        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(main);
        }
    } else {
        document.removeEventListener('mousemove', moveLocked, false);
        cursor_captured = false;
        crosshair.style.display = 'none';
        
        // drawTs();
    }
});

function moveLocked(e) {
    pointX += e.movementX;
    pointY += e.movementY;

    if (pointX < 0) pointX = 0;
    if (pointX > container.clientWidth) pointX = container.clientWidth;
  
    if (pointY < 0) pointY = 0;
    if (pointY > container.clientHeight) pointY = container.clientHeight;

    updateCrosshairPosition();
}
drawTs();