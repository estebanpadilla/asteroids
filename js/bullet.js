function Bullet(position, direction, speed, color) {
    if (!(this instanceof Bullet)) {
        return new Bullet(position, direction, speed, color);
    }

    this.svg;
    this.rect;
    this.group;

    this.position = position;
    this.width = 5;
    this.height = 5;
    this.color = color;
    this.angle = 0;
    this.direction = direction;

    this.velocityMag = 0;
    this.velocity = Vector().setComponents(direction, speed);


    this.render()
    this.update();
    this.rotate();
}

Bullet.prototype.update = function () {

    this.velocityMag = this.velocity.magnitude();

    // this.rotate();

    this.position.add(this.velocity);
    this.checkBoundaries();
}

Bullet.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    this.svg = document.createElementNS(xmlns, 'svg');
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.style.fill = this.color;
    document.body.appendChild(this.svg);

    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.rect = document.createElementNS(xmlns, 'rect')
    this.rect.setAttribute('width', this.width);
    this.rect.setAttribute('height', this.height);
    this.group.appendChild(this.rect);
}

Bullet.prototype.rotate = function () {
    this.group.setAttribute('transform', 'rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
};

Bullet.prototype.checkBoundaries = function () {

    if (this.position.x > (window.innerWidth + this.width)) {
        this.position.x = (0 - this.width);
    }

    if (this.position.x < (0 - this.width)) {
        this.position.x = window.innerWidth;
    }

    if (this.position.y > (window.innerHeight + this.height)) {
        this.position.y = (0 - this.height);
    }

    if (this.position.y < (0 - this.height)) {
        this.position.y = window.innerHeight;
    }

    this.svg.style.left = this.position.x;
    this.svg.style.top = this.position.y;
}