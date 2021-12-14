$('html').ready(function () {
    $('.showHideW').css('display', 'none')
    console.log('load')
})


function onOff () {

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

