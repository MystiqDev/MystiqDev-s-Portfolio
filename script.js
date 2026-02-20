const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
});


const faders = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);

            } else {
                entry.target.classList.remove('show');
            }
        });
    },
    {
        threshold: 0.2
    }
);

faders.forEach(el => observer.observe(el));

const sidebar = document.querySelector('.sidebar');

function showSidebar() {
    sidebar.style.display = 'flex';
}

function hideSidebar() {
    sidebar.style.display = 'none';
}

function typeWriter(el, speed = 90) {
    const text = el.dataset.text;
    el.textContent = "";
    let i = 0;

    const interval = setInterval(() => {
        el.textContent += text[i];
        i++;

        if (i >= text.length) {
            clearInterval(interval);
            el.style.borderRight = "none";
        }
    }, speed);
}

document.addEventListener("DOMContentLoaded", () => {
    const tw = document.querySelector(".typewriter");
    const menuButton = document.querySelector(".menu-button");
    const isTouchCardUi = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const cardSelector = ".builds .card, .pro-card:not(.coming-soon)";

    if (tw) typeWriter(tw, 150);

    function clearActiveCards() {
        document.querySelectorAll(`${cardSelector}.tap-active`).forEach((card) => {
            card.classList.remove("tap-active");
        });
    }

    document.addEventListener("click", (event) => {
        if (isTouchCardUi) {
            const tappedCard = event.target.closest(cardSelector);
            if (tappedCard) {
                const alreadyActive = tappedCard.classList.contains("tap-active");
                clearActiveCards();
                if (!alreadyActive) tappedCard.classList.add("tap-active");
            } else {
                clearActiveCards();
            }
        }

        const clickedInsideSidebar = sidebar.contains(event.target);
        const clickedMenuButton = menuButton && menuButton.contains(event.target);

        if (!clickedInsideSidebar && !clickedMenuButton && sidebar.style.display === "flex") {
            hideSidebar();
        }
    });
});
