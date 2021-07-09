var movePlanks = false;
var animation = false;
var stopAnimation = false;
var restartIndi = false;
var paused = false;
var createPlayer = false;

function stopPlanksMoving(_timeout) {
    setTimeout(() => {
        movePlanks = false
    }, _timeout)
}

const auth = firebase.auth();
const db = firebase.database();
var canvas;
var userName;
var id;
var score = 0;
var connectedPlayerId = '';
var connectedPlayerName = '';
var playerIdValid = false;
let position = {
    x: -50,
    y: -50,
    offset: 0
}
let audio = {}
let playing = false;
let settingButtons;

document.addEventListener("DOMContentLoaded", e => {
    canvas = document.querySelector("canvas");

    let users = [];

    audio["menu"] = new Audio();
    audio["menu"].src = "content/menu.mp3"

    $('body').click(() => {
        if (!playing) {
            audio['menu'].play();
            playing = true;
        }
    })

    audio["game"] = new Audio();
    audio["game"].src = "content/play.mp3"

    settingButtons = document.querySelectorAll(".on-off")
    for (const element of settingButtons) {
        element.addEventListener('click', () => {
            let active = $(element).find('.active')
            if (active.hasClass('on')) {
                $(element).find('.off').toggleClass('active')
                audio['menu'].muted = true;
                audio['game'].muted = true;
            } else if (active.hasClass('off')) {
                $(element).find('.on').toggleClass('active')
                audio['menu'].muted = false;
                audio['game'].muted = false;
            }
            active.toggleClass('active')
        })
    }

    db.ref().child("users").get().then((snapshot) => {
        if (snapshot.exists()) {
            for (let key in snapshot.val()) {
                users.push(snapshot.val()[key].username)
            }
        } else {
            console.log("No data available")
        }
    }).catch((error) => {
        console.error(error);
    })

    document.addEventListener("keydown", e => {
        if (e.keyCode === 13 && document.querySelector(".login input").value !== "") {
            userName = document.querySelector(".login input").value;
            for (let user of users) {
                if (user === userName) {
                    alert("user name already exists")
                    break
                } else {
                    document.querySelector(".login input").value = "";
                    auth.signInAnonymously()
                }
            }
            if (users.length === 0) {
                document.querySelector(".login input").value = "";
                auth.signInAnonymously()
            }
        }
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            id = auth.currentUser.uid
            if (userName) {
                writeUserData(id, userName)
                $('.logged .name').html("<b>Name:</b> " + userName)
                $('.logged .id').html("<b>ID</b>:</b> " + id)
            } else {
                db.ref().child("users").child(id).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        userName = snapshot.val().username;
                        $('.logged .name').html("<b>Name:</b><i>" + userName + "</i>")
                        $('.logged .id').html("<b>ID:</b><i class='id'>" + id + "</i>")
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
            $('.login').hide();
            $('.logged').show();

            db.ref('users/' + id + '/connected').on('value', (snapshot) => {
                if (snapshot.val()) {
                    db.ref('users').child(id).get().then((snapshot) => {
                        if (snapshot.val().playerId !== "") {
                            connectedPlayerId = snapshot.val().playerId
                            connectedPlayerName = snapshot.val().playerName
                            $('.line-status').toggleClass('online')
                            $('.multiplayer .disconnected').hide()
                            $('.multiplayer .connected').css('display', 'flex')
                            $('.multiplayer .connected .name').html(connectedPlayerName)
                            $('.multiplayer .connected .id').html(connectedPlayerId)
                            $('.popup').css('display', 'flex')
                            $('.popup .message p').html('player "' + connectedPlayerName + '" with ID "' + connectedPlayerId + '" was connected.')
                            db.ref('users/' + connectedPlayerId + '/inGame').set(false)
                            db.ref('users/' + connectedPlayerId + '/gameState').set('')
                        }
                    })
                } else if (connectedPlayerName !== '' && connectedPlayerId !== '') {
                    $('.popup').css('display', 'flex')
                    $('.popup .message p').html('player "' + connectedPlayerName + '" with ID "' + connectedPlayerId + '" was disconnected.')
                    $('.line-status').toggleClass('online')
                    $('.multiplayer .disconnected').css('display', 'flex')
                    $('.multiplayer .connected').hide()
                    $('.multiplayer .connected .name').html('')
                    $('.multiplayer .connected .id').html('')
                    connectedPlayerId = ''
                    connectedPlayerName = ''
                }
            })

            db.ref('users/' + id + '/inGame').on('value', (snapshot) => {
                if (snapshot.val() === true && connectedPlayerId !== '') {
                    db.ref().child('users').child(connectedPlayerId).child('inGame').get().then((snapshot) => {
                        if (snapshot.val() === true) {
                            pauseGame()
                        }
                    })
                } else if (snapshot.val() === false && connectedPlayerId !== '') {
                    $('.pause-menu').toggleClass('active')
                    $('.pause-menu .left').show()
                    $('.pause-menu .wait').hide()
                    $('.pause-menu img').hide()
                    $('.pause-menu .continue').hide()
                    $('.pause-menu .restart').hide()
                    $('.play-menu-layer .pause img').hide()
                    stopAnimation = true;
                    setTimeout(() => {
                        stopAnimation = false
                    }, 30)
                    paused = true;
                }
            })

            db.ref('users/' + id + '/gameState').on('value', (snapshot) => {
                if (snapshot.val() === 'lost') {
                    pauseGame()
                    $('.play-menu-layer .pause img').hide()
                    $('.pause-menu img').hide()
                    $('.pause-menu .win').show()
                    $('.pause-menu .continue').hide()
                } else if (snapshot.val() === 'restart') {
                    newRestart()
                } else if (snapshot.val() === 'quit') {
                    backToMenu()
                }

            })

        } else {
            $('.login').show();
            $('.logged').hide();
        }
    })
})

function writeUserData(userId, userName) {
    db.ref('users/' + userId).set({
        username: userName,
        connected: false,
        playerName: "",
        playerId: "",
        inGame: false,
        gameState: "",
        gameMode: "",
        x: 0,
        y: 0,
        offset: 0
    });
    db.ref('highscores/' + userId).set({
        name: userName,
        score: 0
    })
}

function signOut() {
    $('.popup').css('display', 'flex')
    $('.popup .message p').html('do you really want to sign out?<br>your high-score will be deleted from the list!')
    $('.popup .ok').attr('data-action', 'sign-out')
}

function menu(e) {
    let back = $('.back')
    let logged = $('.logged')
    let menu = $('.menu')
    let logo = $('.logged .logo').hide()
    $('.signOut').hide()
    switch (e.target.innerHTML) {
        case "SPIELEN":
            back.attr("alt", "spielen");
            logged.hide();
            $('.play-menu-layer').show();
            restartIndi = true;
            setTimeout(() => {
                restartIndi = false;
            }, 30)
            animation = true;
            setTimeout(() => {
                animation = false
            }, 30)
            paused = false;
            audio['menu'].pause()
            audio['game'].play()
            if (connectedPlayerId !== '') {
                db.ref('users/' + connectedPlayerId + '/inGame').set(true)
                db.ref().child('users').child(id).child('inGame').get().then((snapshot) => {
                    if (!snapshot.val()) {
                        $('.pause-menu').toggleClass('active')
                        $('.pause-menu .wait').show()
                        $('.pause-menu img').hide()
                        $('.pause-menu .continue').hide()
                        $('.pause-menu .restart').hide()
                        $('.pause-menu .lost').hide()
                        $('.pause-menu .win').hide()
                        $('.pause-menu .left').hide()
                        $('.play-menu-layer .pause img').hide()
                        stopAnimation = true;
                        setTimeout(() => {
                            stopAnimation = false
                        }, 30)
                        paused = true;
                    }
                })
                db.ref('users/' + connectedPlayerId + '/gameState').set('playing')
            }
            break
        case "MULTIPLAYER":
            $('.multiplayer').show()
            menu.hide()
            $('.user-data').show()
            back.attr("alt", "multiplayer");
            back.show();
            logo.hide()
            logged.css('background-image', 'url("content/Trompeten-best.png")')
            logged.toggleClass('multi')
            break
        case "BESTENLISTE":
            back.attr("alt", "bestenliste");
            back.show();
            $('.bestenliste').css('display', 'flex')
            menu.hide()
            logo.hide()
            logged.css('background-image', 'url("content/Trompeten-best-1.png")')
            logged.toggleClass('best')
            db.ref().child('highscores').get().then((snapshot) => {
                let scores = [];
                let counter = 0;
                let list = '<div><h1>BESTENLISTE</h1>' +
                    '<img src="./content/Spalte-best.png"></div>' +
                    '<table>'
                for (let key in snapshot.val()) {
                    scores.push(snapshot.val()[key])
                    counter++
                    if (counter === 5) {
                        break
                    }
                }
                scores.sort((a, b) => b.score - a.score);
                counter = 1;
                for (let heigh of scores) {
                    list += '<tr><td><img src="./content/Spalte-best.png"></td></tr>'
                    list += '<tr><td><p>' + counter + '. ' + heigh.name + '</p></td>'
                    list += '<td><p>' + heigh.score + '</p></td></tr>'
                    list += '<tr><td><img src="./content/Spalte-best.png" style="transform: rotateY(180deg)"></td></tr>'
                    counter++
                }
                list += '</table>'
                $('.bestenliste').html(list)
            })
            break
        case "OPTIONEN":
            back.attr("alt", "optionen");
            back.show();
            $('.optionen').css('display', 'flex')
            menu.hide()
            logo.hide()
            logged.css('background-image', 'url("content/Klavier-Bestenliste.png")')
            break
    }
}

function backToMenu() {
    let back = $('.back')
    let menu = back.attr("alt")
    let logged = $('.logged')
    logged.css('background-image', 'url("content/Trompeten_Main-Menu.png")')
    if (logged.hasClass('multi')) {
        logged.toggleClass('multi')
    }
    if (logged.hasClass('best')) {
        logged.toggleClass('best')
    }
    if (menu) {
        $('.' + menu).hide();
    }
    audio['menu'].pause()
    audio['game'].pause()
    audio['menu'].play()
    $('.menu').show();
    logged.show()
    $('.signOut').show()
    $('.logged .logo').show()
    $('.user-data').hide();
    back.hide();
    $('.play-menu-layer').hide();
    back.attr("alt", "")
    if ($('.pause-menu').hasClass("active")) {
        $('.pause-menu').toggleClass("active")
        $('.play-menu-layer .pause img').show()
        $('.play-menu-layer .pause-menu .left').hide()
    }
    if (connectedPlayerId !== '') {
        db.ref('users/' + connectedPlayerId + '/inGame').set(false)
        db.ref('users/' + connectedPlayerId + '/gameState').set('quit')
    }
}

function connectPlayer() {
    let userID = $('.multiplayer input').val()
    db.ref().child("users").child(userID).get().then((snapshot) => {
        if (playerIdValid && !snapshot.val().connected) {
            connectedPlayerId = userID;
            connectedPlayerName = snapshot.val().username;
            db.ref("users/" + userID + "/playerId").set(id)
            db.ref("users/" + id + "/playerId").set(userID)
            db.ref("users/" + userID + "/playerName").set(userName)
            db.ref("users/" + id + "/playerName").set(snapshot.val().username)
            db.ref("users/" + userID + "/connected").set(true)
            db.ref("users/" + id + "/connected").set(true)
        } else if (snapshot.val().connected) {
            $('.popup').css('display', 'flex')
            $('.popup .message p').html('player already connected to another player...')
        }
    })

}

function checkPlayer() {
    let userID = $('.multiplayer input').val()
    if (userID !== "") {
        db.ref().child("users").child(userID).get().then((snapshot) => {
            if (snapshot.val() != null && userID !== id) {
                $('.multiplayer .disconnected button').css("background-color", "green")
                playerIdValid = true;
            } else {
                $('.multiplayer .disconnected button').css("background-color", "red")
                playerIdValid = false;
            }
        }).catch((error) => {
            console.log(error)
        })
    } else {
        $('.multiplayer .disconnected button').css("background-color", "#EEECC1")
    }
}

function writePosition(_x, _y, offset) {
    db.ref('users/' + id + '/x').set(_x)
    db.ref('users/' + id + '/y').set(_y)
    db.ref('users/' + id + '/offset').set(offset)
}

function restart() {
    $('.pause-menu').toggleClass("active")
    $('.play-menu-layer .pause img').show()
    restartIndi = true;
    setTimeout(() => {
        restartIndi = false;
    }, 30)
    animation = true;
    setTimeout(() => {
        animation = false
    }, 30)
    paused = false;
    if (connectedPlayerId !== '') {
        db.ref('users/' + id + '/gameState').set('playing')
        db.ref('users/' + connectedPlayerId + '/gameState').set('restart')
    }
}


function newRestart() {
    $('.pause-menu').toggleClass("active")
    $('.play-menu-layer .pause img').show()
    restartIndi = true;
    setTimeout(() => {
        restartIndi = false;
    }, 30)
    animation = true;
    setTimeout(() => {
        animation = false
    }, 30)
    paused = false;
    db.ref('users/' + id + '/gameState').set('playing')
}

function pauseGame() {
    $('.pause-menu').toggleClass("active")
    $('.pause-menu img').show()
    $('.pause-menu .lost').hide()
    $('.pause-menu .win').hide()
    $('.pause-menu .wait').hide()
    $('.pause-menu .left').hide()
    $('.pause-menu .continue').show()
    $('.pause-menu .restart').show()
    $('.play-menu-layer .pause img').show()
    if (!paused) {
        stopAnimation = true;
        setTimeout(() => {
            stopAnimation = false
        }, 30)
        paused = true;
    } else if (paused) {
        animation = true;
        setTimeout(() => {
            animation = false
        }, 30)
        paused = false;
    }
}

function lost() {
    $('.pause-menu').toggleClass("active")
    $('.pause-menu img').hide()
    $('.pause-menu .lost').show()
    $('.pause-menu .continue').hide()
    $('.pause-menu .win').hide()
    $('.pause-menu .wait').hide()
    $('.pause-menu .left').hide()
    $('.pause-menu .restart').show()
    if (connectedPlayerId !== '') {
        db.ref('users/' + connectedPlayerId + '/gameState').set('lost')
    } else {
        db.ref().child('highscores').child(id).child('score').get().then((snapshot) => {
            if (snapshot.val() < score) {
                db.ref('highscores/' + id + '/score').set(score)
            }
        })
    }
}

function closePopup() {
    $('.popup').hide()
    $('.popup .ok').attr('data-action', 'close')
}

function popupOk() {
    let action = $('.popup .ok').attr('data-action')
    switch (action) {
        case 'close':
            closePopup()
            break

        case 'disconnect':
            $('.multiplayer .disconnected').css('display', 'flex')
            $('.multiplayer .connected').hide()
            $('.multiplayer .connected .name').html('')
            $('.multiplayer .connected .id').html('')
            db.ref("users/" + connectedPlayerId + "/playerId").set("")
            db.ref("users/" + id + "/playerId").set("")
            db.ref("users/" + connectedPlayerId + "/playerName").set('')
            db.ref("users/" + id + "/playerName").set('')
            db.ref("users/" + connectedPlayerId + "/connected").set(false)
            db.ref("users/" + id + "/connected").set(false)
            closePopup()
            break

        case 'sign-out':
            db.ref('users/' + id).remove()
            db.ref('highscores/' + id).remove()
            auth.signOut()
            $('.back').hide()
            closePopup()
            break
    }
}

function disconnectPlayer() {
    $('.popup').css('display', 'flex')
    $('.popup .message p').html('do you really want to disconnect with player ' + connectedPlayerId + ' ?')
    $('.popup .ok').attr('data-action', 'disconnect')
}

function getPlayerPosition() {
    if (connectedPlayerId !== '' && connectedPlayerName !== '') {
        db.ref().child('users').child(connectedPlayerId).child('x').get().then((snapshot) => {
            position.x = snapshot.val()
        });
        db.ref().child('users').child(connectedPlayerId).child('y').get().then((snapshot) => {
            position.y = snapshot.val()
        })
        db.ref().child('users').child(connectedPlayerId).child('offset').get().then((snapshot) => {
            position.offset = snapshot.val()
        })
    } else {
        position.x = -50;
        position.y = -50;
    }
}

function copy() {
    var el = document.createElement('textarea');
    el.value = id;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

