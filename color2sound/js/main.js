$(document).ready(function() {
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

        $(h1).css('color', hsl)
        $(h2).html(hsl.replace('hsl', ''))
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
// leise mit tiefbass filter (ubterschied in klagfarbe) -> lowpass

// H = klangfarbe


// H 6 loops = 6 farben
// V = filter

// einzelne rythmische töne

