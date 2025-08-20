import Enemy from "./Enemy.js";
import Hook from "./Hook.js";
import Projectile from "./Projectile.js";

export type PlayerState = {
  x: number;
  y: number;
  width: number;
  height: number;
  x_moveSpeed: number;
  y_moveSpeed: number;
  isMoving?: boolean;
  isJumping?: boolean;
};

type KeyState = {
  [key: string]: boolean;
};

type Obsticle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default class Game {
  private GRAVITY = 1;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private secondsPassed = 0;
  private oldTimeStamp: number = 0;
  private fps = 0;

  private BASELINE_Y = 620;

  private playerState: PlayerState;
  private moveState: KeyState;

  private projectiles: Hook[];
  private MAX_PROJECTILES = 6;

  private readonly JUMPING_POWER = -17;

  private mousePos: { x: number; y: number } = { x: 0, y: 0 };

  private obsticles: Obsticle[];

  private enemies: Enemy[];

  constructor() {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      throw new Error("A canvas element is require for game to start");
    }
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext("2d")!;
    this.playerState = {
      x: 10,
      y: 594,
      width: 40,
      height: 40,
      x_moveSpeed: 3,
      y_moveSpeed: 0,
    };

    this.moveState = {};
    this.projectiles = [];
    this.obsticles = [
      {
        x: 150,
        y: 500,
        width: 200,
        height: 20,
      },
      {
        x: 350,
        y: 400,
        width: 200,
        height: 20,
      },
      {
        x: 550,
        y: 300,
        width: 200,
        height: 20,
      },
    ];
    const enemiesAmount = 10;
    const enemiesToAdd: Enemy[] = [];
    for (let index = 0; index < enemiesAmount; index++) {
      enemiesToAdd.push(
        new Enemy({
          canvas: this.canvas,
          ctx: this.ctx,
          x: (index + 1) * 100,
          y: 580,
          player: this.playerState,
          x_speed: Math.random() * .3,
        }),
      );
    }

    this.enemies = enemiesToAdd;
  }

  init() {
    this.setupWindowListeners();
    this.draw();
  }

  draw() {
    this.clearCanvas();
    this.drawLayout();
    this.drawPlayer();
    this.drawPlayerProjectileAmmount();
    this.drawFPS();
    this.drawPlayerState();
    this.drawMoveState();
    this.drawProjectiles();
    this.drawProjectilesArray();
    this.drawMousePos();
    this.drawMousePosAngleToPlayer();
    this.drawCentrePoint();
    this.drawLinePlayerToCentrePoint();
    this.drawObsticules();

    this.drawEnemies();
  }

  update(timeStamp: number) {
    // Calculate the number of seconds passed since the last frame
    this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;

    // Calculate fps
    this.fps = Math.round(1 / this.secondsPassed);

    //apply gravity to player position
    this.playerState.y_moveSpeed += this.GRAVITY;
    this.playerState.y += this.playerState.y_moveSpeed;

    if (this.playerState.y > this.BASELINE_Y - this.playerState.height) {
      this.playerState.y = this.BASELINE_Y - this.playerState.height;
      this.playerState.y_moveSpeed = 0;
      this.playerState.isJumping = false;
    }

    if (this.moveState["a"] && this.playerState.x > 0) {
      this.playerState.x -= this.playerState.x_moveSpeed;
      this.playerState.isMoving = true;
    }
    if (this.moveState["d"] && this.playerState.x < this.canvas.width - 25) {
      this.playerState.x += this.playerState.x_moveSpeed;
      this.playerState.isMoving = true;
    }
    if (this.moveState["w"] && !this.playerState.isJumping) {
      this.playerState.isJumping = true;
      this.playerState.y_moveSpeed = this.JUMPING_POWER;
    }

    this.checkObsticleCollissions();

    this.updateProjectiles();
    this.updateEnemies(timeStamp);
  }

  drawProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      projectile.draw();
    }
  }

  drawCentrePoint() {
    const CENTRE_POINT_RADIUS = 20;
    this.ctx.beginPath();
    this.ctx.arc(
      this.canvas.width / 2 - CENTRE_POINT_RADIUS / 2,
      this.canvas.height / 2 - CENTRE_POINT_RADIUS / 2,
      CENTRE_POINT_RADIUS,
      0,
      2 * Math.PI,
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawLinePlayerToCentrePoint() {
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.playerState.x + this.playerState.width / 2,
      this.playerState.y + this.playerState.height / 2,
    );
    this.ctx.lineTo(this.canvas.width / 2 - 10, this.canvas.height / 2 - 10);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawObsticules() {
    for (let index = 0; index < this.obsticles.length; index++) {
      const obsticule = this.obsticles[index];
      this.ctx.fillRect(
        obsticule.x,
        obsticule.y,
        obsticule.width,
        obsticule.height,
      );
    }
  }

  setupWindowListeners() {
    window.onresize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      // drawCanvasBg(canvas, ctx)
    };

    window.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });

    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      // console.log(key)

      this.moveState[key] = true;

      if (key === " " && this.projectiles.length <= this.MAX_PROJECTILES) {
        const lastProjecile = this.projectiles[this.projectiles.length - 1];
        if (lastProjecile && !lastProjecile.isStationary) {
          this.projectiles[this.projectiles.length - 1].isStationary = true;
          return;
        }
        //if we have no more projectiles left to shoot
        if (this.projectiles.length == this.MAX_PROJECTILES) return;

        const dy = this.playerState.y + this.playerState.height / 2 -
          this.mousePos.y;
        const dx = this.playerState.x + this.playerState.width / 2 -
          this.mousePos.x;
        let theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs

        this.projectiles.push(
          new Hook({
            canvas: this.canvas,
            ctx: this.ctx,
            x: this.playerState.x + this.playerState.width,
            y: this.playerState.y + this.playerState.height / 2,
            speed: 10,
            // angle: Math.random() * 10,
            // speed: Math.random() * 10 + 10
          }),
        );
      }

      if (key === "backspace") {
        this.projectiles.pop();
      }
    });
    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      delete this.moveState[key];
    });
  }

  drawFPS() {
    // Draw FPS number to the screen
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("FPS: " + this.fps, 10, 30);
  }

  drawPlayerState() {
    // Draw FPS number to the screen
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(JSON.stringify(this.playerState, null, 2), 10, 45);
  }

  drawMoveState() {
    // Draw FPS number to the screen
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(JSON.stringify(this.moveState, null, 2), 10, 60);
  }

  drawProjectilesArray() {
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(`Projectiles: ${this.projectiles.length}`, 10, 75);
  }

  drawMousePos() {
    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(JSON.stringify(this.mousePos, null, 2), 10, 90);
  }

  drawMousePosAngleToPlayer() {
    const dy = this.playerState.y + this.playerState.height / 2 -
      this.mousePos.y;
    const dx = this.playerState.x + this.playerState.width / 2 -
      this.mousePos.x;
    const theta = Math.atan2(dy, dx); // range (-PI, PI]
    const radians = theta * (180 / Math.PI);

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(
      `Angle To Player: ${theta}, Radians: ${radians}`,
      10,
      105,
    );
  }

  drawLayout() {
    //bottom grey box
    this.ctx.fillStyle = "#cccccc";
    let x = 0;
    let y = this.BASELINE_Y;
    let width = this.canvas.width - x;
    let height = this.canvas.height - y;
    this.ctx.fillRect(x, y, width, height);

    //black outline on top grey box
    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(x, y, width, 4);
  }

  drawPlayer() {
    this.ctx.strokeStyle = "#000000";
    this.ctx.setLineDash([0]);
    this.ctx.lineWidth = 3;
    let x = this.playerState.x;
    let y = this.playerState.y;
    let width = this.playerState.width;
    let height = this.playerState.height;
    this.ctx.strokeRect(x, y, width, height);

    this.ctx.beginPath();
    this.ctx.arc(
      this.playerState.x + this.playerState.width / 2,
      this.playerState.y + this.playerState.height / 2,
      2,
      0,
      2 * Math.PI,
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawPlayerProjectileAmmount() {
    this.ctx.strokeStyle = "#000000";
    this.ctx.fillStyle = "#000000";
    this.ctx.setLineDash([0]);
    this.ctx.lineWidth = 1;
    let x = this.playerState.x - 2;
    let y = this.playerState.y - 10;
    let width = 5;
    let height = 3;
    const GAP = 8;

    // for (let index = this.MAX_PROJECTILES - 1; index >= 0; index--) {
    for (let index = 0; index < this.MAX_PROJECTILES; index++) {
      if (this.projectiles[index]) {
        this.ctx.fillStyle = "#dddddd";
        this.ctx.fillRect(x + index * GAP, y, width, height);
      } else {
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(x + index * GAP, y, width, height);
      }
    }
  }

  updateProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index];
      if (
        projectile.x < 0 ||
        projectile.x > this.canvas.width ||
        projectile.y < 0 ||
        projectile.y > this.canvas.height
      ) {
        this.projectiles.splice(index, 1);
      } else {
        projectile.update();
      }
    }
  }

  checkObsticleCollissions() {
    const bottomOfPlayer = this.playerState.y + this.playerState.height;
    const leftOfPlayer = this.playerState.x;
    const rightOfPlayer = this.playerState.x + this.playerState.width;
    for (let index = 0; index < this.obsticles.length; index++) {
      const obsticule = this.obsticles[index];

      //if player bottom is inside the obsticule then pin them on top
      if (
        bottomOfPlayer > obsticule.y &&
        bottomOfPlayer < obsticule.y + obsticule.height &&
        rightOfPlayer > obsticule.x &&
        leftOfPlayer < obsticule.x + obsticule.width
      ) {
        this.playerState.y = obsticule.y - this.playerState.height;
        this.playerState.y_moveSpeed = 0;
        this.playerState.isJumping = false;
      }
    }
  }

  updateEnemies(deltaTime: number) {
    for (let index = 0; index < this.enemies.length; index++) {
      const enemy = this.enemies[index];
      enemy.update(deltaTime);
    }
  }

  drawEnemies() {
    for (let index = 0; index < this.enemies.length; index++) {
      const enemy = this.enemies[index];
      enemy.draw();
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
