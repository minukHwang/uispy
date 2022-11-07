import "../scss/main.scss";

import Matter from "matter-js";

let originX = window.innerWidth;
let originY = window.innerHeight;
const canvas = document.querySelector(".canvas");
//const context = canvas.getContext("2d");
const pixelRatio = window.devicePixelRatio;

// module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create runner
const runner = Runner.create();
// create an engine
const engine = Engine.create();

// create a renderer

const render = Render.create({
  canvas: canvas,
  element: document.body,
  engine: engine,
  options: {
    background: "e05406",
    wireframes: false,
  },
});

console.log(render);

// create two boxes and a ground
const boxA = Bodies.rectangle(
  (window.innerWidth * pixelRatio) / 2,
  0,
  500,
  500
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
  console.log(boxA);
  originX = window.innerWidth;
  originY = window.innerHeight;
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

init();
// add all of the bodies to the world
Composite.add(engine.world, [boxA, ground, mouseConstraint]);
// run the renderer
Render.run(render);

// run the engine
Runner.run(runner, engine);

window.addEventListener("resize", () => {
  init();
});
