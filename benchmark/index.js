const Benchmark = require('benchmark')
const Game = require('../index.js')
const microtime = require('microtime')

const suite = new Benchmark.Suite
const control = new Game()
let startTime;
let endTime;

suite
  .add('update', () => {
    control.update([{
        paddle: control.paddles[0],
        action: 'up'
      }, {
        paddle: control.paddles[1],
        action: 'down'
      }
    ])
  })
  .on('start', () => {
    startTime = microtime.now()
  })
  .on('cycle', (event) => {
    endTime = microtime.now()
    console.log(`Total elapsed time: ${(endTime - startTime)/ 1000000} seconds.`)
    console.log(String(event.target))
  })
  .run()