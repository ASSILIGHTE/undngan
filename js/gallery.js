/* ==========================================================================
   MATCHA JAPANESE GARDEN WEDDING INVITATION - LIGHTBOX GALLERY SCRIPT
   ========================================================================== */

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;
  
  // Create Lightbox DOM structure if not present
  let lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.innerHTML = `
      <div class="lightbox-content-wrapper">
        <span class="lightbox-close-btn">&times;</span>
        <div class="lightbox-nav-btn lightbox-nav-prev">&#10094;</div>
        <div class="lightbox-nav-btn lightbox-nav-next">&#10095;</div>
        <img class="lightbox-img" src="" alt="Gallery Preview" />
        <div class="lightbox-caption-text"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption-text');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-nav-prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav-next');
  
  let currentIndex = 0;
  const imagesData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-fullsrc') || item.querySelector('img').src,
    caption: item.querySelector('.gallery-caption')?.innerText || ''
  }));
  
  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
  }
  
  function updateLightbox() {
    const data = imagesData[currentIndex];
    lightboxImg.src = data.src;
    lightboxCaption.innerText = data.caption;
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
  }
  
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });
  
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + imagesData.length) % imagesData.length;
    updateLightbox();
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % imagesData.length;
    updateLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

document.addEventListener('DOMContentLoaded', initGalleryLightbox);
