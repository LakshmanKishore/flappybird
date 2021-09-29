window.onload = function () {

    const canvas = document.querySelector("canvas");

    canvas.height = window.innerHeight - 5;
    canvas.width = window.innerWidth;

    let width = canvas.width;
    let height = canvas.height;

    let hHalf = height / 2;
    let wHalf = width / 2;

    let c = canvas.getContext("2d");

    let x, y;
    let clickStart = false;

    let s = 10;
    let score = 0;
    let brickNumber = 2;
    let speed = 4;

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        s = 30;
        speed = 2;
    }

    function random(min, max) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num;
    }

    function Bricks(tx, ty, bx, by) {
        this.tx = tx;
        this.ty = ty;
        this.bx = bx;
        this.by = by;
        this.tb = random(hHalf - (isMobile?100:50), hHalf - (isMobile?300:200));
    }

    Bricks.prototype.draw = function () {
        c.beginPath();
        c.rect(this.tx, this.ty, s, this.tb);
        c.rect(this.bx, this.by, s, height - this.by);
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    Bricks.prototype.animate = function () {
        let topX = x;
        let topY = y;
        if (x < this.tx) topX = this.tx;
        else if (x > this.tx + s) topX = this.tx + s;

        if (y < this.ty) testY = this.ty;
        else if (y > this.ty + this.tb)
            topY = this.ty + this.tb;

        const distx = x - topX;
        const disty = y - topY;
        let distance = Math.sqrt((distx * distx) + (disty * disty));

        if (distance <= s) {
            gameOver();
            clearInterval(run);
        }

        let bX = x;
        let bY = y;
        if (x < this.bx) bX = this.bx;
        else if (x > this.bx + s) bX = this.bx + s;

        if (y < this.by) bY = this.by;

        const distbx = x - bX;
        const distby = y - bY;
        let distanceb =
            Math.sqrt((distbx * distbx) + (distby * distby));

        if (distanceb <= s) {
            gameOver();
            clearInterval(run);
        }
        if (clickStart) {
            this.tx -= speed;
            this.bx -= speed;
        }

    }

    let brick = [];

    for (i = 0; i < brickNumber; i++) {
        brick[i] = new Bricks((width / (i + 1)), 0, (width / (i + 1)),
            random(hHalf + 50, hHalf + 200));
    }

    x = 100;
    y = hHalf;

    let gravity = isMobile ? 0.6 : 0.3;
    let velocity = 0;

    function loop() {
        c.clearRect(0, 0, width, height);

        c.beginPath();
        c.arc(x, y, s, 0, Math.PI * 2, false);
        c.fillStyle = "green";
        c.fill();
        c.closePath();

        for (i = 0; i < brickNumber; i++) {
            if (brick[i].tx == 0) {
                brick[i] = new Bricks(width, 0, width,
                    random(hHalf + 50, hHalf + 100));
                score++;
            }
        }

        if (clickStart) {
            velocity += gravity;
            velocity *= 0.9;
            y += velocity;
        }

        for (i = 0; i < brickNumber; i++) {
            brick[i].draw();
            brick[i].animate();
        }

        if (y + 10 >= height || y < 10) {
            gameOver();
            clearInterval(run);
        }

    }

    let run = setInterval(loop, 10);

    function gameOver() {
        let size = 20;
        if (isMobile) {
            size = 40;
        }
        c.font = (size + 20) + "px Arial";
        c.fillStyle = "yellow";
        c.textAlign = "center";
        c.fillText("GAME OVER", wHalf, hHalf);
        c.font = (size + 10) + "px Arial";
        c.fillText("Score: " + score, wHalf, hHalf + size + 10);
        c.fillStyle = "green";
        c.font = size + "px Arial";
        c.fillText("To play again refresh the page 😅", wHalf, hHalf + size + 50)
    }

    function tap() {
        clickStart = true;
        velocity -= (isMobile ? 20 : 10);
    }

    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            tap();
        }
    }

    canvas.addEventListener("click", tap);

    canvas.addEventListener("dblclick", function (e) {
        e.preventDefault();
    })

    loop();

}


