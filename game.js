let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;

let startGame;
let body;
let isGamePlaying = false;
let isPlayerDead = false;
let totalBombs = 0;

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

//Starts the game
function start() {
    isGamePlaying = true;
    document.getElementById("alien").remove();
    document.getElementsByTagName('span')[0].innerHTML = getUserName();
    document.getElementsByClassName('username')[0].style.display = '';

    if (isGamePlaying) {
        startGame.style.display = 'none';
        startAttacking();
        setInterval(startAttacking, 5000);
    }
}

function getBombEscaped() {
    return totalBombs;
}

//Enemy starts attacking
function startAttacking(difficulty = 1) {
    let attackRate = Math.ceil(Math.random() * 500);

    for (let i = 0; i < difficulty * 3; i++) {
        setTimeout(enemyFireBombs, attackRate);
        clearEnemy();
    }
}

//Enemy fires bomb at interval
function enemyFireBombs() {
    if (isGamePlaying === true) {
        let bomb = createEnemyAndBomb();
        let randomExplosion = Math.ceil((randomInteger(535, 770) + 1) / 10) * 10;
        let rate = [20, 40, 60, 80, 100, 150, 200, 300];

        setInterval(function () {
            document.getElementsByTagName('span')[1].innerHTML = getBombEscaped().toString();
            let positionTop = bomb.offsetTop;
            bomb.style.top = positionTop + 10 + 'px';

            // let randomBoolean = Math.random() < 0.1;
            //
            // if (randomBoolean) {
            //     let positionLeft = bomb.offsetLeft;
            //     bomb.style.left = positionLeft + 8 + 'px';
            // }

            let newTop = positionTop + 10;
            let element = document.elementFromPoint(bomb.offsetLeft, newTop);

            if (element !== null) {

                if (element.classList.contains('user')) {
                    bomb.style.top = positionTop + 0 + 'px';
                    bomb.classList = 'explosion';
                    removeLives()
                }

                if (positionTop === randomExplosion) {
                    bomb.classList = 'explosion';
                    bomb.style.top = positionTop + 0 + 'px';
                }

                if (element.classList.contains('explosion')) {
                    setTimeout(function () {
                        removeBombs()
                    }, 100);
                }

            }
        }, rate[randomInteger(0, 7)])
    }
}

function removeBombs() {
    const explosion = document.getElementsByClassName('explosion');
    while (explosion.length > 0) explosion[0].remove();

    if (isPlayerDead) {
        const bombs = document.getElementsByClassName('bomb');
        while (bombs.length > 0) bombs[0].remove();
    }
}

// Creates the enemy position and bomb
function createEnemyAndBomb() {
    let bomb = document.createElement('div');
    body.appendChild(bomb);
    bomb.classList.add('bomb');

    let position = Math.ceil(Math.random() * window.innerWidth);
    bomb.style.left = position + 28 + "px";

    let enemy = document.createElement('div');
    body.appendChild(enemy);
    enemy.classList.add('alien');
    enemy.style.top = "0vh";
    enemy.style.left = position + "px";

    totalBombs++;

    return bomb;
}

function removeLives() {
    let lives = document.getElementsByClassName('health')[0].getElementsByTagName('li');
    if (lives.length > 1) {
        totalBombs--;
        lives[0].remove()
    } else {
        document.getElementById('player').className = 'character dead';
        isGamePlaying = false;
        lives[0].remove();

        isPlayerDead = true;
        document.getElementsByClassName('game-over')[0].style.display = '';
        document.getElementsByClassName('play-again')[0].style.display = '';

        removeBombs();
    }
}

// clears enemies created earlier.
function clearEnemy() {
    let enemies = document.getElementsByClassName('alien');
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }
}

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomInteger(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

// gets and stores username
function getUserName() {
    const user = localStorage.getItem("username");
    if (user === null) {
        let user = prompt("Enter your nickname", "User 1");
        localStorage.setItem('username', user);
    }

    return localStorage.getItem('username');
}

function myLoadFunction() {
    timeout = setInterval(move, 10);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    startGame = document.getElementsByClassName('start')[0];
    startGame.addEventListener('click', start);

    body = document.getElementsByTagName('body')[0];
    document.getElementsByClassName('username')[0].style.display = 'none';
    document.getElementsByClassName('game-over')[0].style.display = 'none';
    document.getElementsByClassName('play-again')[0].style.display = 'none';
}

document.addEventListener('DOMContentLoaded', myLoadFunction);