const Physics = require('./physics.js')

class Paddle {
  constructor (options = {}) {
    this.startPos = options.startPos || [10, 170]
    this.pos = this.startPos
    this.fieldWidth = options.fieldWidth || 360
    this.size = options.size || [10, 70]

    // player stuff
    this.name = (typeof options.name !== 'undefined') ? options.name : Math.random()
    this.controls = options.controls || [{key: 87, action: 'up'}, {key: 83, action: 'down'}]
    this.points = options.points || 0
    this.controlsBall = options.controlsBall || false
    this.goal = options.goal || 'right'

    // physics stuff here
    this.maxPower = options.maxPower || 60
    this.density = (typeof options.density !== 'undefined') ? options.density : 400
    this.height = (typeof options.height !== 'undefined') ? options.height : 0.1
    const area = (this.size[0] / 100) * this.height
    this.physics = new Physics({
      mass: this.density * area * (this.size[1] / 100),
      drag: options.drag || 5,
      area: area,
      dragCo: 5,
      friction: true,
      frictionCo: 0.3
    })
  }

  move (direction) {
    this.physics.power = this.maxPower
    this.physics.powerDirection = direction
  }

  calcPos () {
    this.physics.calcEnergy()
    if (this.physics.objectDirection === 'up') {
      this.pos[1] -= this.physics.energyToVelocity(this.physics.energy, this.physics.mass)
    } else if (this.physics.objectDirection === 'down') {
      this.pos[1] += this.physics.energyToVelocity(this.physics.energy, this.physics.mass)
    }

    if (this.pos[1] + this.size[1] < 0) {
      this.pos[1] = this.fieldWidth
    } else if (this.pos[1] > this.fieldWidth) {
      this.pos[1] = 0 - this.size[1]
    }
  }
}
module.exports = Paddle
