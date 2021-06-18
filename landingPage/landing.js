let screens;
let active = 0;
$(document).ready(() => {
    screens = document.querySelectorAll(".screen")
    $(screens[0]).toggleClass("active")
    $(window).bind("wheel", (e) => {
        $(screens[active]).toggleClass("active")
        if (e.originalEvent.wheelDelta > 0) {
            if (active <= 3) {
                active++
            } else {
                active = 0
            }
        } else {
            if (active <= 0) {
                active = 4
            } else {
                active--
            }
        }
        $(screens[active]).toggleClass("active")
    })
    $(document).click( () => {
        $(screens[active]).toggleClass("active")
        if (active <= 3) {
            active++
        } else {
            active = 0
        }
        $(screens[active]).toggleClass("active")
    })
})
