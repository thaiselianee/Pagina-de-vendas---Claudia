/* =====================================================
   MODAL DO VÍDEO
===================================================== */

const openVideo = document.getElementById("openVideo");
const closeVideo = document.getElementById("closeVideo");

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");


/* ABRIR */

openVideo.addEventListener("click", () => {

    videoModal.classList.add("active");

    videoModal.setAttribute(
        "aria-hidden",
        "false"
    );

    modalVideo.currentTime = 0;

    modalVideo.play();

});


/* FECHAR */

function fecharVideo() {

    videoModal.classList.remove("active");

    videoModal.setAttribute(
        "aria-hidden",
        "true"
    );

    modalVideo.pause();

}


/* BOTÃO X */

closeVideo.addEventListener(
    "click",
    fecharVideo
);


/* CLICAR FORA */

videoModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === videoModal
        ) {

            fecharVideo();

        }

    }
);


/* ESC */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            fecharVideo();

        }

    }
);

/* =====================================================
   MENU MOBILE
===================================================== */

const menuMobile = document.querySelector(".menu-mobile");
const nav = document.querySelector(".nav");


if (menuMobile && nav) {

    /* ABRIR / FECHAR MENU */

    menuMobile.addEventListener("click", () => {

        nav.classList.toggle("active");
        menuMobile.classList.toggle("active");

    });


    /* FECHAR AO CLICAR EM UM LINK */

    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");
            menuMobile.classList.remove("active");

        });

    });

}


/* =====================================================
   CARROSSEL DE DEPOIMENTOS
===================================================== */

document.querySelectorAll(".depoimentos-section").forEach((section) => {

    const viewport = section.querySelector(".depoimentos-viewport");
    const track = section.querySelector(".depoimentos-track");
    const prevButton = section.querySelector(".depoimentos-prev");
    const nextButton = section.querySelector(".depoimentos-next");

    if (!viewport || !track || !prevButton || !nextButton) {
        return;
    }

    // Calcula a largura de um card mais o espaçamento
    function getStep() {
        const card = track.querySelector(".depoimento-card");

        if (!card) return 0;

        const trackStyle = getComputedStyle(track);
        const gap = parseFloat(trackStyle.columnGap) || 0;

        return card.getBoundingClientRect().width + gap;
    }

    // Distância máxima de rolagem
    function getMaxScroll() {
        return Math.max(
            0,
            viewport.scrollWidth - viewport.clientWidth
        );
    }

    // Avançar
    nextButton.addEventListener("click", () => {
        const step = getStep();
        const maxScroll = getMaxScroll();

        if (!step || maxScroll <= 1) return;

        if (viewport.scrollLeft >= maxScroll - step * 0.6) {
            // Volta ao início
            viewport.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        } else {
            // Avança um card
            viewport.scrollBy({
                left: step,
                behavior: "smooth"
            });
        }
    });

    // Voltar
    prevButton.addEventListener("click", () => {
        const step = getStep();
        const maxScroll = getMaxScroll();

        if (!step || maxScroll <= 1) return;

        if (viewport.scrollLeft <= step * 0.6) {
            // Vai para o último conjunto
            viewport.scrollTo({
                left: maxScroll,
                behavior: "smooth"
            });
        } else {
            // Volta um card
            viewport.scrollBy({
                left: -step,
                behavior: "smooth"
            });
        }
    });

});


/* =====================================================
   FAQ — PERGUNTAS FREQUENTES
===================================================== */

document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
        const isOpen =
            question.getAttribute("aria-expanded") === "true";

        // Fecha as outras perguntas da mesma seção
        const faqList = item.closest(".faq-list");

        faqList.querySelectorAll(".faq-item").forEach((other) => {
            const otherQuestion =
                other.querySelector(".faq-question");
            const otherAnswer =
                other.querySelector(".faq-answer");

            otherQuestion.setAttribute("aria-expanded", "false");
            otherAnswer.style.maxHeight = null;
        });

        // Abre a pergunta selecionada
        if (!isOpen) {
            question.setAttribute("aria-expanded", "true");
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});