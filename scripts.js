/**
 * Interactive Apple-Inspired Birthday Engine Logic
 * Pure ES6+, Zero Framework Dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- การตั้งค่าคำพูดและข้อความจดหมาย ---
  const config = {
    noPhrases: [
      "ให้โอกาสตอบใหม่",
      "ไม่อยากได้จริงหรออ้วน 🥺",
      "ไม่เอาจริงดิเห้ย",
      "เอาหน่อยเถอะน้าาา",
      "ใจร้าย😡",
      "งอน!"
    ],
    letterText: "สุขสันต์วันเกิดนะอ้วง 🩵\n\nขอบคุณที่อยู่ด้วยกัน\nขอบคุณที่เข้าใจกัน\nขอบคุณที่ทำให้ทุกวันมีความสุข\n\nเค้าหวังว่าเธอจะยิ้มได้เยอะ ๆ\nมีความสุขมาก ๆ\nสมหวังในทุกเรื่อง\nไม่ว่าจะเกิดอะไรขึ้น\nเค้าจะอยู่ข้างเธอเสมอ\n\nรักนะไอ้ตัวเร้ก 🤍"
  };

  let state = {
    clickCountNo: 0,
    yesScale: 1.0,
    noScale: 1.0,
    musicPlaying: false
  };

  // --- DOM Elements Cache ---
  const dom = {
    canvas: document.getElementById('particleCanvas'),
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    questionText: document.getElementById('questionText'),
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    transitionOverlay: document.getElementById('transitionOverlay'),
    bgMusic: document.getElementById('bgMusic'),
    musicToggle: document.getElementById('musicToggle'),
    envelopeWrapper: document.getElementById('envelopeWrapper'),
    letterSheet: document.getElementById('letterSheet'),
    typewriterText: document.getElementById('typewriterText'),
    photoGallery: document.getElementById('photoGallery'),
    btnShowGift: document.getElementById('btnShowGift'),
    giftModal: document.getElementById('giftModal'),
    giftBox: document.getElementById('giftBox'),
    giftReveal: document.getElementById('giftReveal')
  };

  // --- Canvas Setup ระบบเอฟเฟกต์ลอยละล่อง ---
  const ctx = dom.canvas.getContext('2d');
  let particles = [];
  let sparkles = [];

  function resizeCanvas() {
    dom.canvas.width = window.innerWidth;
    dom.canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const types = ['heart', 'star', 'sparkle', 'cloud'];
  const colors = ['#A8DAFF', '#CDEFFF', '#FFFFFF', '#EAF8FF'];

  class AmbientParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * dom.canvas.height;
    }

    reset() {
      this.x = Math.random() * dom.canvas.width;
      this.y = dom.canvas.height + 20;
      this.size = Math.random() * 12 + 6;
      this.speed = Math.random() * 0.6 + 0.2;
      this.type = types[Math.floor(Math.random() * types.length)];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
    }

    update(burstMultiplier = 1) {
      this.y -= this.speed * burstMultiplier;
      this.angle += this.spin;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;

      if (this.type === 'heart') {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
        ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
      } else if (this.type === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size, Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
          ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 2), Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 2));
        }
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 'sparkle') {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((i * 90) * Math.PI / 180) * this.size, Math.sin((i * 90) * Math.PI / 180) * this.size);
          ctx.lineTo(Math.cos((45 + i * 90) * Math.PI / 180) * (this.size * 0.3), Math.sin((45 + i * 90) * Math.PI / 180) * (this.size * 0.3));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.arc(this.size * 0.5, -this.size * 0.2, this.size * 0.7, 0, Math.PI * 2);
        ctx.arc(-this.size * 0.5, -this.size * 0.2, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class InteractiveSparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.life = 1.0;
      this.decay = Math.random() * 0.03 + 0.015;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // สร้างไอเทมลอยเริ่มต้น
  for (let i = 0; i < 40; i++) particles.push(new AmbientParticle());

  // ลูปแอนิเมชันหลัก
  let burstIntensity = 1;
  function renderLoop() {
    ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    if (burstIntensity > 1) burstIntensity -= 0.05;

    particles.forEach(p => {
      p.update(burstIntensity);
      p.draw();
    });

    sparkles = sparkles.filter(s => s.life > 0);
    sparkles.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // ติดตามพิกัดเมาส์/สัมผัสเพื่อสร้าง Sparkle
  window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.4) sparkles.push(new InteractiveSparkle(e.clientX, e.clientY));
  });
  window.addEventListener('touchmove', (e) => {
    if (Math.random() < 0.4) sparkles.push(new InteractiveSparkle(e.touches[0].clientX, e.touches[0].clientY));
  });

  // --- Page 1 ลอจิกปุ่มคำถามกลั่นแกล้ง ---
  dom.btnNo.addEventListener('click', () => {
    burstIntensity = 6; // ให้ละอองวิ่งเร็วขึ้นเมื่อขัดใจ

    dom.btnNo.classList.add('shake');
    setTimeout(() => dom.btnNo.classList.remove('shake'), 400);

    state.noScale *= 0.85;
    state.yesScale += 0.25;

    dom.btnNo.style.transform = `scale(${state.noScale})`;
    dom.btnYes.style.transform = `scale(${state.yesScale})`;

    if (state.clickCountNo < config.noPhrases.length) {
      dom.questionText.textContent = config.noPhrases[state.clickCountNo];
      state.clickCountNo++;
    }

    if (state.clickCountNo === config.noPhrases.length) {
      dom.btnNo.style.display = 'none';
    }
  });

  dom.btnYes.addEventListener('click', () => {
    dom.transitionOverlay.classList.add('active');

    for (let i = 0; i < 60; i++) {
      sparkles.push(new InteractiveSparkle(window.innerWidth / 2 + (Math.random() - 0.5) * 200, window.innerHeight / 2 + (Math.random() - 0.5) * 200));
    }

    setTimeout(() => {
      dom.page1.classList.remove('active');
      dom.page1.classList.add('hidden');
      dom.page2.classList.remove('hidden');
      dom.page2.classList.add('active');

      dom.bgMusic.play().then(() => {
        state.musicPlaying = true;
        dom.musicToggle.classList.remove('hidden');
        dom.musicToggle.classList.add('playing');
      }).catch(() => {
        dom.musicToggle.classList.remove('hidden');
      });

      setTimeout(() => {
        dom.transitionOverlay.classList.remove('active');
      }, 400);

    }, 700);
  });

  // ระบบควบคุมเสียงเพลง
  dom.musicToggle.addEventListener('click', () => {
    if (state.musicPlaying) {
      dom.bgMusic.pause();
      dom.musicToggle.classList.remove('playing');
    } else {
      dom.bgMusic.play();
      dom.musicToggle.classList.add('playing');
    }
    state.musicPlaying = !state.musicPlaying;
  });

  // --- Page 2 ลอจิกดึงจดหมายกางกลางจอ (NEW!) ---
  dom.envelopeWrapper.addEventListener('click', function openSequence() {
    // 1. เปิดฝากล่องซอง
    dom.envelopeWrapper.classList.add('open');

    // 2. ดึงกระดาษแยกออกจากตัวแรปเปอร์เพื่อให้หลุดออกจากการถูกซ่อนตัวพร้อมซองจดหมาย
    setTimeout(() => {
      dom.page2.appendChild(dom.letterSheet);
      dom.letterSheet.classList.add('center-active');
    }, 400);

    // 3. เริ่มฟังก์ชันพิมพ์ดีดเมื่อกระดาษกางตัวเข้าที่
    setTimeout(() => {
      runTypewriter(config.letterText, 0, () => {
        dom.btnShowGift.classList.remove('hidden-element');
        dom.letterSheet.scrollTop = dom.letterSheet.scrollHeight;
      });
    }, 1200);

    dom.envelopeWrapper.removeEventListener('click', openSequence);
  });

  function runTypewriter(text, index, doneCallback) {
    if (index < text.length) {
      dom.typewriterText.textContent += text.charAt(index);

      triggerPhotoMilestones(index);

      // บังคับให้หน้ากระดาษ Auto-scroll ลงล่างตามความยาวตัวหนังสืออัตโนมัติ ไม่ให้ล้น
      dom.letterSheet.scrollTop = dom.letterSheet.scrollHeight;

      let nextCharSpeed = text.charAt(index) === '\n' ? 550 : 75;
      setTimeout(() => runTypewriter(text, index + 1, doneCallback), nextCharSpeed);
    } else {
      if (doneCallback) doneCallback();
    }
  }

  function triggerPhotoMilestones(index) {
    const polaroids = document.querySelectorAll('.polaroid');
    dom.photoGallery.classList.remove('hidden-gallery');

    if (index === 10) polaroids[0].classList.add('show');
    if (index === 40) polaroids[1].classList.add('show');
    if (index === 70) polaroids[2].classList.add('show');
    if (index === 100) polaroids[3].classList.add('show');
  }

  // --- ลอจิกกล่องของขวัญและ Confetti ระเบิด ---
  dom.btnShowGift.addEventListener('click', () => {
    dom.giftModal.classList.remove('hidden-modal');
    dom.giftBox.classList.add('bounce');
  });

  dom.giftBox.addEventListener('click', () => {
    dom.giftBox.classList.remove('bounce');
    dom.giftBox.classList.add('opened');

    burstIntensity = 12; // ระเบิดละอองอนุภาคฟุ้งกระจายเต็มจอ
    for (let i = 0; i < 80; i++) {
      let s = new InteractiveSparkle(window.innerWidth / 2, window.innerHeight / 2);
      s.vx = (Math.random() - 0.5) * 14;
      s.vy = (Math.random() - 0.7) * 16;
      s.color = ['#FFF066', '#FF8E53', '#FFFFFF'][Math.floor(Math.random() * 3)];
      sparkles.push(s);
    }

    setTimeout(() => {
      dom.giftReveal.classList.remove('hidden-element');
      dom.giftReveal.classList.add('reveal-active');
    }, 400);
  });
});
