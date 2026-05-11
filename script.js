/* DesiFit Method — Interactions */

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// --- Reveal-on-scroll animations ---
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// --- Pricing toggle (monthly / annual) ---
const monthlyBtn = document.getElementById('billingMonthly');
const annualBtn  = document.getElementById('billingAnnual');

function setBilling(period) {
  if (!monthlyBtn || !annualBtn) return;

  const isAnnual = period === 'annual';
  monthlyBtn.classList.toggle('active', !isAnnual);
  annualBtn.classList.toggle('active', isAnnual);
  monthlyBtn.setAttribute('aria-selected', String(!isAnnual));
  annualBtn.setAttribute('aria-selected', String(isAnnual));

  document.querySelectorAll('.amount[data-monthly]').forEach(el => {
    el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
  });

  document.querySelectorAll('.price-note[data-monthly]').forEach(el => {
    el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
  });
}

if (monthlyBtn && annualBtn) {
  monthlyBtn.addEventListener('click', () => setBilling('monthly'));
  annualBtn.addEventListener('click', () => setBilling('annual'));
}

// --- Starter Kit modal ---
const STARTER_KIT_URL = 'assets/DesiFit%20Method/DesiFit%20Starter%20Kit.docx';

function buildStarterModal() {
  if (document.getElementById('starterModal')) return;
  const wrapper = document.createElement('div');
  wrapper.id = 'starterModal';
  wrapper.className = 'modal-overlay';
  wrapper.setAttribute('role', 'dialog');
  wrapper.setAttribute('aria-modal', 'true');
  wrapper.setAttribute('aria-labelledby', 'starterModalTitle');
  wrapper.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" aria-label="Close" data-close>&times;</button>
      <div data-modal-step="form">
        <span class="modal-eyebrow">Free Starter Kit</span>
        <h3 id="starterModalTitle">Get the DesiFit Starter Kit.</h3>
        <p class="modal-sub">Where should I send Desi tips, recipes, and the kit itself? No spam, unsubscribe anytime.</p>
        <form class="modal-form" id="starterForm" novalidate>
          <input type="text" name="name" placeholder="First name" autocomplete="given-name" required />
          <input type="email" name="email" placeholder="your@email.com" autocomplete="email" required />
          <button type="submit" class="btn btn-primary btn-block">Send me the kit</button>
        </form>
        <button class="modal-skip" data-skip>Skip and just download</button>
      </div>
      <div data-modal-step="success" style="display:none;">
        <div class="modal-success">
          <div class="check-circle">✓</div>
          <h3>Your kit is ready.</h3>
          <p>Download should start automatically. If it doesn't, tap the button below.</p>
          <a href="${STARTER_KIT_URL}" download class="btn btn-primary">Download Starter Kit</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  wrapper.addEventListener('click', (e) => {
    if (e.target === wrapper || e.target.matches('[data-close]')) closeStarterModal();
  });

  const skipBtn = wrapper.querySelector('[data-skip]');
  if (skipBtn) skipBtn.addEventListener('click', () => {
    triggerStarterDownload();
    showStarterSuccess();
  });

  const form = wrapper.querySelector('#starterForm');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      form.querySelectorAll('input').forEach(el => {
        if (!el.value || !el.checkValidity()) el.style.borderColor = '#B91C1C';
      });
      return;
    }
    notifyOwner(name, email);
    triggerStarterDownload();
    showStarterSuccess();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('open')) closeStarterModal();
  });
}

function notifyOwner(name, email) {
  const subject = encodeURIComponent('New DesiFit Starter Kit lead');
  const body = encodeURIComponent(
    `New Starter Kit download:\n\nName: ${name}\nEmail: ${email}\nTime: ${new Date().toLocaleString()}\n`
  );
  const link = document.createElement('a');
  link.href = `mailto:arjpras.12@gmail.com?subject=${subject}&body=${body}`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  try {
    const leads = JSON.parse(localStorage.getItem('desifit_leads') || '[]');
    leads.push({ name, email, ts: Date.now() });
    localStorage.setItem('desifit_leads', JSON.stringify(leads));
  } catch (_) { /* storage unavailable */ }
}

function triggerStarterDownload() {
  const a = document.createElement('a');
  a.href = STARTER_KIT_URL;
  a.download = 'DesiFit Starter Kit.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function showStarterSuccess() {
  const wrapper = document.getElementById('starterModal');
  wrapper.querySelector('[data-modal-step="form"]').style.display = 'none';
  wrapper.querySelector('[data-modal-step="success"]').style.display = 'block';
}

function openStarterModal() {
  buildStarterModal();
  const wrapper = document.getElementById('starterModal');
  wrapper.querySelector('[data-modal-step="form"]').style.display = 'block';
  wrapper.querySelector('[data-modal-step="success"]').style.display = 'none';
  wrapper.querySelectorAll('input').forEach(el => { el.value = ''; el.style.borderColor = ''; });
  wrapper.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const firstInput = wrapper.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeStarterModal() {
  const wrapper = document.getElementById('starterModal');
  if (!wrapper) return;
  wrapper.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.js-starter-kit');
  if (trigger) {
    e.preventDefault();
    openStarterModal();
  }
});

// --- Newsletter form (no backend; just feedback) ---
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn = newsletterForm.querySelector('button');
    if (!input.value || !input.checkValidity()) {
      input.style.outline = '2px solid #B91C1C';
      return;
    }
    input.style.outline = '';
    btn.textContent = 'Subscribed ✓';
    btn.disabled = true;
    btn.style.background = 'var(--color-success)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  });
}
