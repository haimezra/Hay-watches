// ===== HAY Watches — Shared Data =====
// Product photos: free-to-use stock photography (Unsplash License - unsplash.com/license),
// no attribution required, no copyright/brand-IP issues.

const CATEGORIES = {
  men:         { he:"שעוני גברים",        en:"Men's Watches",       img:"images/products/men-7-2.webp" },
  women:       { he:"שעוני נשים",         en:"Women's Watches",     img:"images/categories/women.jpg" },
  straps:      { he:"רצועות פרימיום",      en:"Premium Straps",      img:"images/categories/straps.jpg" },
  accessories: { he:"אביזרים וקופסאות",    en:"Accessories & Boxes", img:"images/categories/accessories-box.jpg" }
};

const PRODUCTS = [
  // ---- Men's Watches ----
  { id:"men-6", cat:"men", brand:"Citizen", name:{he:"Citizen Tsuyosa NJ0151 (ירוק/מנטה)", en:"Citizen Tsuyosa NJ0151 (Mint/Green)"}, price:1690, cond:"new", img:"images/products/men-6-1.webp",
    imgs:["images/products/men-6-1.webp","images/products/men-6-2.webp"],
    dHe:"קוטר 40 מ״מ · פלדת אל-חלד · תנועה אוטומטית קליבר 8210 · 21 אבנים · זכוכית ספיר · עמיד למים 50מ׳ · גב שקוף · צמיד משולב",
    dEn:"40mm stainless steel case · Automatic Caliber 8210 · 21 jewels · Sapphire crystal · 50m water resistant · Exhibition caseback · Integrated bracelet" },
  { id:"men-7", cat:"men", brand:"Citizen", name:{he:"Citizen Tsuyosa NJ0151-53M (Ice Blue)", en:"Citizen Tsuyosa NJ0151-53M (Ice Blue)"}, price:1790, cond:"new", img:"images/products/men-7-1.webp",
    imgs:["images/products/men-7-1.webp","images/products/men-7-2.webp"],
    dHe:"קוטר 40 מ״מ · לוח כחול קרח בגימור סאנריי · תנועה אוטומטית קליבר 8210 · 21 אבנים · עמיד למים 50מ׳ · אחריות יצרן 5 שנים",
    dEn:"40mm case · Sunray-textured ice blue dial · Automatic Caliber 8210 · 21 jewels · 50m water resistant · 5-year manufacturer warranty" },
  { id:"men-8", sold:true, cat:"men", brand:"Citizen", name:{he:"Citizen Challenge Diver Automatic (שחור/זהב)", en:"Citizen Challenge Diver Automatic (Black/Gold)"}, price:1290, cond:"new", img:"images/products/men-8-1.webp",
    imgs:["images/products/men-8-1.webp","images/products/men-8-2.webp"],
    dHe:"קוטר 41 מ״מ · עובי 13.7 מ״מ · לוניטה חד-כיוונית · זכוכית מינרל · תנועה אוטומטית קליבר 8204-21 · עמיד למים 200מ׳",
    dEn:"41mm case, 13.7mm thick · Unidirectional bezel · Mineral crystal · Automatic Caliber 8204-21 · 200m water resistant" },
  { id:"men-9", sold:true, cat:"men", brand:"Hamilton", name:{he:"Hamilton Khaki Field Auto H70455540 (לוח כחול)", en:"Hamilton Khaki Field Auto H70455540 (Blue Dial)"}, price:2390, cond:"new", img:"images/products/men-9-2.webp",
    imgs:["images/products/men-9-2.webp","images/products/men-9-1.webp","images/products/men-9-3.webp"],
    dHe:"קוטר 38 מ״מ · פלדת אל-חלד · תנועה אוטומטית קליבר H-10 · מילואי כוח 80 שעות · זכוכית ספיר · עמיד למים 100מ׳ · לוח כחול · רצועת עור · חלון תאריך ב-3",
    dEn:"38mm stainless steel case · Automatic Caliber H-10 · 80-hour power reserve · Sapphire crystal · 100m water resistant · Blue dial · Leather strap · Date window at 3" },
  { id:"men-10", cat:"men", brand:"Omega", name:{he:"Omega De Ville Cal.1432 (וינטג׳, לוח זהב)", en:"Omega De Ville Cal.1432 (Vintage, Gold Dial)"}, price:4290, cond:"used", img:"images/products/men-10-1.webp",
    imgs:["images/products/men-10-1.webp","images/products/men-10-2.webp"],
    dHe:"יד שנייה · קוטר 32.5 מ״מ · מארז פלדה עם לוניטה מוזהבת · תנועת קוורץ קליבר 1432 · רצועת עור מקורית · כולל תעודת בדיקה",
    dEn:"Pre-owned · 32.5mm steel case with gold-tone bezel · Quartz Caliber 1432 · Original leather strap · Includes inspection certificate" },
  { id:"men-11", cat:"men", brand:"Omega", name:{he:"Omega וינטג׳ Ref.2445 קליבר 351 (Bumper)", en:"Omega Vintage Ref.2445 Cal.351 (Bumper Automatic)"}, price:3200, cond:"used", img:"images/products/men-11-1.webp",
    imgs:["images/products/men-11-1.webp","images/products/men-11-2.webp"],
    dHe:"פריט וינטג׳ משנות ה-50 · קוטר כ-34 מ״מ · תנועה אוטומטית מסוג Bumper קליבר 351 · 17 אבנים · זכוכית אקרילית · רצועת עור",
    dEn:"1950s vintage piece · ~34mm case · Bumper-style automatic Caliber 351 · 17 jewels · Acrylic crystal · Leather strap" },

  { id:"men-12", sold:true, cat:"men", brand:"Omega", name:{he:"Omega Seamaster 2991-61 SC וינטג׳ קליבר 571 (לוח שחור)", en:"Vintage Omega Seamaster 2991-61 SC Mid Size Automatic Cal.571 (Black Dial)"}, price:2000, cond:"used", img:"images/products/men-12-1.webp",
    imgs:["images/products/men-12-1.webp","images/products/men-12-2.webp","images/products/men-12-3.webp","images/products/men-12-4.webp"],
    dHe:"יד שנייה · גודל מידי (Mid Size) · לוח שחור · תנועה אוטומטית קליבר 571 · 24 אבנים · גב סגור עם סמל Seamaster · רצועת עור שחורה",
    dEn:"Pre-owned · Mid Size · Black dial · Automatic Caliber 571 · 24 jewels · Seamaster medallion caseback · Black leather strap" },

  { id:"men-13", cat:"men", brand:"Omega", name:{he:"Omega Genève וינטג׳ זהב 14K מלא (משנות השישים)", en:"Vintage Omega Genève Solid 14K Gold (1960s)"}, price:5500, cond:"used", img:"images/products/men-13-1.webp",
    dHe:"יד שנייה · זהב 14K מלא, לא ציפוי · לוח כסוף עם מחוגים מוזהבים · שעון וינטג׳ משנות השישים · רצועת עור חומה",
    dEn:"Pre-owned · Solid 14K gold, not plated · Silver dial with gold-tone hands · 1960s vintage piece · Brown leather strap" },

  { id:"men-14", cat:"men", name:{he:"שעון הסרט הצהוב, מהדורה מוגבלת 07.10.2023", en:"Yellow Ribbon Watch, Limited Edition 07.10.2023"}, price:200, cond:"new", img:"images/products/men-14-1.webp",
    imgs:["images/products/men-14-1.webp","images/products/men-14-2.webp"],
    dHe:"כשכל דקה נושאת בתוכה רגעים של זיכרון ומשמעות, הגיע הזמן לשעון שיש לו נשמה. שעון זה הוא לא רק אביזר, הוא תזכורת לרגעים החשובים באמת. בואו לרכוש את השעון שיספר את הסיפור שלכם, כי הזמן לא עוצר, אבל הזיכרונות נשארים לנצח. יחידות בודדות",
    dEn:"When every minute carries moments of memory and meaning, it is time for a watch with a soul. This watch is not just an accessory, it is a reminder of the moments that truly matter. Come and get the watch that will tell your story, because time does not stop, but memories remain forever. Limited units" },

  { id:"men-15", available:false, cat:"men", brand:"Bulova", name:{he:"Bulova Moon Phase קוורץ NOS משנת 1982 (לא נענד)", en:"NOS Bulova Moon Phase Quartz, 1982 (Unworn)"}, price:600, cond:"used", img:"images/products/men-15-1.webp",
    imgs:["images/products/men-15-1.webp","images/products/men-15-2.webp","images/products/men-15-3.webp","images/products/men-15-4.webp"],
    dHe:"יד שנייה · New Old Stock, שעון שלא נענד · משנת 1982 · תנועת קוורץ · פאזת ירח ותצוגת חודשים · Swiss Made · מארז בגוון זהב · רצועת עור חומה",
    dEn:"Pre-owned · New Old Stock, unworn · 1982 · Quartz movement · Moon phase and month display · Swiss Made · Gold-tone case · Brown leather strap" },

  // ---- Women's Watches ----
  { id:"women-1", cat:"women", brand:"Tissot", featured:true, name:{he:"Tissot בליסימה סמול ליידי", en:"Tissot Bellissima Small Lady"}, price:1200, cond:"used",
    img:"images/products/women-1-1.webp",
    imgs:["images/products/women-1-1.webp","images/products/women-1-2.webp","images/products/women-1-3.webp"],
    dHe:"יד שנייה · מק״ט T126.010.66.113.00 · קוטר 26 מ״מ · מארז פלדת אל-חלד 316L משובץ אבנים · זכוכית ספיר עמידה בשריטות עם ציפוי אנטי-רפלקטיבי · תנועת קוורץ שוויצרית (קליבר ETA F03.111) · רצועת עור אמיתית באדום עז עם אבזם פרפר · עמיד למים עד 50 מ׳ · כולל קופסה מקורית של המותג",
    dEn:"Pre-owned · Ref. T126.010.66.113.00 · 26mm case · 316L stainless steel case set with stones · Scratch-resistant sapphire crystal with antireflective coating · Swiss quartz movement (ETA F03.111) · Genuine red leather strap with butterfly deployment clasp · 50m water resistant · Comes with original brand box" },
  { id:"women-2", cat:"women", brand:"Tissot", name:{he:"Tissot קרסון פרימיום ליידי", en:"Tissot Carson Premium Lady"}, price:1200, cond:"used",
    img:"images/products/women-2-1.webp",
    imgs:["images/products/women-2-1.webp","images/products/women-2-2.webp"],
    dHe:"יד שנייה · מק״ט T122.210.16.373.00 · קוטר 30 מ״מ · מארז פלדת אל-חלד · לוח בורדו בגימור סאנריי עם אינדקסים רומיים · חלון תאריך · זכוכית ספיר · תנועת קוורץ שוויצרית (קליבר ETA F03.115) · רצועת עור בורדו תואמת · עמיד למים עד 50 מ׳",
    dEn:"Pre-owned · Ref. T122.210.16.373.00 · 30mm stainless steel case · Burgundy sunray dial with Roman numerals · Date window · Sapphire crystal · Swiss quartz movement (ETA F03.115) · Matching burgundy leather strap · 50m water resistant" },
  { id:"women-3", cat:"women", brand:"Tissot", name:{he:"Tissot A282 זהב וינטג׳, שנייה קטנה", en:"Vintage Tissot A282 Gold Small Second"}, price:1500, cond:"used",
    img:"images/products/women-3-1.webp",
    imgs:["images/products/women-3-1.webp","images/products/women-3-2.webp"],
    dHe:"יד שנייה · מצב מעולה (Near Mint) · שעון וינטג׳ מסדרת Tissot A282 · קוטר 23 מ״מ · מארז מלבני מצופה זהב · לוח לבן עם אינדקסים רומיים · תת-חוגה שניות קטנה · תנועת קוורץ שוויצרית · רצועת עור חום מקורית בגימור קרוקודיל · פריט אספנות קלאסי מתקופת שנות ה-80",
    dEn:"Pre-owned · Near Mint condition · Vintage Tissot A282 series · 23mm gold-plated rectangular case · White dial with Roman numerals · Small seconds sub-dial · Swiss quartz movement · Original brown crocodile-embossed leather strap · Classic 1980s collector's piece" },
  { id:"women-4", cat:"women", brand:"Tissot", name:{he:"Tissot PRX קוורץ 25 מ״מ פנינת-אם", en:"Tissot PRX Quartz 25mm Mother of Pearl"}, price:1000, cond:"used",
    img:"images/products/women-4-1.webp",
    imgs:["images/products/women-4-1.webp","images/products/women-4-2.webp","images/products/women-4-3.webp"],
    dHe:"יד שנייה · מק״ט T137.010.21.111.00 · קוטר 25 מ״מ · מארז פלדת אל-חלד 316L עם לינטה מצופה זהב ורוד (PVD) · לוח פנינת-אם ייחודי עם אינדקסים ורוד-זהב · זכוכית ספיר אנטי-רפלקטיבית · תנועת קוורץ שוויצרית · צמיד פלדה מקורי · עמיד למים עד 100 מ׳ · עיצוב וינטג׳-מודרני בהשראת שנות ה-70",
    dEn:"Pre-owned · Ref. T137.010.21.111.00 · 25mm case · 316L stainless steel case with rose gold PVD coated bezel · Distinctive mother-of-pearl dial with rose gold indices · Antireflective sapphire crystal · Swiss quartz movement · Original steel bracelet · 100m water resistant · 70's-inspired modern-vintage design" },
  { id:"women-5", cat:"women", brand:"Burberry", featured:true, name:{he:"Burberry The City זהב ורוד", en:"Burberry The City Rose Gold"}, price:1000, cond:"new", available:true,
    img:"images/products/women-5-1.webp",
    imgs:["images/products/women-5-1.webp","images/products/women-5-2.webp","images/products/women-5-3.webp"],
    dHe:"חדש · דגם BU9039 מסדרת The City · קוטר 38 מ״מ · מארז וצמיד פלדת אל-חלד בציפוי זהב ורוד · לוח בגימור סאנריי עם תבנית ה-Check האייקונית של המותג · חלון תאריך · זכוכית ספיר · תנועת קוורץ שוויצרית · אבזם פרפר · עמיד למים עד 50 מ׳ · כולל קופסה מקורית של המותג",
    dEn:"Brand new · Model BU9039, The City collection · 38mm case · Rose gold-plated stainless steel case and bracelet · Sunray dial with the brand's iconic engraved check pattern · Date window · Sapphire crystal · Swiss quartz movement · Butterfly deployment clasp · 50m water resistant · Comes with original brand box" },

  { id:"women-6", sold:true, cat:"women", brand:"Cartier", name:{he:"Cartier Santos Galbée 1567 פלדה וזהב, קוורץ 24 מ״מ (2012)", en:"Cartier Santos Galbée 1567 Steel & Gold Quartz 24mm (2012)"}, price:18000, cond:"used",
    img:"images/products/women-6-1.webp",
    imgs:["images/products/women-6-1.webp","images/products/women-6-2.webp"],
    dHe:"יד שנייה · דגם 1567 Santos Galbée · פלדה וזהב · תנועת קוורץ · קוטר 24 מ״מ · משנת 2012 · לוח לבן עם ספרות רומיות · כתר עם אבן כחולה · מגיע עם קופסה ותעודות · אחריות 6 חודשים",
    dEn:"Pre-owned · Model 1567 Santos Galbée · Steel & gold · Quartz movement · 24mm · 2012 · White dial with Roman numerals · Blue cabochon crown · Box and papers included · 6-month warranty" },

  // ---- Premium Straps ----
  { id:"strap-1", cat:"straps", strap:true, name:{he:"רצועת עור פרימיום לשעון", en:"Premium Leather Watch Strap"}, price:120, cond:"new",
    img:"images/products/strap-black-1.webp",
    imgs:["images/products/strap-black-1.webp","images/products/strap-black-2.webp","images/products/strap-gray-1.webp","images/products/strap-brown-1.webp","images/products/strap-brown-2.webp","images/products/strap-cognac-1.webp","images/products/strap-cognac-2.webp","images/products/strap-slate-1.webp","images/products/strap-slate-2.webp","images/products/strap-rust-1.webp"],
    dHe:"רצועת עור עם תפרים תואמי צבע · אבזם פלדה מוברשת · 7 חורי כוונון · שתי לולאות החזקה · זמינה ב-3 אורכים ובמידות 18–24 מ״מ",
    dEn:"Leather strap with matching stitching · Brushed steel buckle · 7 adjustment holes · Two keeper loops · 3 lengths, 18–24mm widths",
    colors:[
      { id:"black",  he:"שחור",      hex:"#000000", imgs:["images/products/strap-black-1.webp","images/products/strap-black-2.webp"] },
      { id:"gray",   he:"אפור",      hex:"#898884", imgs:["images/products/strap-gray-1.webp"] },
      { id:"brown",  he:"חום",       hex:"#887066", imgs:["images/products/strap-brown-1.webp","images/products/strap-brown-2.webp"] },
      { id:"cognac", he:"קוניאק",    hex:"#b08260", imgs:["images/products/strap-cognac-1.webp","images/products/strap-cognac-2.webp"] },
      { id:"slate",  he:"כחול-אפור", hex:"#666f74", imgs:["images/products/strap-slate-1.webp","images/products/strap-slate-2.webp"] },
      { id:"rust",   he:"חלודה",     hex:"#9d6f5f", imgs:["images/products/strap-rust-1.webp"] },
      { id:"olive",  he:"ירוק זית",  hex:"#767c6e", imgs:[] },
      { id:"tan",    he:"טאן",       hex:"#b59268", imgs:[] }
    ],
    lengths:[ {id:"short", he:"קצר"}, {id:"standard", he:"סטנדרטי"}, {id:"long", he:"ארוך"} ],
    sizes:[18,19,20,21,22,24] },
  { id:"strap-2", cat:"straps", strap:true, name:{he:"רצועת עור וינטג׳", en:"Vintage Leather Watch Strap"}, price:80, cond:"new",
    img:"images/products/strap-vintage-brown.webp", imgs:["images/products/strap-vintage-brown.webp","images/products/strap-vintage-black.webp","images/products/strap-vintage-beige.webp"],
    dHe:"עברה בקרת איכות אצלנו · עור בסגנון וינטג׳ עם תפרים לבנים בולטים · אבזם פלדה מבריק · 7 חורי כוונון · לולאת החזקה · זמינה ב-3 אורכים ובמידות 18–24 מ״מ",
    dEn:"Passed our quality check · Vintage-style leather with contrast white stitching · Polished steel buckle · 7 adjustment holes · Keeper loop · 3 lengths, 18–24mm widths",
    colors:[
      { id:"black", he:"שחור", hex:"#000000", imgs:["images/products/strap-vintage-black.webp"] },
      { id:"brown", he:"חום",  hex:"#5b3a2f", imgs:["images/products/strap-vintage-brown.webp"] },
      { id:"beige", he:"בז׳",  hex:"#d8c6a5", imgs:["images/products/strap-vintage-beige.webp"] }
    ],
    lengths:[ {id:"short", he:"קצר"}, {id:"standard", he:"סטנדרטי"}, {id:"long", he:"ארוך"} ],
    sizes:[18,19,20,21,22,24] },

  // ---- Accessories & Boxes ----
  { id:"acc-1", cat:"accessories", name:{he:"קופסת עור לשעונים", en:"Leather Watch Box"}, price:200, cond:"new",
    img:"images/products/acc-1.webp",
    dHe:"רפידה קטיפה פנימית · נעילה מגנטית · מקום לשעון אחד", dEn:"Velvet-lined interior · Magnetic clasp · Single watch slot" },
  { id:"acc-2", cat:"accessories", name:{he:"סט תצוגה לשלושה שעונים", en:"Triple Watch Display Set"}, price:200, cond:"new",
    img:"images/products/acc-2.webp",
    dHe:"עמדת עץ ממותג · מקום לשלושה שעונים · גימור מט", dEn:"Branded wooden stand · Holds 3 watches · Matte finish" },
  { id:"acc-3", cat:"accessories", name:{he:"ערכת טיפוח וניקוי לשעונים", en:"Watch Care & Cleaning Kit"}, price:320, cond:"new",
    img:"https://images.unsplash.com/photo-1704783339057-3fb087d3bc98?auto=format&fit=crop&w=900&q=70",
    dHe:"מברשת עדינה · מטלית מיקרופייבר · תרסיס ניקוי לזכוכית", dEn:"Soft brush · Microfiber cloth · Crystal cleaning spray" }
];

const ARTICLES = [
  { he:"איך לבחור את השעון הראשון שלך", en:"How to Choose Your First Watch",
    img:"images/guides/first-watch.jpg",
    link:"guide-first-watch.html" },
  { he:"שעון אוטומטי מול קוורץ", en:"Automatic vs. Quartz",
    img:"images/guides/automatic-vs-quartz.jpg",
    link:"guide-automatic-vs-quartz.html" },
  { he:"המדריך לשמירה על רצועות עור", en:"Caring for Leather Straps",
    img:"images/guides/strap-care.jpg",
    link:"guide-strap-care.html" },
  { he:"למה לא לענוד שעונים מזויפים", en:"Why You Shouldn't Wear Fake Watches",
    img:"https://images.unsplash.com/photo-1646724810360-abfa1bb76d6d?auto=format&fit=crop&w=900&q=70",
    link:"guide-fake-watches.html" }
];

function fmtPrice(n){ return "₪" + Number(n).toLocaleString("en-US"); }

function availabilityHtml(p){
  const isSold = p.sold === true;
  const isAvailable = !isSold && p.available !== false; // default: available, unless sold or explicitly set to false
  const cls = isAvailable ? "available" : "unavailable";
  const heTxt = isSold ? "נמכר" : (isAvailable ? "זמין" : "לא זמין");
  const enTxt = isSold ? "Sold" : (isAvailable ? "Available" : "Unavailable");
  return `<span class="avail-badge ${cls}"><span class="avail-dot"></span><span class="he-txt">${heTxt}</span><span class="en-txt">${enTxt}</span></span>`;
}

function productImgHtml(p){
  const src = (typeof bestProductImg === 'function') ? bestProductImg(p) : p.img;
  const avail = availabilityHtml(p);
  if(src){
    return `${avail}<img src="${src}" alt="${p.name.en}" loading="lazy">`;
  }
  const brand = p.brand ? p.brand.toUpperCase() : '';
  return `${avail}<div class="img-placeholder">
    <span class="ph-brand">${brand}</span>
    <span class="he-txt ph-note">תמונת מוצר בהמתנה</span><span class="en-txt ph-note">Product photo pending</span>
  </div>`;
}

// ===== סליקת HYPAY (יאד) =====
// TODO: להחליף כאן את מספר המסוף (Masof) שיתקבל מחברת הסליקה.
const HYP_MASOF = "YOUR_MASOF_NUMBER";

function buyNow(name, priceILS){
  if(HYP_MASOF === "YOUR_MASOF_NUMBER"){
    alert('עוד לא הוגדר מספר מסוף לסליקה. יש להחליף את HYP_MASOF בקובץ data.js עם המספר שתקבל מחברת הסליקה.');
    return;
  }
  const amount = String(priceILS).replace(/[^\d.]/g,'');
  const url = `https://icom.yaad.net/p/?action=pay&Masof=${HYP_MASOF}&Amount=${amount}&Info=${encodeURIComponent(name)}&UTF8=True&UTF8out=True`;
  window.location.href = url;
}
