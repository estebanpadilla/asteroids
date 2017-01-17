window.addEventListener('load', init, false);
function init() {

    let ship = null;
    let requestId = undefined;

    let score = 0;
    let asteroidBig = 10;
    let asteroidMed = 15;
    let asteroidSmall = 25;
    let level = 0;
    let levels = [[1, 2, 1, 2, 1],
    [1, 2, 1, 3, 2, , 3, 3, 4],
    [1, 4, 1, 2, 3, 1, 2, 1, 2, 4, 4, 3, 1],
    [1, 2, 2, 2, 3, 4, 3, 4, 3, 4, 3, 3, 2, 1, 2, 3],
    [1, 2, 2, 2, 3, 4, 3, 4, 3, 4, 3, 3, 2, 1, 2, 3, 2, 1, 2]];

    let goCounter = 0;
    let poolAsteroids = new Map();
    let poolBullets = new Map();
    let angle = 0;

    let scoreTitle = document.getElementById('scoreTitle');
    let levelTitle = document.getElementById('levelTitle');
    let startBtn = document.getElementById('startBtn');
    startBtn.onclick = startBtnClick;

    function addShip() {
        ship = Ship(goCounter, Vector(window.innerWidth / 2, window.innerHeight / 2), 40, 40, '#f58d82', addBullet, removeShip);
    }

    function addAsteroids() {

        for (var i = 0; i < levels[level].length; i++) {
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

    function addBullet() {
        let shootPosition = Vector((ship.position.x + (ship.width / 2) - 2), (ship.position.y + (ship.height / 2) - 2));
        goCounter++;
        let bullet = Bullet(goCounter, shootPosition, ship.angle, (5 + ship.velocityMag), 'white', removeBullet);
        poolBullets.set(goCounter, bullet);
    }

    function removeBullet(go) {
        poolBullets.delete(go.id);
    }

    function removeAsteroid(go) {
        poolAsteroids.delete(go.id)
    }

    function removeShip(go) {
        ship = null;
    }

    function ramdonIn(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
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

    function levelCompleted() {
        // cleanBullets();
        setTimeout(startNewLevel, 1000);
    }
    function startNewLevel() {
        level++;
        levelTitle.firstChild.nodeValue = '' + (level + 1);
        addAsteroids();
    }

    function ramdonColor() {
        let value = ramdonIn(1, 11);
        switch (value) {
            case 1:
                return '#c056a1';
                break;
            case 2:
                return '#77b1e1';
                break;
            case 3:
                return '#c53f31';
                break;
            case 4:
                return '#bdb331';
                break;
            case 5:
                return '#d6d6d6';
                break;
            case 6:
                return '#c056a1';
                break;
            case 7:
                return '#77b1e1';
                break;
            case 8:
                return '#c53f31';
                break;
            case 9:
                return '#bdb331';
                break;
            case 10:
                return '#d6d6d6';
                break;
            default:
                return '#c53f31';
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

}
