const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "grey";

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
        if(Math.random() < 0.1) {
            this.w++
            this.h++
        }
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
function main() {
    frame++;
    console.log(frame);
    
    if (Math.random() < chance) {
        chance+=0.002;
        zombies.push(new zombie(1, 
            canvas.width*clampToRange(Math.random()),
             canvas.height*0.43,canvas.width*.08,canvas.height*.3))
    }
    drawTs()
    
    requestAnimationFrame(main);
}
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    const clickedZombie = [...zombies].reverse().find(z => 
        clickX >= z.x && clickX <= z.x + z.w &&
        clickY >= z.y && clickY <= z.y + z.h
    );

    if (clickedZombie) {
        zombies = zombies.filter(z => z !== clickedZombie);
        drawTs();
    }
});
main();