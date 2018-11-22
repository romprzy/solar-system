import { helpers } from './helpers.mjs';
import { objects } from './orbs.mjs';
import { drawCircle } from './DrawCircle.mjs';

window.onload = () => {
  let requestId = false;
  const settings = {
    sunScale: Number(document.getElementById('sun-scale').value) || 12345,
    planetsScale: Number(document.getElementById('planets-scale').value) || 500,
    orbitsScale: Number(document.getElementById('orbits-scale').value) || 500000,
    orb: {

    },
    orbit: {
      color: 'rgba(255,255,255,.25)',
      width: .25
    },
    year: 10000
  }

  const orbsArr = ['Sun','Mercury','Venus','Earth','Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  // const orbsArr = ['Sun','Mercury','Venus','Earth','Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const orbs = {};

  function getOrbs() {
    orbsArr.forEach((item) => {
      orbs[item] = {...objects[item]};
      if (item === 'Sun') {
        orbs[item].radius = objects[item].radius / settings.sunScale;
      } else {
        orbs[item].radius = objects[item].diameter / 2 / settings.planetsScale;
        orbs[item].orbitRadius = objects[item].orbitRadius / settings.orbitsScale;
      }
    })
  }
  getOrbs();
  const orbsObj = {};

  const controls = document.getElementById('controls');

  // Draw canvas
  const canvas = document.getElementById('canvas');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  if (canvas.getContext) {
    let min = height < width ? height : width;
    let max = height > width ? height : width;
    const ctx = canvas.getContext('2d');
    let scale = canvas.clientWidth / width;
    const scaleNodes = Array.from(document.getElementsByClassName('resize-scale'));
    scaleNodes.forEach(item => {
      item.innerHTML = scale.toFixed(2);
    });
    window.addEventListener('resize', () => {
      scale = canvas.clientWidth / width;
      scaleNodes.forEach(item => {
        item.innerHTML = scale.toFixed(2);
      });
      // width = canvas.width = window.innerWidth;
      // height = canvas.height = window.innerHeight;
      // min = height < width ? height : width;
      // max = height > width ? height : width;
    })

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Circle class
    class Circle {
      constructor(circle) {
        this.x = circle.x ? circle.x : 0;
        this.y = circle.y ? circle.y : 0;
        this.r = circle.r;
        this.fill = circle.fill;
        this.stroke = circle.stroke;
      }

      draw() {
        drawCircle(ctx, this.x, this.y, this.r, this.fill, this.stroke);
      }
    }

    // Orb class to draw Circle orb on circle orbit
    class Orb {
      constructor(orb, orbit) {
        this.x = orbit ? orbit.radius : null;
        this.orb = new Circle(orb);
        this.orbit = orbit ? new Circle(orbit) : null;
        // super(orb, orbit);
        // this.orbit = orbit ? orbit : false;
      }

      draw() {
        this.orbit ? this.orbit.draw() : null;
        this.orb.draw();
      }
    }

    const drawLegend = function() {
      const fontSize = 24;
      const lineHeight = 1.2 * fontSize;
      const left = 10;
      const line = 50;
      const drawScale = (x, y, length, endsLendth) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.moveTo(x, y - endsLendth);
        ctx.lineTo(x, y + endsLendth);
        ctx.moveTo(x + length, y - endsLendth);
        ctx.lineTo(x + length, y + endsLendth);
        ctx.stroke();
        ctx.closePath();
      };
      let top = 0;
      ctx.fillStyle = '#fff';
      ctx.font = `100 ${fontSize}px 'Open Sans', Arial, sans-serif`;

      ctx.textBaseline = 'middle';
      // top += lineHeight;
      // ctx.fillText('Scale:', 10, top);

      // Sun
      top += lineHeight;
      ctx.moveTo(left, top);
      ctx.fillText('Sun:', left, top);
      // ctx.fillText(`Sun: 1px = ${settings.sunScale} km`, 10, top);

      ctx.strokeStyle='#fff';
      ctx.lineWidth = 1;
      top += lineHeight;
      drawScale(left, top, line, 4);
      // ctx.moveTo(left, top);
      // ctx.lineTo(left + line, top);
      // ctx.moveTo(left, top - 5);
      // ctx.lineTo(left, top + 5);
      // ctx.moveTo(left + line, top - 5);
      // ctx.lineTo(left + line, top + 5);
      // ctx.stroke();
      ctx.fillText(`${helpers.formatNumber(line * settings.sunScale)} km`, left + line + 10, top);

      // Planets
      top += lineHeight;
      ctx.moveTo(left, top);
      ctx.fillText('Planets:', left, top);

      top += lineHeight;
      drawScale(left, top, line, 4);
      ctx.fillText(`${helpers.formatNumber(line * settings.planetsScale)} km`, left + line + 10, top);

      // Orbits
      top += lineHeight;
      ctx.moveTo(left, top);
      ctx.fillText('Orbits:', left, top);

      top += lineHeight;
      drawScale(left, top, line, 4);
      ctx.fillText(`${helpers.formatNumber(line * settings.orbitsScale)} km`, left + line + 10, top);

      // Year on Earth
      top += lineHeight;
      ctx.moveTo(left, top);
      ctx.fillText(`Year on Earth: ${settings.year / 1000} s`, left, top);
    }

    let frame = 0;
    const animate = (frame, s) => {
      // ctx.translate(0, 0);
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.closePath();

      drawLegend();

      orbsArr.forEach((obj) => {
        const orb = orbs[obj];
        const orbit = orb.orbitRadius ? { r: orb.orbitRadius, stroke: {color: '#fff', width: settings.orbit.width} } : null;
        orb.x = orb.orbitRadius;

        orbsObj[orb] = new Orb({
          r: orb.radius ? orb.radius : orb.diameter ? orb.diameter / 2 : null,
          x: orb.orbitRadius ? orb.orbitRadius : null,
          fill: orb.color ? orb.color : null
        }, orbit);

        if (obj === 'Sun') {
          ctx.translate(width / 2, height / 2);
          orbsObj[orb].draw();
        }
        else {
          ctx.rotate(frame * 2 * Math.PI * orbs.Earth.year / (settings.year * orb.year));
          ctx.translate(orb.r, 0);
          orbsObj[orb].draw();
          ctx.translate(-orb.r, 0);
          ctx.rotate(-frame * 2 * Math.PI * orbs.Earth.year / (settings.year * orb.year));
        }
      });

      ctx.translate(-width / 2, -height / 2);
      requestId = window.requestAnimationFrame(animate, settings);
    }

    requestId = window.requestAnimationFrame(animate, settings);

    // const start = document.getElementById('startAnimation');
    document.addEventListener('click', (e) => {
      if (e.target.id === 'startAnimation') {
        // window.requestAnimationFrame(animate, settings);
        requestId = window.requestAnimationFrame(animate, settings);
      } else if (e.target.id === 'stopAnimation') {
        window.cancelAnimationFrame(requestId);
        requestId = false;
      }
    })

    function changeSettings(e) {
      const el = e.target;
      if (e.target.id) {
        const id = e.target.id;
        switch (id) {
          case 'sun-scale':
          settings.sunScale = Number(el.value);
          break;
          case 'planets-scale':
          settings.planetsScale = Number(el.value);
          break;
          case 'orbits-scale':
          settings.orbitsScale = Number(el.value);
          break;
          case 'year':
          settings.year = Number(el.value);
          break;
        }
        getOrbs();
      }
    }

    document.addEventListener('keyup', changeSettings);
    document.addEventListener('input', changeSettings);
  }
}
