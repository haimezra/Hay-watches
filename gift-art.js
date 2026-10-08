/* HAY Watches — small SVG illustrations used inside the 3D gift box (homepage teaser + gifts.html). */
(function(){
  function esc(v){ return String(v).replace(/[^#a-zA-Z0-9(),.%\s-]/g,''); }

  // c: { cs: case colour, dial, band, mk: markers, hand, kind: 'strap'|'bracelet', shape: 'round'|'rect' }
  function watch(c){
    c = c || {};
    var cs = esc(c.cs||'#c9ccd2'), dial = esc(c.dial||'#101114'), band = esc(c.band||'#2a2118'),
        mk = esc(c.mk||'#e9e4f5'), hand = esc(c.hand||'#f1ecff'),
        kind = c.kind||'strap', rect = c.shape==='rect', i, a, o = '';
    var bw = rect ? 24 : 28, bx = 50 - bw/2, topEnd = rect ? 40 : 42, botStart = rect ? 90 : 88;
    if(kind==='bracelet'){
      o += '<rect x="'+bx+'" y="0" width="'+bw+'" height="'+(topEnd+4)+'" rx="3" fill="'+cs+'"/>'
         + '<rect x="'+bx+'" y="'+(botStart-4)+'" width="'+bw+'" height="'+(130-botStart+4)+'" rx="3" fill="'+cs+'"/>';
      for(i=4;i<topEnd;i+=7) o += '<line x1="'+bx+'" y1="'+i+'" x2="'+(bx+bw)+'" y2="'+i+'" stroke="rgba(0,0,0,.28)" stroke-width="1"/>';
      for(i=botStart+3;i<128;i+=7) o += '<line x1="'+bx+'" y1="'+i+'" x2="'+(bx+bw)+'" y2="'+i+'" stroke="rgba(0,0,0,.28)" stroke-width="1"/>';
      o += '<rect x="'+bx+'" y="0" width="'+(bw/2)+'" height="130" fill="rgba(255,255,255,.12)"/>';
    } else {
      o += '<rect x="'+bx+'" y="0" width="'+bw+'" height="'+topEnd+'" rx="6" fill="'+band+'"/>'
         + '<rect x="'+bx+'" y="'+botStart+'" width="'+bw+'" height="'+(130-botStart)+'" rx="6" fill="'+band+'"/>'
         + '<line x1="'+(bx+3)+'" y1="2" x2="'+(bx+3)+'" y2="'+(topEnd-4)+'" stroke="rgba(255,255,255,.25)" stroke-width=".8" stroke-dasharray="2 2"/>'
         + '<line x1="'+(bx+bw-3)+'" y1="2" x2="'+(bx+bw-3)+'" y2="'+(topEnd-4)+'" stroke="rgba(255,255,255,.25)" stroke-width=".8" stroke-dasharray="2 2"/>'
         + '<line x1="'+(bx+3)+'" y1="'+(botStart+4)+'" x2="'+(bx+3)+'" y2="128" stroke="rgba(255,255,255,.25)" stroke-width=".8" stroke-dasharray="2 2"/>'
         + '<line x1="'+(bx+bw-3)+'" y1="'+(botStart+4)+'" x2="'+(bx+bw-3)+'" y2="128" stroke="rgba(255,255,255,.25)" stroke-width=".8" stroke-dasharray="2 2"/>';
    }
    if(rect){
      o += '<rect x="73" y="59" width="6" height="12" rx="2" fill="'+cs+'"/>'
         + '<rect x="25" y="35" width="50" height="60" rx="8" fill="'+cs+'"/>'
         + '<rect x="25" y="35" width="50" height="60" rx="8" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>'
         + '<rect x="31" y="41" width="38" height="48" rx="3" fill="'+dial+'"/>';
      var rm = [[50,45,50,48],[50,82,50,85],[35,65,38,65],[62,65,65,65]];
      for(i=0;i<rm.length;i++) o += '<line x1="'+rm[i][0]+'" y1="'+rm[i][1]+'" x2="'+rm[i][2]+'" y2="'+rm[i][3]+'" stroke="'+mk+'" stroke-width="1.6"/>';
    } else {
      o += '<rect x="79" y="60" width="6" height="10" rx="2" fill="'+cs+'"/>'
         + '<circle cx="50" cy="65" r="32" fill="'+cs+'"/>'
         + '<circle cx="50" cy="65" r="32" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>'
         + '<circle cx="50" cy="65" r="27" fill="'+dial+'"/>';
      for(i=0;i<12;i++){
        a = i*30*Math.PI/180;
        var r1 = 22, r2 = i%3 ? 24 : 20;
        o += '<line x1="'+(50+Math.sin(a)*r1).toFixed(1)+'" y1="'+(65-Math.cos(a)*r1).toFixed(1)+'" x2="'+(50+Math.sin(a)*r2).toFixed(1)+'" y2="'+(65-Math.cos(a)*r2).toFixed(1)+'" stroke="'+mk+'" stroke-width="1.4"/>';
      }
    }
    o += '<line x1="50" y1="65" x2="50" y2="48" stroke="'+hand+'" stroke-width="2" stroke-linecap="round"/>'
       + '<line x1="50" y1="65" x2="61" y2="70" stroke="'+hand+'" stroke-width="1.6" stroke-linecap="round"/>'
       + '<circle cx="50" cy="65" r="2" fill="'+hand+'"/>';
    return '<svg viewBox="0 0 100 130" aria-hidden="true">'+o+'</svg>';
  }

  // Leather watch box (acc-1)
  function box(col){
    col = esc(col||'#2c2c32');
    return '<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="6" y="34" width="88" height="42" rx="5" fill="'+col+'"/>'
      + '<rect x="6" y="18" width="88" height="22" rx="5" fill="'+col+'" stroke="#9B6EF3" stroke-width="1"/>'
      + '<rect x="6" y="18" width="88" height="22" rx="5" fill="rgba(255,255,255,.07)"/>'
      + '<rect x="43" y="33" width="14" height="9" rx="2" fill="#9B6EF3"/></svg>';
  }

  // Three-watch display stand (acc-2)
  function stand(col){
    col = esc(col||'#6d4527');
    return '<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="6" y="46" width="88" height="26" rx="4" fill="'+col+'"/>'
      + '<rect x="6" y="46" width="88" height="8" rx="4" fill="rgba(255,255,255,.12)"/>'
      + '<rect x="14" y="26" width="20" height="26" rx="9" fill="#d9d4e4"/><rect x="40" y="26" width="20" height="26" rx="9" fill="#d9d4e4"/><rect x="66" y="26" width="20" height="26" rx="9" fill="#d9d4e4"/>'
      + '<path d="M24 26v-8M50 26v-8M76 26v-8" stroke="rgba(255,255,255,.25)" stroke-width="1.4"/></svg>';
  }

  // Care kit (acc-3)
  function care(col){
    col = esc(col||'#8fa3b8');
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="52" width="52" height="38" rx="4" fill="#d9d4e4"/>'
      + '<path d="M14 62h52M14 72h52" stroke="#b9b2cc" stroke-width="1.2"/>'
      + '<rect x="66" y="26" width="20" height="64" rx="5" fill="'+col+'"/><rect x="70" y="14" width="12" height="14" rx="2" fill="#2a2a34"/>'
      + '<rect x="66" y="48" width="20" height="14" fill="rgba(0,0,0,.25)"/></svg>';
  }

  // Rolled leather strap (strap-1 / strap-2)
  function strap(col){
    col = esc(col||'#5b3a2f');
    return '<svg viewBox="0 0 100 76" aria-hidden="true"><ellipse cx="50" cy="40" rx="38" ry="26" fill="none" stroke="'+col+'" stroke-width="14"/>'
      + '<ellipse cx="50" cy="40" rx="38" ry="26" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1" stroke-dasharray="3 3"/>'
      + '<ellipse cx="50" cy="40" rx="38" ry="26" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="14"/>'
      + '<rect x="78" y="22" width="14" height="14" rx="2" fill="none" stroke="#c9ccd2" stroke-width="2.2"/><line x1="85" y1="22" x2="85" y2="36" stroke="#c9ccd2" stroke-width="1.8"/></svg>';
  }

  window.GiftArt = { watch: watch, box: box, stand: stand, care: care, strap: strap };
})();
