
/* Mentoria Blindagem Emocional — interações da página */
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const body = document.body;
    const menuButton = $('.menu-mobile');
    const nav = $('.nav');
    const openVideo = $('#openVideo');
    const closeVideo = $('#closeVideo');
    const videoModal = $('#videoModal');
    const modalVideo = $('#modalVideo');

    let lastFocused = null;


    /* ============================================================
       VÍDEO MODAL
    ============================================================ */

    const showVideo = () => {

      if (!videoModal) return;

      lastFocused = document.activeElement;

      videoModal.classList.add('active');
      videoModal.setAttribute('aria-hidden', 'false');

      body.classList.add('modal-open');
      body.style.overflow = 'hidden';

      if (closeVideo) {
        closeVideo.focus();
      }

      if (modalVideo) {
        modalVideo.currentTime = 0;

        const play = modalVideo.play();

        if (play?.catch) {
          play.catch(() => {});
        }
      }
    };


    const hideVideo = () => {

      if (!videoModal) return;

      videoModal.classList.remove('active');
      videoModal.setAttribute('aria-hidden', 'true');

      body.classList.remove('modal-open');
      body.style.overflow = '';

      if (modalVideo) {

        modalVideo.pause();

        try {
          modalVideo.currentTime = 0;
        } catch (_) {}

      }

      if (lastFocused?.focus) {
        lastFocused.focus();
      }
    };


    openVideo?.addEventListener('click', showVideo);

    closeVideo?.addEventListener('click', hideVideo);

    videoModal?.addEventListener('click', e => {

      if (e.target === videoModal) {
        hideVideo();
      }

    });



    /* ============================================================
       MENU MOBILE
    ============================================================ */

    const closeMenu = () => {

      if (!menuButton || !nav) return;

      nav.classList.remove('active');

      menuButton.classList.remove('active');

      menuButton.setAttribute('aria-expanded', 'false');

      menuButton.setAttribute('aria-label', 'Abrir menu');
    };


    menuButton?.addEventListener('click', () => {

      if (!nav) return;

      const expanded =
        menuButton.getAttribute('aria-expanded') === 'true';

      menuButton.setAttribute(
        'aria-expanded',
        String(!expanded)
      );

      menuButton.setAttribute(
        'aria-label',
        expanded ? 'Abrir menu' : 'Fechar menu'
      );

      menuButton.classList.toggle(
        'active',
        !expanded
      );

      nav.classList.toggle(
        'active',
        !expanded
      );

    });


    $$('.nav a').forEach(link => {

      link.addEventListener('click', closeMenu);

    });


    document.addEventListener('click', e => {

      if (
        nav?.classList.contains('active') &&
        !nav.contains(e.target) &&
        !menuButton?.contains(e.target)
      ) {
        closeMenu();
      }

    });


    document.addEventListener('keydown', e => {

      if (e.key === 'Escape') {

        closeMenu();

        if (videoModal?.classList.contains('active')) {
          hideVideo();
        }

      }

    });



    /* ============================================================
       CARROSSEL DE DEPOIMENTOS
    ============================================================ */

    const viewport = $('.depoimentos-viewport');
    const track = $('.depoimentos-track');

    const cards = $$('.depoimento-card', track || document);

    const prev = $('.depoimentos-prev');
    const next = $('.depoimentos-next');

    let cardIndex = 0;


    const moveCarousel = direction => {

      if (!viewport || !track || cards.length < 1) return;

      const gap =
        parseFloat(getComputedStyle(track).gap) || 0;

      const cardWidth =
        cards[0].getBoundingClientRect().width + gap;

      const maxIndex = Math.max(
        0,
        cards.length -
        Math.max(
          1,
          Math.floor(
            (viewport.clientWidth + gap) /
            cardWidth
          )
        )
      );


      cardIndex += direction;


      if (cardIndex > maxIndex) {
        cardIndex = 0;
      }


      if (cardIndex < 0) {
        cardIndex = maxIndex;
      }


      viewport.scrollTo({

        left: cardIndex * cardWidth,

        behavior:
          window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches
            ? 'auto'
            : 'smooth'

      });

    };


    prev?.addEventListener(
      'click',
      () => moveCarousel(-1)
    );

    next?.addEventListener(
      'click',
      () => moveCarousel(1)
    );



    /* ============================================================
       FAQ
    ============================================================ */

    const faqItems = $$('.faq-item');


    window.addEventListener('resize', () => {

      if (viewport && cards.length) {

        const gap =
          parseFloat(getComputedStyle(track).gap) || 0;

        const step =
          cards[0].getBoundingClientRect().width + gap;

        cardIndex =
          Math.max(
            0,
            Math.round(
              viewport.scrollLeft /
              (step || 1)
            )
          );

      }


      faqItems.forEach(item => {

        const q = $('.faq-question', item);
        const a = $('.faq-answer', item);

        if (
          q?.getAttribute('aria-expanded') === 'true' &&
          a
        ) {

          a.style.maxHeight =
            `${a.scrollHeight}px`;

        }

      });

    });


    faqItems.forEach(item => {

      const question =
        $('.faq-question', item);

      const answer =
        $('.faq-answer', item);

      if (!question || !answer) return;


      answer.style.overflow = 'hidden';

      answer.style.maxHeight =
        question.getAttribute('aria-expanded') === 'true'
          ? `${answer.scrollHeight}px`
          : '0px';


      question.addEventListener('click', () => {

        const shouldOpen =
          question.getAttribute('aria-expanded') !== 'true';


        faqItems.forEach(other => {

          const q =
            $('.faq-question', other);

          const a =
            $('.faq-answer', other);

          if (!q || !a) return;


          q.setAttribute(
            'aria-expanded',
            'false'
          );

          a.style.maxHeight = '0px';


          const icon =
            $('.faq-icon', q);

          if (icon) {
            icon.textContent = '+';
          }

        });


        if (shouldOpen) {

          question.setAttribute(
            'aria-expanded',
            'true'
          );

          answer.style.maxHeight =
            `${answer.scrollHeight}px`;


          const icon =
            $('.faq-icon', question);

          if (icon) {
            icon.textContent = '−';
          }

        }

      });

    });



    /* ============================================================
       REVELAÇÃO SUAVE AO ROLAR A PÁGINA
       Anima automaticamente as seções, sem editar o HTML.
       Para alterar ou remover o efeito, edite este bloco.
    ============================================================ */

    // Seleciona todas as seções, exceto o Hero, e o rodapé
    const revealTargets = $$('section:not(.hero), footer');

    // Verifica se o navegador permite a animação
    if (
      !window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches &&
      'IntersectionObserver' in window
    ) {

      // Adiciona a classe que permite controlar a animação pelo CSS
      document.documentElement.classList.add('js-reveal');

      // Prepara as seções para a animação
      revealTargets.forEach(section => {
        section.classList.add('scroll-reveal');
      });

      // Detecta quando uma seção entra na área visível da tela
      const observer = new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            // Torna a seção visível
            entry.target.classList.add('visible');

            // Evita repetir a animação nessa seção
            observer.unobserve(entry.target);

          });

        },
        {
          threshold: 0.03,
          rootMargin: '0px 0px -10px 0px'
        }
      );

      // Ativa a observação de todas as seções selecionadas
      revealTargets.forEach(section => {
        observer.observe(section);
      });

    } else {

      // Mantém tudo visível se a animação não for suportada
      revealTargets.forEach(section => {
        section.classList.add('visible');
      });

    }

  });

})();