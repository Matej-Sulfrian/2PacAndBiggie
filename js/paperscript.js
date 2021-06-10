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
    var radius = this.radius = 50;
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
    this.gravity = new Point(0, 2)
    var color = {
        hue: Math.random() * 360,
        saturation: 1,
        brightness: 1
    };
    var radius = this.size = new Size(20, 20)
    var plank = new CompoundPath({
        children: [
            new Path.Rectangle({
                rectangle: new Rectangle(this.point, new Point(this.point.x + 150, this.point.y + 20)),
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

var planks = [];

Plank.prototype.move = function () {
    var size = view.size
    this.vector = this.gravity

    if (this.item.position.y >= 700) {
        console.log("out")
        this.item.remove()
        planks.shift()
        var newOffset = 700 - planks[planks.length - 1].point.y
        console.log(newOffset)
        createPlanks(1, newOffset)
    }

    var max = Point.max(0, this.point + this.vector);
    this.item.position = this.point = Point.min(max, size - 0);

}

var move = "";
var left = 0;
var right = 0;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createPlanks(_amount, _offset) {
    var offset = 0;
    for (var i = 0; i < _amount; i++) {
        var y
        if (i === 0 && !_offset) {
            y = randomIntFromInterval(650, 700)
        } else {
            if (_offset) {
                offset = _offset
            }
            y = randomIntFromInterval(offset - 70, offset - 140)
        }
        offset = y
        var x = randomIntFromInterval(0, 300)
        var position = new Point(x, y),
            plank = new Plank(position)
        planks.push(plank);

    }
}

createPlanks(5, null)

for (var i = 0; i < planks.length; i++) {
    console.log(planks[i])
}


Ball.prototype.iterate = function () {
    var size = view.size;
    this.vector.y += this.gravity;
    var pre = this.point + this.vector;

    if (pre.y < this.radius || pre.y > size.height - this.radius) {
        console.log(this.vector.y)
        this.vector.y = this.bounce;
    } else {
        for (var i = 0; i < planks.length; i++) {
            if (pre.y < planks[i].point.y && pre.y > planks[i].point.y - 40 && pre.x > planks[i].point.x - 150 && pre.x < planks[i].point.x + 150 && this.vector.y > 8) {
                this.vector.y = this.bounce;
                movePlanks = true
                stopPlanksMoving()
                break
            }
        }
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


var balls = [];

function createBalls() {
    for (var i = 0; i < 1; i++) {
        var position = new Point(50, 50) * view.size,
            vector = new Point(0, 0),
            ball = new Ball(position, vector);
        balls.push(ball);
    }
}

createBalls()

// var textItem = new PointText({
//     point: [20, 30],
//     fillColor: 'black',
//     content: 'Click, drag and release to add balls.'
// });


function onFrame() {
    for (var i = 0, l = balls.length; i < l; i++) {
        balls[i].iterate();
    }
    if (movePlanks === true) {
        for (var p = 0; p < planks.length; p++) {
            planks[p].move()
        }
    }


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