import Projectile, { ProjectileConstructor } from "./Projectile.js";

export default class Hook extends Projectile {
  public enabled: boolean;
  public isStationary: boolean;
  constructor(args: ProjectileConstructor) {
    super(args);

    this.enabled = true;
    this.isStationary = false;
  }

  update() {
    if (this.isStationary) return;
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  }
}
