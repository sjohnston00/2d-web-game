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
      width: 25,
      height: 25,
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
    this.drawFPS()
    this.drawPlayerState()
    this.drawMoveState()
    this.drawProjectsArray()

    for (let index = 0; index < this.projectiles.length; index++) {
      const projectile = this.projectiles[index]
      projectile.draw()
    }
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
      this.playerState.y_moveSpeed = -10
    }

    for (let index = 0; index < this.projectiles.length; index++) {
      const projectile = this.projectiles[index]
      projectile.update()
    }
  }

  setupWindowListeners() {
    window.onresize = () => {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      // drawCanvasBg(canvas, ctx)
    }

    window.addEventListener('keydown', (e) => {
      this.moveState[e.key] = true

      if (e.key === ' ') {
        this.projectiles.push(
          new Projectile({
            canvas: this.canvas,
            ctx: this.ctx,
            x: this.playerState.x,
            y: this.playerState.y,
            angle: Math.random() * 10,
            speed: Math.random() * 10 + 10
          })
        )
      }
    })
    window.addEventListener('keyup', (e) => {
      delete this.moveState[e.key]
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

  drawProjectsArray() {
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
    //TODO: show rectangles above player with amount of projectiles left
    this.ctx.strokeStyle = '#000000'
    this.ctx.setLineDash([0])
    this.ctx.lineWidth = 3
    let x = this.playerState.x
    let y = this.playerState.y
    let width = this.playerState.width
    let height = this.playerState.height
    this.ctx.strokeRect(x, y, width, height)
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
