import Projectile from './Projectile.js'

type PlayerState = {
  x: number
  y: number
  width: number
  height: number
  x_moveSpeed: number
  y_moveSpeed: number
  isMoving?: boolean
  isJumping?: boolean
}

type KeyState = {
  [key: string]: boolean
}

export default class Game {
  private GRAVITY = 1
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  private secondsPassed = 0
  private oldTimeStamp: number = 0
  private fps = 0

  private BASELINE_Y = 620

  private playerState: PlayerState
  private moveState: KeyState

  private projectiles: Projectile[]
  private MAX_PROJECTILES = 6

  private readonly JUMPING_POWER = -17

  constructor() {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      throw new Error('A canvas element is require for game to start')
    }
    this.canvas = canvas
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.ctx = this.canvas.getContext('2d')!
    this.playerState = {
      x: 10,
      y: 594,
      width: 40,
      height: 40,
      x_moveSpeed: 3,
      y_moveSpeed: 0
    }

    this.moveState = {}
    this.projectiles = []
  }

  init() {
    this.setupWindowListeners()
    this.draw()
  }

  draw() {
    this.clearCanvas()
    this.drawLayout()
    this.drawPlayer()
    this.drawPlayerProjectileAmmount()
    this.drawFPS()
    this.drawPlayerState()
    this.drawMoveState()
    this.drawProjectiles()
    this.drawProjectilesArray()
  }

  update(timeStamp: number) {
    // Calculate the number of seconds passed since the last frame
    this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000
    this.oldTimeStamp = timeStamp

    // Calculate fps
    this.fps = Math.round(1 / this.secondsPassed)

    //apply gravity to player position
    this.playerState.y_moveSpeed += this.GRAVITY
    this.playerState.y += this.playerState.y_moveSpeed

    if (this.playerState.y > this.BASELINE_Y - this.playerState.height) {
      this.playerState.y = this.BASELINE_Y - this.playerState.height
      this.playerState.y_moveSpeed = 0
      this.playerState.isJumping = false
    }

    if (this.moveState['a'] && this.playerState.x > 0) {
      this.playerState.x -= this.playerState.x_moveSpeed
      this.playerState.isMoving = true
    }
    if (this.moveState['d'] && this.playerState.x < this.canvas.width - 25) {
      this.playerState.x += this.playerState.x_moveSpeed
      this.playerState.isMoving = true
    }
    if (this.moveState['w'] && !this.playerState.isJumping) {
      this.playerState.isJumping = true
      this.playerState.y_moveSpeed = this.JUMPING_POWER
    }

    this.updateProjectiles()
  }

  drawProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index]
      projectile.draw()
    }
  }

  setupWindowListeners() {
    window.onresize = () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      // drawCanvasBg(canvas, ctx)
    }

    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase()
      this.moveState[key] = true

      if (key === ' ' && this.projectiles.length < this.MAX_PROJECTILES) {
        this.projectiles.push(
          new Projectile({
            canvas: this.canvas,
            ctx: this.ctx,
            x: this.playerState.x + this.playerState.width,
            y: this.playerState.y + this.playerState.height / 2,
            angle: 0,
            speed: 10
            // angle: Math.random() * 10,
            // speed: Math.random() * 10 + 10
          })
        )
      }
    })
    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase()
      delete this.moveState[key]
    })
  }

  drawFPS() {
    // Draw FPS number to the screen
    this.ctx.font = '12px Arial'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText('FPS: ' + this.fps, 10, 30)
  }

  drawPlayerState() {
    // Draw FPS number to the screen
    this.ctx.font = '12px Arial'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(JSON.stringify(this.playerState, null, 2), 10, 45)
  }

  drawMoveState() {
    // Draw FPS number to the screen
    this.ctx.font = '12px Arial'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(JSON.stringify(this.moveState, null, 2), 10, 60)
  }

  drawProjectilesArray() {
    this.ctx.font = '12px Arial'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(`Projectiles: ${this.projectiles.length}`, 10, 75)
  }

  drawLayout() {
    //bottom grey box
    this.ctx.fillStyle = '#cccccc'
    let x = 0
    let y = this.BASELINE_Y
    let width = this.canvas.width - x
    let height = this.canvas.height - y
    this.ctx.fillRect(x, y, width, height)

    //black outline on top grey box
    this.ctx.fillStyle = '#222222'
    this.ctx.fillRect(x, y, width, 4)
  }

  drawPlayer() {
    this.ctx.strokeStyle = '#000000'
    this.ctx.setLineDash([0])
    this.ctx.lineWidth = 3
    let x = this.playerState.x
    let y = this.playerState.y
    let width = this.playerState.width
    let height = this.playerState.height
    this.ctx.strokeRect(x, y, width, height)
  }

  drawPlayerProjectileAmmount() {
    this.ctx.strokeStyle = '#000000'
    this.ctx.setLineDash([0])
    this.ctx.lineWidth = 1
    let x = this.playerState.x - 2
    let y = this.playerState.y - 10
    let width = 5
    let height = 3
    const GAP = 8

    for (let index = this.MAX_PROJECTILES - 1; index >= 0; index--) {
      if (this.projectiles[index]) {
        this.ctx.strokeRect(x + index * GAP, y, width, height)
      } else {
        this.ctx.fillRect(x + index * GAP, y, width + 1, height + 1)
      }
    }
  }

  updateProjectiles() {
    for (let index = this.projectiles.length - 1; index >= 0; index--) {
      const projectile = this.projectiles[index]
      if (
        projectile.x < 0 ||
        projectile.x > this.canvas.width ||
        projectile.y < 0 ||
        projectile.y > this.canvas.height
      ) {
        this.projectiles.splice(index, 1)
      } else {
        projectile.update()
      }
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
