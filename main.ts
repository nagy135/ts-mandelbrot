const WIDTH = 490;
const HEIGHT = 490;

const _drawPixel =
  (ctx: CanvasRenderingContext2D) => (color: number, x: number, y: number) => {
    const r = color;
    const g = 20;
    const b = 20;
    const a = color;
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
    ctx.fillRect(x, y, 1, 1);
  };
const _map =
  (inMin: number, inMax: number, outMin: number, outMax: number) =>
  (input: number) =>
    ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

const computePixelColor = (x0: number, y0: number): number => {
  let x = 0;
  let y = 0;

  let iteration = 0;
  let maxIteration = 100;
  while (x ** 2 + y ** 2 <= 2 * 2 && iteration < maxIteration) {
    const xTemp = x ** 2 - y ** 2 + x0;
    y = 2 * x * y + y0;
    x = xTemp;
    iteration += 1;
  }
  return iteration;
};

let viewBox = {
  x: [0, WIDTH],
  y: [0, HEIGHT],
};

const render = (context: CanvasRenderingContext2D) => {
  const drawPixel = _drawPixel(context);

  const viewBoxXMap = _map(0, WIDTH, viewBox.x[0], viewBox.x[1]);
  const viewBoxYMap = _map(0, HEIGHT, viewBox.y[0], viewBox.y[1]);

  const mapX = _map(0, WIDTH, -2, 0.47);
  const mapY = _map(0, HEIGHT, -1.12, 1.12);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const xInViewBox = viewBoxXMap(x);
      const yInViewBox = viewBoxYMap(y);

      const xInSet = mapX(xInViewBox);
      const yInSet = mapY(yInViewBox);

      const color = computePixelColor(xInSet, yInSet);
      drawPixel(color, x, y);
    }
  }
};

const main = () => {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let context = canvas.getContext("2d");

  let clicked: [number, number] | null = null;

  canvas.onmousedown = (e) => {
    const viewBoxXMap = _map(0, WIDTH, viewBox.x[0], viewBox.x[1]);
    const viewBoxYMap = _map(0, HEIGHT, viewBox.y[0], viewBox.y[1]);
    clicked = [viewBoxXMap(e.offsetX), viewBoxYMap(e.offsetY)];
  };

  canvas.onmouseup = (e) => {
    if (!clicked) return;

    const viewBoxXMap = _map(0, WIDTH, viewBox.x[0], viewBox.x[1]);
    const viewBoxYMap = _map(0, HEIGHT, viewBox.y[0], viewBox.y[1]);

    const clickedX = viewBoxXMap(e.offsetX);
    const clickedY = viewBoxYMap(e.offsetY);

    const maxWidth = Math.max(
      Math.abs(clicked[0] - clickedX),
      Math.abs(clicked[1] - clickedY)
    );

    const x = Math.min(clicked[0], clickedX);
    const y = Math.min(clicked[1], clickedY);

    viewBox.x = [x, x + maxWidth];
    viewBox.y = [y, y + maxWidth];

    context.clearRect(0, 0, WIDTH, HEIGHT);
    render(context);

    clicked = null;
  };

  render(context);
};

main();
