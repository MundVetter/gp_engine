const Physics = require('./physics.js')

class ball {
  constructor (options = {}) {
    this.startPos = options.pos || [360, 180]
    this.pos = options.pos || [360, 180]
    this.energyX = options.energyX || 200
    this.energyY = options.energyY || 0
    this.size = options.size || 10
    this.fieldWidth = options.fieldWidth || 360
    this.xDirection = options.xDirection || 'left'
    this.maxPower = options.maxPower || 28

    this.physicsX = new Physics({
      energy: this.energyX,
      mass: options.mass || 20,
      airDensity: options.airDensity || 0,
      area: options.area || Math.pow(Math.PI, 2) * this.size / 200
    })

    this.physicsY = new Physics({
      energy: this.energyY,
      mass: options.mass || 20,
      airDensity: options.airDensity || 0,
      area: options.area || Math.pow(Math.PI, 2) * this.size / 200,
      dragCo: 0
    })
  }
  moveY (direction) {
    this.physicsY.power = this.maxPower
    if (direction === 'up') {
      direction = 'down'
    } else {
      direction = 'up'
    }
    this.physicsY.powerDirection = direction
  }
  calcPosX () {
    this.physicsX.calcEnergy()
    if (this.xDirection === 'left') {
      this.pos[0] -= this.physicsX.energyToVelocity(this.physicsX.energy, this.physicsX.mass)
    } else {
      this.pos[0] += this.physicsX.energyToVelocity(this.physicsX.energy, this.physicsX.mass)
    }
  }
  calcPosY () {
    this.physicsY.calcEnergy()
    if (this.pos[1] + this.size < 0) {
      this.pos[1] = this.fieldWidth
    } else if (this.pos[1] > this.fieldWidth) {
      this.pos[1] = 0 - this.size
    }
    if (this.physicsY.objectDirection === 'up') {
      this.pos[1] -= this.physicsY.energyToVelocity(this.physicsY.energy, this.physicsY.mass)
    } else if (this.physicsY.objectDirection === 'down') {
      this.pos[1] += this.physicsY.energyToVelocity(this.physicsY.energy, this.physicsY.mass)
    }
  }
  reset () {
    this.xDirection = (this.xDirection === 'left' ? 'left' : 'right')
    this.pos[0] = this.startPos[0]
    this.pos[1] = this.startPos[1]
    this.physicsX.energy = this.energyX
    this.physicsY.energy = this.energyY
  }
  addEnergyX (amount) {
    this.physicsX.energy += amount
  }
  calcPos () {
    // physicsX
    this.calcPosX()

    // physicsY
    this.calcPosY()
  }
}
module.exports = ball
