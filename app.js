window.addEventListener('load', init, false);
function init() {

    let ship = null;
    let requestId = undefined;

    let score = 0;
    let asteroidBig = 10;
    let asteroidMed = 15;
    let asteroidSmall = 25;
    let alienBig = 10;
    let alienMed = 15;
    let alienSmall = 25;
    let level = 0;
    let levels = [[1, 2, 1, 2, 2, 2],
    [2, 1, 2, 1, 3, 3, 2, 3, 4, 4, 3, 2],
    [2, 3, 1, 2, 1, 2, 3, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3],
    [2, 3, 1, 2, 1, 2, 3, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 1, 2, 3, 4, 4, 3]];
    let levelAlienTimer = [];

    // let levels = [[4],
    // [4],
    // [4]];

    let background = '#2b0d3b';
    let creme = '#f6e6ca';
    let lightblue = '#b5e2ef';
    let red = '#ee3344';
    let bulletColor = 'lawngreen';
    let alienColor = '#ffdd17';
    let goCounter = 0;
    let poolAsteroids = new Map();
    let poolBullets = new Map();
    let poolAliens = new Map;
    let poolAlienBullets = new Map;

    let angle = 0;

    let scoreTitle = document.getElementById('scoreTitle');
    let levelTitle = document.getElementById('levelTitle');
    let startBtn = document.getElementById('startBtn');
    startBtn.onclick = startBtnClick;

    addAsteroids();
    update();

    function update() {

        for (let bullet of poolBullets.values()) {
            bullet.update();
            if (bullet.readyToRemove) {
                bullet.remove();
            } else {
                for (let asteroid of poolAsteroids.values()) {
                    let rect = Rect(bullet.position.x, bullet.position.y, bullet.width, bullet.height);
                    if (asteroid.isTouching(rect)) {
                        addAsteroidOnTouch(asteroid);
                        bullet.remove();
                        break;
                    }
                }
                for (let alien of poolAliens.values()) {
                    let rect = Rect((alien.position.x + 5), (alien.position.y + 20), (alien.width - 20), (alien.height - 20));
                    if (bullet.isTouching(rect)) {
                        console.log('ship destroy alien');
                        alien.remove();
                        break;
                    }
                }
            }
        }

        for (let asteroid of poolAsteroids.values()) {
            if (ship != null) {
                let rect = Rect((ship.position.x + 5), (ship.position.y + 20), (ship.width - 20), (ship.height - 20));
                if (asteroid.isTouching(rect)) {
                    addAsteroidOnTouch(asteroid);
                    gameEnd();
                    break;
                }
            }
            asteroid.update();
        }

        for (let alien of poolAliens.values()) {
            alien.update();
        }

        for (let bullet of poolAlienBullets.values()) {

            bullet.update();

            if (bullet.readyToRemove) {
                bullet.remove();
            } else {
                if (ship != null) {
                    let rect = Rect((ship.position.x + 5), (ship.position.y + 20), (ship.width - 20), (ship.height - 20));
                    if (bullet.isTouching(rect)) {
                        console.log('ship destroy by alien');
                        gameEnd();
                        break;
                    }
                }
            }
        }

        if (ship != null) {
            ship.update();
        }

        requestId = requestAnimationFrame(update);
    }

    function keydownHandler(e) {

        switch (e.keyCode) {
            case 39://left
                ship.doLeft = true;
                break;
            case 37://right
                ship.doRight = true;
                break;
            case 38:
                ship.doThrust = true;
                break;
            case 32:
                ship.doShoot = true;
                break;
            default:
                break;
        }
    }

    function keyupHandler(e) {
        switch (e.keyCode) {
            case 39://left
                ship.doLeft = false;
                break;
            case 37://right
                ship.doRight = false;
                break;
            case 38:
                ship.doThrust = false;
                break;
            case 32:
                ship.doShoot = false;
                break;
            default:
                break;
        }
    }

    //Add Methods
    function addShip() {
        ship = Ship(goCounter, Vector(window.innerWidth / 2, window.innerHeight / 2), 40, 40, bulletColor, addBullet, removeShip);
    }

    function addBullet() {
        let shootPosition = Vector((ship.position.x + (ship.width / 2) - 2), (ship.position.y + (ship.height / 2) - 2));
        goCounter++;
        let bullet = Bullet(goCounter, shootPosition, ship.angle, (5 + ship.velocityMag), bulletColor, removeBullet);
        poolBullets.set(goCounter, bullet);
    }

    function addAlienBullet(alien) {

        let position;
        let direction = 0;
        if (alien.shootUp) {
            direction = ramdonIn(260, 315);
            position = Vector(alien.position.x + (alien.width / 2), alien.position.y);
        } else {
            direction = ramdonIn(45, 110);
            position = Vector(alien.position.x + (alien.width / 2), (alien.position.y + alien.height));
        }

        // let shootPosition = Vector(alien.position.x, alien.position.y);
        goCounter++;
        let bullet = Bullet(goCounter, position, direction, ramdonIn(2, 5), alien.color, removeAlienBullet);
        poolAlienBullets.set(goCounter, bullet);
    }

    function addAsteroids() {

        let time = 0;
        for (var i = 0; i < levels[level].length; i++) {


            // levelAlienTimer.push(time);
            let y = -100;
            let x = 0;

            if (i % 2 == 0) {
                x = ramdonIn(0, window.innerWidth / 2);

            } else {
                x = ramdonIn(window.innerWidth / 2, window.innerWidth);
            }

            if (i % 3 == 0) {
                y = window.innerHeight;
            }

            goCounter++;
            let asteroid = Asteroid(goCounter, Vector(x, y), ramdonIn(-90, 90), ramdonIn(1, 3), levels[level][i], ramdonColor(), removeAsteroid);
            poolAsteroids.set(goCounter, asteroid);
        }
    }

    function addAsteroidOnTouch(asteroid) {

        if (asteroid.type == 1 || asteroid.type == 2) {
            goCounter++;
            let asteroid1 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 4), 3, ramdonColor(), removeAsteroid);
            poolAsteroids.set(goCounter, asteroid1);

            goCounter++;
            let asteroid2 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(2, 5), 3, ramdonColor(), removeAsteroid);
            poolAsteroids.set(goCounter, asteroid2);
            score += asteroidBig;
        } else if (asteroid.type == 3) {
            goCounter++;
            let asteroid1 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 3), 4, ramdonColor(), removeAsteroid);
            poolAsteroids.set(goCounter, asteroid1);

            goCounter++;
            let asteroid2 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 3), 4, ramdonColor(), removeAsteroid);
            poolAsteroids.set(goCounter, asteroid2);
            score += asteroidMed;
        } else {
            score += asteroidSmall;
        }

        scoreTitle.firstChild.nodeValue = '' + score;
        asteroid.remove();

        if (poolAsteroids.size == 0) {
            levelCompleted();
        }
    }

    function addAlient() {
        goCounter++;
        let alien = Alien(goCounter, Vector(50, 500), 0, ramdonIn(1, 3), 3, alienColor, addAlienBullet, removeAlient);
        poolAliens.set(goCounter, alien);
    }

    addAlient();

    //Remove Methods
    function removeBullet(go) {
        poolBullets.delete(go.id);
    }

    function removeAlienBullet(go) {
        poolAlienBullets.delete(go.id);
    }

    function removeAsteroid(go) {
        poolAsteroids.delete(go.id)
    }

    function removeAlient(go) {
        poolAliens.delete(go.id);
    }

    function removeShip(go) {
        ship = null;
    }

    //Game play methods
    function gameEnd() {
        ship.remove();
        startBtn.disabled = false;
        startBtn.style.opacity = 1;

        window.removeEventListener('keydown', keydownHandler, false);
        window.removeEventListener('keyup', keyupHandler, false);
    }

    function startBtnClick(e) {
        score = 0;
        level = 0;
        levelTitle.firstChild.nodeValue = '' + (level + 1);
        scoreTitle.firstChild.nodeValue = '' + score;
        clean();
        addShip();
        addAsteroids();
        startBtn.disabled = true;
        startBtn.style.opacity = 0;
        window.addEventListener('keydown', keydownHandler, false);
        window.addEventListener('keyup', keyupHandler, false);
        update();
    }

    function clean() {
        cancelAnimationFrame(requestId);
        if (ship != null) {
            ship.remove();
        }
        cleanAsteroids();
        cleanBullets();
    }

    function cleanAsteroids() {

        poolAsteroids.forEach(function (asteroid) {
            asteroid.remove();
        }, this);
    }

    function cleanBullets() {
        poolBullets.forEach(function (bullet) {
            bullet.remove();
        }, this);
    }

    function cleanAliend() {
        poolAsteroids.forEach(function (alien) {
            alien.remove();
        }, this);
    }

    function levelCompleted() {
        // cleanBullets();
        setTimeout(startNewLevel, 1000);
    }

    function startNewLevel() {
        level++;

        if (level < levels.length) {
            levelTitle.firstChild.nodeValue = '' + (level + 1);
            addAsteroids();
        } else {
            gameEnd();
        }

    }

    //Construction methods
    function ramdonColor() {
        let value = ramdonIn(1, 11);
        switch (value) {
            case 1:
                return red;
                break;
            case 2:
                return lightblue;
                break;
            case 3:
                return creme;
                break;
            case 4:
                return red;
                break;
            case 5:
                return red;
                break;
            case 6:
                return lightblue;
                break;
            case 7:
                return creme;
                break;
            case 8:
                return red;
                break;
            case 9:
                return creme;
                break;
            case 10:
                return red;
                break;
            default:
                return lightblue;
                break;
        }
    }

    function ramdonDirection() {
        let value = ramdonIn(1, 11);
        switch (value) {
            case 1:
                return 90;
                break;
            case 2:
                return -90;
                break;
            case 3:
                return 90;
                break;
            case 4:
                return -90;
                break;
            case 5:
                return 90;
                break;
            case 6:
                return -90;
                break;
            case 7:
                return 90;
                break;
            case 8:
                return -90;
                break;
            case 9:
                return 90;
                break;
            case 10:
                return -90;
                break;
            default:
                return 90;
                break;
        }
    }

    function ramdonIn(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
    }


}
