/* ==========================================================================
   MATCHA JAPANESE GARDEN WEDDING INVITATION - RSVP & WISHES MANAGEMENT
   ========================================================================== */

const INITIAL_WISHES = [
  {
    name: "Kenji & Hana",
    status: "Joyfully Accept",
    message: "Selamat untuk Sadewa & Aruna! Semoga pernikahan kalian dipenuhi kebahagiaan, kedamaian, dan kehangatan selamanya.",
    time: "2 jam yang lalu"
  },
  {
    name: "Dr. Takeshi Yamamoto",
    status: "Joyfully Accept",
    message: "Wishing both of you a lifetime of love, contentment and harmony in this new Japanese garden of life. Omedetou gozaimasu!",
    time: "5 jam yang lalu"
  },
  {
    name: "Siti Nurhaliza & Family",
    status: "Joyfully Accept",
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat menempuh hidup baru sahabatku!",
    time: "1 hari yang lalu"
  }
];

function initRSVP() {
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesStream = document.getElementById('wishes-stream');
  
  if (!rsvpForm || !wishesStream) return;
  
  // Load wishes from localStorage or set initial
  let wishes = JSON.parse(localStorage.getItem('matcha_wedding_wishes'));
  if (!wishes || wishes.length === 0) {
    wishes = INITIAL_WISHES;
    localStorage.setItem('matcha_wedding_wishes', JSON.stringify(wishes));
  }
  
  renderWishes(wishes);
  
  // Form submission handler
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('rsvp-name').value.trim();
    const attendanceInput = document.getElementById('rsvp-attendance').value;
    const guestsInput = document.getElementById('rsvp-guests').value;
    const messageInput = document.getElementById('rsvp-message').value.trim();
    
    if (!nameInput || !messageInput) {
      showToast('Silakan lengkapi nama dan ucapan Anda.');
      return;
    }
    
    const newWish = {
      name: nameInput,
      status: attendanceInput === 'accept' ? 'Joyfully Accept' : 'Regretfully Decline',
      message: messageInput,
      time: 'Baru saja'
    };
    
    wishes.unshift(newWish);
    localStorage.setItem('matcha_wedding_wishes', JSON.stringify(wishes));
    
    renderWishes(wishes);
    rsvpForm.reset();
    showToast('Terima kasih! Ucapan & konfirmasi Anda telah terkirim.');
  });
}

function renderWishes(wishesList) {
  const wishesStream = document.getElementById('wishes-stream');
  if (!wishesStream) return;
  
  wishesStream.innerHTML = wishesList.map(w => `
    <div class="wish-item">
      <div class="wish-header">
        <span class="wish-author">${escapeHtml(w.name)}</span>
        <span class="wish-badge">${escapeHtml(w.status)}</span>
      </div>
      <p class="wish-text">"${escapeHtml(w.message)}"</p>
    </div>
  `).join('');
}

function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} (${text}) berhasil disalin!`);
  }).catch(() => {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast(`${label} berhasil disalin!`);
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
  }
  
  toast.innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initRSVP);
