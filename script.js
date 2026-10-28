const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById('game-container');
const crosshair = document.getElementById('crosshair');
let pointX = window.innerWidth / 2;
let pointY = window.innerHeight / 2;
ctx.fillStyle = "grey";
let setup = false;
let isRunning = false;

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
    finnaSetLeftWallUp()
    finnaSetRightWallUp()
    finnaSetBackUp()
    finnaSetCeilingUp()
    finnaSetFloorUp()
    if (setup && !cursor_captured) {
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText('click to resume \n ', canvas.width/2, canvas.height/2);
    }
    if (!setup) {
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText('Welcome to Zinsi! \n ', canvas.width/2, canvas.height/2);
        setup = true;
    }
    
}

function deleteTs(op) {
    zombies = zombies.filter(zombie => zombie !== op)
    drawTs()
}

let frame = 0


let zombies = []

ctx.fillStyle = 'lightblue'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);
let chance = 0.01;
let cursor_captured = false;

function updateCrosshairPosition() {
    crosshair.style.left = `${pointX}px`;
    crosshair.style.top = `${pointY}px`;
}

let zombieId = 0;
function main() {
    frame++;
    console.log(frame);
    chance = clicks*.01
    if (Math.random() < chance) {
        zombieId++;
        zombies.push(new zombie(
            zombieId, 
            canvas.width * clampToRange(Math.random()),
            canvas.height * 0.43,
            canvas.width * .08,
            canvas.height * .3
        ));
    }
    drawTs()
    if (cursor_captured) {
        requestAnimationFrame(main);
    } else {
        isRunning = false;
    }
}







let clicks = 1;
canvas.addEventListener('click', () => {
    
    if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
        return;
    }

    const targetX = pointX;
    const targetY = pointY;

    const matchingZombies = zombies.filter(z => 
        targetX >= z.x && targetX <= z.x + z.w &&
        targetY >= z.y && targetY <= z.y + z.h
    );

    let target = null;
    if (matchingZombies.length > 0) {
        target = matchingZombies.reduce((lowest, current) => 
            current.id < lowest.id ? current : lowest
        );
    }

    if (target) {
        clicks += 0.25;
        zombies = zombies.filter(z => z.id !== target.id);
        drawTs();
    }
});






document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        cursor_captured = true;
        pointX = container.clientWidth / 2;
        pointY = container.clientHeight / 2;
        updateCrosshairPosition();

        crosshair.style.display = 'block';
        document.addEventListener('mousemove', moveLocked, false);
        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(main);
        }
    } else {
        cursor_captured = false;
        crosshair.style.display = 'none';
        document.removeEventListener('mousemove', moveLocked, false);
        drawTs();
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