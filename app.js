window.addEventListener('load', init, false);

function init() {

    var stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.dom);

    let ship = null,
        requestId = undefined,
        score = 0,
        asteroidBig = 10,
        asteroidMed = 15,
        asteroidSmall = 25,
        alienBig = 10,
        alienMed = 15,
        alienSmall = 5;

    let level = 0,
        levels = [[4, 3, 4, 3, 4],
        [3, 4, 3, 4, 3, 3, 2, 3, 1, 1, 3, 2],
        [2, 3, 4, 2, 3, 2, 3, 4, 3, 4, 3, 3, 3, 4, 3, 4, 3],
        [2, 3, 3, 2, 4, 2, 3, 2, 3, 1, 3, 4, 3, 2, 3, 4, 3, 4, 2, 3, 3, 4, 3]],
        levelAlienTimer = [];

    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, 'svg');
    svg.setAttribute('id', 'rootsvvg');
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);
    svg.style.left = 0;
    svg.style.top = 0;
    document.body.appendChild(svg);

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
    let poolAlienBullets = new Map();

    let scoreTitle = document.getElementById('scoreTitle');
    let levelTitle = document.getElementById('levelTitle');
    let startBtn = document.getElementById('startBtn');
    startBtn.onclick = startBtnClick;

    addAsteroids();
    addAlient();

    function update() {
        stats.begin();

        for (let bullet of poolBullets.values()) {
            bullet.update();
            if (!bullet.isRemove) {
                for (let asteroid of poolAsteroids.values()) {
                    if (hitPointOnRect(bullet.position.x, bullet.position.y, asteroid.getBounds())) {
                        bullet.remove();
                        addAsteroidOnTouch(asteroid);
                        break;
                    }
                }
            }

            if (!bullet.isRemove) {
                for (let alien of poolAliens.values()) {
                    if (hitPointOnRect(bullet.position.x, bullet.position.y, alien.getBounds())) {
                        bullet.remove();
                        alien.remove();
                        break;
                    }
                }
            }
        }

        for (let asteroid of poolAsteroids.values()) {
            if (ship != null) {
                if (hitRectOnRect(asteroid.getBounds(), ship.getBounds())) {
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

            if (!bullet.isRemove) {
                if (ship != null) {
                    if (hitPointOnRect(bullet.position.x, bullet.position.y, ship.getBounds())) {
                        gameEnd();
                        break;
                    }
                }
            }
        }

        if (ship != null) {
            ship.update();
        }

        stats.end();
        requestId = requestAnimationFrame(update);
    }
    update();

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
        e.preventDefault();
        return false;
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
        ship = Ship(goCounter, Vector(window.innerWidth / 2, window.innerHeight / 2), 40, 40, bulletColor, addBullet, removeShip, svg);
    }

    function addBullet() {
        let shootPosition = Vector((ship.position.x + (ship.width / 2) - 5), (ship.position.y + (ship.height / 2) - 3));
        goCounter++;
        let bullet = Bullet(goCounter, shootPosition, ship.angle, (7 + ship.velocityMag), bulletColor, removeBullet, svg);
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
        let bullet = Bullet(goCounter, position, direction, ramdonIn(2, 5), alien.color, removeAlienBullet, svg);
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
            let asteroid = Asteroid(goCounter, Vector(x, y), ramdonIn(-90, 90), ramdonIn(1, 3), levels[level][i], ramdonColor(), removeAsteroid, svg);
            poolAsteroids.set(goCounter, asteroid);
        }
    }

    function addAsteroidOnTouch(asteroid) {

        if (asteroid.type == 3 || asteroid.type == 4) {
            goCounter++;
            let asteroid1 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 4), 2, ramdonColor(), removeAsteroid, svg);
            poolAsteroids.set(goCounter, asteroid1);

            goCounter++;
            let asteroid2 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(2, 5), 2, ramdonColor(), removeAsteroid, svg);
            poolAsteroids.set(goCounter, asteroid2);
            score += asteroidBig;
        } else if (asteroid.type == 2) {
            goCounter++;
            let asteroid1 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 3), 1, ramdonColor(), removeAsteroid, svg);
            poolAsteroids.set(goCounter, asteroid1);

            goCounter++;
            let asteroid2 = Asteroid(goCounter, Vector(asteroid.position.x, asteroid.position.y), ramdonIn(0, 360), ramdonIn(1, 3), 1, ramdonColor(), removeAsteroid, svg);
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
        let alien = Alien(goCounter, Vector(50, 500), 0, ramdonIn(1, 3), 3, alienColor, addAlienBullet, removeAlient, svg);
        poolAliens.set(goCounter, alien);
    }
    //Remove Methods
    function removeBullet(go) {
        poolBullets.delete(go.id);
        go = null;
    }

    function removeAlienBullet(go) {
        poolAlienBullets.delete(go.id);
        go = null;
    }

    function removeAsteroid(go) {
        // addExplotion(go);
        poolAsteroids.delete(go.id)
        go = null;
    }

    function removeAlient(go) {
        // addExplotion(go);
        poolAliens.delete(go.id);
        go = null;
    }

    function removeShip(go) {
        // addExplotion(go);
        go = null;
        ship = null;
    }

    function addExplotion(go) {
        // const brust = new mojs.Burst({
        //     left: (go.position.x + (go.width / 2)),
        //     top: (go.position.y + (go.height / 2)),
        //     radius: ramdonIn(30, 100),
        //     count: ramdonIn(5, 10),
        //     opacity: { 1: 0 },
        //     fill: go.color,
        // }).play();
        const burst = new mojs.Burst({
            left: (go.position.x + (go.width / 2)),
            top: (go.position.y + (go.height / 2)),
            radius: { 0: (go.type * 50) },
            angle: { 0: ramdonIn(0, 90) },
            count: ramdonIn(3, 10),
            isShowEnd: false,
            children: {
                shape: 'rect',
                fill: go.color,
                radius: 5
            },
            onComplete: function () { removeEl(this.el); }
        }).play();


        const circle = new mojs.Shape({
            left: (go.position.x + (go.width / 2)),
            top: (go.position.y + (go.height / 2)),
            stroke: go.color,
            strokeWidth: { 10: ramdonIn(10, (go.type * 10)) },
            fill: 'none',
            scale: { .2: 1 },
            opacity: { 1: 0 },
            // isForce3d: true,
            isShowEnd: false,
            radius: ramdonIn(40, (go.type * 60)),
            easing: 'cubic.out',
            delay: ramdonIn(100, 200),
            onComplete: function () { removeEl(this.el); }
        }).play();


    }

    var removeEl = function removeEl(node) { node.parentNode.removeChild(node); }

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
