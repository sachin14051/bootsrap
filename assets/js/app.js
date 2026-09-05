/* ==========================================================================
   RajGan Group - IT Company Interactive WebGL & Form API Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  init3DBackground();
  init3DTilt();
  initCounterAnimations();
  initModalManager();
  initPortfolioFilter();
  initServiceTabs();
  initFormSubmissions();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation Menu Drawer Controller
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-item');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   2. Three.js / Canvas 3D Tech Background Engine
   -------------------------------------------------------------------------- */
function init3DBackground() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas) return;

  if (typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = window.innerWidth < 768 ? 700 : 1400;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const c1 = new THREE.Color('#6366f1');
    const c2 = new THREE.Color('#06b6d4');
    const c3 = new THREE.Color('#10b981');

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 4.5 + Math.random() * 8.5;

      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);

      let mixColor = c1;
      if (i % 3 === 0) mixColor = c1;
      else if (i % 3 === 1) mixColor = c2;
      else mixColor = c3;

      colorArray[i] = mixColor.r;
      colorArray[i + 1] = mixColor.g;
      colorArray[i + 2] = mixColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.06 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 10;

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - halfX) * 0.0005;
      mouseY = (e.clientY - halfY) * 0.0005;
    });

    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - halfX) * 0.0005;
        mouseY = (e.touches[0].clientY - halfY) * 0.0005;
      }
    }, { passive: true });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = elapsedTime * 0.02;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particlesMesh.rotation.y += targetX;
      particlesMesh.rotation.x += targetY;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}

/* --------------------------------------------------------------------------
   3. 3D Card Tilt Interaction
   -------------------------------------------------------------------------- */
function init3DTilt() {
  if (window.innerWidth < 991) return;

  const cards = document.querySelectorAll('.glass-card, .tech-card, .process-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Animated Counter Stats
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  function checkScroll() {
    if (animated) return;
    const triggerBottom = window.innerHeight * 0.9;

    counters.forEach(counter => {
      const top = counter.getBoundingClientRect().top;
      if (top < triggerBottom) {
        animated = true;
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = Math.max(1, target / 35);

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = Math.ceil(count) + suffix;
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target + suffix;
          }
        };
        updateCount();
      }
    });
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* --------------------------------------------------------------------------
   5. Modal Manager for Consultation & Quotes
   -------------------------------------------------------------------------- */
function initModalManager() {
  const modal = document.getElementById('consultationModal');
  const openBtns = document.querySelectorAll('.trigger-consultation-modal');
  const closeBtn = document.querySelector('.modal-close');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   6. Portfolio Category Filter
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('btn-primary-glow'));
      filterBtns.forEach(b => b.classList.add('btn-outline-glass'));
      btn.classList.remove('btn-outline-glass');
      btn.classList.add('btn-primary-glow');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Service Detail Tabs
   -------------------------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const tabPanes = document.querySelectorAll('.service-tab-pane');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active', 'btn-primary-glow'));
      tabBtns.forEach(b => b.classList.add('btn-outline-glass'));
      btn.classList.remove('btn-outline-glass');
      btn.classList.add('active', 'btn-primary-glow');

      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Form Submissions - Sends ALL Input Values to support@rajgan.in & CC to sachin14051@gmail.com
   -------------------------------------------------------------------------- */
function initFormSubmissions() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending All Form Values to support@rajgan.in...';

      const formData = new FormData(form);
      const payload = {
        _subject: "New Website Quote Inquiry - All Values Captured",
        _replyto: formData.get("email") || "",
        _cc: "sachin14051@gmail.com",
        _captcha: "false"
      };

      formData.forEach((value, key) => {
        if (!key.startsWith('_')) {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          payload[formattedKey] = value;
        }
      });

      fetch('https://formsubmit.co/ajax/support@rajgan.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i> Sent! All Form Values Emailed to support@rajgan.in';
        submitBtn.style.background = '#10b981';

        setTimeout(() => {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = '';
          const modal = document.getElementById('consultationModal');
          if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }, 3500);
      })
      .catch(err => {
        console.warn('Form submission AJAX fallback:', err);
        // Fallback: Submit form natively to FormSubmit
        form.action = "https://formsubmit.co/support@rajgan.in";
        form.method = "POST";
        form.submit();
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. Smooth Navigation Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
