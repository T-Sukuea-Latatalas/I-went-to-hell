class Enemy {
  constructor(tileX, tileY) {
    this.x = tileX * TILE_SIZE;
    this.y = tileY * TILE_SIZE;
    this.width = 14;
    this.height = 14;
    this.vx = 0;
    this.vy = 0;
    this.isDead = false;
    this.removeMe = false;
  }

  defeat() {
    this.isDead = true;
    this.removeMe = true;
  }

  update(tileMap) {}
  render(ctx, camera) {}
}

class SlimeEnemy extends Enemy {
  constructor(tileX, tileY, range = 4) {
    super(tileX, tileY);
    this.direction = -1;
    this.speed = PHYSICS.ENEMY_SPEED;
    this.startX = this.x;
    this.maxPatrolDistance = range * TILE_SIZE;
  }

  update(tileMap) {
    if (this.isDead) return;

    this.vx = this.direction * this.speed;
    this.vy += PHYSICS.GRAVITY;
    if (this.vy > PHYSICS.MAX_FALL_SPEED) {
      this.vy = PHYSICS.MAX_FALL_SPEED;
    }

    const prevX = this.x;

    Physics.collideAndMoveX(this, tileMap);
    Physics.collideAndMoveY(this, tileMap);

    if (Math.abs(this.x - prevX) < 0.05) {
      this.direction *= -1;
    }

    if (Math.abs(this.x - this.startX) > this.maxPatrolDistance) {
      this.direction = this.x > this.startX ? -1 : 1;
    }
  }

  render(ctx, camera) {
    if (this.isDead) return;
    const drawX = Math.round(this.x - camera.x);
    const drawY = Math.round(this.y - camera.y);
    drawTile(ctx, TILES.SPAWN_SLIME, drawX, drawY, TILE_SIZE);
  }
}

class FlyerEnemy extends Enemy {
  constructor(tileX, tileY, range = 3) {
    super(tileX, tileY);
    this.startY = this.y;
    this.amplitude = range * 8;
    this.angle = 0;
    this.speed = 0.04;
  }

  update() {
    if (this.isDead) return;
    this.angle += this.speed;
    this.y = this.startY + Math.sin(this.angle) * this.amplitude;
  }

  render(ctx, camera) {
    if (this.isDead) return;
    const drawX = Math.round(this.x - camera.x);
    const drawY = Math.round(this.y - camera.y);
    drawTile(ctx, TILES.SPAWN_FLYER, drawX, drawY, TILE_SIZE);
  }
}

window.Enemy = Enemy;
window.SlimeEnemy = SlimeEnemy;
window.FlyerEnemy = FlyerEnemy;