/* HAY Watches — gift box builder (gifts.html).
   Catalogue data comes from data.js (PRODUCTS, GIFT_BOXES, WHATSAPP_NUMBER). Prices shown here are for display only:
   the server (api/checkout.js) recomputes everything from data.js before creating the payment link. */
(function(){
  var FREE_SHIPPING_OVER = 1500, SHIPPING_FEE = 45, NOTE_MAX = 60;
  var $ = function(id){ return document.getElementById(id); };
  var money = function(n){ return '₪' + Number(n).toLocaleString('he-IL'); };
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var byId = function(list, id){ for(var i=0;i<list.length;i++) if(list[i].id===id) return list[i]; return null; };
  var isAvail = function(p){ return p.sold !== true && p.available !== false; };

  /* How each watch is drawn inside the box (case / dial / strap colours matched to the product photos). */
  var LOOKS = {
    'men-6':   { cs:'#c9ccd2', dial:'#7fcab8', kind:'bracelet', mk:'#f4fbf8' },
    'men-7':   { cs:'#d4d7dc', dial:'#6cc4ea', kind:'bracelet', mk:'#f4fbff' },
    'men-10':  { cs:'#c7a85a', dial:'#caa447', band:'#16161a', mk:'#4a3b14', hand:'#2b2410' },
    'men-11':  { cs:'#c7a85a', dial:'#e4dece', band:'#16161a', mk:'#6a5a2a', hand:'#2b2410' },
    'men-13':  { cs:'#c7a85a', dial:'#ece6d6', band:'#5a1f2b', mk:'#6a5a2a', hand:'#2b2410' },
    'men-14':  { cs:'#dcdce2', dial:'#1b1b20', band:'#141418', mk:'#e8c93a', hand:'#e8c93a' },
    'men-17':  { cs:'#d1b45f', dial:'#d9c88a', band:'#16161a', mk:'#6a5a2a', hand:'#2b2410' },
    'men-18':  { cs:'#2d3a8c', dial:'#e8e4d6', band:'#27367e', mk:'#2d3a8c', hand:'#2d3a8c' },
    'women-1': { cs:'#cfd2d8', dial:'#efece4', band:'#b3142b', mk:'#3a3a44', hand:'#2a2a33' },
    'women-2': { cs:'#cfd2d8', dial:'#7a1f35', band:'#5a1426', mk:'#f1e6ea' },
    'women-3': { cs:'#c7a85a', dial:'#ece7dc', band:'#3a2a22', mk:'#5a4a22', hand:'#2b2410', shape:'rect' },
    'women-4': { cs:'#cfd2d8', dial:'#e8e1e4', kind:'bracelet', mk:'#8a6c75', hand:'#6a5058' },
    'women-5': { cs:'#d9a38c', dial:'#d7a088', kind:'bracelet', mk:'#7a4a3a', hand:'#5a3326' },
    'women-7': { cs:'#cfd2d8', dial:'#f2f2f4', band:'#121216', mk:'#1a1a22', hand:'#1a1a22', shape:'rect' }
  };
  var look = function(p){ return LOOKS[p.id] || { cs:'#c9ccd2', dial:'#16161c', band:'#2a2118' }; };

  var WATCHES = PRODUCTS.filter(function(p){ return (p.cat==='men'||p.cat==='women') && isAvail(p); });
  var STRAP_COLOR = function(c){ return (c.imgs && c.imgs.length>0) || c.available===true; };

  var CATS = [
    { id:'cases', title:'קופסאות ואחסון', lead:'לשמירה על השעון והצגתו', ids:['acc-1','acc-2'] },
    { id:'care',  title:'טיפוח וניקוי',    lead:'להחזיק את השעון במצב מושלם', ids:['acc-3'] },
    { id:'strap', title:'רצועות עור',      lead:'רצועה נוספת להחלפה', ids:['strap-1','strap-2'] }
  ].map(function(c){
    c.items = c.ids.map(function(id){ return byId(PRODUCTS,id); }).filter(function(p){ return p && isAvail(p); });
    return c;
  }).filter(function(c){ return c.items.length; });

  var ROSES = (typeof GIFT_EXTRAS !== 'undefined' ? GIFT_EXTRAS : []).filter(function(x){ return x.cat==='gift-extra'; });
  var STEPS = ['קופסה','שעון','ורדים','תוספות','סיכום'], LAST = STEPS.length - 1;
  var qs = new URLSearchParams(location.search);
  var pre = byId(WATCHES, qs.get('watch'));
  var S = { step:0, box:'matte', watch:pre?pre.id:null, filter:'all',
            rose:null, add:{ cases:null, care:null, strap:null },
            strap:{ color:null, length:'standard', size:20 }, note:'', closed:false };

  /* ---------- pricing ---------- */
  function addonItems(){
    var out = [], rs = S.rose && byId(ROSES,S.rose);
    if(rs) out.push(rs);
    CATS.forEach(function(c){ var id = S.add[c.id]; if(id){ var p = byId(PRODUCTS,id); if(p) out.push(p); } });
    return out;
  }
  function subtotal(){
    var t = byId(GIFT_BOXES,S.box).price;
    if(S.watch) t += byId(WATCHES,S.watch).price;
    addonItems().forEach(function(p){ t += p.price; });
    return t;
  }
  function shipping(){ return subtotal() >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE; }
  function strapColors(p){ return (p.colors||[]).filter(STRAP_COLOR); }
  function strapPick(){
    var id = S.add.strap; if(!id) return null;
    var p = byId(PRODUCTS,id), cols = strapColors(p);
    var c = byId(cols, S.strap.color) || cols[0];
    return c ? { p:p, c:c, l:byId(p.lengths,S.strap.length)||p.lengths[1], size:S.strap.size } : null;
  }

  /* ---------- 3D stage ---------- */
  var scene = $('gbScene'), stage = $('gbStage'), slots = {};
  function setSlot(name, key, html, style, cls){
    var el = slots[name];
    if(!key){ if(el){ el.remove(); delete slots[name]; } return; }
    if(el && el.dataset.k === key) return;
    if(el) el.remove();
    el = document.createElement('div');
    el.className = 'gbx-it ' + (cls||'');
    el.style.cssText = style; el.dataset.k = key;
    el.innerHTML = '<div class="in">' + html + '</div>';
    scene.appendChild(el); slots[name] = el;
  }
  function addonArt(p){
    if(p.id==='acc-1') return GiftArt.box('#2c2430');
    if(p.id==='acc-2') return GiftArt.stand('#6d4527');
    if(p.id==='acc-3') return GiftArt.care('#8fa3b8');
    return '';
  }
  function syncStage(){
    scene.dataset.box = S.box;
    var w = S.watch && byId(WATCHES,S.watch), lk = w && look(w);
    setSlot('ph', w?null:'ph', 'בחרו שעון', '--w:120px;--h:120px;--x:0px;--y:12px;--r:0deg', 'gb-ph flat');
    setSlot('watch', w&&(w.id), w?GiftArt.watch(lk):'', '--w:96px;--h:125px;--x:0px;--y:46px');
    var c = S.add.cases && byId(PRODUCTS,S.add.cases), k = S.add.care && byId(PRODUCTS,S.add.care), sp = strapPick();
    setSlot('cases', c&&c.id, c?addonArt(c):'', '--w:92px;--h:74px;--x:-88px;--y:-8px');
    setSlot('care',  k&&k.id, k?addonArt(k):'', '--w:76px;--h:76px;--x:92px;--y:-6px');
    setRoses(S.rose);
    setSlot('strap', sp&&(sp.p.id+sp.c.id), sp?GiftArt.strap(sp.c.hex):'', '--w:96px;--h:70px;--x:-78px;--y:66px;--r:-9deg', 'flat');
  }
  /* roses: a seeded heap (so it looks the same every time) that rains into the box from above */
  var ROSE_SPOTS = (function(){
    var a = 7, out = [];
    function R(){ a|=0; a = a+0x6D2B79F5|0; var t = Math.imul(a^a>>>15, 1|a); t = t+Math.imul(t^t>>>7, 61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }
    [{nx:6,ny:5,dx:46,dy:34,z:11,s:52},{nx:5,ny:4,dx:46,dy:34,z:18,s:50},{nx:3,ny:2,dx:52,dy:36,z:25,s:46}].forEach(function(L,li){
      for(var j=0;j<L.ny;j++) for(var i=0;i<L.nx;i++){
        var x = (i-(L.nx-1)/2)*L.dx + (R()-.5)*10, y = (j-(L.ny-1)/2)*L.dy + (R()-.5)*8, r = R()*360;
        out.push({ x:Math.max(-112,Math.min(112,x)).toFixed(1), y:Math.max(-72,Math.min(72,y)).toFixed(1), z:(L.z+R()*3).toFixed(1),
                   r:r.toFixed(0), r0:(r+(R()-.5)*160).toFixed(0), s:(L.s+(R()-.5)*6).toFixed(0), d:(R()*1.1+li*.4).toFixed(2) });
      }
    });
    return out;
  })();
  var roseKey = null, roseEls = [];
  function setRoses(id){
    if(id === roseKey) return;
    roseKey = id;
    roseEls.forEach(function(e){ e.remove(); }); roseEls = [];
    scene.classList.toggle('has-roses', !!id);
    var r = id && byId(ROSES,id); if(!r) return;
    var vars = GiftArt.roseVars(r.color), svg = GiftArt.rose();
    ROSE_SPOTS.forEach(function(p){
      var el = document.createElement('div'); el.className = 'gbx-rose';
      el.style.cssText = '--x:'+p.x+'px;--y:'+p.y+'px;--z:'+p.z+'px;--r:'+p.r+'deg;--r0:'+p.r0+'deg;--s:'+p.s+'px;--d:'+p.d+'s;'+vars;
      el.innerHTML = svg; scene.appendChild(el); roseEls.push(el);
    });
  }
  function setClosed(closed){
    S.closed = closed;
    scene.classList.toggle('shut', closed);
    scene.style.setProperty('--lid', closed ? '0deg' : '108deg');
    $('gbLid').textContent = closed ? 'פתיחת המכסה' : 'סגירת המכסה';
  }
  $('gbLid').addEventListener('click', function(e){ e.stopPropagation(); setClosed(!S.closed); });
  $('gbLid').addEventListener('pointerdown', function(e){ e.stopPropagation(); });
  var rz = -28, drag = null;
  stage.addEventListener('pointerdown', function(e){ drag = { x:e.clientX, r:rz }; });
  window.addEventListener('pointermove', function(e){
    if(!drag) return;
    rz = Math.max(-85, Math.min(85, drag.r + (e.clientX - drag.x)*.45));
    stage.style.setProperty('--gbx-rz', rz+'deg');
  });
  window.addEventListener('pointerup', function(){ drag = null; });

  /* ---------- panel ---------- */
  /* box option photos (same shots as the homepage inspiration slider, cropped to squares) */
  var BOX_IMG = { matte:'images/gifts/box-matte.webp', wood:'images/gifts/box-wood.webp', velvet:'images/gifts/box-velvet.webp' };
  function optBox(b){
    return '<button class="gb-opt" type="button" data-box="'+b.id+'" aria-pressed="'+(S.box===b.id)+'"><span class="gb-thumb">'+(BOX_IMG[b.id]?'<img src="'+BOX_IMG[b.id]+'" alt="" loading="lazy" decoding="async">':'<span class="gb-sw" data-bg="'+b.sw+'"></span>')+'</span>'
      + '<span class="gb-t"><div class="gb-n">'+b.name+'</div><div class="gb-d">'+b.desc+'</div><div class="gb-p">'+(b.price?'+ '+money(b.price):'כלול במחיר')+'</div></span></button>';
  }
  function watchDesc(p){
    var d = (p.dHe||'').split(' · ').slice(0,2).join(' · ');
    return (p.cond==='used' ? 'יד שנייה' : 'חדש') + (d ? ' · ' + d : '');
  }
  function optWatch(p){
    return '<button class="gb-opt" type="button" data-watch="'+p.id+'" aria-pressed="'+(S.watch===p.id)+'"><span class="gb-thumb"><img src="'+p.img+'" alt="" loading="lazy"></span>'
      + '<span class="gb-t"><div class="gb-n">'+esc(p.name.he)+'</div><div class="gb-d">'+esc(watchDesc(p))+'</div><div class="gb-p">'+money(p.price)+'</div></span></button>';
  }
  function optRose(r){
    var on = S.rose === r.id;
    return '<button class="gb-opt" type="button" data-rose="'+r.id+'" aria-pressed="'+on+'"><span class="gb-thumb" style="'+GiftArt.roseVars(r.color)+'">'+GiftArt.rose()+'</span>'
      + '<span class="gb-t"><div class="gb-n">'+esc(r.name.he)+'</div><div class="gb-d">'+(on?'נוסף למארז · לחיצה נוספת מסירה':'ימלאו את הקופסה סביב השעון')+'</div><div class="gb-p">'+(r.price?'+ '+money(r.price):'כלול במחיר')+'</div></span></button>';
  }
  function optAdd(cat, p){
    var on = S.add[cat.id]===p.id;
    return '<button class="gb-opt gb-pc" type="button" data-cat="'+cat.id+'" data-add="'+p.id+'" aria-pressed="'+on+'"><span class="gb-thumb"><img src="'+p.img+'" alt="" loading="lazy"></span>'
      + '<span class="gb-t"><div class="gb-n">'+esc(p.name.he)+'</div><div class="gb-p"><span>'+money(p.price)+'</span><em>'+(on?'נוסף למארז · הסרה':'הוספה')+'</em></div></span></button>';
  }
  function strapOpts(){
    var sp = strapPick(); if(!sp) return '';
    var dots = strapColors(sp.p).map(function(c){
      return '<button class="gb-dot" type="button" data-scolor="'+c.id+'" data-bg="'+c.hex+'" aria-label="'+esc(c.he)+'" aria-pressed="'+(c.id===sp.c.id)+'"></button>';
    }).join('');
    var lens = sp.p.lengths.map(function(l){
      return '<button class="gb-seg" type="button" data-slen="'+l.id+'" aria-pressed="'+(l.id===sp.l.id)+'">'+l.he+'</button>';
    }).join('');
    var sizes = sp.p.sizes.map(function(n){
      return '<button class="gb-seg" type="button" data-ssize="'+n+'" aria-pressed="'+(n===sp.size)+'">'+n+'</button>';
    }).join('');
    return '<div class="gb-sopts"><div class="gb-lab">צבע</div><div class="gb-set">'+dots+'<span class="gb-cn">'+esc(sp.c.he)+'</span></div>'
      + '<div class="gb-lab">אורך</div><div class="gb-set">'+lens+'</div>'
      + '<div class="gb-lab">רוחב הרצועה במ״מ (לפי רוחב הידית בשעון)</div><div class="gb-set">'+sizes+'</div></div>';
  }
  function describeAddon(p){
    if(p.strap){ var sp = strapPick(); if(sp && sp.p.id===p.id) return p.name.he+', '+sp.c.he+', '+sp.l.he+', '+sp.size+' מ״מ'; }
    return p.name.he;
  }
  function summaryRows(){
    var b = byId(GIFT_BOXES,S.box), w = byId(WATCHES,S.watch);
    var rows = '<div class="gb-row"><span>קופסה: '+esc(b.name)+'</span><span>'+(b.price?money(b.price):'כלול')+'</span></div>'
      + '<div class="gb-row"><span>שעון: '+esc(w.name.he)+'</span><span>'+money(w.price)+'</span></div>';
    addonItems().forEach(function(p){ rows += '<div class="gb-row"><span>'+esc(describeAddon(p))+'</span><span>'+money(p.price)+'</span></div>'; });
    var sh = shipping();
    rows += '<div class="gb-row"><span>משלוח</span><span>'+(sh?money(sh):'חינם')+'</span></div>'
          + '<div class="gb-row tot"><span>לתשלום</span><span>'+money(subtotal()+sh)+'</span></div>';
    return rows;
  }
  function paint(){
    document.querySelectorAll('[data-bg]').forEach(function(el){ el.style.background = el.getAttribute('data-bg'); });
  }
  function view(){
    var h = '';
    if(S.step===0){
      h = '<h2 class="gb-h2">בחרו קופסה</h2><p class="gb-lead">הקופסה הראשונה שהנמען רואה.</p><div class="gb-grid">'+GIFT_BOXES.map(optBox).join('')+'</div>';
    } else if(S.step===1){
      var shown = WATCHES.filter(function(p){ return S.filter==='all' || p.cat===S.filter; });
      var chips = [['all','הכול'],['men','גברים'],['women','נשים']].map(function(f){
        return '<button class="gb-chip" type="button" data-filter="'+f[0]+'" aria-pressed="'+(S.filter===f[0])+'">'+f[1]+'</button>';
      }).join('');
      h = '<h2 class="gb-h2">בחרו את השעון</h2><p class="gb-lead">'+(pre?'השעון נבחר מעמוד המוצר. אפשר להחליף אותו כאן.':'כל השעונים שזמינים כרגע באתר. השעון יוצב במרכז המארז.')+'</p>'
        + '<div class="gb-chips">'+chips+'</div><div class="gb-grid">'+shown.map(optWatch).join('')+'</div>';
    } else if(S.step===2){
      h = '<h2 class="gb-h2">הוסיפו ורדים</h2><p class="gb-lead">ורדים בצבע לבחירתכם ימלאו את הקופסה סביב השעון. אפשר לבחור צבע אחד, או לדלג.</p><div class="gb-grid">'+ROSES.map(optRose).join('')+'</div>';
    } else if(S.step===3){
      h = CATS.map(function(c){
        return '<h2 class="gb-h2">'+c.title+'</h2><p class="gb-lead">'+c.lead+'. אפשר לבחור פריט אחד, או לדלג.</p><div class="gb-grid c2">'
          + c.items.map(function(p){ return optAdd(c,p); }).join('') + '</div>' + (c.id==='strap' ? strapOpts() : '');
      }).join('');
    } else {
      h = '<h2 class="gb-h2">הסיכום שלכם</h2><p class="gb-lead">בדקו שהכול במקום לפני התשלום.</p><div class="gb-sum">'+summaryRows()+'</div>'
        + '<p class="gb-fine">משלוח חינם בהזמנה מעל ₪1,500, ובמחיר אחיד של ₪45 מתחת לסכום הזה.</p>'
        + '<label class="gb-l" for="gbNote">כרטיס ברכה (לא חובה, עד '+NOTE_MAX+' תווים)</label><textarea id="gbNote" maxlength="'+NOTE_MAX+'" placeholder="כתבו כאן כמה מילים לנמען">'+esc(S.note)+'</textarea>';
    }
    $('gbBody').innerHTML = h;
    $('gbSteps').innerHTML = STEPS.map(function(s,i){
      var ok = i<2 || !!S.watch;
      return '<button type="button" data-step="'+i+'" class="'+(i===S.step?'on':i<S.step?'done':'')+'" '+(ok?'':'disabled')+'><b>'+(i<S.step?'✓':i+1)+'</b><span>'+s+'</span></button>';
    }).join('');
    $('gbPrev').style.visibility = S.step ? 'visible' : 'hidden';
    var n = $('gbNext'); n.textContent = S.step===LAST ? 'לתשלום' : 'המשך'; n.disabled = (S.step===1 && !S.watch);
    $('gbTotal').textContent = money(subtotal());
    paint(); syncStage();
  }
  function go(i){
    S.step = i; view();
    setClosed(i===LAST);                    // the lid closes once the box is complete
    if(window.innerWidth <= 880) window.scrollTo({ top:0, behavior:'smooth' });
  }
  /* roses of the chosen colour rain down the screen whenever a rose colour is picked */
  function rosesFall(color){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var old = document.querySelector('.gb-fall'); if(old) old.remove();
    var layer = document.createElement('div'); layer.className = 'gb-fall'; layer.setAttribute('aria-hidden','true');
    layer.style.cssText = GiftArt.roseVars(color);
    var n = window.innerWidth <= 880 ? 18 : 28, i, size, el, inn;
    for(i=0;i<n;i++){
      size = 30 + Math.random()*36;
      el = document.createElement('div'); el.className = 'gb-fall-r';
      el.style.cssText = 'left:'+(Math.random()*96).toFixed(1)+'%;width:'+size.toFixed(0)+'px;height:'+size.toFixed(0)+'px;animation-duration:'+(2.6+Math.random()*1.8).toFixed(2)+'s;animation-delay:'+(Math.random()*1.1).toFixed(2)+'s';
      inn = document.createElement('div'); inn.className = 'gb-fall-i';
      inn.style.cssText = '--sw:'+((Math.random()*44+16)*(Math.random()<.5?-1:1)).toFixed(0)+'px;--tilt:'+((Math.random()*50+20)*(Math.random()<.5?-1:1)).toFixed(0)+'deg;animation-duration:'+(1.2+Math.random()*1.1).toFixed(2)+'s';
      inn.innerHTML = GiftArt.rose();
      el.appendChild(inn); layer.appendChild(el);
    }
    document.body.appendChild(layer);
    setTimeout(function(){ layer.remove(); }, 6200);
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-box],[data-watch],[data-rose],[data-add],[data-step],[data-filter],[data-scolor],[data-slen],[data-ssize]');
    if(!b || !$('gbBody').contains(b) && !$('gbSteps').contains(b)) return;
    var d = b.dataset;
    if(d.box){ S.box = d.box; }
    else if(d.watch){ S.watch = d.watch; }
    else if(d.rose){ S.rose = S.rose===d.rose ? null : d.rose; if(S.rose){ var rr = byId(ROSES,S.rose); if(rr) rosesFall(rr.color); if(window.innerWidth<=880) window.scrollTo({ top:0, behavior:'smooth' }); } }
    else if(d.filter){ S.filter = d.filter; }
    else if(d.add){
      var on = S.add[d.cat] === d.add; S.add[d.cat] = on ? null : d.add;
      if(d.cat==='strap' && !on){ var cols = strapColors(byId(PRODUCTS,d.add)); if(!byId(cols,S.strap.color)) S.strap.color = cols[0] && cols[0].id; }
    }
    else if(d.scolor){ S.strap.color = d.scolor; }
    else if(d.slen){ S.strap.length = d.slen; }
    else if(d.ssize){ S.strap.size = +d.ssize; }
    else if(d.step){ go(+d.step); return; }
    view();
  });
  document.addEventListener('input', function(e){ if(e.target.id==='gbNote') S.note = e.target.value.slice(0,NOTE_MAX); });
  $('gbPrev').onclick = function(){ go(S.step-1); };
  $('gbNext').onclick = function(){ if(S.step<LAST) go(S.step+1); else checkout(); };

  /* ---------- checkout ---------- */
  function payload(){
    var addons = addonItems().map(function(p){
      if(p.strap){ var sp = strapPick(); return { id:p.id, opts:{ color:sp.c.id, length:sp.l.id, size:sp.size, qty:1 } }; }
      return { id:p.id };
    });
    return { box:S.box, watch:S.watch, addons:addons, note:S.note.trim() };
  }
  function whatsappText(){
    var b = byId(GIFT_BOXES,S.box), w = byId(WATCHES,S.watch);
    var lines = ['היי, אני מעוניין/ת להזמין מארז מתנה:', 'קופסה: '+b.name, 'שעון: '+w.name.he+' ('+money(w.price)+')'];
    addonItems().forEach(function(p){ lines.push('תוספת: '+describeAddon(p)+' ('+money(p.price)+')'); });
    if(S.note.trim()) lines.push('כרטיס ברכה: '+S.note.trim());
    var sh = shipping();
    lines.push('משלוח: '+(sh?money(sh):'חינם'), 'סה״כ לתשלום: '+money(subtotal()+sh));
    return lines.join('\n');
  }
  function openWhatsApp(){ location.href = 'https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(whatsappText()); }
  var busy = false;
  async function checkout(){
    if(busy) return; busy = true;
    var btn = $('gbNext'); btn.disabled = true;
    try{
      var r = await fetch('/api/checkout', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ gift:payload() }) });
      var data = await r.json().catch(function(){ return {}; });
      if(r.ok && data.ok && typeof data.url==='string' && (data.url.indexOf('https://pay.hyp.co.il/')===0 || data.url.indexOf('https://icom.yaad.net/')===0)){ location.href = data.url; return; }
      if(data.error==='payment_not_configured' || r.status===404 || r.status===503){ openWhatsApp(); return; }
      if(data.error==='not_available'){ alert('אחד הפריטים במארז כבר לא זמין. רעננו את הדף ובחרו מחדש.'); return; }
      console.warn('gift checkout', data.error, data.detail||'');
      if(confirm('התשלום המקוון באתר יהיה זמין בקרוב, ואנחנו עובדים על זה.\nבינתיים מוזמנים ליצור איתנו קשר ונשמח להשלים את ההזמנה יחד.\n\nלפתוח שיחת וואטסאפ עם פרטי המארז?')) openWhatsApp();
    }catch(err){
      alert('אירעה שגיאה בחיבור. נסו שוב בעוד רגע, או צרו איתנו קשר.');
    }finally{
      busy = false; btn.disabled = false;
    }
  }

  /* header height drives the sticky offset of the stage */
  function measure(){
    var hd = document.querySelector('header');
    if(hd) document.querySelector('.gb-app').style.setProperty('--hh', hd.offsetHeight+'px');
  }
  window.addEventListener('resize', measure); measure();

  view();
  setClosed(true);
  scene.style.setProperty('--lid','0deg');
  setTimeout(function(){ setClosed(false); }, 500);
})();
