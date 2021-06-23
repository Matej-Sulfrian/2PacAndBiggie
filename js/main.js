var movePlanks = false;
const sessionId = parseInt(Math.random() * 1000)

console.log(sessionId)

function stopPlanksMoving(_timeout) {
    setTimeout(() => {
        movePlanks = false
    }, _timeout)
}

let position = {
    x: "",
    y: ""
}

// function sendPosition(_x, _y) {
//     position.x = _x;
//     position.y = _y;
//     let send = JSON.stringify(position)
//     $.get('http://jaazzjumper.local:8888/backend/server.php/?x='+send,
//         function (data) {
//             console.log(data)
//         },
//     )
// }