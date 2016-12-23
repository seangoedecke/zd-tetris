import Matter from 'matter-js'
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
    Bodies = Matter.Bodies;

const runner = Matter.Runner.create()

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.getElementById('tetris'),
    engine: engine,
    options: {
      width: 600,
      height: 900,
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
  450,
  60,
  render.options.height,
  {
    isStatic: true,
    render: {
      fillStyle: ZD_COLOUR_DARK,
      strokeStyle: 'transparent'
    }
  });

const getRandomColor = () => {
  let blockColor = Math.floor(Math.random() * 7)
  let color

  switch (blockColor) {
    case 0:
      return ZD_APPLE_GREEN
    case 1:
      return ZD_PELOROUS
    case 2:
      return ZD_YELLOW
    case 3:
      return ZD_ORANGE
    case 4:
      return ZD_MANDY
    case 5:
      return ZD_FLAMINGO
    case 6:
      return ZD_TEAL
  }

}

const generateBlock = () => {
  let x = render.options.width * Math.random()
  let blockType = Math.floor(Math.random() * 5)


  let color = getRandomColor();


  switch (blockType) {
    case 0:
      // small square
      return Bodies.rectangle(x, 0, 80, 80, {
        render: {
          fillStyle: color,
          strokeStyle: 'transparent'
        }
      })
    case 1:
      // rectangle
      return Bodies.rectangle(x, 0, 80, 160, {
        render: {
          fillStyle: color,
          strokeStyle: 'transparent'
        }
      })
    case 2:
      // small circle
      return Bodies.circle(x, 0, 40, {
        render: {
          fillStyle: color,
          strokeStyle: 'transparent'
        }
      })
    case 3:
      // triangle
      return Bodies.polygon(x, 0, 3, 40, {
        render: {
          fillStyle: color,
          strokeStyle: 'transparent'
        }
      })
    case 4:
      // semicircle
      return Bodies.polygon(x, 0, 3, 40, {
        render: {
          fillStyle: color,
          strokeStyle: 'transparent'
        }
      })
  }

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
