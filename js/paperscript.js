var move = "";
var left = 0;
var right = 0;

var planks = [];
var balls = [];

var startPlankPoints = [
    {"x": view.size.width / 4, "y": view.size.height - 80},
    {"x": view.size.width / 3, "y": view.size.height - 210},
    {"x": view.size.width / 1.5, "y": view.size.height - 360},
    {"x": view.size.width / 5, "y": view.size.height - 490},
    {"x": view.size.width / 2, "y": view.size.height - 620}
];
var startJumps = 2;

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
    this.bounce = -15;
    var color = {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 1
    };
    var gradient = new Gradient([color, 'black'], true);
    var radius = this.radius = 30;
    var ball = new CompoundPath({
        children: [
            new Path.Circle({
                radius: radius
            }),
            new Path.Circle({
                center: radius / 8,
                radius: radius / 3
            })
        ],
        fillColor: new Color(gradient, 0, radius, radius / 8),
    });

    this.item = new Group({
        children: [ball],
        applyMatrix: false,
        position: this.point
    });
}

var Plank = function (point) {
    this.point = point;
    this.vector = new Point(0, 0)
    this.gravity = new Point(0, 10)
    var color = {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 1
    };
    var radius = this.size = new Size(20, 20)
    var plank = new CompoundPath({
        children: [
            new Path.Rectangle({
                rectangle: new Rectangle(this.point, new Point(this.point.x + 100, this.point.y + 20)),
                radius: radius
            }),
        ],
        fillColor: new Color(color)
    })

    this.item = new Group({
        children: [plank],
        applyMatrix: false,
        position: this.point
    })
}

Plank.prototype.move = function () {
    var size = view.size
    this.vector = this.gravity

    if (this.item.position.y >= size.height) {
        // console.log("out")
        this.item.remove()
        planks.shift()
        // var newOffset = 700 - planks[planks.length - 1].point.y
        // console.log(newOffset)
        var newPoint = new Point (morePlankPoints[mPPi].x, morePlankPoints[mPPi].y)
            newPlank = new Plank(newPoint)
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
        console.log(_points[i])
        var position = new Point(_points[i].x, _points[i].y)
            plank = new Plank(position)
        planks.push(plank);
    }
}

createPlanks(startPlankPoints)

Ball.prototype.iterate = function () {
    var size = view.size;
    this.vector.y += this.gravity;
    var pre = this.point + this.vector;

    if (pre.y < this.radius || pre.y > size.height - this.radius) {
        console.log(this.vector.y)
        this.vector.y = this.bounce;
        if (startJumps > 3) {
            startAnimating(0)
            var textItem = new PointText({
                point: [20, 30],
                fillColor: 'black',
                content: 'you lost',
                fontSize: 50
            });
        }
    } else {
        for (var i = 0; i < planks.length; i++) {
            if (pre.y < planks[i].point.y && pre.y > planks[i].point.y - 40 && pre.x > planks[i].point.x - 100 && pre.x < planks[i].point.x + 100 && this.vector.y > 8) {
                this.vector.y = this.bounce;
                if (startJumps > 3) {
                    movePlanks = true
                    stopPlanksMoving(500)
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
startAnimating(30)

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
        if (movePlanks === true) {
            for (var p = 0; p < planks.length; p++) {
                planks[p].move()
            }
        }
    }
}

function onFrame() {

}

tool.onKeyDown = function (eventObject) {
    if (eventObject.key === 'a') {
        move = "moveLeft"
        console.log(move)
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