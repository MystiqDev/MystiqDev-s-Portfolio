const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
});

function animateProgressCircles() {
    document.querySelectorAll('.circle').forEach(circle => {
        const percent = circle.dataset.percent;
        const svgCircles = circle.querySelectorAll('circle');
        const progressCircle = svgCircles[1];

        if (!progressCircle) return;

        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        progressCircle.style.transition = 'none';
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;

        progressCircle.getBoundingClientRect();

        progressCircle.style.transition = 'stroke-dashoffset 2s ease';
        progressCircle.style.strokeDashoffset =
            circumference * (1 - percent / 100);
    });
}


function animateProgressBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        const percent = bar.dataset.percent;

        bar.style.transition = 'none';
        bar.style.width = '0%';

        bar.getBoundingClientRect();

        bar.style.transition = 'width 2s ease';
        bar.style.width = percent + '%';
    });
}


const faders = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);

                if (entry.target.classList.contains('progress')) {
                    animateProgressCircles();
                    animateProgressBars();
                }
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


window.addEventListener('load', () => {
    document.querySelector('.progress')?.classList.add('show');
    document.querySelector('.about')?.classList.add('show');

    animateProgressCircles();
    animateProgressBars();
});

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
    if (tw) typeWriter(tw, 150);
});