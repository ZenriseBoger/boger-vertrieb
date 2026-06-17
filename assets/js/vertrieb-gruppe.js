/* ZENRISE × ZENTHERM — Gruppen-Vertrieb (standalone JS) */
(function(){
'use strict';
var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

var nav=document.querySelector('.nav'), prog=document.getElementById('prog');
function onScroll(){var y=scrollY;if(nav)nav.classList.toggle('scrolled',y>20);var h=document.body.scrollHeight-innerHeight;if(prog)prog.style.width=(h>0?y/h*100:0)+'%';}
addEventListener('scroll',onScroll,{passive:true});onScroll();

var burger=document.getElementById('burger'),ov=document.getElementById('ov');
if(burger){burger.addEventListener('click',function(){var o=ov.classList.toggle('open');burger.classList.toggle('open',o);document.body.classList.toggle('lock',o);});
ov.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){ov.classList.remove('open');burger.classList.remove('open');document.body.classList.remove('lock');});});}

/* gate */
(function(){var g=document.getElementById('gate');if(!g)return;
var passed=false;try{passed=sessionStorage.getItem('zr-gate2')==='1';}catch(e){}
if(passed){g.parentNode&&g.parentNode.removeChild(g);return;}
document.body.classList.add('lock');
var ask=document.getElementById('gAsk'),rej=document.getElementById('gRej');
var y=g.querySelector('[data-g="yes"]'),n=g.querySelector('[data-g="no"]'),a=g.querySelector('[data-g="again"]');
if(y)y.addEventListener('click',function(e){e.preventDefault();try{sessionStorage.setItem('zr-gate2','1');}catch(_){}g.classList.add('closed');document.body.classList.remove('lock');setTimeout(function(){g.parentNode&&g.parentNode.removeChild(g);},550);});
if(n)n.addEventListener('click',function(e){e.preventDefault();if(ask)ask.style.display='none';if(rej)rej.style.display='block';});
if(a)a.addEventListener('click',function(e){e.preventDefault();if(rej)rej.style.display='none';if(ask)ask.style.display='block';});})();

/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.st').forEach(function(el){io.observe(el);});

/* counters */
function fmt(n,th){return th?n.toLocaleString('de-DE'):''+n;}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);cio.unobserve(e.target);}});},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});
function run(el){var tg=+el.dataset.count,sfx=el.dataset.suffix||'',th=el.dataset.thousands!==undefined,dur=1800,t0=performance.now();
if(reduced){el.textContent=fmt(tg,th)+sfx;return;}
(function s(t){var p=Math.min((t-t0)/dur,1);el.textContent=fmt(Math.round((1-Math.pow(1-p,3))*tg),th)+sfx;if(p<1)requestAnimationFrame(s);})(performance.now());}

/* faq */
document.querySelectorAll('.qa').forEach(function(it){var q=it.querySelector('.qa__q'),a=it.querySelector('.qa__a');q.addEventListener('click',function(){var o=it.classList.toggle('open');a.style.maxHeight=o?a.scrollHeight+'px':0;});});

/* demo form */
document.querySelectorAll('form[data-demo]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var w=f.closest('[data-wrap]')||f.parentNode,ok=w.querySelector('.ok');f.style.display='none';if(ok){ok.classList.add('show');ok.scrollIntoView({behavior:'smooth',block:'center'});}});});

/* Bewerbungs-Popup (Modal) */
(function(){
  var m=document.getElementById('applyModal'); if(!m) return;
  var frame=m.querySelector('iframe'), loaded=false;
  function open(){ if(!loaded){ frame.src=frame.getAttribute('data-src'); loaded=true; } m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('lock'); }
  function close(){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); }
  document.addEventListener('click',function(e){
    var trig=e.target.closest('[data-apply], a[href="#bewerben"], a[href$="#bewerben"]');
    if(trig){ e.preventDefault(); e.stopImmediatePropagation(); open(); return; }
    if(e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && m.classList.contains('open')) close(); });
  // Embed meldet Erfolg -> kurz Danke zeigen, dann schließen
  window.addEventListener('message',function(e){ if(e.data && e.data.type==='boger-hr:application-success'){ setTimeout(close, 2500); } });
})();

/* anchors */
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href');if(id.length<2)return;var t=document.querySelector(id);if(!t)return;e.preventDefault();scrollTo({top:t.getBoundingClientRect().top+scrollY-70,behavior:'smooth'});});
})();
