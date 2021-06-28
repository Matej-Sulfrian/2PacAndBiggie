window.addEventListener("load", () => {
    let top = $('.top')
    let width = top.width()
    console.log(width)
    top.height(width / 16 * 9 + "px")
})

window.addEventListener("resize", () => {
    let top = $('.top')
    let width = top.width()
    console.log(width)
    top.height(width / 16 * 9 + "px")
})