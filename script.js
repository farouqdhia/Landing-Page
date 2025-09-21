(function(){
  // Helpers
  const qs = s => document.querySelector(s);
  const qsa = s => Array.from(document.querySelectorAll(s));

  // Elements
  const navLinks = qsa('.nav-link');
  const sections = qsa('main section');
  const mobileToggle = qs('#mobileToggle');
  const navLinksContainer = qs('#navLinks');
  const mobileNavPanelId = 'mobileNavPanel';
  const uploadBtn = qs('#uploadBtn');
  const changeImageBtn = qs('#changeImageBtn');
  const useUrlBtn = qs('#useUrlBtn');
  const imgInput = qs('#imgInput');
  const heroImg = qs('#heroImg');
  const heroPlaceholder = qs('#heroPlaceholder');
  const yearSpan = qs('#year');

  // Set current year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Smooth scroll for nav links
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').replace('#','');
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({behavior:'smooth', block:'start'});
      }
      // close mobile panel if open
      const mobilePanel = document.getElementById(mobileNavPanelId);
      if (mobilePanel) mobilePanel.remove();
    });
  });

  // Mobile toggle: show simple panel of nav links
  mobileToggle.addEventListener('click', () => {
    const existing = document.getElementById(mobileNavPanelId);
    if (existing) { existing.remove(); return; }

    const panel = document.createElement('div');
    panel.id = mobileNavPanelId;
    panel.className = 'mobile-nav-panel';
    // add copies of links for mobile
    navLinks.forEach(link => {
      const copy = link.cloneNode(true);
      // ensure click closes panel
      copy.addEventListener('click', () => panel.remove());
      panel.appendChild(copy);
    });
    document.body.appendChild(panel);
  });

  // Active nav on scroll (simple midpoint method)
  function updateActiveNav() {
    const mid = window.scrollY + window.innerHeight / 2;
    let activeId = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (mid >= top && mid < bottom) {
        activeId = sec.id;
      }
    });
    navLinks.forEach(a => {
      if (a.dataset.target === activeId) a.classList.add('active');
      else a.classList.remove('active');
    });
  }
  window.addEventListener('load', updateActiveNav);
  window.addEventListener('scroll', () => { window.requestAnimationFrame(updateActiveNav); });

  // Image upload handling
  function showPreviewFromDataURL(dataUrl) {
    heroImg.src = dataUrl;
    heroImg.style.display = 'block';
    heroPlaceholder.style.display = 'none';
  }

  imgInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File bukan gambar — pilih file gambar (jpg, png, webp, dll).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      showPreviewFromDataURL(ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Contact demo (no backend)
  const sendBtn = qs('#sendBtn');
  const clearBtn = qs('#clearBtn');
  const contactNotice = qs('#contactNotice');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name = qs('#cName').value.trim();
      const email = qs('#cEmail').value.trim();
      const msg = qs('#cMessage').value.trim();
      if (!name || !email || !msg) {
        contactNotice.textContent = 'Isi semua kolom sebelum mengirim.';
        return;
      }
      // simulate send
      contactNotice.style.color = 'var(--accent-2)';
      contactNotice.textContent = 'Pesan siap dikirim (demo). Anda dapat menghubungkan ke backend sesuai kebutuhan.';
      // optionally clear
      setTimeout(() => {
        contactNotice.style.color = 'var(--muted)';
      }, 3000);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      qs('#cName').value = '';
      qs('#cEmail').value = '';
      qs('#cMessage').value = '';
      contactNotice.textContent = '';
    });
  }

  // Accessibility: keyboard close mobile panel with Esc
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const mobilePanel = document.getElementById(mobileNavPanelId);
      if (mobilePanel) mobilePanel.remove();
    }
  });

})();