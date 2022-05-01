let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;

let startGame;
let body;
let isGamePlaying = false;

function keyup(event) {
    let player = document.getElementById('player');
    if (event.keyCode === 37) {
        leftPressed = false;
        lastPressed = 'left';
    }
    if (event.keyCode === 39) {
        rightPressed = false;
        lastPressed = 'right';
    }
    if (event.keyCode === 38) {
        upPressed = false;
        lastPressed = 'up';
    }
    if (event.keyCode === 40) {
        downPressed = false;
        lastPressed = 'down';
    }

    player.className = 'character stand ' + lastPressed;
}

function move() {
    let player = document.getElementById('player');
    let positionLeft = player.offsetLeft;
    let positionTop = player.offsetTop;
    if (downPressed) {
        let newTop = positionTop + 1;

        let element = document.elementFromPoint(player.offsetLeft, newTop + 32);
        if (element.classList.contains('sky') === false) {
            player.style.top = newTop + 'px';
        }

        if (leftPressed === false) {
            if (rightPressed === false) {
                player.className = 'character walk down';
            }
        }
    }
    if (upPressed) {
        let newTop = positionTop - 1;

        let element = document.elementFromPoint(player.offsetLeft, newTop);
        if (element.classList.contains('sky') === false) {
            player.style.top = newTop + 'px';
        }

        if (leftPressed === false) {
            if (rightPressed === false) {
                player.className = 'character walk up';
            }
        }
    }
    if (leftPressed) {
        let newLeft = positionLeft - 1;

        let element = document.elementFromPoint(newLeft, player.offsetTop);
        if (element.classList.contains('sky') === false) {
            player.style.left = newLeft + 'px';
        }


        player.className = 'character walk left';
    }
    if (rightPressed) {
        let newLeft = positionLeft + 1;

        let element = document.elementFromPoint(newLeft + 32, player.offsetTop);
        if (element.classList.contains('sky') === false) {
            player.style.left = newLeft + 'px';
        }

        player.className = 'character walk right';
    }

}

function keydown(event) {
    if (event.keyCode === 37) {
        leftPressed = true;
    }
    if (event.keyCode === 39) {
        rightPressed = true;
    }
    if (event.keyCode === 38) {
        upPressed = true;
    }
    if (event.keyCode === 40) {
        downPressed = true;
    }
}


function myLoadFunction() {
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);