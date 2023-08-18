const WIDTH = 490;
const HEIGHT = 490;
const _drawPixel = (ctx: CanvasRenderingContext2D) => {
  return (color: number, x: number, y: number) => {
    const r = color;
    const g = color;
    const b = color;
    const a = 255;
    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
    ctx.fillRect(x, y, 1, 1);
  };
};
const _map = function (
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return (input: number) =>
    ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const main = () => {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let context = canvas.getContext("2d");
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = "black";
  context.lineWidth = 1;

  const drawPixel = _drawPixel(context);
  const mapX = _map(0, WIDTH, -2, 0.47);
  const mapY = _map(0, HEIGHT, -1.12, 1.12);

  for (let py = 0; py < HEIGHT; py += 1) {
    for (let px = 0; px < WIDTH; px += 1) {
      const x0 = mapX(px);
      const y0 = mapY(py);

      let x = 0;
      let y = 0;

      let iteration = 0;
      let maxIteration = 100;
      while (x * x + y * y <= 2 * 2 && iteration < maxIteration) {
        const xTemp = x ** 2 - y ** 2 + x0;
        y = 2 * x * y + y0;
        x = xTemp;
        iteration += 1;
      }

      drawPixel(iteration, px, py);
    }
  }
};

main();
