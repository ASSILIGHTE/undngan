/* ==========================================================================
   ROMANTIC WEDDING INVITATION - INTERACTIVE SCENERY PARTICLES & BOKEH ENGINE
   Features: Floating Pearls, 3D Swaying Rose Petals, Twinkling Golden Bokeh,
   and Interactive Mouse Wind Deflection.
   ========================================================================== */

class RomanticSceneryParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 36;
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.windX = 0;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Mouse wind interaction
    window.addEventListener('mousemove', (e) => {
      const deltaX = (e.clientX - this.mouseX) * 0.005;
      this.windX = Math.max(-1.5, Math.min(1.5, this.windX + deltaX));
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.initParticles();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }
  
  createParticle(randomY = false) {
    const typeRoll = Math.random();
    let type = 'pearl';
    if (typeRoll > 0.65) type = 'petal';
    else if (typeRoll > 0.40) type = 'sparkle';

    return {
      type: type,
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -30,
      size: type === 'pearl' ? Math.random() * 5 + 3.5 : (type === 'petal' ? Math.random() * 9 + 7 : Math.random() * 3 + 1.5),
      speedY: type === 'sparkle' ? -(Math.random() * 0.3 + 0.1) : (Math.random() * 0.6 + 0.3),
      speedX: Math.sin(Math.random() * Math.PI) * 0.4 - 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.03 + 0.01,
      opacity: type === 'sparkle' ? Math.random() * 0.6 + 0.2 : (type === 'pearl' ? Math.random() * 0.6 + 0.35 : Math.random() * 0.45 + 0.3),
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulseDir: 1
    };
  }
  
  drawParticle(p) {
    this.ctx.save();
    this.ctx.translate(p.x, p.y);
    this.ctx.globalAlpha = p.opacity;

    if (p.type === 'pearl') {
      // 1. Lustrous 3D Pearl with radial sheen
      const grad = this.ctx.createRadialGradient(
        -p.size * 0.25, -p.size * 0.25, 1,
        0, 0, p.size
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#f5efe6');
      grad.addColorStop(0.9, '#ded3c3');
      grad.addColorStop(1, '#c2b39f');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Subtle pearl outline
      this.ctx.strokeStyle = 'rgba(74, 14, 23, 0.15)';
      this.ctx.lineWidth = 0.6;
      this.ctx.stroke();

    } else if (p.type === 'petal') {
      // 2. 3D Swaying Rose Petal with pitch flip rotation
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      const flipScale = Math.cos(p.flipAngle);
      this.ctx.scale(1, flipScale);

      // Deep Burgundy / Maroon Petal Gradient
      const petalGrad = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
      petalGrad.addColorStop(0, '#6b1823');
      petalGrad.addColorStop(0.7, '#4a0e17');
      petalGrad.addColorStop(1, '#2d080e');

      this.ctx.fillStyle = petalGrad;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size);
      this.ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.5, p.size * 0.75, p.size * 0.5, 0, p.size);
      this.ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.5, -p.size * 0.75, -p.size * 0.5, 0, -p.size);
      this.ctx.fill();

      // Soft center vein detail
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -p.size * 0.8);
      this.ctx.lineTo(0, p.size * 0.8);
      this.ctx.stroke();

    } else if (p.type === 'sparkle') {
      // 3. Twinkling Golden Bokeh Dust
      const bokehGrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
      bokehGrad.addColorStop(0, 'rgba(229, 207, 155, 0.9)');
      bokehGrad.addColorStop(0.5, 'rgba(196, 159, 87, 0.4)');
      bokehGrad.addColorStop(1, 'rgba(196, 159, 87, 0)');

      this.ctx.fillStyle = bokehGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
  
  drawAtmosphericGlow() {
    // Breathing atmospheric light pulse at top right and bottom left
    const time = Date.now() * 0.001;
    const pulse1 = Math.sin(time * 0.5) * 0.03 + 0.06;
    const pulse2 = Math.cos(time * 0.6) * 0.03 + 0.06;

    // Top-Right Maroon Rose Atmospheric Sheen
    const topGrad = this.ctx.createRadialGradient(
      this.canvas.width * 0.85, 0, 10,
      this.canvas.width * 0.85, 0, this.canvas.width * 0.45
    );
    topGrad.addColorStop(0, `rgba(74, 14, 23, ${pulse1})`);
    topGrad.addColorStop(1, 'rgba(74, 14, 23, 0)');
    this.ctx.fillStyle = topGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Bottom-Left Pearl & Gold Shimmer Light
    const bottomGrad = this.ctx.createRadialGradient(
      0, this.canvas.height, 10,
      0, this.canvas.height, this.canvas.width * 0.4
    );
    bottomGrad.addColorStop(0, `rgba(196, 159, 87, ${pulse2})`);
    bottomGrad.addColorStop(1, 'rgba(196, 159, 87, 0)');
    this.ctx.fillStyle = bottomGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw subtle atmospheric background glow
    this.drawAtmosphericGlow();
    
    // Dampen wind gradually
    this.windX *= 0.96;

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];

      // Update positions
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.008) * 0.4 + p.speedX + this.windX;
      p.rotation += p.rotationSpeed;
      p.flipAngle += p.flipSpeed;

      // Pulse opacity for sparkles
      if (p.type === 'sparkle') {
        p.opacity += p.pulseSpeed * p.pulseDir;
        if (p.opacity > 0.8 || p.opacity < 0.15) {
          p.pulseDir *= -1;
        }
      }
      
      // Respawn boundary checks
      if (p.type === 'sparkle') {
        if (p.y < -20) {
          this.particles[i] = this.createParticle(false);
          this.particles[i].y = this.canvas.height + 10;
        }
      } else {
        if (p.y > this.canvas.height + 30) {
          this.particles[i] = this.createParticle(false);
        }
      }

      // Keep x within screen bounds
      if (p.x < -30) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 30) p.x = -20;
      
      this.drawParticle(p);
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.sceneryParticleEngine = new RomanticSceneryParticleEngine('leaves-canvas');
});
