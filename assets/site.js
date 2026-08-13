/* ============================================================
   Shared engine for the multi-page site.
   Every page includes this file, then calls initPage('pageId').
   Content always comes from content/site.json — this file only
   contains layout/markup logic, never the actual text.
   ============================================================ */

var DATA = null;
var LANG = 'en';
var CURRENT_PAGE = 'home';

var PAGES = [
  { id: 'home',          file: 'index.html',          labelKey: null },
  { id: 'about',         file: 'about.html',          labelKey: 'about' },
  { id: 'awards',        file: 'awards.html',         labelKey: 'awards' },
  { id: 'initiatives',   file: 'initiatives.html',    labelKey: 'initiatives' },
  { id: 'teaching',      file: 'teaching.html',       labelKey: 'teaching' },
  { id: 'publications',  file: 'publications.html',   labelKey: 'publications' },
  { id: 'media',         file: 'media.html',          labelKey: 'media' },
  { id: 'consultations', file: 'consultations.html',  labelKey: 'consultations' },
  { id: 'contact',       file: 'contact.html',        labelKey: null }
];

function esc(s){ return (s===undefined||s===null) ? '' : String(s); }

function pathToRoot(){
  // pages live at the site root, so assets/content are siblings
  return '';
}

async function initPage(pageId){
  CURRENT_PAGE = pageId;
  initLangFromUrl();
  const res = await fetch(pathToRoot() + 'content/site.json', {cache:'no-store'});
  DATA = await res.json();
  renderPage();
}

function initLangFromUrl(){
  const params = new URLSearchParams(window.location.search);
  const l = params.get('lang');
  if (l === 'ar' || l === 'en') LANG = l;
}

function setLang(l){
  LANG = l;
  const url = new URL(window.location.href);
  url.searchParams.set('lang', l);
  window.history.replaceState(null, '', url.toString());
  renderPage();
}

function renderPage(){
  const en = LANG === 'en';
  document.documentElement.lang = LANG;
  document.documentElement.dir = en ? 'ltr' : 'rtl';

  const bodyFn = {
    home: renderHome, about: renderAbout, awards: renderAwards,
    initiatives: renderInitiatives, teaching: renderTeaching,
    publications: renderPublications, media: renderMedia,
    consultations: renderConsultations, contact: renderContact
  }[CURRENT_PAGE];

  document.getElementById('app').innerHTML =
    renderHeader(en) + '<main id="top">' + bodyFn(en) + '</main>' + renderFooter(en);

  document.getElementById('bookingForm').innerHTML = bookingFormHtml(en);
  document.getElementById('bookingConfirm').innerHTML = bookingConfirmHtml(en);
}

/* ---------------- Header / Nav ---------------- */
function renderHeader(en){
  const nav = DATA.nav[LANG];
  const links = PAGES.filter(p => p.labelKey).map(function(p){
    const active = p.id === CURRENT_PAGE ? 'style="color:var(--ink); border-color:var(--gold);"' : '';
    return '<li><a href="'+p.file+(en?'':'?lang=ar')+'" '+active+'>'+esc(nav[p.labelKey])+'</a></li>';
  }).join('');
  return `
  <header>
    <nav>
      <a href="index.html${en?'':'?lang=ar'}" class="logo">${esc(nav.logoName)}<span>${esc(nav.logoTag)}</span></a>
      <ul class="navlinks">
        ${links}
        <li><button class="btn btn-primary" onclick="openBooking()">${esc(nav.bookBtn)}</button></li>
        <li class="langswitch">
          <button id="btn-en" class="${en?'active':''}" onclick="setLang('en')">EN</button>
          <button id="btn-ar" class="${!en?'active':''}" onclick="setLang('ar')">AR</button>
        </li>
      </ul>
    </nav>
  </header>`;
}

/* ---------------- Footer (appears on every page) ---------------- */
function renderFooter(en){
  const c = DATA.contact[LANG];
  return `
  <footer id="contact-strip">
    <div class="wrap footer-bottom" style="margin-top:0; padding-top:22px;">
      <span>${esc(c.copyright)}</span>
      <span>${esc(c.tagline)}</span>
    </div>
  </footer>`;
}

/* ---------------- HOME ---------------- */
function renderHome(en){
  const T = DATA.hero[LANG];
  const heroPhoto = DATA.site.photo
    ? '<img src="'+esc(DATA.site.photo)+'" alt="'+esc(DATA.nav[LANG].logoName)+'">'
    : '<div class="ph">photo</div>';
  const statsHtml = DATA.hero.stats.map(function(s){
    const inner = '<b>'+esc(s.value)+'</b><span>'+esc(en?s.labelEn:s.labelAr)+'</span>';
    return s.url
      ? '<a class="hero-stat" href="'+esc(s.url)+'" target="_blank" rel="noopener" style="text-decoration:none;">'+inner+'</a>'
      : '<div class="hero-stat">'+inner+'</div>';
  }).join('');
  return `
  <section class="hero">
    <div class="wrap"><div class="hero-panel"><div class="hero-grid">
      <div class="hero-photo-wrap"><div class="hero-photo">${heroPhoto}</div></div>
      <div class="hero-text">
        <p class="eyebrow">${esc(T.eyebrow)}</p>
        <h1>${esc(T.h1)}</h1>
        <p class="lede">${esc(T.lede)}</p>
        <div class="hero-stats">${statsHtml}</div>
        <div class="hero-ctas">
          <button class="btn btn-primary" onclick="openBooking()">${esc(T.ctaPrimary)}</button>
          <a href="publications.html${en?'':'?lang=ar'}" class="btn btn-ghost">${esc(T.ctaGhost)}</a>
        </div>
      </div>
    </div></div></div>
  </section>`;
}

/* ---------------- ABOUT ---------------- */
function renderAbout(en){
  const T = DATA.about[LANG];
  return `
  <section id="about">
    <div class="wrap about-grid">
      <div>
        <p class="eyebrow">${en?'About':'نبذة'}</p>
        <h2>${esc(T.h2)}</h2>
      </div>
      <div>
        <p class="lede" style="font-size:16px;">${esc(T.p1)}</p>
        <p class="pull">"${esc(T.quote)}"</p>
        <p class="lede" style="font-size:16px;">${esc(T.p2)}</p>
        <ul class="creds">
          <li><b>${en?'Ph.D.':'دكتوراه'}</b> ${esc(en?DATA.about.credEducation.en.replace('Ph.D. ',''):DATA.about.credEducation.ar.replace('دكتوراه ',''))}</li>
          <li><b>${en?'Based in':'مقيمة في'}</b> ${esc(DATA.site.based)}</li>
          <li><b>${en?'Email':'البريد الإلكتروني'}</b> <a href="mailto:${esc(DATA.site.email)}">${esc(DATA.site.email)}</a></li>
          <li><b>${en?'Profiles':'الصفحات'}</b> <a href="${esc(DATA.site.socialLinks.scholar)}" target="_blank" rel="noopener">Google Scholar</a> &middot; <a href="${esc(DATA.site.socialLinks.scopus)}" target="_blank" rel="noopener">Scopus</a> &middot; <a href="${esc(DATA.site.socialLinks.orcid)}" target="_blank" rel="noopener">ORCID</a> &middot; <a href="${esc(DATA.site.socialLinks.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  </section>`;
}

/* ---------------- AWARDS ---------------- */
function renderAwards(en){
  const T = DATA.awards[LANG];
  const items = DATA.awards.items.map(function(a){
    const thumb = a.image ? '<img class="award-thumb" src="'+esc(a.image)+'" alt="">' : '';
    return '<div class="award-card">'+thumb+'<span class="award-year">'+esc(a.year)+'</span><div><div class="award-title">'+esc(en?a.titleEn:a.titleAr)+'</div>'+((en?a.noteEn:a.noteAr)?'<div class="award-note">'+esc(en?a.noteEn:a.noteAr)+'</div>':'')+'</div></div>';
  }).join('');
  return `
  <section>
    <div class="wrap">
      <div class="section-head"><div><p class="eyebrow">${esc(T.eyebrow)}</p><h2>${esc(T.h2)}</h2></div></div>
      <div class="awards-grid">${items}</div>
    </div>
  </section>`;
}

/* ---------------- INITIATIVES ---------------- */
function renderInitiatives(en){
  const T = DATA.initiatives[LANG];
  const items = DATA.initiatives.items.map(function(i){
    const thumb = i.image ? '<img class="init-thumb" src="'+esc(i.image)+'" alt="">' : '';
    return '<div class="init-card">'+thumb+'<span class="role-tag">'+esc(en?i.tagEn:i.tagAr)+'</span><h3>'+esc(i.title)+'</h3><p>'+esc(en?i.descEn:i.descAr)+'</p></div>';
  }).join('');
  return `
  <section>
    <div class="wrap">
      <div class="section-head"><div><p class="eyebrow">${esc(T.eyebrow)}</p><h2>${esc(T.h2)}</h2></div></div>
      <div class="init-grid">${items}</div>
    </div>
  </section>`;
}

/* ---------------- TEACHING ---------------- */
function renderTeaching(en){
  const T = DATA.teaching[LANG];
  const rows = DATA.teaching.positions.map(function(p){
    const thumb = p.image ? '<img class="pos-thumb" src="'+esc(p.image)+'" alt="">' : '';
    return '<li class="pos-row"><div class="pos-dates">'+esc(p.dates)+'</div><div class="pos-body">'+thumb+'<div><div class="pos-title">'+esc(en?p.titleEn:p.titleAr)+'</div><div class="pos-org">'+esc(en?p.org:p.orgAr)+'</div><p class="pos-desc">'+esc(en?p.descEn:p.descAr)+'</p></div></div></li>';
  }).join('');
  return `
  <section>
    <div class="wrap">
      <div class="section-head"><div><p class="eyebrow">${esc(T.eyebrow)}</p><h2>${esc(T.h2)}</h2></div></div>
      <ul class="pos-list">${rows}</ul>
      <div class="training-stat">
        <div><b>${esc(DATA.teaching.trainingStat.value)}</b><span>${esc(en?DATA.teaching.trainingStat.labelEn:DATA.teaching.trainingStat.labelAr)}</span></div>
        <span style="color:#C9DCD5; font-size:14.5px; max-width:46ch;">${esc(en?DATA.teaching.trainingStat.noteEn:DATA.teaching.trainingStat.noteAr)}</span>
      </div>
    </div>
  </section>`;
}

/* ---------------- PUBLICATIONS ---------------- */
function renderPublications(en){
  const T = DATA.publications[LANG];
  const books = DATA.publications.books.map(function(b){
    const thumb = b.image ? '<img class="book-thumb" src="'+esc(b.image)+'" alt="">' : '';
    return '<div class="card">'+thumb+'<span class="tag">'+esc(en?b.tagEn:b.tagAr)+'</span><h3>'+esc(b.title)+'</h3><p class="venue">'+esc(en?b.venueEn:b.venueAr)+'</p></div>';
  }).join('');
  const articles = DATA.publications.articles.map(function(a){
    return '<li class="pub-row"><div><span class="p-title">'+esc(en?a.titleEn:a.titleAr)+'</span><span class="p-venue">'+esc(en?a.venueEn:a.venueAr)+'</span></div><span class="p-year">'+esc(a.year)+'</span></li>';
  }).join('');
  const arOnly = (!en && DATA.publications.arabicOnly) ? (
    '<div style="margin-top:44px;"><div class="media-sub"><h3>منشورات باللغة العربية</h3></div><ul class="pub-list">' +
    DATA.publications.arabicOnly.map(function(a){
      return '<li class="pub-row"><div><span class="p-title">'+esc(a.title)+'</span>'+(a.venue?'<span class="p-venue">'+esc(a.venue)+'</span>':'')+'</div><span class="p-year">'+esc(a.year)+'</span></li>';
    }).join('') + '</ul></div>'
  ) : '';
  return `
  <section>
    <div class="wrap">
      <div class="section-head">
        <div><p class="eyebrow">${esc(T.eyebrow)}</p><h2>${esc(T.h2)}</h2></div>
        <a href="${esc(DATA.site.socialLinks.scholar)}" target="_blank" rel="noopener" class="btn btn-ghost">${esc(T.scholarLink)}</a>
      </div>
      <div class="pub-grid">${books}</div>
      <ul class="pub-list">${articles}</ul>
      ${arOnly}
    </div>
  </section>`;
}

/* ---------------- MEDIA ---------------- */
function renderMedia(en){
  const T = DATA.media[LANG];
  const videos = DATA.media.videos.map(function(v){
    const thumb = v.thumbnail ? '<img src="'+esc(v.thumbnail)+'">' : '';
    return '<a href="'+esc(v.url)+'" class="video-card" target="_blank" rel="noopener"><div class="video-thumb">'+thumb+'<div class="play"></div></div><h4>'+esc(en?v.titleEn:v.titleAr)+'</h4><p class="meta">'+esc(v.meta)+'</p></a>';
  }).join('');
  const linksMap = [
    {label:{en:'YouTube channel',ar:'قناة يوتيوب'}, url: DATA.site.socialLinks.youtube},
    {label:{en:'LinkedIn',ar:'لينكدإن'}, url: DATA.site.socialLinks.linkedin},
    {label:{en:'Google Scholar',ar:'Google Scholar'}, url: DATA.site.socialLinks.scholar},
    {label:{en:'Scopus',ar:'Scopus'}, url: DATA.site.socialLinks.scopus},
    {label:{en:'ORCID',ar:'ORCID'}, url: DATA.site.socialLinks.orcid}
  ];
  const links = linksMap.map(function(l){
    return '<a href="'+esc(l.url)+'" class="chip" target="_blank" rel="noopener"><span class="dot"></span>'+esc(en?l.label.en:l.label.ar)+'</a>';
  }).join('');
  return `
  <section>
    <div class="wrap">
      <div class="section-head"><div><p class="eyebrow">${esc(T.eyebrow)}</p><h2>${esc(T.h2)}</h2></div></div>
      <div class="video-grid">${videos}</div>
      <div class="media-sub"><h3>${esc(T.elseSub)}</h3></div>
      <div class="elsewhere">${links}</div>
    </div>
  </section>`;
}

/* ---------------- CONSULTATIONS ---------------- */
function renderConsultations(en){
  const T = DATA.consultations[LANG];
  const cards = DATA.consultations.cards.map(function(c){
    return '<div class="consult-card"><h4>'+esc(en?c.titleEn:c.titleAr)+'</h4></div>';
  }).join('');
  return `
  <section>
    <div class="wrap">
      <div class="events-panel">
        <p class="eyebrow" style="color:#9FC2B7;">${esc(T.eyebrow)}</p>
        <h2>${esc(T.h2)}</h2>
        <p class="lede">${esc(T.lede)}</p>
        <div class="consult-grid">${cards}</div>
        <div class="book-cta">
          <div><h3 style="color:#F6F0E3; font-size:20px;">${esc(T.ctaTitle)}</h3><p>${esc(T.ctaDesc)}</p></div>
          <button class="btn btn-primary" style="background:var(--gold); color:#241a06;" onclick="openBooking()">${esc(T.ctaBtn)}</button>
        </div>
      </div>
    </div>
  </section>`;
}

/* ---------------- CONTACT ---------------- */
function renderContact(en){
  const T = DATA.contact[LANG];
  return `
  <section>
    <div class="wrap footer-grid">
      <div>
        <p class="eyebrow">${esc(T.eyebrow)}</p>
        <h2 style="font-size:28px; margin:10px 0 16px;">${esc(T.h2)}</h2>
        <p class="lede" style="margin-bottom:24px;">${esc(T.lede)}</p>
        <form class="contact-form" onsubmit="return handleContactSubmit(event)">
          <div class="row"><input type="text" placeholder="${en?'Your name':'الاسم'}" required><input type="email" placeholder="you@email.com" required></div>
          <textarea placeholder="${en?"What's this about?":'ما موضوع رسالتك؟'}" required></textarea>
          <button type="submit" class="btn btn-primary" style="justify-self:start;">${en?'Send message':'إرسال الرسالة'}</button>
        </form>
        <div class="social-row">
          <a href="${esc(DATA.site.socialLinks.youtube)}" target="_blank" rel="noopener">${en?'YouTube':'يوتيوب'}</a>
          <a href="${esc(DATA.site.socialLinks.linkedin)}" target="_blank" rel="noopener">${en?'LinkedIn':'لينكدإن'}</a>
          <a href="${esc(DATA.site.socialLinks.scholar)}" target="_blank" rel="noopener">Google Scholar</a>
          <a href="mailto:${esc(DATA.site.email)}">${en?'Email':'البريد الإلكتروني'}</a>
        </div>
      </div>
      <div>
        <p class="eyebrow">${en?'Details':'التفاصيل'}</p>
        <div class="creds" style="margin-top:14px;">
          <div><b>${en?'Email':'البريد الإلكتروني'}</b> ${esc(DATA.site.email)}</div>
          <div><b>${en?'Based in':'مقيمة في'}</b> ${esc(DATA.site.based)}</div>
          <div><b>${en?'Affiliation':'الانتماء'}</b> ${esc(DATA.site.affiliation)}</div>
        </div>
        <p class="marginalia" style="margin-top:26px;"><span class="arrow">&#8618;</span>${esc(T.note)}</p>
      </div>
    </div>
  </section>`;
}

/* ---------------- Booking modal (shared across all pages) ---------------- */
function bookingFormHtml(en){
  const T = DATA.booking[LANG];
  return `
    <h3>${esc(T.title)}</h3>
    <p class="lede">${esc(T.lede)}</p>
    <form class="contact-form" onsubmit="return handleBookingSubmit(event)">
      <div class="row"><input type="text" placeholder="${en?'Your name':'الاسم'}" required><input type="email" placeholder="you@email.com" required></div>
      <div class="row"><input type="text" placeholder="${en?'Organization':'الجهة / المؤسسة'}" required><input type="date" required></div>
      <textarea placeholder="${en?'What would you like to talk about?':'ما الذي تودّين مناقشته؟'}" required></textarea>
      <button type="submit" class="btn btn-primary" style="justify-self:start;">${en?'Request appointment':'إرسال طلب الحجز'}</button>
    </form>`;
}
function bookingConfirmHtml(en){
  const T = DATA.booking[LANG];
  return `
    <div class="check">&#10003;</div>
    <h3>${esc(T.confirmTitle)}</h3>
    <p class="lede" style="margin:0 auto;">${esc(T.confirmLede)}</p>
    <button class="btn btn-ghost" style="margin-top:20px;" onclick="closeBooking()">${esc(T.closeBtn)}</button>`;
}
function openBooking(){
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('bookingConfirm').classList.remove('open');
  document.getElementById('bookingModal').classList.add('open');
}
function closeBooking(){ document.getElementById('bookingModal').classList.remove('open'); }
function handleBookingSubmit(e){
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const name = inputs[0] ? inputs[0].value : '';
  const email = inputs[1] ? inputs[1].value : '';
  const org = inputs[2] ? inputs[2].value : '';
  const date = inputs[3] ? inputs[3].value : '';
  const message = form.querySelector('textarea') ? form.querySelector('textarea').value : '';
  const subject = encodeURIComponent((LANG==='ar' ? 'طلب حجز استشارة من ' : 'Consultation request from ') + name);
  const body = encodeURIComponent(
    (LANG==='ar' ? 'الاسم: ' : 'Name: ') + name + '\n' +
    (LANG==='ar' ? 'البريد: ' : 'Email: ') + email + '\n' +
    (LANG==='ar' ? 'الجهة: ' : 'Organization: ') + org + '\n' +
    (LANG==='ar' ? 'التاريخ: ' : 'Date: ') + date + '\n' +
    (LANG==='ar' ? 'الرسالة: ' : 'Message: ') + message
  );
  window.location.href = 'mailto:' + esc(DATA.site.email) + '?subject=' + subject + '&body=' + body;
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingConfirm').classList.add('open');
  return false;
}
function handleContactSubmit(e){
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const name = inputs[0] ? inputs[0].value : '';
  const email = inputs[1] ? inputs[1].value : '';
  const message = form.querySelector('textarea') ? form.querySelector('textarea').value : '';
  const subject = encodeURIComponent((LANG==='ar' ? 'رسالة من ' : 'Message from ') + name + (LANG==='ar' ? ' عبر الموقع' : ' via website'));
  const body = encodeURIComponent(
    (LANG==='ar' ? 'الاسم: ' : 'Name: ') + name + '\n' +
    (LANG==='ar' ? 'البريد: ' : 'Email: ') + email + '\n' +
    (LANG==='ar' ? 'الرسالة: ' : 'Message: ') + message
  );
  window.location.href = 'mailto:' + esc(DATA.site.email) + '?subject=' + subject + '&body=' + body;
  alert(LANG==='ar' ? "سيتم فتح تطبيق البريد لديك لإتمام الإرسال." : "Your email app will open to complete sending.");
  e.target.reset();
  return false;
}
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'bookingModal') closeBooking();
});
