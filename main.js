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
