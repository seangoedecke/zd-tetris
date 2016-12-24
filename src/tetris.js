import Matter from 'matter-js'
import semiCircle from './bodies-semicircle'
import {
  ZD_COLOUR_DARK,
  ZD_COLOUR_LIGHT,
  ZD_APPLE_GREEN,
  ZD_PELOROUS,
  ZD_YELLOW,
  ZD_ORANGE,
  ZD_MANDY,
  ZD_FLAMINGO,
  ZD_TEAL } from './zd-colours'

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Events = Matter.Events,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Bounds = Matter.Bounds,
    Vertices = Matter.Vertices,
    Composite = Matter.Composite,
    Runner = Matter.Runner,
    Body = Matter.Body;

let tick = 0
let activeBlock = Bodies.rectangle(0,0,0,0)

const resultMessage = document.getElementById('message')
const results = document.getElementById('results')

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.getElementById('tetris'),
    engine: engine,
    options: {
      width: 400,
      height: 700,
      wireframes: false,
      background: ZD_COLOUR_LIGHT
    }
});

// create boundaries

const ground = Bodies.rectangle(
  (render.options.width / 2),
  render.options.height,
  render.options.width,
  60,
  {
    isStatic: true,
    render: {
      fillStyle: ZD_COLOUR_DARK,
      strokeStyle: 'transparent'
    }
  });
const leftWall = Bodies.rectangle(
  0,
  (render.options.height / 2),
  60,
  render.options.height + 100,
  {
    isStatic: true,
    render: {
      fillStyle: ZD_COLOUR_DARK,
      strokeStyle: 'transparent'
    }
  });
const rightWall = Bodies.rectangle(
  render.options.width,
  (render.options.height / 2),
  60,
  render.options.height + 100,
  {
    isStatic: true,
    render: {
      fillStyle: ZD_COLOUR_DARK,
      strokeStyle: 'transparent'
    }
  });

// Used for loss checking collision detection. Do not add to world
const ceiling = Bodies.rectangle(
  (render.options.width / 2),
  -20,
  render.options.width,
  10,
  {
    isStatic: true,
    render: {
      fillStyle: ZD_COLOUR_DARK,
      strokeStyle: 'transparent'
    }
  });

const getRandomColor = () => (
  Common.choose([ZD_APPLE_GREEN, ZD_PELOROUS, ZD_YELLOW, ZD_ORANGE, ZD_MANDY, ZD_FLAMINGO, ZD_TEAL])
)

const getRandomShape = (x, color) => (
  Common.choose([
    Bodies.rectangle(x, 5, 80, 80, {  // square
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      },
      friction: 1
    }),
    Bodies.rectangle(x, 5, 80, 160, { // rect
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      },
      friction: 1
    }),
    Bodies.circle(x, 5, 40, { // circle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      },
      friction: 1
    }),
    Bodies.polygon(x, 5, 3, 40, { // triangle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      },
      friction: 1
    }),
    semiCircle(x, 5, 40, { // semicircle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      },
      friction: 1
    })
  ])
)

const generateBlock = () => {
  let x = 0
  while (x < 30 || x > render.options.width - 30) {
    x = render.options.width * Math.random()
  }
  let color = getRandomColor();
  return getRandomShape(x, color)
}

// listen for keys
document.onkeypress = (key) => {
  switch (key.code) {
    case 'KeyA': // left arrow
      Body.applyForce(activeBlock, { x: 0, y: 0 }, { x: -0.05 * activeBlock.mass, y: -0.01})
      break
    case 'KeyD': // right arrow
      Body.applyForce(activeBlock, { x: 0, y: 0 }, { x: 0.05 * activeBlock.mass, y: -0.01})
      break
  }
}

document.onkeydown = (key) => {
  if ((key.code === 'KeyA') || (key.code === 'KeyB')) {
    Body.setAngularVelocity(activeBlock, 0)
  }
}

// game loop
Events.on(engine, 'beforeTick', () => {
  tick = tick + 1

  // enforce hard limit on active block
  if (activeBlock.angularVelocity < -0.05) {
    Body.setAngularVelocity(activeBlock, -0.05)
  }
  if (activeBlock.angularVelocity > 0.05) {
    Body.setAngularVelocity(activeBlock, 0.05)
  }
  if (activeBlock.velocity < -0.05) {
    Body.setVelocity(activeBlock, -0.05)
  }
  if (activeBlock.velocity > 0.05) {
    Body.setVelocity(activeBlock, 0.05)
  }

  // check for loss condition
  Composite.allBodies(engine.world).forEach( (body) => {
    if (Bounds.overlaps(ceiling.bounds, body.bounds)
          && body != activeBlock
          && body != leftWall
          && body != rightWall) {

      renderEndGameScreen(Composite.allBodies(engine.world).length-3);
      Runner.stop(runner);
    }
  })

  // generate new block if required
  if (tick % 100 === 0) {
    let newBlock = generateBlock();

    activeBlock.render.strokeStyle = 'transparent'  // set focus color
    newBlock.render.strokeStyle = ZD_COLOUR_DARK

    activeBlock = newBlock
    World.add(engine.world, [newBlock])
  }

  if (tick === 500) { tick = 0 }; // make sure tick never gets too big
})

const renderEndGameScreen = (score) => {
  resultMessage.innerHTML = `You stacked ${Composite.allBodies(engine.world).length-3} bodies before losing.`
  results.className = 'results'
}

// add all of the bodies to the world
World.add(engine.world, [leftWall, rightWall, ground]);

// run the engine
const runner = Engine.run(engine);

// run the renderer
Render.run(render);
