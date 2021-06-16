// $(document).keypress(function (eventObject) {
//     console.log(eventObject.keyCode);
// });
var movePlanks = false;
function stopPlanksMoving(_timeout) {
    setTimeout(() => {
        movePlanks = false
    },_timeout)
}