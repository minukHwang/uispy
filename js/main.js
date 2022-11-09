import "../scss/main.scss";

import Matter from "matter-js";

let originX = window.innerWidth;
let originY = window.innerHeight;
const canvas = document.querySelector(".canvas");
//const context = canvas.getContext("2d");
const pixelRatio = window.devicePixelRatio;

let mouseNum = 0;

let originWidth = originX * pixelRatio;
let origintHeight = originY * pixelRatio;

let colors = ["#0094FF", "#FFD600", "#04CB00"];

// module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Vertices = Matter.Vertices,
  Events = Matter.Events,
  Svg = Matter.Svg;

// create runner
const runner = Runner.create();
// create an engine
const engine = Engine.create();
engine.world.gravity.y = 2;
// create a renderer

// svg import
const starPath = document.querySelector(".star-path");

console.log(starPath);

const starVertices = Bodies.fromVertices(
  (originX * pixelRatio) / 2 - 100,
  0,
  Vertices.scale(Svg.pathToVertices(starPath), 2, 2),
  {
    render: {
      fillStyle: "#FFD600",
    },
  },
  true
);

console.log(starVertices);

const render = Render.create({
  canvas: canvas,
  element: document.body,
  engine: engine,
  options: {
    background: "transparent",
    wireframes: false,
  },
});

// create two boxes and a ground
const boxA = Bodies.rectangle(
  (originX * pixelRatio) / 2,
  0,
  originWidth * 0.1,
  originWidth * 0.1,
  {
    render: {
      fillStyle: "#0094FF",
    },
    chamfer: { radius: 10 },
  }
);

const triA = Bodies.polygon(
  (originX * pixelRatio) / 2 + 30,
  0,
  3,
  originWidth * 0.1,
  {
    render: {
      fillStyle: "#04CB00",
    },
    chamfer: { radius: 10 },
  }
);

const hexA = Bodies.polygon(
  (originX * pixelRatio) / 2 + 30,
  0,
  7,
  originWidth * 0.1,
  {
    render: {
      fillStyle: "#FFD600",
    },
    chamfer: { radius: 10 },
  }
);

const ground = Bodies.rectangle(
  0,
  30 + window.innerHeight,
  window.innerWidth * 2,
  60,
  {
    isStatic: true,
  }
);

// 캔버스 사이즈 조정
const init = () => {
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  Matter.Body.setPosition(ground, {
    x: canvas.width / 2,
    y: canvas.height + 30,
  });
  Matter.Body.setPosition(boxA, {
    x: boxA.position.x * (window.innerWidth / originX),
    y: boxA.position.y,
  });
  Matter.Body.scale(
    boxA,
    window.innerWidth / originX,
    window.innerWidth / originX
  );
  originX = window.innerWidth;
  originY = window.innerHeight;
};

const addGeometry = (e) => {
  if (mouseNum == 1) {
    const randomWidth = (originWidth * (Math.random() / 2 + 0.5)) / 10;
    const starWidth = 2 * (Math.random() / 2 + 0.5);
    const box = Bodies.rectangle(
      e.mouse.mousedownPosition.x,
      e.mouse.mousedownPosition.y,
      randomWidth,
      randomWidth,
      {
        render: {
          fillStyle: colors[Math.floor(Math.random() * 3)],
        },
        chamfer: { radius: 10 },
      }
    );

    const tri = Bodies.polygon(
      e.mouse.mousedownPosition.x,
      e.mouse.mousedownPosition.y,
      3,
      (originWidth * (Math.random() / 2 + 0.5)) / 10,
      {
        render: {
          fillStyle: colors[Math.floor(Math.random() * 3)],
        },
        chamfer: { radius: 10 },
      }
    );

    const star = Bodies.fromVertices(
      e.mouse.mousedownPosition.x + 100,
      e.mouse.mousedownPosition.y + 100,
      Vertices.scale(Svg.pathToVertices(starPath), starWidth, starWidth),
      {
        render: {
          fillStyle: colors[Math.floor(Math.random() * 3)],
        },
      },
      true
    );

    // 공간에 추가합니다.
    Composite.add(engine.world, [box, tri, star]);
  }
};

// create mouse
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false },
  },
});

render.mouse = mouse;

Events.on(mouseConstraint, "mousedown", (e) => {
  console.log(2)
  mouseNum = 2;
  addGeometry(e);
});

Events.on(mouseConstraint, "mouseup", (e) => {
  console.log(1)
  if(mouseNum == 3){
    mouseNum = 3
  } else {
    mouseNum = 1;
  }
  addGeometry(e);
});

Events.on(mouseConstraint, "startdrag", (e) => {
  console.log(3)
  mouseNum = 3;
  addGeometry(e);
});

Events.on(mouseConstraint, "enddrag", (e) => {
  console.log(3)
  mouseNum = 3;
  addGeometry(e);
});


// render.canvas.addEventListener(
//   "click",
//   (e) => {
//     console
//   },
//   false
// );

init();
// add all of the bodies to the world
Composite.add(engine.world, [
  boxA,
  triA,
  starVertices,
  ground,
  mouseConstraint,
]);
// run the renderer
Render.run(render);

// run the engine
Runner.run(runner, engine);

window.addEventListener("resize", () => {
  init();
});
