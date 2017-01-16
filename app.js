window.addEventListener('load', init, false);
function init() {

    window.addEventListener('keydown', keydownHandler, false);
    window.addEventListener('keyup', keyupHandler, false);

    let l1 = [1, 2, 1, 3, 2, 1, 2, 2, 1, 3, 4, 2, 1, 4, 4, 2, 1, 3, 1, 1, 2, 3];

    let pool = [];
    let angle = 0;
    let ship = Ship(Vector(window.innerWidth / 2, window.innerHeight / 2), 40, 40, '#f58d82', addBullet);
    pool.push(ship);

    for (var i = 0; i < l1.length; i++) {
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

        let asteroid = Asteroid(Vector(x, y), ramdonIn(-90, 90), ramdonIn(1, 3), l1[i], ramdonColor());
        pool.push(asteroid);
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


    function update() {

        pool.forEach(function (element) {
            element.update();
        }, this);
        requestAnimationFrame(update);
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
                if (ship.canShoot) {
                    addBullet();
                }
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
        let bullet = Bullet(shootPosition, ship.angle, (5 + ship.velocityMag), 'white');
        pool.push(bullet);
    }

    function ramdonIn(max, min) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}