const assert = require('assert')
const jsonfile = require('jsonfile')

describe('Glitchping', () => {
  const Game = require('../index.js')
  
  describe('#goalCheck', () => {
    const testCase = {
      paddles: [
        {
          name: 'testBot 1',
          startPos: [10, 100]
        },
        {
          name: 'testBot 2',
          goal: 'left',
          startPos: [620, 100]
        }
      ]
    }
 
    const goal = new Game(testCase)
    for (let i = 0; i < 100; i++) {
      goal.update()
    }
 
    it('should add the score if the ball is in the goal', () => {
      assert.equal(goal.paddles[1].points, 1)
    })
  })

  describe('#bounce', () => {
    const bounce = new Game()
    for (let i = 0; i < 100; i++) {
      bounce.update()
    }
    it('should change the direction of the ball', () => {
      assert.equal(bounce.ball.xDirection, 'right')
    })
    it('should change the player who controls the ball', () => {
      assert.ok(bounce.paddles[0].controlsBall)
    })
  })

  describe('#control', () => {
    const control = new Game()
    const ballPath = []
    const paddlePath = []

    for (let i = 0; i < 100; i++) {
      control.update()
    }
    for (let i = 0; i < 100; i++) {
      control.update([{
        paddle: control.paddles[0],
        action: 'up'
      }])
      ballPath.push(control.ball.pos.slice())
      paddlePath.push(control.paddles[0].pos[1])
    }

    it('should ensure that the ball moves as expected given a certain input', () => {
      assert.deepEqual(ballPath, jsonfile.readFileSync('./test/ballPath.json'))
    })
    it('should ensure that the paddle moves as expected', () => {
      assert.deepEqual(paddlePath, jsonfile.readFileSync('./test/paddlePath.json'))
    })
  })
})
