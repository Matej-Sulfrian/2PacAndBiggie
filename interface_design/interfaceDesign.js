let plates,
    mid

$('html').ready(function () {
    $('.showHideW').css('display', 'none')
    console.log('load')

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

})

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

    }
}

function switchPlate(plateI) {
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

        for (let i = 0 + x; i < 2 + x; i++) {
            let plate = plates[i].touchPlate
            plates[i].midActive = true
            if (!plate.hasClass('active')) {
                plate.addClass('active')
            }
        }

    } else {
        mid[midI].el.attr('src', 'interface_design/mid_sec.svg')
        mid[midI].active = false

        for (let i = 0 + x; i < 2 + x; i++) {
            let plate = plates[i].touchPlate
            plates[i].midActive = false
            plate.removeClass('active')
        }
    }
}

