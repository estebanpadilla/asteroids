function Alien(id, position, direction, speed, type, color, addAlienBullet, removeAlien) {
    if (!(this instanceof Alien)) {
        return new Alien(id, position, direction, speed, type, color, addAlienBullet, removeAlien);
    }

    this.id = id;
    this.svg;
    this.polygone;
    this.group;

    this.position = position;
    this.type = type;
    this.points = '';
    this.width = 40;
    this.height = 40;
    this.color = color;
    this.angle = 0;
    this.direction = direction;

    this.velocityMag = 0;
    this.velocity = Vector().setComponents(direction, speed);


    if (type == 1) {
        //Big 1
        this.points = '45,10 45,5 35,5 35,0 15,0 15,5 5,5 5,10 0,10 0,15 5,15 5,20 10,20 10,25 40,25 40,20 45,20 45,15 50,15 50,10';
        this.width = 50;
        this.height = 25;
    } else if (type == 2) {
        //Med
        this.points = '35,10 35,5 25,5 25,0 15,0 15,5 5,5 5,10 0,10 0,15 5,15 5,20 35,20 35,15 40,15 40,10';
        this.width = 40;
        this.height = 20;
    } else if (type == 3) {
        //Small
        this.points = '20,10 20,5 15,5 15,0 10,0 10,5 5,5 5,10 0,10 0,15 5,15 5,20 20,20 20,15 25,15 25,10';
        this.width = 25;
        this.height = 20;
    }

    this.removeAlien = removeAlien;
    this.addAlienBullet = addAlienBullet;
    this.render()
    this.update();
    this.shootUp = false;
    this.shootDown = false;

    let _this = this;
    this.timer = setTimeout(function () {
        _this.shoot(_this);
    }, 100);


    if (this.position.y < window.innerHeight / 2) {
        this.shootDown = true;
    } else {
        this.shootUp = true;
    }
}

Alien.prototype.shoot = function () {
    this.addAlienBullet(this);
    let _this = this;
    this.timer = setTimeout(function () {
        _this.shoot(_this);
    }, 800);
}

Alien.prototype.update = function () {


    this.velocityMag = this.velocity.magnitude();

    this.rotate();

    this.position.add(this.velocity);
    this.checkBoundaries();
}

Alien.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(xmlns, 'svg');
    this.svg.setAttribute('id', this.id);
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.style.fill = this.color;
    document.body.appendChild(this.svg);

    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.polygone = document.createElementNS(xmlns, 'polygon');
    this.polygone.setAttribute('points', this.points);
    this.group.appendChild(this.polygone);
}

Alien.prototype.rotate = function () {
    this.group.setAttribute('transform', 'rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
};

Alien.prototype.checkBoundaries = function () {

    if (this.position.x > (window.innerWidth + this.width) ||
        this.position.x < (0 - this.width) ||
        this.position.y > (window.innerHeight + this.height) ||
        this.position.y < (0 - this.height)) {

        this.remove();
    }

    this.svg.style.left = this.position.x;
    this.svg.style.top = this.position.y;
}

Alien.prototype.isTouching = function (rect) {
    // console.log(rect);
    if ((rect.x + rect.width) > this.position.x &&
        rect.x < (this.position.x + this.width) &&
        (rect.y + rect.width) > this.position.y &&
        rect.y < (this.position.y + this.height)) {
        return true;
    }
    return false;
}

Alien.prototype.remove = function () {
    clearTimeout(this.timer);
    this.svg.parentNode.removeChild(this.svg);
    this.removeAlien(this);
}
