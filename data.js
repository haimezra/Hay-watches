// ===== HAY Watches — Shared Data =====
// Product photos: free-to-use stock photography (Unsplash License - unsplash.com/license),
// no attribution required, no copyright/brand-IP issues.

const CATEGORIES = {
  men:         { he:"שעוני גברים",        en:"Men's Watches",       img:"https://images.unsplash.com/photo-1667375565651-b660b574d1a9?auto=format&fit=crop&w=900&q=65" },
  women:       { he:"שעוני נשים",         en:"Women's Watches",     img:"https://images.unsplash.com/photo-1751437774882-deeea4352018?auto=format&fit=crop&w=900&q=65" },
  straps:      { he:"רצועות פרימיום",      en:"Premium Straps",      img:"https://images.unsplash.com/photo-1434704504321-71a8bc15a685?auto=format&fit=crop&w=900&q=65" },
  accessories: { he:"אביזרים וקופסאות",    en:"Accessories & Boxes", img:"https://images.unsplash.com/photo-1704783339057-3fb087d3bc98?auto=format&fit=crop&w=900&q=65" }
};

const PRODUCTS = [
  // ---- Men's Watches ----
  { id:"men-1", cat:"men", featured:true, name:{he:"HAY מרידיאן", en:"HAY Meridian"}, price:4890, cond:"new",
    img:"https://images.unsplash.com/photo-1623998021450-85c29c644e0d?auto=format&fit=crop&w=900&q=70",
    dHe:"מצופה נירוסטה · תנועה אוטומטית · קוטר 40 מ״מ", dEn:"Stainless steel · Automatic movement · 40mm" },
  { id:"men-2", cat:"men", name:{he:"HAY קרונומאסטר", en:"HAY Chronomaster"}, price:5450, cond:"new",
    img:"https://images.unsplash.com/photo-1667375565651-b660b574d1a9?auto=format&fit=crop&w=900&q=70",
    dHe:"רצועת עור איטלקית · תנועה אוטומטית · זכוכית ספיר", dEn:"Italian leather strap · Automatic movement · Sapphire crystal" },
  { id:"men-3", cat:"men", name:{he:"HAY אקווה ספורט", en:"HAY Aqua Sport"}, price:6890, cond:"new",
    img:"https://images.unsplash.com/photo-1715776314938-c7b1ab69ad80?auto=format&fit=crop&w=900&q=70",
    dHe:"עמיד למים 100מ׳ · לוח שנה · קוטר 41 מ״מ", dEn:"100m water resistant · Date function · 41mm" },
  { id:"men-4", cat:"men", name:{he:"HAY אושיאניק פרו", en:"HAY Oceanic Pro"}, price:8250, cond:"new",
    img:"https://images.unsplash.com/photo-1762708052051-bfa096f5649f?auto=format&fit=crop&w=900&q=70",
    dHe:"טבילה מקצועית · תנועה אוטומטית · לוניטה מסתובבת", dEn:"Professional diver · Automatic movement · Rotating bezel" },
  { id:"men-5", cat:"men", name:{he:"HAY אבניור וינטג׳", en:"HAY Avenoir Vintage"}, price:7420, cond:"used",
    img:"https://images.unsplash.com/photo-1613579153555-a83eadd8fdde?auto=format&fit=crop&w=900&q=70",
    dHe:"יד שנייה · מקורי משנות ה-80 · כולל תעודת מקוריות", dEn:"Pre-owned · Original 1980s piece · Certificate included" },

  { id:"men-6", cat:"men", brand:"Citizen", name:{he:"Citizen Tsuyosa NJ0151 (ירוק/מנטה)", en:"Citizen Tsuyosa NJ0151 (Mint/Green)"}, price:1690, cond:"new", img:null,
    dHe:"קוטר 40 מ״מ · פלדת אל-חלד · תנועה אוטומטית קליבר 8210 · 21 אבנים · זכוכית ספיר · עמיד למים 50מ׳ · גב שקוף · צמיד משולב",
    dEn:"40mm stainless steel case · Automatic Caliber 8210 · 21 jewels · Sapphire crystal · 50m water resistant · Exhibition caseback · Integrated bracelet" },
  { id:"men-7", cat:"men", brand:"Citizen", name:{he:"Citizen Tsuyosa NJ0151-53M (Ice Blue)", en:"Citizen Tsuyosa NJ0151-53M (Ice Blue)"}, price:1790, cond:"new", img:null,
    dHe:"קוטר 40 מ״מ · לוח כחול קרח בגימור סאנריי · תנועה אוטומטית קליבר 8210 · 21 אבנים · עמיד למים 50מ׳ · אחריות יצרן 5 שנים",
    dEn:"40mm case · Sunray-textured ice blue dial · Automatic Caliber 8210 · 21 jewels · 50m water resistant · 5-year manufacturer warranty" },
  { id:"men-8", cat:"men", brand:"Citizen", name:{he:"Citizen Challenge Diver Automatic (שחור/זהב)", en:"Citizen Challenge Diver Automatic (Black/Gold)"}, price:1290, cond:"new", img:"images/products/men-8-1.webp",
    imgs:["images/products/men-8-1.webp","images/products/men-8-2.webp"],
    dHe:"קוטר 41 מ״מ · עובי 13.7 מ״מ · לוניטה חד-כיוונית · זכוכית מינרל · תנועה אוטומטית קליבר 8204-21 · עמיד למים 200מ׳",
    dEn:"41mm case, 13.7mm thick · Unidirectional bezel · Mineral crystal · Automatic Caliber 8204-21 · 200m water resistant" },
  { id:"men-9", cat:"men", brand:"Hamilton", name:{he:"Hamilton Khaki Field Auto H70455540 (לוח כחול)", en:"Hamilton Khaki Field Auto H70455540 (Blue Dial)"}, price:2390, cond:"new", img:"images/products/men-9-2.webp",
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

  // ---- Women's Watches ----
  { id:"women-1", cat:"women", featured:true, name:{he:"HAY אקוויליבר", en:"HAY Equiliber"}, price:6250, cond:"new",
    img:"https://images.unsplash.com/photo-1628678172909-13a7209c7d62?auto=format&fit=crop&w=900&q=70",
    dHe:"טיטניום · תנועה אוטומטית · עמיד למים 100מ׳", dEn:"Titanium · Automatic movement · 100m water resistant" },
  { id:"women-2", cat:"women", name:{he:"HAY רוזה אלגנס", en:"HAY Rosé Elegance"}, price:4590, cond:"new",
    img:"https://images.unsplash.com/photo-1751437774882-deeea4352018?auto=format&fit=crop&w=900&q=70",
    dHe:"ציפוי זהב ורוד · תנועת קווארץ · קוטר 32 מ״מ", dEn:"Rose gold plating · Quartz movement · 32mm" },
  { id:"women-3", cat:"women", name:{he:"HAY שמפניה מיוז", en:"HAY Champagne Muse"}, price:5290, cond:"new",
    img:"https://images.unsplash.com/photo-1735352246756-1abb2a4ba09c?auto=format&fit=crop&w=900&q=70",
    dHe:"לוח שמפניה · אינדקסים משובצים · רצועת פלדה", dEn:"Champagne dial · Set indices · Steel bracelet" },
  { id:"women-4", cat:"women", name:{he:"HAY אטואל דו-טון", en:"HAY Étoile Duo-Tone"}, price:4990, cond:"new",
    img:"https://images.unsplash.com/photo-1610888968213-4f6d2c068108?auto=format&fit=crop&w=900&q=70",
    dHe:"שילוב זהב וכסף · תנועה אוטומטית · קוטר 34 מ״מ", dEn:"Gold & silver combination · Automatic movement · 34mm" },
  { id:"women-5", cat:"women", name:{he:"HAY לומייר", en:"HAY Lumière"}, price:3690, cond:"used",
    img:"https://images.unsplash.com/photo-1506193095-80bc749473f2?auto=format&fit=crop&w=900&q=70",
    dHe:"יד שנייה · מצב מצוין · נבדק ואומת ע״י המעבדה שלנו", dEn:"Pre-owned · Excellent condition · Authenticated in-house" },

  // ---- Premium Straps ----
  { id:"strap-1", cat:"straps", name:{he:"רצועת עור חום קלאסית", en:"Classic Brown Leather Strap"}, price:390, cond:"new",
    img:"https://images.unsplash.com/photo-1434704504321-71a8bc15a685?auto=format&fit=crop&w=900&q=70",
    dHe:"עור איטלקי מעובד ביד · אבזם נירוסטה · 20 מ״מ", dEn:"Hand-finished Italian leather · Steel buckle · 20mm" },
  { id:"strap-2", cat:"straps", name:{he:"רצועת עור וינטג׳ עבה", en:"Buffed Vintage Leather Strap"}, price:450, cond:"new",
    img:"https://images.unsplash.com/photo-1767009951341-73a7c96e1aab?auto=format&fit=crop&w=900&q=70",
    dHe:"מראה וינטג׳ מיושן · עור עבה איכותי · 22 מ״מ", dEn:"Distressed vintage look · Heavy-duty leather · 22mm" },
  { id:"strap-3", cat:"straps", name:{he:"רצועת עור שחורה יוקרתית", en:"Luxury Black Leather Strap"}, price:420, cond:"new",
    img:"https://images.unsplash.com/photo-1434704504321-71a8bc15a685?auto=format&fit=crop&w=900&q=70",
    dHe:"תפרים בגוון זהב · עור מבריק · 20 מ״מ", dEn:"Gold-tone stitching · Polished leather · 20mm" },

  // ---- Accessories & Boxes ----
  { id:"acc-1", cat:"accessories", name:{he:"קופסת עור לשעונים", en:"Leather Watch Box"}, price:650, cond:"new",
    img:"https://images.unsplash.com/photo-1751437738389-1b339b7a78ef?auto=format&fit=crop&w=900&q=70",
    dHe:"רפידה קטיפה פנימית · נעילה מגנטית · מקום לשעון אחד", dEn:"Velvet-lined interior · Magnetic clasp · Single watch slot" },
  { id:"acc-2", cat:"accessories", name:{he:"סט תצוגה לשלושה שעונים", en:"Triple Watch Display Set"}, price:890, cond:"new",
    img:"https://images.unsplash.com/photo-1634394412850-b3a7571b334b?auto=format&fit=crop&w=900&q=70",
    dHe:"עמדת עץ ממותג · מקום לשלושה שעונים · גימור מט", dEn:"Branded wooden stand · Holds 3 watches · Matte finish" },
  { id:"acc-3", cat:"accessories", name:{he:"ערכת טיפוח וניקוי לשעונים", en:"Watch Care & Cleaning Kit"}, price:320, cond:"new",
    img:"https://images.unsplash.com/photo-1704783339057-3fb087d3bc98?auto=format&fit=crop&w=900&q=70",
    dHe:"מברשת עדינה · מטלית מיקרופייבר · תרסיס ניקוי לזכוכית", dEn:"Soft brush · Microfiber cloth · Crystal cleaning spray" }
];

const ARTICLES = [
  { he:"איך לבחור את השעון הראשון שלך", en:"How to Choose Your First Watch",
    img:"https://images.unsplash.com/photo-1628678172909-13a7209c7d62?auto=format&fit=crop&w=700&q=60" },
  { he:"שעון אוטומטי מול קוורץ", en:"Automatic vs. Quartz",
    img:"https://images.unsplash.com/photo-1623998021450-85c29c644e0d?auto=format&fit=crop&w=700&q=60" },
  { he:"המדריך לשמירה על רצועות עור", en:"Caring for Leather Straps",
    img:"https://images.unsplash.com/photo-1434704504321-71a8bc15a685?auto=format&fit=crop&w=700&q=60" }
];

function fmtPrice(n){ return "₪" + Number(n).toLocaleString("en-US"); }

function productImgHtml(p){
  const src = (typeof bestProductImg === 'function') ? bestProductImg(p) : p.img;
  if(src){
    return `<img src="${src}" alt="${p.name.en}" loading="lazy">`;
  }
  const brand = p.brand ? p.brand.toUpperCase() : '';
  return `<div class="img-placeholder">
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
