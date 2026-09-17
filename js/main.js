/* ==========================================================================
   MATCHA JAPANESE GARDEN WEDDING INVITATION - MAIN APPLICATION LOGIC
   ========================================================================== */

function initApp() {
  const preloader = document.getElementById('preloader');
  const coverModal = document.getElementById('cover-modal');
  const btnOpen = document.getElementById('btn-open-invitation');
  const mainNavbar = document.getElementById('main-navbar');
  const audioControl = document.getElementById('audio-control');
  const bgAudio = document.getElementById('bg-audio');
  
  let isAudioPlaying = false;
  
  // DYNAMIC GUEST NAME URL PARAMETER PARSER (?to=Nama or ?nama=Nama)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('nama');
  const guestDisplay = document.getElementById('guest-name-display');
  if (guestName && guestDisplay) {
    guestDisplay.innerText = decodeURIComponent(guestName);
  }

  // Lock body scroll initially
  document.body.classList.add('invitation-locked');
  
  // 3D PARALLAX SCENERY INTERACTION FOR OPENING COVER
  const flowerTop = document.querySelector('.cover-flower-top');
  const flowerBottom = document.querySelector('.cover-flower-bottom');
  const coverCard = document.querySelector('.cover-card');

  if (coverModal) {
    coverModal.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;

      if (flowerTop) {
        flowerTop.style.transform = `translate(${moveX * 18}px, ${moveY * 18}px)`;
      }
      if (flowerBottom) {
        flowerBottom.style.transform = `translate(${moveX * -22}px, ${moveY * -22}px)`;
      }
      if (coverCard) {
        coverCard.style.transform = `perspective(1000px) rotateY(${moveX * 5}deg) rotateX(${moveY * -5}deg)`;
      }
    });

    coverModal.addEventListener('mouseleave', () => {
      if (flowerTop) flowerTop.style.transform = 'none';
      if (flowerBottom) flowerBottom.style.transform = 'none';
      if (coverCard) coverCard.style.transform = 'none';
    });
  }

  // GLOBAL WINDOW MOUSE PARALLAX FOR AMBIENT BACKGROUND BLOBS
  const ambientBlobs = document.querySelectorAll('.ambient-blob');
  if (ambientBlobs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      ambientBlobs.forEach((blob, index) => {
        const factor = (index + 1) * 12;
        const dir = index % 2 === 0 ? 1 : -1;
        blob.style.transform = `translate3d(${deltaX * factor * dir}px, ${deltaY * factor * dir}px, 0)`;
      });
    });
  }
  
  // OPEN INVITATION BUTTON TRIGGER (TRIGGERS 4-SECOND LOADING ANIMATION)
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // 1. Activate 4-Second Loading Screen
      if (preloader) {
        preloader.classList.remove('fade-out');
        // Reset progress bar animation
        const bar = preloader.querySelector('.preloader-bar');
        if (bar) {
          bar.style.animation = 'none';
          void bar.offsetWidth; // Trigger DOM reflow
          bar.style.animation = null;
        }
        preloader.classList.add('active');
      }

      // Pre-buffer / Start Audio
      playAudio();

      // 2. Wait exactly 2.5 seconds (2500ms) for loading animation to complete
      setTimeout(() => {
        // Fade out preloader
        if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(() => {
            preloader.classList.remove('active');
          }, 600);
        }

        // Open Cover Modal & unlock page
        coverModal.classList.add('opened');
        document.body.classList.remove('invitation-locked');
        
        // Reveal Navbar & Audio Control
        mainNavbar.classList.add('visible');
        audioControl.classList.add('visible');
        
        // Smooth scroll to home section
        setTimeout(() => {
          const homeSection = document.getElementById('home');
          if (homeSection) {
            homeSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }, 2500);
    });
  }
  
  // AUDIO CONTROLLER LOGIC
  function playAudio() {
    if (bgAudio) {
      if (!bgAudio.src) {
        bgAudio.src = 'assets/audio/music.mp3';
      }
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        audioControl.classList.remove('paused');
      }).catch(err => {
        console.log("Autoplay prevented or custom sound synthesis used:", err);
        startSynthesizedThemeMusic();
        isAudioPlaying = true;
        audioControl.classList.remove('paused');
      });
    } else {
      startSynthesizedThemeMusic();
      isAudioPlaying = true;
      audioControl.classList.remove('paused');
    }
  }
  
  function pauseAudio() {
    if (bgAudio) {
      bgAudio.pause();
    }
    stopSynthesizedThemeMusic();
    isAudioPlaying = false;
    audioControl.classList.add('paused');
  }
  
  if (audioControl) {
    audioControl.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
  
  // INTERSECTION OBSERVER FOR BUTTERY-SMOOTH SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-zoom, .reveal-flip');
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  // SCROLL READING PROGRESS BAR & SCROLLPARALLAX
  const progressBar = document.getElementById('scroll-progress-bar');
  const parallaxFlowers = document.querySelectorAll('.cover-flower-top, .cover-flower-bottom');

  window.addEventListener('scroll', () => {
    // 1. Reading Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // 2. Parallax Flower Translation
    const scrollY = window.scrollY;
    parallaxFlowers.forEach((flower, idx) => {
      const speed = (idx + 1) * 0.12;
      flower.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });

    // 3. SCROLLSPY FOR NAVBAR ACTIVE LINKS
    let currentSectionId = '';
    const scrollPosition = scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------------------------------
   WEB AUDIO API ROMANTIC JAPANESE HARP / KOTO MELODY SYNTHESIZER (FALLBACK)
   Guarantees elegant music plays without relying on external media server!
   -------------------------------------------------------------------------- */
let audioCtx = null;
let synthTimer = null;

function startSynthesizedThemeMusic() {
  if (synthTimer) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  } catch (e) {
    return;
  }
  
  // Pentatonic Japanese Sakura scale (D, F, G, A, A#, D)
  const notes = [293.66, 349.23, 392.00, 440.00, 466.16, 587.33, 698.46];
  let step = 0;
  
  synthTimer = setInterval(() => {
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    
    const freq = notes[step % notes.length];
    playPluckedNote(freq);
    step++;
  }, 1200);
}

function stopSynthesizedThemeMusic() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
}

function playPluckedNote(frequency) {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  // Envelope
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 1.8);
}

/* --------------------------------------------------------------------------
   TOAST NOTIFICATION HELPERS
   -------------------------------------------------------------------------- */

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
