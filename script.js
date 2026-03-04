const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("sticky", window.scrollY > 50);
});

const faders = document.querySelectorAll(".fade");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

faders.forEach((el) => observer.observe(el));

const sidebar = document.querySelector(".sidebar");

function showSidebar() {
  sidebar.classList.add("is-open");
  document.body.classList.add("menu-open");
}

function hideSidebar() {
  sidebar.classList.remove("is-open");
  document.body.classList.remove("menu-open");
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
  const contactForm = document.querySelector(".contact-form");
  const formStatus = document.querySelector(".form-status");
  const isTouchCardUi = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;
  const cardSelector = ".builds .card, .pro-card:not(.coming-soon)";
  const faqQuestions = document.querySelectorAll(".faq-question");
  const faqAnswerMaxHeight = 220;

  if (tw) typeWriter(tw, 150);

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("active");

      document.querySelectorAll(".faq-item.active").forEach((openItem) => {
        openItem.classList.remove("active");
        openItem
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
        openItem.querySelector(".faq-answer").style.maxHeight = "0";
      });

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${Math.min(answer.scrollHeight, faqAnswerMaxHeight)}px`;
      }
    });
  });

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnLabel = submitBtn ? submitBtn.querySelector("span") : null;
      const originalBtnText = submitBtnLabel
        ? submitBtnLabel.textContent
        : submitBtn
          ? submitBtn.textContent
          : "Send";

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtnLabel) {
          submitBtnLabel.textContent = "Sending...";
        } else {
          submitBtn.textContent = "Sending...";
        }
      }

      formStatus.textContent = "Sending message...";
      formStatus.classList.remove("is-error", "is-success");

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && (result.success === true || result.success === "true")) {
          formStatus.textContent = "Message sent successfully.";
          formStatus.classList.add("is-success");
          contactForm.reset();
        } else {
          formStatus.textContent =
            "Could not send. Check FormSubmit activation email and spam folder.";
          formStatus.classList.add("is-error");
        }
      } catch (error) {
        formStatus.textContent =
          "Network error while sending. Please try again.";
        formStatus.classList.add("is-error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtnLabel) {
            submitBtnLabel.textContent = originalBtnText;
          } else {
            submitBtn.textContent = originalBtnText;
          }
        }
      }
    });
  }

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

    if (
      !clickedInsideSidebar &&
      !clickedMenuButton &&
      sidebar.classList.contains("is-open")
    ) {
      hideSidebar();
    }
  });
});
