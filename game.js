let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;

// global Variables
let startGame, startGameAgain, endGame, body, startInterval1, startInterval2, startInterval3;
let isGamePlaying, isPlayerDead = false;
let totalBombs = 0;
let multiplier = 15;
let level = 2;

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

        let element = document.elementFromPoint(player.offsetLeft, newTop + 50);
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

/**
 * This function starts the game
 */
function start() {
    // reset all variables
    resetValues();

    // hide text from the HTML
    hideText();

    // remove the first alien on the screen
    let alien = document.getElementById('alien');
    if (alien) alien.remove();

    // check if the game is currently playing
    if (isGamePlaying) {
        // hide the start button
        startGame.style.display = 'none';

        // display the screen score
        document.getElementsByClassName('username')[0].style.display = '';

        // immediately start the attack and set interval to 3 secs
        startAttacking();
        startInterval1 = setInterval(startAttacking, 3000);
    }
}

/**
 * This function returns the total-bomb count
 */
function getBombEscaped() {
    return totalBombs;
}

/**
 * This function changes the difficulty level while playing.
 * It keeps track of the global variable 'level'.
 */
function changeDifficultyLevel() {
    if (getBombEscaped() >= multiplier) {
        if (isGamePlaying) {
            // This increment the game level each time the user escape 20 bombs
            multiplier += 15;
            level++;
        }
    }

    if (level > 10) {
        level = 10;
    }

    return level;
}

/**
 * this function updates the local storage
 */
function updateLocalStorage() {
    localStorage.setItem('high-score', getBombEscaped());
    localStorage.setItem('highest-level', level);
}

// Enemy starts attacking
function startAttacking() {
    // attack user based on difficulty level
    for (let i = 0; i < changeDifficultyLevel(); i++) {
        setTimeout(enemyFireBombs, 1000);
        clearEnemy();
    }
}

/**
 * This function updates the html with the Bomb Escaped and Level.
 */
function updateUserBoard() {
    document.getElementsByTagName('span')[0].innerHTML = getBombEscaped().toString();
    document.getElementsByTagName('span')[1].innerHTML = level;
}

/**
 * This function fires the bomb.
 * It also moves the bomb
 */
function enemyFireBombs() {
    if (isGamePlaying === true) {
        // creates bomb
        let bomb = createEnemyAndBomb();

        //removes all out of screen arrows
        removeArrows();

        /**
         * Reference: https://www.pixelconverter.com/vh-to-pixel-converter
         * I made use of the conversion from vh to px
         * The 'sky' class has a height property of 70vh;
         */
        let randomExplosion = Math.ceil((randomInteger((70 * window.innerHeight) / 100, (100 * window.innerHeight) / 100)));

        // generate random number between 1 - 3 to determine the direction of bomb
        let direction = randomInteger(1, 3);
        // controls the bomb when they to bounce back when they hit the wall
        let left = false;
        let right = true;

        // set interval for random bomb spend
        startInterval2 = setInterval(function () {
            // update the user screen with the level and bomb count
            updateUserBoard();

            // get the current position of bomb
            let positionTop = bomb.offsetTop;
            let positionLeft = bomb.offsetLeft;

            // getting all the arrows on the screen
            let arrows = document.getElementsByClassName('arrow');

            // loop to get the collision with the bomb
            for (let i = 0; i < arrows.length; i++) {
                // get the range of the position of the bomb +/- 15 for wider coverage
                let array = range(arrows[i].offsetLeft - 15, arrows[i].offsetLeft + 15);

                // checking if the left position of the bomb is reach and the height ti get the contact
                if (array.includes(positionLeft) && arrows[i].offsetTop <= positionTop) {
                    // remove the bomb and the arrow in contact.
                    arrows[i].remove();
                    bomb.remove();
                }
            }

            // moving the bomb through the screen
            let newTop = positionTop + 1;
            let element = document.elementFromPoint(bomb.offsetLeft, newTop);

            // checking in the element contain the bomb to change the direction
            if (bomb.classList.contains('bomb')) {
                // if 1 - straight
                // if 2 - diagonal right
                // if 3 - diagonal left
                if (direction === 1) {
                    bomb.style.top = positionTop + 1 + 'px';
                } else {
                    if (direction === 2) {
                        bomb.style.top = positionTop + 1 + 'px';
                    } else {
                        bomb.style.top = positionTop + 1 + 'px';
                    }

                    if (right) {
                        positionLeft++;
                        bomb.style.left = positionLeft + "px";
                        // changing the bomb direction move right and direction to 45 deg
                        bomb.style.transform = 'rotate(45deg)';
                    }

                    if (left) {
                        positionLeft--;
                        bomb.style.left = positionLeft + "px";
                        // changing the bomb direction move right and direction to 135 deg
                        bomb.style.transform = 'rotate(135deg)';
                    }

                    if (window.innerWidth - 28 === positionLeft) {
                        left = true;
                        right = false;
                    }

                    if (positionLeft === 0) {
                        left = false;
                        right = true;
                    }
                }
            }

            // checking if the element is not null:
            // There were error when element is null or empty
            if (element !== null) {
                // checking for bomb contact with the character
                if (element.classList.contains('user')) {
                    // stop the bomb movement and add explosion
                    bomb.style.top = positionTop + 0 + 'px';
                    bomb.className = 'explosion';
                    // removes live and explosions/bombs on the screen
                    removeLives();
                    removeBombs();
                }

                // checking if the bomb is in the green part position and explode randomly
                if (positionTop >= randomExplosion) {
                    // stop the bomb movement, add explosion and set the direction back to default for proper explosion
                    bomb.style.top = positionTop + 0 + 'px';
                    bomb.className = 'explosion';
                    bomb.style.transform = '';
                    removeBombs();
                }
            }
        }, randomInteger(1, 10))
    }
}

/**
 * Reference https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquer
 * This function generate range of numbers.
 * @param lowEnd
 * @param highEnd
 * @returns {*[]}
 */
function range(lowEnd, highEnd) {
    let rangeArray = [];
    for (let i = lowEnd; i <= highEnd; i++) {
        rangeArray.push(i);
    }
    return rangeArray;
}

/**
 * This function removes the arrows
 */
function removeArrows() {
    // gets all the arrows and remove.
    const arrows = document.getElementsByClassName('arrow');
    for (let i = 0; i < arrows.length; i++) {
        // only remove arrows that are out of screen.
        if (arrows[i].offsetTop < 0) arrows[i].remove();
    }
}

/**
 * This function removes the bombs from the
 */
function removeBombs() {
    // setTimeout to 1 sec
    setTimeout(() => {
        let explosions = document.getElementsByClassName('explosion');
        for (let i = 0; i < explosions.length; i++) {
            explosions[i].remove();
        }

        // only remove the bomb when player is dead
        if (isPlayerDead) {
            let bombs = document.getElementsByClassName('bomb');
            for (let i = 0; i < bombs.length; i++) {
                bombs[i].remove();
            }
            // clears the enemy
            clearEnemy();
        }
    }, 1000);
}

/**
 * This function removes the live when the user character gets hit by arrow.
 */
function removeLives() {
    // update the level and bomb
    updateLocalStorage();
    // gets the current live of the user
    let lives = document.getElementsByClassName('health')[0].getElementsByTagName('li');
    if (lives.length > 1) {
        // if user has live, change character CSS and remove life.
        totalBombs--;
        document.getElementById('player').className = 'character hit left';
        lives[0].remove();
    } else {
        // if a user doesn't have live, change character to dead
        document.getElementById('player').className = 'character dead';

        resetValues();

        isGamePlaying = false;
        isPlayerDead = true;

        document.getElementsByClassName('game-over')[0].style.display = '';
        document.getElementsByClassName('play-again')[0].style.display = '';
        document.getElementsByClassName('end-game')[0].style.display = '';
        lives[0].remove();
    }
}

/**
 * This function clears enemies created.
 */
function clearEnemy() {
    //gets all aliens and remove them
    let enemies = document.getElementsByClassName('alien');
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].remove();
    }

    // remove out of screen arrows
    removeArrows();
}

/**
 * This function reset the global variable
 * Also clear the interval
 */
function resetValues() {
    // update the global variables
    totalBombs = 0;
    isPlayerDead = false;
    isGamePlaying = true;
    multiplier = 15;
    level = 2;

    // clear all intervals : Reference https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
    clearInterval(startInterval1);
    clearInterval(startInterval2);
    clearInterval(startInterval3);
}

/**
 * This function creates the enemy position and bomb
 */
function createEnemyAndBomb() {
    // creates a div, add class of bomb
    let bomb = document.createElement('div');
    bomb.classList.add('bomb');

    // gets a random position between 1 and the width of the screen,
    // I removed 80 px do that the position does not go out of screen
    let position = Math.ceil((randomInteger(1, window.innerWidth - 80)));

    // adding the position to the bomb,
    // then 28px to make it appear like its from the alien
    bomb.style.left = position + 28 + 'px';

    // creates a div, add class of alien
    let alien = document.createElement('div');
    alien.classList.add('alien');

    // making the alien goes top and the position left
    alien.style.top = '0vh';
    alien.style.left = position + 'px';

    // adding a custom slideIn animation
    alien.style.animation = 'slideIn 0.2s 1';

    // append the bomb and alien body
    body.appendChild(bomb);
    body.appendChild(alien);

    totalBombs++;

    return bomb;
}

/**
 * This function adds back the live
 */
function addLives(live = 3) {
    let lives = document.getElementsByClassName('health')[0];
    for (let i = 0; i < live; i++) {
        let live = document.createElement('li');
        lives.appendChild(live);
    }
}

/**
 * Randomly generate a number between 2 numbers
 * @param min
 * @param max
 * @returns {*}
 */
// Reference: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomInteger(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min);
}

/**
 * This function returns, gets and stores the user details
 */
function getUserDetails() {
    // Reference https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    // Gets the username from the local storage
    let placeholder = localStorage.getItem('username');
    if (placeholder === 'null') {
        placeholder = 'User 1';
    }

    // Prompt the user to enter nickname
    let user = prompt('Enter your nickname', placeholder);

    // Safes the username, high-score and level to local storage
    localStorage.setItem('username', user);

    return {
        'name': localStorage.getItem('username'),
        'score': localStorage.getItem('high-score'),
        'level': localStorage.getItem('highest-level')
    };
}

/**
 * This function displays the high score board.
 */
function displayScoreBoard() {
    // Hide all buttons
    hideText();

    // get user details
    let userDetails = getUserDetails();

    // display the username, high score, and level
    document.getElementsByClassName('details')[0].innerHTML = 'Username: ' + userDetails.name;
    document.getElementsByClassName('details')[1].innerHTML = 'Highest Score: ' + userDetails.score;
    document.getElementsByClassName('details')[2].innerHTML = 'Level: ' + userDetails.level;

    // display the 'High Score Board' and display the 'Play Again'
    document.getElementsByClassName('high-score')[0].style.display = '';
    document.getElementsByClassName('play-again')[0].style.display = '';

    // adjust the Play Again to take the High Score Board
    document.getElementsByClassName('play-again')[0].style.top = 30 + '%';
}

/**
 * This function shoots the arrow from the characters position
 */
function shootArrows() {
    //Get character and add class to make character shoot arrow
    let player = document.getElementById('player');
    player.className = 'character stand up fire';

    //Create the arrow element
    let arrow = document.createElement('div');
    arrow.className = 'arrow up';

    // Get the player's current position
    // or use the default from the css property of player top: 88vh; left: 200px;
    arrow.style.top = (player.style.top !== '') ? player.style.top : 88 + 'vh';
    arrow.style.left = (player.style.left !== '') ? player.style.left : 228 + 'px';

    //Adds arrow to body
    body.append(arrow);

    //set interval to move the arrow up.
    startInterval3 = setInterval(function () {
        let newTop = arrow.offsetTop - 2;
        arrow.style.top = newTop + 'px';
    }, 10);
}

/**
 * A custom class to hide 'Game Over, Play Again? and End Game' from HTML
 */
function hideText() {
    // hides all HTML with the 'hide-text' class
    let hideText = document.getElementsByClassName('hide-text');
    for (let i = 0; i < hideText.length; i++) {
        hideText[i].style.display = 'none';
    }
}

function myLoadFunction() {
    let timeout = setInterval(move, 10);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    //Event listener to start the game
    startGame = document.getElementsByClassName('start')[0];
    startGame.addEventListener('click', start);

    //Event listener to start the game again after game over
    startGameAgain = document.getElementsByClassName('play-again')[0];
    startGameAgain.addEventListener('click', start);

    //Event listener add lives back the game starts again
    startGameAgain.addEventListener('click', () => {
        addLives(3);
    });

    //Event listener to display score board when game ends.
    endGame = document.getElementsByClassName('end-game')[0];
    endGame.addEventListener('click', displayScoreBoard);
    body = document.getElementsByTagName('body')[0];

    // hide texts on the HTML
    hideText();

    /**
     * Reference https://stackoverflow.com/questions/24386354/execute-js-code-after-pressing-the-spacebar
     * The event listener for when the user press space to shoot an arrow.
     */
    document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
            // player only shoot after 0.5ms
            setTimeout(shootArrows, 500);
        }
    })
}

document.addEventListener('DOMContentLoaded', myLoadFunction);