// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

// Contact form (Web3Forms). Messages are emailed to the address tied to the access key.
const form = document.querySelector('#contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const key = data.get('access_key') || '';

    // Until the access key is added, fall back to opening the visitor's email app.
    if (key.includes('PASTE')) {
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || ''}\nInterested in: ${data.get('service')}\n\n${data.get('message')}`;
      window.location.href = `mailto:SuzanneKovi@comcast.net?subject=${encodeURIComponent('Website inquiry: ' + data.get('service'))}&body=${encodeURIComponent(body)}`;
      return;
    }

    status.className = 'form-status';
    status.textContent = 'Sending…';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      });
      const json = await res.json();
      if (json.success) {
        form.reset();
        status.className = 'form-status ok';
        status.textContent = "Thank you! Your message is on its way. Suzanne will be in touch soon.";
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = 'Something went wrong. Please email SuzanneKovi@comcast.net or call 561-408-7257.';
    }
  });
}
