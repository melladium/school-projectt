(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ============================
     ПРЕЛОАДЕР
     ============================ */
  const preloader = document.getElementById('preloader');
  const preCount  = document.getElementById('preCount');
  const preText   = document.getElementById('preText');

  const preMessages = [
    'загрузка рынка труда',
    'сбор статистики 2025',
    'анализ разрыва',
    'готово'
  ];

  let preProgress = 0;
  let preFinished = false;

  function finishPreloader() {
    if (preFinished) return;
    preFinished = true;
    if (preloader) preloader.classList.add('is-done');
    document.body.style.overflow = '';
    heroIntro();
    setTimeout(() => ScrollTrigger.refresh(), 400);
  }

  function runPreloader() {
    const interval = setInterval(() => {
      preProgress += Math.random() * 14 + 5;
      if (preProgress >= 100) {
        preProgress = 100;
        clearInterval(interval);
        setTimeout(finishPreloader, 400);
      }
      if (preCount) preCount.textContent = Math.floor(preProgress);

      const idx = Math.min(
        Math.floor((preProgress / 100) * preMessages.length),
        preMessages.length - 1
      );
      if (preText) preText.textContent = preMessages[idx];
    }, 80);
  }

  document.body.style.overflow = 'hidden';
  window.addEventListener('load', runPreloader);
  setTimeout(() => { if (!preFinished) { preProgress = 100; finishPreloader(); } }, 3500);

  /* ============================
     HERO INTRO
     ============================ */
  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero__top .brand', {
      y: -20, opacity: 0, duration: 0.8, stagger: 0.1
    })
    .from('.hero__line', {
      y: 100, opacity: 0, duration: 1.2, stagger: 0.12
    }, '-=0.4')
    .from('.hero__sub', {
      y: 30, opacity: 0, duration: 0.9
    }, '-=0.7')
    .from('.hero__cta .btn', {
      y: 20, opacity: 0, duration: 0.7, stagger: 0.1
    }, '-=0.5')
    .from('.hero__stat-num', {
      scale: 0.6, opacity: 0, duration: 1.5, ease: 'power4.out'
    }, '-=1')
    .from('.hero__stat-suffix', {
      x: -20, opacity: 0, duration: 0.7
    }, '-=1.1')
    .from('.hero__stat-label', {
      y: 20, opacity: 0, duration: 0.8
    }, '-=0.9')
    .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.5');
  }

  /* ============================
     REVEAL
     ============================ */
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ============================
     PARALLAX — цифра в hero
     ============================ */
  const heroStatNum = document.querySelector('[data-parallax-num]');
  if (heroStatNum) {
    gsap.to(heroStatNum, {
      yPercent: -35,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  /* ============================
     PIN-СЕКЦИЯ ЦИФР
     ============================ */
  const numbersSection = document.querySelector('.numbers');
  const slides = gsap.utils.toArray('[data-num-slide]');
  const progressBar = document.getElementById('numProgress');

  if (numbersSection && slides.length) {
    let currentIndex = -1;

    function animateCount(slide) {
      slide.querySelectorAll('[data-count]').forEach((counter) => {
        const target = parseFloat(counter.dataset.count);
        const decimals = parseInt(counter.dataset.decimals || '0', 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = decimals
              ? obj.val.toFixed(decimals).replace('.', ',')
              : Math.floor(obj.val).toString();
          }
        });
      });
    }

    function showSlide(index) {
      if (index === currentIndex || index < 0) return;
      currentIndex = index;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      if (progressBar) progressBar.style.width = ((index + 1) / slides.length) * 100 + '%';
      animateCount(slides[index]);
    }

    ScrollTrigger.create({
      trigger: numbersSection,
      start: 'top top',
      end: () => '+=' + (slides.length * 100) + '%',
      pin: '.numbers__pin',
      pinSpacing: true,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * slides.length),
          slides.length - 1
        );
        showSlide(idx);
      },
      onEnter: () => showSlide(0),
      onEnterBack: () => showSlide(slides.length - 1)
    });

    showSlide(0);
  }

  /* ============================
     КНОПКИ
     ============================ */
  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const data = {
        title: 'Образование умерло',
        text: 'Почему диплом больше не гарантирует работу?',
        url: window.location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(data);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          const original = shareBtn.textContent;
          shareBtn.textContent = 'Ссылка скопирована';
          setTimeout(() => { shareBtn.textContent = original; }, 1800);
        }
      } catch (err) {}
    });
  }

  /* ============================
     КУРСОР НА PROBLEM ROW
     ============================ */
  document.querySelectorAll('.problem__row').forEach((row) => {
    row.addEventListener('mousemove', (e) => {
      const rect = row.getBoundingClientRect();
      row.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    });
  });

  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 600);
  });

})();