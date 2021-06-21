let screens;
let active = 0;
let img;
let prevFlag = false;
$(document).ready(() => {
    screens = document.querySelectorAll(".screen")
    img = document.querySelector('.img_prev img')
    $(screens[0]).toggleClass("active")
    $(window).bind("wheel", (e) => {
        if (prevFlag) {
            prevImg()
        } else {
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
        }
    })
    $(document).click((e) => {
            if ($(e.target).parent().hasClass('point_wrap')) {
                $(screens[active]).toggleClass("active")
                let i = $(e.target).attr('data-action')
                active = parseInt(i)
                $(screens[active]).toggleClass("active")
                prevImg()
            } else if (prevFlag) {
                prevImg()
            } else {
                if ($(e.target).parent().hasClass('prev')) {
                    prevImg($(e.target).attr('src'), true)
                } else if ($(e.target).parent().hasClass('close_wrap')) {
                } else {
                    $(screens[active]).toggleClass("active")
                    if (active <= 3) {
                        active++
                    } else {
                        active = 0
                    }
                    $(screens[active]).toggleClass("active")
                }
            }
    })
})
function prevImg (_src = null, _show = false) {
    if (_show) {
        img.src = _src
        $('.screen').addClass('backdrop')
        $('.img_prev').addClass('backdrop')
        $('.close_wrap').show()
        prevFlag = true
    } else {
        img.src = ""
        $('.screen').removeClass('backdrop')
        $('.img_prev').removeClass('backdrop')
        $('.close_wrap').hide()
        prevFlag = false
    }

}