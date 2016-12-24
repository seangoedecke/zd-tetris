import Matter from 'matter-js'

// module aliases
const Common = Matter.Common,
    Bodies = Matter.Bodies,
    Vertices = Matter.Vertices,
    Body = Matter.Body;

const _semiCircle = (x, y, sides, radius, options) => {
  options = options || {};

  var theta = 2 * Math.PI / sides,
      path = '',
      offset = theta * 0.5;

  for (var i = 0; i < sides; i += 1) {
      var angle = offset + (i * theta),
          xx = Math.cos(angle) * radius,
          yy = Math.sin(angle) * radius;

      path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
  }
  let vertices = Vertices.fromPath(path)
  vertices = vertices.slice(vertices.length/2)  // Slice vertices of circle in half, forming a semi-circle
  var polygon = {
      label: 'Polygon Body',
      position: { x: x, y: y },
      vertices: vertices
  };
  return Body.create(Common.extend({}, polygon, options));
};

// returns semiCircle
export default (x, y, radius, options) => {
     // approximate circles with polygons until true circles implemented in SAT
     const maxSides = 25;
     var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));

     // optimisation: always use even number of sides (half the number of unique axes)
     if (sides % 2 === 1)
         sides += 1;

     return _semiCircle(x, y, sides, radius, options);
 };
