let plates,
    mid,
    swiper

$('html').ready(function () {
    $('.showHideW').css('display', 'none')

    plates = [
        {
            touchPlate: $('.touch_w .mid .top .touch_herd[data="0"]'),
            midActive: false,
            state: 0,
            plate: $('.cook .top .plate[data="0"]')
        },
        {
            touchPlate: $('.touch_w .mid .top .touch_herd[data="1"]'),
            midActive: false,
            state: 0,
            plate: $('.cook .top .plate[data="1"]')
        },
        {
            touchPlate: $('.touch_w .mid .bottom .touch_herd[data="2"]'),
            midActive: false,
            state: 0,
            plate: $('.cook .bottom .plate[data="2"]')
        },
        {
            touchPlate: $('.touch_w .mid .bottom .touch_herd[data="3"]'),
            midActive: false,
            state: 0,
            plate: $('.cook .bottom .plate[data="3"]')
        }
    ]

    mid = [
        {
            el: $('.touch_w .mid .top img'),
            active: false
        },
        {
            el: $('.touch_w .mid .bottom img'),
            active: false
        }
    ]

    swiper = {
        img: $('.touch_w .right img'),
        cover: $('.touch_w .right .bg_cover')
    }

    $(swiper.img).mousedown(function (e) {
        let height = e.pageY - $(this).offset().left
        let pz = Math.floor(((height + (swiper.img.height() / 2)) / swiper.img.height()) * 100)


        let swipe = false
        for (let plate of plates) {
            if (plate.touchPlate.hasClass('active')) {
                swipe = true
            }
        }

        if (swipe) {
            setSwipe(pz)
        }

    })

})

function setSwipe(pz, set = true) {
    if (pz <= 12.5) {
        swiper.cover.css('height', '0%')
        if (set) {
            setHeat(8)
        }
    } else if (pz <= 25) {
        swiper.cover.css('height', '12.5%')
        if (set) {
            setHeat(7)
        }
    } else if (pz <= 37.5) {
        swiper.cover.css('height', '25%')
        if (set) {
            setHeat(6)
        }
    } else if (pz <= 50) {
        swiper.cover.css('height', '37.5%')
        if (set) {
            setHeat(5)
        }
    } else if (pz <= 62.5) {
        swiper.cover.css('height', '50%')
        if (set) {
            setHeat(4)
        }
    } else if (pz <= 75) {
        swiper.cover.css('height', '62.5%')
        if (set) {
            setHeat(3)
        }
    } else if (pz <= 87.5) {
        swiper.cover.css('height', '75%')
        if (set) {
            setHeat(2)
        }
    } else if (pz <= 95) {
        swiper.cover.css('height', '87.5%')
        if (set) {
            setHeat(1)
        }
    } else if (pz <= 100) {
        swiper.cover.css('height', '100%')
        if (set) {
            setHeat(0)
        }
    }
}

function setHeat(heat) {
    for (let plate of plates) {
        if (plate.touchPlate.hasClass('active')) {
            plate.touchPlate.html(heat)
            if (heat > 0) {
                plate.touchPlate.css('color', '#E52629')
            } else {
                plate.touchPlate.css('color', 'white')
            }
        }
    }
    switchCook()
}

function onOff() {

    let onOffButton = $('.touch_w .left img')

    let onOffButtonState = onOffButton.attr('state')
    let showHideW = $('.showHideW')
    let touch_w = $('.touch_w')

    if (onOffButtonState === 'off') {
        onOffButton.attr('state', 'on')
        showHideW.show(300, 'linear', function () {
            touch_w.addClass('show')
            showHideW.addClass('show')
            onOffButton.attr('src', 'interface_design/on_off_red.svg')
        })

    } else if (onOffButtonState === 'on') {
        onOffButton.attr('state', 'off')
        showHideW.removeClass('show')
        onOffButton.attr('src', 'interface_design/on_off.svg')
        setTimeout(() => {
            showHideW.hide(300, 'linear', function () {
                touch_w.removeClass('show')
            })
        }, 300)
        swiper.cover.css('height', '100%')
        for (let plat of plates) {
            plat.touchPlate.removeClass('active')
            plat.touchPlate.html('0')
            plat.touchPlate.css('color', 'white')
            plat.plate.removeClass('active')
            plat.midActive = false
        }
        for (let mi of mid) {
            mi.el.attr('src', 'interface_design/mid_sec.svg')
            mi.active = false
        }
    }
}

function switchPlates(plateI) {

    for (let i = 0; i < plates.length; i++) {
        if (i !== plateI) {
            plates[i].touchPlate.removeClass('active')
        }
    }

    if (plates[plateI].midActive) {
        let x
        if (plateI < 2) {
            x = 0
        } else {
            x = 2
        }
        if (plates[plateI].touchPlate.hasClass('active')) {
            for (let i = 0 + x; i < 2 + x; i++) {
                plates[i].touchPlate.removeClass('active')
            }
        } else {
            for (let i = 0 + x; i < 2 + x; i++) {
                plates[i].touchPlate.addClass('active')
            }
        }
    } else {
        if (plates[plateI].touchPlate.hasClass('active')) {
            plates[plateI].touchPlate.removeClass('active')
        } else {
            plates[plateI].touchPlate.addClass('active')
        }
    }

    let tempNumb = 100 - ((plates[plateI].touchPlate.html() - 1) * 12.5)
    if (tempNumb > 100) {
        tempNumb = 100
    } else if (tempNumb === 100) {
        tempNumb = 90
    }
    setSwipe(tempNumb, false)

}

function switchMid(midI) {
    let x
    if (midI === 0) {
        x = 0
    } else {
        x = 2
    }

    if (!mid[midI].active) {
        mid[midI].el.attr('src', 'interface_design/mid_sec_red.svg')
        mid[midI].active = true

        for (let plate of plates) {
            plate.touchPlate.removeClass('active')
        }
        let heat = 0
        for (let i = 0 + x; i < 2 + x; i++) {
            let plate = plates[i].touchPlate
            plates[i].midActive = true
            if (!plate.hasClass('active')) {
                plate.addClass('active')
            }
            if (plate.html() > heat) {
                heat = plate.html()
            }

        }
        for (let i = 0 + x; i < 2 + x; i++) {
            let plate = plates[i].touchPlate
            plate.html(heat)
            if (parseInt(heat) > 0) {
                plate.css('color', '#E52629')
            } else {
                plate.css('color', 'white')
            }
        }
        let tempNumb = 100 - ((heat - 1) * 12.5)
        if (tempNumb > 100) {
            tempNumb = 100
        } else if (tempNumb === 100) {
            tempNumb = 90
        }
        setSwipe(tempNumb, false)
    } else {
        mid[midI].el.attr('src', 'interface_design/mid_sec.svg')
        mid[midI].active = false

        for (let i = 0 + x; i < 2 + x; i++) {
            let plate = plates[i].touchPlate
            plates[i].midActive = false
            plate.removeClass('active')
        }
    }

    switchCook()
}

function switchCook() {
    for (let plate of plates) {
        if (plate.touchPlate.html() > 0) {
            plate.plate.addClass('active')
        } else {
            plate.plate.removeClass('active')
        }
    }
}

