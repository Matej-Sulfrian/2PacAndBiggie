
var move = "";
var left = 0;
var right = 0;
var offset = 0;
var planks = [];
var balls = [];

var startPlankPoints = [
    {"x": view.size.width / 3, "y": view.size.height / 1.1},
    {"x": view.size.width / 5, "y": view.size.height / 1.5},
    {"x": view.size.width / 1.5, "y": view.size.height / 1.7},
    {"x": view.size.width / 1.1, "y": view.size.height / 2},
    {"x": view.size.width / 5, "y": view.size.height / 3},
    {"x": view.size.width / 2, "y": view.size.height / 5},
    {"x": view.size.width / 6, "y": view.size.height / 10}
];
var startJumps = 3;

var morePlankPoints = [
    {"x": view.size.width / 4, "y": 0},
    {"x": view.size.width / 3, "y": 0},
    {"x": view.size.width / 5, "y": 0},
    {"x": view.size.width / 2, "y": 0},
    {"x": view.size.width / 1.5, "y": 0},
    {"x": view.size.width / 3, "y": 0},
    {"x": view.size.width / 5, "y": 0},
    {"x": view.size.width / 1, "y": 0}
];
var mPPi = 0;

var Ball = function (point, vector) {
    this.vector = vector;
    this.point = point;
    this.gravity = 0.9;
    this.bounce = -13;
    var radius = this.radius = 20;
    var ball = new Raster('ball')

    ball.scale(0.3)

    this.item = new Group({
        children: [ball],
        applyMatrix: false,
        position: this.point
    });
}

Ball.prototype.remove = function () {
    this.item.remove()
}

var Player = function () {
    this.point = new Point (0, 0)
    this.offset = 0;

    var ball = new Raster('ball2')

    ball.scale(0.3)

    this.item = new Group({
        children: [ball],
        applyMatrix: false,
        position: this.point
    });
}

Player.prototype.move = function () {
    getPlayerPosition()
    var realOffset = position.offset - offset

    this.item.position = this.point = new Point(position.x, position.y - realOffset)
}

var otherPlayer = new Player()

var Plank = function (point, brick) {
    this.point = point;
    this.vector = new Point(0, 0)
    this.gravity = new Point(0, 10)
    var color = {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 1
    };

    var plank = new Raster(brick)

    plank.scale(0.2)

    this.item = new Group({
        children: [plank],
        applyMatrix: false,
        position: this.point
    })
}

Plank.prototype.remove = function () {
    this.item.remove()
}

Plank.prototype.move = function () {
    var size = view.size
    this.vector = this.gravity

    offset++

    if (this.item.position.y >= size.height) {

        this.item.remove()
        planks.shift()

        var newPoint = new Point(morePlankPoints[mPPi].x, morePlankPoints[mPPi].y)
        var brick
        var rand = Math.floor(Math.random() * 10)
        if (mPPi%2 === 0) {
            if (rand%2 === 0) {
                brick = 'brick-white'
            } else {
                brick = 'brick-white2'
            }
        } else {
            if (rand%2 === 0) {
                brick = 'brick'
            } else {
                brick = 'brick2'
            }
        }
        newPlank = new Plank(newPoint, brick)
        planks.push(newPlank)
        if (mPPi === 4) {
            mPPi = 0
        } else {
            mPPi++
        }
    }

    var max = Point.max(0, this.point + this.vector);
    this.item.position = this.point = Point.min(max, size - 0);

}

function createPlanks(_points) {
    for (var i = 0; i < _points.length; i++) {
        var position = new Point(_points[i].x, _points[i].y)
        var brick;
        var rand = Math.floor(Math.random() * 10)
        if (i%2 === 0) {
            if (rand%2 === 0) {
                brick = 'brick-white'
            } else {
                brick = 'brick-white2'
            }
        } else {
            if (rand%2 === 0) {
                brick = 'brick'
            } else {
                brick = 'brick2'
            }
        }
        plank = new Plank(position, brick)
        planks.push(plank);
    }
}

createPlanks(startPlankPoints)

Ball.prototype.iterate = function () {
    var size = view.size;
    this.vector.y += this.gravity;
    var pre = this.point + this.vector;

    writePosition(this.point.x, this.point.y, offset)



    if (pre.y < this.radius || pre.y > size.height - this.radius) {
        this.vector.y = this.bounce;
        if (startJumps > 3) {
            startAnimating(0)
            lost();
        }
    } else {
        for (var i = 0; i < planks.length; i++) {
            if (pre.y < planks[i].point.y && pre.y > planks[i].point.y - 20 && pre.x > planks[i].point.x - 50 && pre.x < planks[i].point.x + 50 && this.vector.y > 8) {
                this.vector.y = this.bounce;
                if (startJumps > 3) {
                    movePlanks = true
                    stopPlanksMoving(canvas.height / 3)
                    score += 50
                    $('.play-menu-layer .pause .score').html(score)
                } else {
                    startJumps++
                }
                break
            }
        }
    }
    if (pre.y < size.height / 2) {
        movePlanks = true
        stopPlanksMoving(250)
    }
    var max = Point.max(this.radius, this.point + this.vector);

    this.item.position = this.point = Point.min(max, size - this.radius);
    if (move !== "") {
        if (move === "moveRight") {
            this.vector.x += 10;
            right += 10
        } else if (move === "moveLeft") {
            this.vector.x -= 10;
            left += 10
        } else if (move === "clearRight") {
            this.vector.x -= right;
            right = 0
        } else if (move === "clearLeft") {
            this.vector.x += left
            left = 0
        }
        move = ""
    }
};

function createBalls() {
    for (var i = 0; i < 1; i++) {
        var position = new Point(50, 50) * view.size,
            vector = new Point(0, 0),
            ball = new Ball(position, vector);
        balls.push(ball);
    }
}

createBalls()


var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;


// constant frame rate animation code from:
// https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
// initialize the timer variables and start the animation
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}


// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved
function animate() {
    // request another frame
    requestAnimationFrame(animate);
    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        // Put your drawing code here
        for (var i = 0, l = balls.length; i < l; i++) {
            balls[i].iterate();
        }
        otherPlayer.move();
        if (movePlanks === true) {
            for (var p = 0; p < planks.length; p++) {
                planks[p].move()
            }
        }
    }
}



function onFrame() {
    if (animation) {
        startAnimating(30)
    }
    if (stopAnimation) {
        startAnimating(0)
    }
    if (restartIndi) {
        init()
    }
}

tool.onKeyDown = function (eventObject) {
    if (eventObject.key === 'a') {
        move = "moveLeft"
    } else if (eventObject.key === 'd') {
        move = "moveRight"
    }
}

tool.onKeyUp = function (eventObject) {
    if (eventObject.key === 'a') {
        move = "clearLeft"
    } else if (eventObject.key === 'd') {
        move = "clearRight"
    }
}

function init() {
    for (var i = 0; i < planks.length; i++) {
        planks[i].remove()
    }
    for (var x = 0; x < balls.length; x++) {
        balls[x].remove()
    }
    planks = [];
    balls = [];
    createPlanks(startPlankPoints)
    createBalls()
    move = "";
    left = 0;
    right = 0;
    score = 0;
    offset = 0;
    startJumps = 3;
    mPPi = 0;
    $('.play-menu-layer .pause .score').html(score)
}