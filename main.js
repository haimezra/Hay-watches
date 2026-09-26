// Language toggle (shared across all pages)
function toggleLang(){
  const body = document.body;
  const en = body.classList.toggle('en-mode');
  document.documentElement.lang = en ? 'en' : 'he';
  document.documentElement.dir = en ? 'ltr' : 'rtl';
  const btn = document.getElementById('langBtn');
  if(btn) btn.textContent = en ? 'עב' : 'EN';
  try{ localStorage.setItem('hay_lang', en ? 'en' : 'he'); }catch(e){}
}
(function(){
  try{
    if(localStorage.getItem('hay_lang') === 'en'){
      document.addEventListener('DOMContentLoaded', function(){
        if(!document.body.classList.contains('en-mode')) toggleLang();
      });
    }
  }catch(e){}
})();

function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}

// ===== Local product photo storage (per device/browser) =====
// Photos added this way are stored only in the browser they were added from.
const PHOTO_KEY_PREFIX = 'hay_photos:';

function getProductPhotos(productId){
  try{
    const raw = localStorage.getItem(PHOTO_KEY_PREFIX + productId);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

function saveProductPhotos(productId, photosArr){
  try{
    localStorage.setItem(PHOTO_KEY_PREFIX + productId, JSON.stringify(photosArr));
    return true;
  }catch(e){
    alert('שגיאה בשמירת התמונה (ייתכן שנגמר מקום אחסון בדפדפן).');
    return false;
  }
}

function deleteProductPhoto(productId, index){
  const photos = getProductPhotos(productId);
  photos.splice(index, 1);
  saveProductPhotos(productId, photos);
}

// Resize + compress an image File to a data URL before storing
function resizeImageFile(file, maxDim, quality){
  maxDim = maxDim || 1000;
  quality = quality || 0.82;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if(width > height && width > maxDim){ height = Math.round(height * maxDim / width); width = maxDim; }
        else if(height > maxDim){ width = Math.round(width * maxDim / height); height = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Best available image for a product: a locally-added photo first, then the catalog default.
function bestProductImg(p){
  const local = getProductPhotos(p.id);
  if(local.length) return local[0];
  return p.img || null;
}

function toggleMobileMenu(){
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('mobileMenuBtn');
  if(!nav) return;
  const open = nav.classList.toggle('open');
  if(btn) btn.textContent = open ? '✕' : '☰';
}
