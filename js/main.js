// ============================================================
//  CEF$! — MAIN JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------
  //  1. CANVAS PARTICLE BACKGROUND
  // --------------------------------------------------------
  const canvas  = document.getElementById('bg-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H, particles = [], lines = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.size   = Math.random() * 1.5 + 0.3;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color  = Math.random() > 0.5 ? '#ff2d78' : '#39ff14';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Grid lines
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.lineWidth = 1;
    const gap = 80;
    for (let x = 0; x < W; x += gap) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  function initParticles() {
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  initParticles();

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  // --------------------------------------------------------
  //  2. NAVBAR SCROLL
  // --------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --------------------------------------------------------
  //  3. MOBILE BURGER MENU
  // --------------------------------------------------------
  const burger    = document.getElementById('burger');
  const navLinks  = document.querySelector('.nav-links');

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // --------------------------------------------------------
  //  4. HERO ANIMATIONS (entrance)
  // --------------------------------------------------------
  const heroLabel  = document.querySelector('.hero-label');
  const heroName   = document.querySelector('.hero-name');
  const heroBadge  = document.querySelector('.hero-ep-badge');
  const heroCtas   = document.querySelector('.hero-ctas');

  setTimeout(() => { heroLabel.style.opacity = '1'; heroLabel.style.transform = 'none'; }, 300);
  setTimeout(() => { heroName.style.opacity = '1'; }, 600);
  setTimeout(() => { heroBadge.style.opacity = '1'; heroBadge.style.transform = 'none'; }, 900);
  setTimeout(() => { heroCtas.style.opacity = '1'; heroCtas.style.transform = 'none'; startTypewriter(); }, 1200);

  // --------------------------------------------------------
  //  5. TYPEWRITER
  // --------------------------------------------------------
  const typeEl  = document.getElementById('typewriter');
  const lines2  = SITE_CONFIG.taglines;
  let lineIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let tw;

  function startTypewriter() {
    function tick() {
      const current = lines2[lineIdx];
      if (!deleting) {
        typeEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          tw = setTimeout(tick, 2400);
          return;
        }
      } else {
        typeEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          lineIdx  = (lineIdx + 1) % lines2.length;
        }
      }
      tw = setTimeout(tick, deleting ? 40 : 75);
    }
    tick();
  }

  // --------------------------------------------------------
  //  6. SCROLL REVEAL (Intersection Observer)
  // --------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  // --------------------------------------------------------
  //  7. TRACKLIST EP (from config)
  // --------------------------------------------------------
  const tracklistEl = document.getElementById('tracklist');

  if (SITE_CONFIG.tracklist && SITE_CONFIG.tracklist.length) {
    tracklistEl.innerHTML = '';
    SITE_CONFIG.tracklist.forEach(t => {
      const div = document.createElement('div');
      div.className = 'track-item reveal-up';
      div.innerHTML = `
        <span class="track-num">${t.number}</span>
        <span class="track-title">${t.title}${t.feat ? `<span class="track-feat"> ft. ${t.feat}</span>` : ''}</span>
        <span class="track-duration">${t.duration}</span>
      `;
      tracklistEl.appendChild(div);
    });
    // Re-observe new elements
    tracklistEl.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
  }

  // --------------------------------------------------------
  //  8. SOCIAL LINKS IN FOOTER
  // --------------------------------------------------------
  const footerLinks = document.querySelector('.footer-links');
  const socials     = SITE_CONFIG.socials || {};

  if (socials.instagram) {
    const a = document.createElement('a');
    a.href = socials.instagram;
    a.target = '_blank';
    a.textContent = 'Instagram';
    footerLinks.appendChild(a);
  }
  if (socials.youtube) {
    const a = document.createElement('a');
    a.href = socials.youtube;
    a.target = '_blank';
    a.textContent = 'YouTube';
    footerLinks.appendChild(a);
  }
  if (socials.spotify) {
    const a = document.createElement('a');
    a.href = socials.spotify;
    a.target = '_blank';
    a.textContent = 'Spotify';
    footerLinks.appendChild(a);
  }

  // --------------------------------------------------------
  //  9. VISUALIZER BARS (idle + active)
  // --------------------------------------------------------
  const vizBars = document.querySelector('.viz-bars');
  const BAR_COUNT = 48;

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    const maxH = Math.floor(Math.random() * 40 + 8);
    bar.style.setProperty('--max-h', maxH + 'px');
    bar.style.setProperty('--delay', (Math.random() * 1.5 + 0.3) + 's');
    bar.style.height = '4px';
    vizBars.appendChild(bar);
  }

  // --------------------------------------------------------
  //  10. LOCAL AUDIO PLAYER
  // --------------------------------------------------------
  const audio        = document.getElementById('audio-element');
  const playBtn      = document.getElementById('play-btn');
  const playIcon     = document.getElementById('play-icon');
  const pauseIcon    = document.getElementById('pause-icon');
  const prevBtn      = document.getElementById('prev-btn');
  const nextBtn      = document.getElementById('next-btn');
  const progressBar  = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const progressThumb= document.getElementById('progress-thumb');
  const timeCurrent  = document.getElementById('time-current');
  const timeTotal    = document.getElementById('time-total');
  const volumeSlider = document.getElementById('volume');
  const nowPlaying   = document.getElementById('now-playing');
  const localList    = document.getElementById('local-tracklist');

  const tracks   = SITE_CONFIG.audioTracks || [];
  let currentIdx = 0;
  let isPlaying  = false;
  let vizInterval;

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // Build local tracklist UI
  if (tracks.length > 0) {
    localList.innerHTML = '';
    tracks.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'local-track';
      row.dataset.index = i;
      row.innerHTML = `
        <span class="lt-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="lt-title">${t.title}</span>
        <svg class="lt-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
      `;
      row.addEventListener('click', () => loadTrack(i, true));
      localList.appendChild(row);
    });
  }

  function loadTrack(idx, autoplay = false) {
    if (!tracks.length) return;
    currentIdx = idx;
    const t = tracks[idx];
    audio.src = t.src || t.file || '';
    nowPlaying.textContent = t.title;

    // Highlight active track
    document.querySelectorAll('.local-track').forEach((row, i) => {
      row.classList.toggle('playing', i === idx);
    });

    if (autoplay) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function setPlaying(state) {
    isPlaying = state;
    playIcon.style.display  = state ? 'none' : 'block';
    pauseIcon.style.display = state ? 'block' : 'none';

    const bars = document.querySelectorAll('.viz-bar');
    if (state) {
      bars.forEach(b => b.classList.add('active'));
      startVizAnimation(bars);
    } else {
      bars.forEach(b => { b.classList.remove('active'); b.style.height = '4px'; });
      clearInterval(vizInterval);
    }
  }

  function startVizAnimation(bars) {
    clearInterval(vizInterval);
    vizInterval = setInterval(() => {
      bars.forEach(b => {
        const h = Math.floor(Math.random() * 50 + 4);
        b.style.height = h + 'px';
      });
    }, 100);
  }

  playBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    if (!audio.src) loadTrack(0);
    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  });

  prevBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    const idx = (currentIdx - 1 + tracks.length) % tracks.length;
    loadTrack(idx, isPlaying);
  });

  nextBtn.addEventListener('click', () => {
    if (!tracks.length) return;
    const idx = (currentIdx + 1) % tracks.length;
    loadTrack(idx, isPlaying);
  });

  audio.addEventListener('ended', () => {
    const idx = (currentIdx + 1) % tracks.length;
    loadTrack(idx, true);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width  = pct + '%';
    progressThumb.style.left  = pct + '%';
    timeCurrent.textContent   = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  progressBar.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
  });

  audio.volume = parseFloat(volumeSlider.value);

  // --------------------------------------------------------
  //  11. GALLERY
  // --------------------------------------------------------
  const galleryGrid = document.getElementById('gallery-grid');
  const photos      = SITE_CONFIG.photos || [];
  let photoOpenIdx  = 0;

  if (photos.length > 0) {
    galleryGrid.innerHTML = '';
    photos.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item reveal-up';
      item.innerHTML = `
        <img src="${p.src}" alt="${p.alt || 'CEF$!'}" loading="lazy" />
        <div class="gallery-item-overlay">
          <span class="gallery-item-label">${p.alt || ''}</span>
        </div>
      `;
      item.addEventListener('click', () => openLightbox(i));
      galleryGrid.appendChild(item);
      observer.observe(item);
    });
  }

  // LIGHTBOX
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev  = document.getElementById('lightbox-prev');
  const lightboxNext  = document.getElementById('lightbox-next');

  function openLightbox(idx) {
    if (!photos.length) return;
    photoOpenIdx = idx;
    lightboxImg.src = photos[idx].src;
    lightboxImg.alt = photos[idx].alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  lightboxPrev.addEventListener('click', () => {
    openLightbox((photoOpenIdx - 1 + photos.length) % photos.length);
  });

  lightboxNext.addEventListener('click', () => {
    openLightbox((photoOpenIdx + 1) % photos.length);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lightboxPrev.click();
    if (e.key === 'ArrowRight')  lightboxNext.click();
  });

  // --------------------------------------------------------
  //  12. VIDEOS
  // --------------------------------------------------------
  const videosGrid = document.getElementById('videos-grid');
  const videos     = SITE_CONFIG.videos || [];

  if (videos.length > 0) {
    videosGrid.innerHTML = '';
    videos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card reveal-up';

      if (v.type === 'youtube') {
        card.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${v.id}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
          <span class="video-title">${v.title || ''}</span>
        `;
      } else {
        card.innerHTML = `
          <video controls preload="metadata" ${v.poster ? `poster="${v.poster}"` : ''}>
            <source src="${v.src}" type="video/mp4" />
          </video>
          <span class="video-title">${v.title || ''}</span>
        `;
      }

      videosGrid.appendChild(card);
      observer.observe(card);
    });
  }

  // --------------------------------------------------------
  //  13. EP COVER PLACEHOLDER (always show if no image)
  // --------------------------------------------------------
  const epImg = document.querySelector('.ep-cover-inner img');
  if (epImg) {
    const placeholder = document.querySelector('.ep-cover-placeholder');
    epImg.addEventListener('error', () => {
      placeholder.style.display = 'flex';
    });
    // If src is empty or default
    if (!epImg.src || epImg.src.endsWith('ep-cover.jpg')) {
      const testImg = new Image();
      testImg.onerror = () => { placeholder.style.display = 'flex'; };
      testImg.src = epImg.src;
    }
  }

});
