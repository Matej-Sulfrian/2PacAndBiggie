

$(document).ready(function() {

    const osc = new Tone.Oscillator('80', "sine2").start();

    let vol = new Tone.Volume(0).toDestination();


    osc.connect(vol)
    // osc.start()
    // console.log(vol.toString())
    vol.mute = true


    let c
    let cxt
    let img = document.querySelector('#img')
    let imgI = 0
    const h1 = $('h1')
    const h2 = $('h2')
    const imgSrc = [
        "5449.jpeg",
        "019b99b6397884cc7dfb0d9b6fd2f281.jpeg",
        "mona-lisa-la-gioconda.jpeg"
    ]

    if (img.complete) {
        setSizeAndImgData();

    }

    $('#c').mousemove(function (e) {
        var posX = $(this).offset().left,
            posY = $(this).offset().top;

        let x = e.pageX - posX
        let y = e.pageY - posY

        let imgData = cxt.getImageData(x, y, 1, 1)

        // HSL -> intuitiever
        // HSV (vielleicht besser)
        // HSB

        let hsl = RGBToHSL(imgData.data[0], imgData.data[1], imgData.data[2])

        $(h1).css('color', 'hsl(' + hsl.h + ', ' + hsl.s + ', ' + hsl.l + ')')
        $(h2).html(hsl.h + ', ' + hsl.s + ', ' + hsl.l)

        // osc.baseType = 'sine' + hsl.h

        osc.volume.value = percentToDecibels(hsl.l.replace('%', ''))
    })

    $('.switch').click((e) => {
        if (e.target.classList.contains('right')) {
            if (imgI < imgSrc.length-1) {
                imgI++
            } else {
                imgI = 0
            }
        } else {
            if (imgI > 0) {
                imgI--
            } else {
                imgI = imgSrc.length -1
            }
        }
        img.src = 'content/' + imgSrc[imgI]
        setTimeout(setSizeAndImgData, 100)
    })

    $('.settings').click(() => {
        $('.settings').toggleClass('active')
        $('.set').toggleClass('active')
    })

    $('.mute_button').click(() => {
        let img = $('.mute_button img')
        if ($(img).hasClass('mute')) {
            $(img).attr('src', 'content/volume.png')
            vol.mute = false
        } else {
            $(img).attr('src', 'content/mute.png')
            vol.mute = true
        }
        $(img).toggleClass('mute')
    })

    function setSizeAndImgData() {
        c = document.querySelector('#c')
        cxt = c.getContext('2d')
        img = document.querySelector('#img')

        c.width = window.innerWidth
        c.height = window.innerHeight

        cxt.drawImage(img, getFrame().offsetX, getFrame().offsetY, getFrame().width, getFrame().height, 0, 0, c.width, c.height)

        $('.right').css('top', window.innerHeight / 2 - 25 + 'px')
        $('.left').css('top', window.innerHeight / 2 - 25 + 'px')
    }

    function getFrame() {
        let out = {
            width: 0,
            height: 0,
            offsetX: 0,
            offsetY: 0
        }
        let xW = window.innerWidth / img.width
        let xH = window.innerHeight / img.height
        if (xW > xH) {
            out.width = img.width
            out.height = window.innerHeight / xW
            out.offsetY = img.height / 2 - out.height / 2
        } else {
            out.width = window.innerWidth / xH
            out.height = img.height
            out.offsetX = img.width / 2 - out.width / 2
        }
        return out
    }

    window.addEventListener('resize', setSizeAndImgData)
})








// oszilatoren
// filter


// wie man schaut vs was man anschaut

// L = lautstärke (hell dunkel)
// leise mit tiefpass filter (ubterschied in klagfarbe) -> lowpass

// H = klangfarbe


// H 6 loops = 6 farben
// V = filter

// einzelne rythmische töne

