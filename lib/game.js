const Paddle = require('./paddle.js')
const Ball = require('./ball.js')

class Game {
  constructor (options = {}) {
    this.fieldSize = options.fieldSize || [640, 360]
    this.paddleSettings = options.paddles || [
      {name: 'player Left'},
      {
        name: 'player Right',
        controls: [{key: 38, action: 'up'}, {key: 40, action: 'down'}],
        goal: 'left',
        startPos: [this.fieldSize[0] - 20, this.fieldSize[1] / 2 - 10]
      }
    ]
    this.paddles = this.paddleSettings.map(opt => new Paddle(opt))
    this.ballOptions = options.ball || {}
    this.ball = new Ball(this.ballOptions)

    this.reflectEnergy = (typeof options.reflectEnergy !== 'undefined') ? options.reflectEnergy : 1
    this.multiplier = options.multiplier || 3
    this.goal = options.goal || 5

    this.paused = false
    this.ended = false
    this.winner = []
  }

  sendControls (controller) {
    controller.forEach((control) => {
      this._controlPaddle(control.paddle, control.action)
      this._controlBall(control.paddle, control.action)
    })
  }

  _controlPaddle (paddle, direction) {
    paddle.move(direction)
  }

  _controlBall (paddle, direction) {
    if (paddle.controlsBall) this.ball.moveY(direction)
  }

  bounce () {
    for (let paddle of this.paddles) {
      const paddleX = {
        min: paddle.pos[0],
        max: paddle.pos[0] + paddle.size[0]
      }
      const paddleY = {
        min: paddle.pos[1],
        max: paddle.pos[1] + paddle.size[1]
      }
      
      // Does the ball touch the paddle?
      if (paddleX.min <= this.ball.pos[0] && this.ball.pos[0] <= paddleX.max &&
        paddleY.min <= this.ball.pos[1] + this.ball.size / 2 &&
        this.ball.pos[1] - this.ball.size / 2 <= paddleY.max) {
        this.ball.xDirection = (this.ball.xDirection === 'left' ? 'right' : 'left')
        this.ball.addEnergyX(this.multiplier * paddle.physics.energy + this.reflectEnergy)
  
        for (const paddle of this.paddles) {
          paddle.controlsBall = false
        }
  
        paddle.controlsBall = true
      }
    }
  }

  goalCheck () {
    if (this.ball.pos[0] < 0 || this.ball.pos[0] > this.fieldSize[0]) {
      for (const paddle of this.paddles) {
        if (paddle.goal === this.ball.xDirection) paddle.points ++
  
        if (paddle.points >= this.goal) {
          this.ended = true
          this.winner.push(paddle.name)
        }
 
        paddle.controlsBall = false
      }
      this.ball.reset()
    }
  }

  calcPos () {
    for (const paddle of this.paddles) {
      paddle.calcPos()
    }
    this.ball.calcPos()
  }

  update (controller = []) {
    if (!this.paused && !this.ended) {
      this.sendControls(controller)
      this.calcPos()
      this.bounce()
      this.goalCheck()
    }
  }
}
module.exports = Game
