// $(document).keypress(function (eventObject) {
//     console.log(eventObject.keyCode);
// });
var movePlanks = false;
function stopPlanksMoving() {
    setTimeout(() => {
        movePlanks = false
    },1000)
}