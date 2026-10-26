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
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
};

function drawTs() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    zombies.forEach(zombie => zombie.draw(ctx))
}

function deleteTs(op) {
    zombies = zombies.filter(zombie => zombie !== op)
    drawTs()
}

let frame = 0

felix = new zombie(1, 0, 0, 10, 10)

let zombies = [felix]

zombies.push(felix)
felix.draw(ctx)

function main() {
    frame++;
    console.log(frame);
    if (frame > 500) {
        deleteTs(felix)
    }
    drawTs()
    requestAnimationFrame(main);
}

main()