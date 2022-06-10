$(document).ready(function () {

    // Master Volume
    let master = new Tone.Volume(0);
    const panner = new Tone.Panner(0).toDestination();
    master.connect(panner)
    let mute = false
    master.mute = true


    // SHEPERD TONE

    let sheperd = false
    const shepVol = new Tone.Volume(0)
    shepVol.connect(master)
    shepVol.mute = true

    const osc1 = new Tone.Oscillator('C1', 'sawtooth').start()
    const osc2 = new Tone.Oscillator('C2', 'sawtooth').start()

    osc1.connect(shepVol)
    osc2.connect(shepVol)

    $('#sheperd').change(function () {
        if ($(this).is(':checked')) {
            sheperd = true
            shepVol.mute = false
        } else {
            sheperd = false
            shepVol.mute = true
        }
    })





    let expS = false
    const volExpS = new Tone.Volume(0)
    volExpS.connect(master)
    volExpS.mute = true

    const noise = new Tone.Noise('white').start()
    const filter = new Tone.Filter(400, 'bandpass', -48)
    noise.connect(filter)

    const volFilter = new Tone.Volume(0)
    filter.connect(volFilter)
    volFilter.connect(volExpS)

    const synth = new Tone.Synth()
    const volSynth = new Tone.Volume(0)
    synth.connect(volSynth)
    volSynth.connect(master)


    // SAMPLES ************************************************************************


    // PIANO --------------------------------------------------------------------------

    // vol
    let piano = false
    const volPiano = new Tone.Volume(0)
    volPiano.connect(master)
    volPiano.mute = true

    // notes
    let pianoIsPlaying = false
    let pianoNotes = {c3: {}, d3: {}, e3: {}, f3: {}, g3: {}, a3: {}, b3: {}, c4: {}}
    for (let note in pianoNotes) {
        // console.log(note)
        pianoNotes[note].isPlaying = false
        pianoNotes[note].player = new Tone.Player('ion__piano-notes/ion__' + note + '.mp3')
        pianoNotes[note].player.connect(volPiano)
        pianoNotes[note].player.onstop = () => {
            // console.log (note + 'piano stop')
            pianoNotes[note].isPlaying = false
        }
    }


    // GUITAR ------------------------------------------------------------------------

    // vol
    let guitarOpen = false
    const volGuitarOpen = new Tone.Volume(-8)
    volGuitarOpen.connect(master)

    // notes
    volGuitarOpen.mute = true
    let guitarOpenNotes = {c2: {}, d2: {}, e2: {}, f2: {}, g2: {}, a2: {}, b2: {}, c3: {}}
    let guitarOpenIsPlaying = false
    for (let note in guitarOpenNotes) {
        // console.log(note)
        guitarOpenNotes[note].isPlaying = false
        guitarOpenNotes[note].player = new Tone.Player('electric-guitar-power-chords/ax-grinder__' + note + '.wav')
        guitarOpenNotes[note].player.connect(volGuitarOpen)
        guitarOpenNotes[note].player.onstop = () => {
            // console.log (note + 'mute guitar stop')
            guitarOpenNotes[note].isPlaying = false
            guitarOpenIsPlaying = false
        }
    }

    // console.log(guitarOpenNotes)

    // const oscBass1 = new Tone.Oscillator('40', 'square').start()
    // const oscBass2 = new Tone.Oscillator('40', 'square').start()
    // const oscVol = new Tone.Volume(-25)
    // oscBass1.connect(oscVol)
    // oscBass2.csynth.triggerAttackRelease.conne '16n', '32n)

    // synth.triggerAttack('C3')

    $('#piano').change(function () {
        if ($(this).is(':checked')) {
            piano = true
            volPiano.mute = false
        } else {
            piano = false
            volPiano.mute = true
        }
    })

    $('#guitarOpen').change(function () {
        if ($(this).is(':checked')) {
            guitarOpen = true
            volGuitarOpen.mute = false
        } else {
            guitarOpen = false
            volGuitarOpen.mute = true
        }
    })

    $('#expS').change(function () {
        if ($(this).is(':checked')) {
            expS = true
            volExpS.mute = false
        } else {
            expS = false
            volExpS.mute = true
        }
    })

    let expV = false
    $('#expV').change(function () {
        if ($(this).is(':checked')) {
            expV = true
        } else {
            expV = false
        }
    })

    let pan = false
    $('#pan').change(function () {
        if ($(this).is(':checked')) {
            pan = true
        } else {
            pan = false
        }
    })




    let expElements = document.querySelectorAll('.radioRow.exp')
    let instElements = document.querySelectorAll('.radioRow.inst')
    $('.switch input').change(function () {
        if ($(this).is(':checked')) {
            console.log('instrumental')
            for (let el in expElements) {
                $(el).hide()
            }
            for (let el in instElements) {
                $(el).show()
            }
        } else {
            console.log('experimental')
            for (let el in expElements) {
                $(el).show()
            }
            for (let el in instElements) {
                $(el).hide()
            }
        }
    })



    // sebezähne statt sinus -> filter


    // filter.connect(vol)
    // synth.connect(vol)


    let c
    let cxt
    let img = document.querySelector('#img')
    let imgI = 0
    const h1 = $('h1')
    const h2 = $('h2')
    const imgSrc = [
        "Hsl-hsv_models.svg.png",
        "1_dhEdk3qMhkK1tQjXfwuQFw.png",
        "HSV_color_space_stereographic.png",
        "Concentric-Circles.jpeg",
        "kandinsky1.jpeg",
        "kandinsky-sketch-for-several-circles.jpeg",
        "TriptyquedeKrefeld_02.jpeg",
        "im-473216.jpeg",
        "pollock.jpeg",
        "5449.jpeg",
        "019b99b6397884cc7dfb0d9b6fd2f281.jpeg",
    ]

    if (img.complete) {
        setSizeAndImgData();
    }

    let xLast = 0
    let yLast = 0

    $('#c').mousemove(function (e) {
        var posX = $(this).offset().left,
            posY = $(this).offset().top;

        let x = e.pageX - posX
        let y = e.pageY - posY

        // let cursorPosX = x - 25
        // let cursorPosY = y - 25
        // let cursor = $('.cursor')
        // $(cursor).css('left', cursorPosX + 'px')
        // $(cursor).css('top', cursorPosY + 'px')

        let imgData = cxt.getImageData(x, y, 1, 1)

        // HSL -> intuitiever

        // filter auf S (sättigung des tons)
        // oder ein 2. osc -> filter mit starker resonanz / güte / q factor (in db) = sinus

        // filter auf weises rauschen -> wie pfeifen (mit band pass)

        // yves klein

        // let hsl = RGBToHSL(imgData.data[0], imgData.data[1], imgData.data[2])
        let hsv = rgb2hsv(imgData.data[0], imgData.data[1], imgData.data[2])

        $(h1).css('color', 'rgb(' + (255 - imgData.data[0]) + ', ' + (255 - imgData.data[1]) + ', ' + (255 - imgData.data[2]) + ')')
        $(h1).css('background-color', 'rgb(' + imgData.data[0] + ', ' + imgData.data[1] + ', ' + imgData.data[2] + ')')
        $(h2).html(hsv.h + ', ' + hsv.s + ', ' + hsv.v)


        // picture filter setting -> blur


        // SHEPERD TONE

        if (sheperd) {

            let deltaX = x - xLast
            let deltaY = y - yLast
            let deltaMove = deltaX * deltaX + deltaY * deltaY

            if (deltaMove > 100) {

                xLast = x
                yLast = y

                let rampTime = 0.1
                let pO = hsv.h * 100 / 360

                osc1.volume.rampTo(percentToDecibels(pO), 0.1)
                osc2.volume.rampTo(percentToDecibels(100 - pO), 0.1)

                osc1.frequency.rampTo(h2frequencyC1_C3(hsv.h), rampTime)
                osc2.frequency.rampTo(h2frequencyC3_C5(hsv.h), rampTime)
            }
        } else {
            shepVol.mute = true
        }


        // Piano -------------------------------------------------------------------

        if (piano) {

            // let deltaX = x - xLast
            // let deltaY = y - yLast
            // let deltaMove = deltaX * deltaX + deltaY * deltaY

            if (hsv.h < 360) {
                let noteName = Object.keys(pianoNotes)[Math.floor(hsv.h / 45)]
                let pianoNote = pianoNotes[noteName]

                if (!pianoNote.isPlaying) {
                    pianoNote.player.start()
                    pianoNote.isPlaying = true
                }
            }





            // if (deltaMove > 10000) {
            //
            //     xLast = x
            //     yLast = y
            //
            //     let normalized = 0
            //     let s = hsv.s.replace('%', '')
            //     if (s < 10) {
            //         normalized = s * 2
            //     } else if (s > 10 && s < 50) {
            //         normalized = s * 3
            //     } else {
            //         normalized = s * 4
            //     }
            //
            //
            //
            //
            //     if (hsv.h <= 45) {
            //         // synth.triggerAttackRelease('C2', '4n')
            //         // synth.triggerAttackRelease('C3', '4n')
            //
            //         console.log()
            //
            //         if (!pianoNotes.c3.isPlaying) {
            //             pianoNotes.c3.player.start()
            //         }
            //
            //
            //         console.log(45)
            //     } else if (hsv.h <= 90) {
            //         // synth.triggerAttackRelease('D2', '4n')
            //         // synth.triggerAttackRelease('E3', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.d3.isPlaying) {
            //             pianoNotes.d3.player.start()
            //         }
            //
            //
            //         console.log(90)
            //     } else if (hsv.h <= 135) {
            //         // synth.triggerAttackRelease('E2', '4n')
            //         // synth.triggerAttackRelease('G3', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.e3.isPlaying) {
            //             pianoNotes.e3.player.start()
            //         }
            //
            //
            //         console.log(135)
            //     } else if (hsv.h <= 180) {
            //         // synth.triggerAttackRelease('F2', '4n')
            //         // synth.triggerAttackRelease('B3', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.f3.isPlaying) {
            //             pianoNotes.f3.player.start()
            //         }
            //
            //
            //         console.log(180)
            //     } else if (hsv.h <= 225) {
            //         // synth.triggerAttackRelease('G2', '4n')
            //         // synth.triggerAttackRelease('D4', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.g3.isPlaying) {
            //             pianoNotes.g3.player.start()
            //         }
            //
            //
            //         console.log(225)
            //     } else if (hsv.h <= 270) {
            //         // synth.triggerAttackRelease('A2', '4n')
            //         // synth.triggerAttackRelease('F4', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.a3.isPlaying) {
            //             pianoNotes.a3.player.start()
            //         }
            //
            //
            //         console.log(270)
            //     } else if (hsv.h <= 315) {
            //         // synth.triggerAttackRelease('B2', '4n')
            //         // synth.triggerAttackRelease('A4', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.b3.isPlaying) {
            //             pianoNotes.b3.player.start()
            //         }
            //
            //
            //         console.log(315)
            //     } else if (hsv.h <= 360) {
            //         // synth.triggerAttackRelease('C3', '4n')
            //         // synth.triggerAttackRelease('C5', '4n')
            //
            //         console.log(pianoNotes[Object.keys(pianoNotes)[(hsv.h / 45).toFixed(0)]])
            //
            //         if (!pianoNotes.c4.isPlaying) {
            //             pianoNotes.c4.player.start()
            //         }
            //
            //
            //         console.log(360)
            //     }
            // }


        } else {
            volPiano.mute = true
        }


        // Guitar Open --------------------------------------------------------------

        if (guitarOpen) {
            let s = hsv.s.replace('%', '')
            if (s < 100) {
                let noteName = Object.keys(guitarOpenNotes)[Math.floor(s / 20)]
                let guitarNote = guitarOpenNotes[noteName]

                if (!guitarNote.isPlaying && !guitarOpenIsPlaying) {
                    guitarNote.player.start()
                    guitarNote.isPlaying = true
                    guitarOpenIsPlaying = true
                }
            }
        } else {
            volGuitarOpen.mute = true
        }


        if (expS) {
            let s = hsv.s.replace('%', '')
            volFilter.volume.rampTo(percentToDecibels(s), 0.1)

        }

        if (expV) {

            let normalized = 0
            let s = hsv.s.replace('%', '')
            if (s < 10) {
                normalized = s * 2
            } else if (s > 10 && s < 50) {
                normalized = s * 3
            } else {
                normalized = s * 4
            }

            filter.frequency.rampTo(normalized + 1000, 0.1)
        }

        if (pan) {
            let xTotal = c.width / 2

            let panTo = 0
            if (x < xTotal) {
                // let p = (x * 100) / xTotal
                panTo = ((100 - ((x * 100) / xTotal)) / 100)
            } else if (x >= xTotal) {
                // let p = ((x/2) * 100) / xTotal
                panTo = ((100 - ((x * 100) / xTotal)) / 100)
            }
            panner.pan.rampTo(panTo, 0.1);
        }

    })

    $('.switchImg').click((e) => {
        if (e.target.classList.contains('right')) {
            if (imgI < imgSrc.length - 1) {
                imgI++
            } else {
                imgI = 0
            }
        } else {
            if (imgI > 0) {
                imgI--
            } else {
                imgI = imgSrc.length - 1
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
            master.mute = false
            mute = false
        } else {
            $(img).attr('src', 'content/mute.png')
            master.mute = true
            mute = true
        }
        $(img).toggleClass('mute')
    })

    function setSizeAndImgData() {
        c = document.querySelector('#c')
        cxt = c.getContext('2d')
        img = document.querySelector('#img')

        c.width = window.innerWidth
        c.height = window.innerHeight

        console.log(c.width)

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

