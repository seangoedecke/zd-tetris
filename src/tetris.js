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

let tick = 0
let activeBlock

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Events = Matter.Events,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Vertices = Matter.Vertices,
    Body = Matter.Body;

const runner = Matter.Runner.create()

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
  render.options.height,
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
  render.options.height,
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
    Bodies.rectangle(x, 0, 80, 80, {  // square
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      }
    }),
    Bodies.rectangle(x, 0, 80, 160, { // rect
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      }
    }),
    Bodies.circle(x, 0, 40, { // circle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      }
    }),
    Bodies.polygon(x, 0, 3, 40, { // triangle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      }
    }),
    semiCircle(x, 0, 40, { // semicircle
      render: {
        fillStyle: color,
        strokeStyle: 'transparent'
      }
    })
  ])
)

const generateBlock = () => {
  let x = render.options.width * Math.random()
  let color = getRandomColor();
  return getRandomShape(x, color)
}

Events.on(engine, 'beforeTick', () => {
  tick = tick + 1
  if (tick % 100 === 0) {
    let newBlock = generateBlock();
    activeBlock = newBlock
    World.add(engine.world, [newBlock])
    tick = 0
  }
})

// add all of the bodies to the world
World.add(engine.world, [leftWall, rightWall, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
