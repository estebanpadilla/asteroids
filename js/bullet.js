function Bullet(id, position, direction, speed, color, removeBullet, svg) {
    if (!(this instanceof Bullet)) {
        return new Bullet(id, position, direction, speed, color, removeBullet, svg);
    }

    this.id = id;
    this.svg = svg;
    this.rect = null;
    this.group = null;

    this.position = position;
    this.width = 5;
    this.height = 5;
    this.color = color;
    this.angle = direction;
    this.speed = speed;
    // this.direction = direction;

    // this.velocityMag = 0;
    this.velocity = Vector().setComponents(this.angle, this.speed);

    this.removeBullet = removeBullet;

    this.render()
    // this.update();
    // this.rotate();

    // this.readyToRemove = false;
    this.isRemove = false;
}

Bullet.prototype.update = function () {
    // this.velocityMag = this.velocity.magnitude();
    this.position.add(this.velocity);
    this.checkBoundaries();

    if (!this.isRemove) {
        this.group.setAttribute('transform', 'translate(' + this.position.x + ' ' + this.position.y + ') rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
    }

}

Bullet.prototype.render = function () {
    let xmlns = "http://www.w3.org/2000/svg";
    // this.svg = document.createElementNS(xmlns, 'svg');
    // this.svg.setAttribute('id', this.id);
    // this.svg.setAttribute('width', this.width);
    // this.svg.setAttribute('height', this.height);
    // this.svg.style.fill = this.color;
    // document.body.appendChild(this.svg);

    this.group = document.createElementNS(xmlns, 'g');
    this.svg.appendChild(this.group);

    this.rect = document.createElementNS(xmlns, 'rect')
    this.rect.setAttribute('width', this.width);
    this.rect.setAttribute('height', this.height);
    this.rect.setAttribute('fill', this.color);
    this.group.appendChild(this.rect);
}

// Bullet.prototype.rotate = function () {
//     this.group.setAttribute('transform', 'rotate(' + 45 + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
// };

Bullet.prototype.checkBoundaries = function () {

    // if (this.svg != null) {
    if (this.position.x > (window.innerWidth + this.width) ||
        this.position.x < (0 - this.width) ||
        this.position.y > (window.innerHeight + this.height) ||
        this.position.y < (0 - this.height)) {

        // console.log('c ' + this.isRemove);

        this.remove();
        // this.readyToRemove = true;
    }
    // /else {

    // console.log('c ' + this.isRemove);
    // this.group.setAttribute('transform', 'translate(' + this.position.x + ' ' + this.position.y + ') rotate(' + this.angle + ' ' + this.width / 2 + ' ' + this.height / 2 + ')');
    // this.svg.style.left = this.position.x;
    // this.svg.style.top = this.position.y;
    // }
}

Bullet.prototype.remove = function () {
    this.isRemove = true;
    this.removeBullet(this);
    this.svg.removeChild(this.group);
    this.position = null;
    this.velocity = null;
    this.svg = null
    this.rect = null;
    this.group = null;
}

Bullet.prototype.isTouching = function (rect) {
    // console.log(rect);
    if ((rect.x + rect.width) > this.position.x &&
        rect.x < (this.position.x + this.width) &&
        (rect.y + rect.width) > this.position.y &&
        rect.y < (this.position.y + this.height)) {
        return true;
    }
    return false;
}
