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
