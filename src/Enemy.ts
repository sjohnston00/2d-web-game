import { PlayerState } from "./Game.js";

type EnemyConstructor = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  x_speed?: number;
  player: PlayerState;
};

export default class Enemy {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public x: number;
  public y: number;
  public player: PlayerState;
  private height: number = 40;
  private width: number = 10;
  private x_speed: number = .1;
  private oldDeltaTime: number = 0;
  public health = 100;

  constructor(args: EnemyConstructor) {
    this.canvas = args.canvas;
    this.ctx = args.ctx;
    this.x = args.x;
    this.y = args.y;
    this.player = args.player;
    this.x_speed = args.x_speed || this.x_speed;
  }

  public update(deltaTime: number) {
    const direction = this.player.x < this.x ? -1 : 1;
    this.x += (direction * this.x_speed) * (deltaTime - this.oldDeltaTime);
    this.oldDeltaTime = deltaTime;
  }

  /**
   * A function to decrease an enemies health by a certain amount, say when a player projectile hits them
   */
  public decreaseHealth(by: number) {
    this.health = Math.max(this.health - by, 0);
  }

  public draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);

    this.ctx.beginPath();
    this.ctx.arc(this.x + this.width / 2, this.y, 7.5, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
