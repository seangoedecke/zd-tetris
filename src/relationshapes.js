import Matter from 'matter-js'
import semiCircle from './bodies-semicircle'
import { ZD_APPLE_GREEN,
  ZD_PELOROUS,
  ZD_YELLOW,
  ZD_ORANGE,
  ZD_MANDY,
  ZD_FLAMINGO,
  ZD_TEAL } from './zd-colours'

const Common = Matter.Common
const Bodies = Matter.Bodies

export const getRandomColor = () => (
  Common.choose([ZD_APPLE_GREEN, ZD_PELOROUS, ZD_YELLOW, ZD_ORANGE, ZD_MANDY, ZD_FLAMINGO, ZD_TEAL])
)

export const getRandomShape = (x, color) => (
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
