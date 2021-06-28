var vidSrc = [
    {src: "https://www.youtube.com/embed/b_CKItV6Epk", done: false},
    {src: "https://www.youtube.com/embed/b_CKItV6Epk", done: false},
    {src: "https://www.youtube.com/embed/b_CKItV6Epk", done: false},
    {src: "https://www.youtube.com/embed/b_CKItV6Epk", done: false},
    {src: "https://www.youtube.com/embed/b_CKItV6Epk", done: false}
]
var actualVid = 0;

var questions = [
    [
        [true, false, false, false],
        [false, true, false, false],
        [false, true, false, false]
    ],
    [
        [false, true, false, false],
        [false, true, false, false],
        [true, false, false, false]
    ],
    [
        [false, false, false, true],
        [false, false, false, true],
        [true, false, true, false, true]
    ],
    [
        [true, false, false, false],
        [true, false, false, false],
        [false, true, false, false]
    ],
]

var stepBarWidth = 16.66;

window.addEventListener("load", () => {
    let top = $('.top')
    let width = top.width()
    console.log(width)
    top.height(width / 16 * 9 + "px")

    $('.go-right').on("click", nextVid())
    $('.go-left').on("click", () => {
        let srcToCheck = actualVid - 1
        if (srcToCheck < 0) {
            srcToCheck = 4
        }
        if (vidSrc[srcToCheck].done === true) {
            actualVid--
            if (actualVid < 0) {
                actualVid = 4
            }
            $('.top .mid iframe').attr("src", vidSrc[actualVid].src);
            console.log(actualVid, vidSrc[actualVid].src)
        } else {
            console.log("answer questions first")
            $('.quiz-sec')[0].scrollIntoView({behavior: "smooth"})
        }
    })

    $('.answer-button').on("click", () => {
        let ansDivs = $('.' + actualVid + " .answer-sec")
        let counter = 0;
        let done = true
        for (let ansDiv of ansDivs) {
            console.log(counter)
            let innerCounter = 0
            let labs = $(ansDiv).children()
            for (let lab of labs) {
                console.log("checkbox: ", $(lab).children()[0].checked)
                console.log("correct: ", questions[actualVid][counter][innerCounter])
                if ($(lab).children()[0].checked !== questions[actualVid][counter][innerCounter]) {
                    done = false;
                    break;
                }
                innerCounter++
            }
        counter++
        }
        if (done) {
            vidSrc[actualVid].done = true;
            if (stepBarWidth < 99.96) {
                stepBarWidth += 16.66
            }
            let nth = actualVid+1
            $('.point:nth-child('+nth+')').css("background-color", "#05CECF")
            $('.point:nth-child('+nth+')').css("color", "white")
            let stepBar = $('.inner-step-bar')
            stepBar.width(stepBarWidth + "%")
            done = false
            nextVid()
        }
    })
})

window.addEventListener("resize", () => {
    let top = $('.top')
    let width = top.width()
    console.log(width)
    top.height(width / 16 * 9 + "px")
})

function nextVid () {
    if (vidSrc[actualVid].done === true) {
        $('.quiz.' + actualVid).hide()
        actualVid++
        if (actualVid > 4) {
            actualVid = 0
        }
        $('.top .mid iframe').attr("src", vidSrc[actualVid].src);
        $('.quiz.' + actualVid).css("display", "flex")
        console.log(actualVid, vidSrc[actualVid].src)
    } else {
        console.log("answer questions first")
        $('.quiz-sec')[0].scrollIntoView({behavior: "smooth"})
    }
}



