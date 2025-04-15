<template>
  <canvas id="starCanvas" ref="canvas"></canvas>
</template>

<script>
export default {
  name: 'StarCanvas',
  mounted() {
    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let meteor = null;
    let lastMeteorTime = Date.now();
    let astronomyBlend = 0;
    let targetAstronomy = 0;
    const rotationSpeed = 0.00015;
    
    function initStars(numStars = 400) {
      stars = [];
      const width = canvas.width;
      const height = canvas.height;
      const gridCount = Math.round(Math.sqrt(numStars));
      const cellW = width / gridCount;
      const cellH = height / gridCount;
      const astroCenter = { x: width / 2, y: height * 0.25 };
      for (let i = 0; i < gridCount; i++) {
        for (let j = 0; j < gridCount; j++) {
          let rx = j * cellW + Math.random() * cellW;
          let ry = i * cellH + Math.random() * cellH;
          const randomX = rx;
          const randomY = ry;
          const dx = (Math.random() - 0.5) * 0.005;
          const dy = (Math.random() - 0.5) * 0.005;
          const dX = rx - astroCenter.x, dY = ry - astroCenter.y;
          const distance = Math.sqrt(dX * dX + dY * dY);
          const astroAngle = Math.atan2(dY, dX);
          stars.push({
            randomX,
            randomY,
            dx,
            dy,
            distance,
            astroAngle,
            x: randomX,
            y: randomY,
            radius: Math.random() * 1.5 + 0.5,
            baseAlpha: Math.random() * 0.5 + 0.5,
            amplitude: Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            brightnessSpeed: Math.random() * 0.001 + 0.0005
          });
        }
      }
      meteor = null;
      lastMeteorTime = Date.now();
    }
    
    function spawnMeteor() {
      const width = canvas.width, height = canvas.height;
      const x0 = Math.random() * width;
      const y0 = Math.random() * height * 0.2;
      const angle = (Math.random() * 20 + 20) * Math.PI / 180;
      meteor = {
        x: x0,
        y: y0,
        len: Math.random() * 80 + 80,
        speed: Math.random() * 5 + 12,
        acceleration: Math.random() * 0.15 + 0.1,
        angle,
        life: 0,
        maxLife: Math.random() * 300 + 500,
        curveAmplitude: Math.random() * 1 + 0.5,
        curveFrequency: Math.random() * 0.002 + 0.001,
        curvePhase: Math.random() * Math.PI * 2
      };
    }
    
    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      initStars(400);
    }
    window.addEventListener('resize', resize);
    resize();
    
    function updateMode() {
      if (Math.random() < 0.0005) {
        targetAstronomy = 1;
      } else if (Math.random() < 0.0005) {
        targetAstronomy = 0;
      }
      const blendSpeed = 0.002;
      astronomyBlend += (targetAstronomy - astronomyBlend) * blendSpeed;
    }
    
    function animate() {
      const width = canvas.width, height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      const time = Date.now();
      updateMode();
      const astroCenter = { x: width / 2, y: height * 0.25 };
      stars.forEach(star => {
        star.randomX += star.dx;
        star.randomY += star.dy;
        if (star.randomX < 0) star.randomX = width;
        if (star.randomX > width) star.randomX = 0;
        if (star.randomY < 0) star.randomY = height;
        if (star.randomY > height) star.randomY = 0;
        star.astroAngle += rotationSpeed;
        let astroX = astroCenter.x + star.distance * Math.cos(star.astroAngle);
        let astroY = astroCenter.y + star.distance * Math.sin(star.astroAngle);
        star.x = (1 - astronomyBlend) * star.randomX + astronomyBlend * astroX;
        star.y = (1 - astronomyBlend) * star.randomY + astronomyBlend * astroY;
        const alpha = star.baseAlpha + star.amplitude * Math.sin(time * star.brightnessSpeed + star.phase);
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!meteor && time - lastMeteorTime > 15000 && Math.random() < 0.005) {
        spawnMeteor();
        lastMeteorTime = time;
      }
      if (meteor) {
        meteor.life += 16.67;
        const progress = meteor.life / meteor.maxLife;
        if (progress > 1) {
          meteor = null;
        } else {
          meteor.speed += meteor.acceleration;
          meteor.x += Math.cos(meteor.angle) * meteor.speed;
          meteor.y += Math.sin(meteor.angle) * meteor.speed;
          const offset = meteor.curveAmplitude * Math.sin(meteor.life * meteor.curveFrequency + meteor.curvePhase);
          meteor.x += -Math.sin(meteor.angle) * offset;
          meteor.y += Math.cos(meteor.angle) * offset;
          ctx.beginPath();
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.len;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.len;
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${1 - progress})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
}
</script>
