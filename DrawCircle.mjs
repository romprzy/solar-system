export const drawCircle = (ctx, x, y, r, fill, stroke) => {

  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.stroke();
  }
  ctx.closePath();
}

export default drawCircle;