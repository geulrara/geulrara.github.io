let archiveData = [];
let currentPage = 1;
const itemsPerPage = 8;

const CLS_TABLE_ROW = "archive-table-row";
const CLS_CELL_BASE = "archive-table-cell";
const CLS_CELL_TITLE = "archive-table-cell archive-table-cell--title";
const CLS_CELL_SHARE = "archive-table-cell archive-table-cell--share";

const CLS_MOBILE_CARD = "archive-mobile-card";
const CLS_MOBILE_BADGE = "archive-mobile-card__badge";
const CLS_MOBILE_SUB = "archive-mobile-card__details";

const CLS_BTN_ACTIVE = "archive-page-button archive-page-button--current";
const CLS_BTN_DEFAULT = "archive-page-button";
const CLS_BTN_ICON_DISABLED = "archive-page-button archive-page-button--disabled";
const CLS_BTN_ICON_ACTIVE = "archive-page-button archive-page-button--icon";

async function loadArchiveData() {
  try {
    const response = await fetch("/assets/data/archive.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    archiveData = await response.json();
    renderArchive();
  } catch (error) {
    console.error("Failed to load archive data:", error);
  }
}

function renderArchive() {
  const tbody = document.getElementById("archive-table-body");
  const mobileList = document.getElementById("archive-mobile-list");
  const paginationInfo = document.getElementById("pagination-info");
  const paginationButtons = document.getElementById("pagination-buttons");

  if (!tbody) return;

  const totalPages = Math.ceil(archiveData.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = archiveData.slice(startIdx, endIdx);
  const firstItem = archiveData.length === 0 ? 0 : startIdx + 1;
  const lastItem = Math.min(endIdx, archiveData.length);

  tbody.innerHTML = currentItems
    .map(
      (item) => `
        <tr class="${CLS_TABLE_ROW}">
          <td class="${CLS_CELL_TITLE}">${item.title}</td>
          <td class="${CLS_CELL_BASE}">${item.period}</td>
          <td class="${CLS_CELL_BASE}">${item.role}</td>
          <td class="${CLS_CELL_BASE}">${item.tech}</td>
          <td class="${CLS_CELL_SHARE}">${item.share}</td>
        </tr>
    `,
    )
    .join("");

  mobileList.innerHTML = currentItems
    .map(
      (item) => `
        <div class="${CLS_MOBILE_CARD}">
          <div class="archive-mobile-card__header">
            <span class="archive-mobile-card__title">${item.title}</span>
            <span class="${CLS_MOBILE_BADGE}">${item.share}</span>
          </div>
          <div class="archive-mobile-card__meta">${item.period} | ${item.role}</div>
          <div class="${CLS_MOBILE_SUB}">기술환경: ${item.tech}</div>
        </div>
    `,
    )
    .join("");

  paginationInfo.textContent = `Showing ${firstItem}-${lastItem} of ${archiveData.length} projects`;

  let buttonsHTML = `
    <div class="pagination-arrow-group">
    <button onclick="changePage(1)" aria-label="첫 페이지" ${currentPage === 1 ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18l-6-6 6-6M12 18L6 12l6-6"></path></svg>
    </button>
    <button onclick="changePage(${currentPage - 1})" aria-label="이전 페이지" ${currentPage === 1 ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6"></path></svg>
    </button>
    </div>
    `;

  buttonsHTML += `
    <label class="pagination-mobile-position">
      <input type="number" min="1" max="${totalPages}" value="${currentPage}" aria-label="페이지 번호 입력" onchange="changePageFromInput(this)" onkeydown="if(event.key === 'Enter'){event.preventDefault();changePageFromInput(this)}">
      <span>/ ${totalPages}</span>
    </label>
    `;

  for (let i = 1; i <= totalPages; i++) {
    buttonsHTML += `
      <button onclick="changePage(${i})" class="pagination-page ${i === currentPage ? `pagination-current ${CLS_BTN_ACTIVE}` : CLS_BTN_DEFAULT}" ${i === currentPage ? 'aria-current="page"' : ""}>${i}</button>
    `;
  }

  buttonsHTML += `
    <div class="pagination-arrow-group">
    <button onclick="changePage(${currentPage + 1})" aria-label="다음 페이지" ${currentPage === totalPages ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l6 6-6 6"></path></svg>
    </button>
    <button onclick="changePage(${totalPages})" aria-label="마지막 페이지" ${currentPage === totalPages ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="pagination-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l6 6-6 6M12 6l6 6-6 6"></path></svg>
    </button>
    </div>
    `;

  paginationButtons.innerHTML = buttonsHTML;
  window.ScrollTrigger?.refresh();
}

function changePageFromInput(input) {
  const page = input.valueAsNumber;
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);

  if (!Number.isInteger(page) || page < 1 || page > totalPages) {
    input.value = currentPage;
    return;
  }

  changePage(page, true);
}

function changePage(page, scrollToMobileList = false) {
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  const scrollPosition = window.scrollY;
  currentPage = page;
  renderArchive();

  if (scrollToMobileList && window.matchMedia("(max-width: 42.5em)").matches) {
    const mobileList = document.getElementById("archive-mobile-list");
    const header = document.querySelector("header");

    if (mobileList) {
      const headerOffset = header ? header.getBoundingClientRect().height : 0;
      const listTop = mobileList.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo(window.scrollX, listTop);
      return;
    }
  }

  const bookmark = document.getElementById("archive-list-bookmark");
  if (bookmark) {
    const header = document.querySelector("header");
    const headerOffset = header ? header.getBoundingClientRect().height : 0;
    const bookmarkTop = bookmark.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo(window.scrollX, bookmarkTop);
    return;
  }

  window.scrollTo(window.scrollX, scrollPosition);
}

function initializeMobileNavigation() {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNavigation = document.getElementById("mobile-navigation");
  const header = document.querySelector("header");

  if (!menuToggle || !mobileNavigation || !header) return;

  const closeMenu = (restoreFocus = false) => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
    mobileNavigation.hidden = true;
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "메뉴 열기" : "메뉴 닫기");
    mobileNavigation.hidden = isExpanded;
  });

  mobileNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (menuToggle.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  window.matchMedia("(min-width: 53.75em)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

function initializeProjectsCarousel() {
  const carousel = document.querySelector(".projects-card-list");
  if (!carousel) return;

  let touchStart = null;

  carousel.addEventListener(
    "touchstart",
    (event) => {
      if (!window.matchMedia("(max-width: 42.5em)").matches || event.touches.length !== 1) {
        touchStart = null;
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) return;

      const carouselLeft = carousel.getBoundingClientRect().left;
      const cards = [...carousel.children];
      if (cards.length === 0) return;

      const startIndex = cards.reduce((closestIndex, card, index) => {
        const closestCard = cards[closestIndex];
        return Math.abs(card.getBoundingClientRect().left - carouselLeft) <
          Math.abs(closestCard.getBoundingClientRect().left - carouselLeft)
          ? index
          : closestIndex;
      }, 0);

      touchStart = {
        identifier: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        index: startIndex,
      };
    },
    { passive: true },
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      if (!touchStart || !window.matchMedia("(max-width: 42.5em)").matches) return;

      const touch = [...event.changedTouches].find(
        ({ identifier }) => identifier === touchStart.identifier,
      );
      if (!touch) return;

      const start = touchStart;
      touchStart = null;
      const swipeDistance = start.x - touch.clientX;
      const verticalDistance = start.y - touch.clientY;
      if (Math.abs(swipeDistance) < 40 || Math.abs(swipeDistance) <= Math.abs(verticalDistance)) return;

      const cards = [...carousel.children];
      if (cards.length === 0) return;
      const nextIndex = Math.max(
        0,
        Math.min(cards.length - 1, start.index + (swipeDistance > 0 ? 1 : -1)),
      );
      const carouselLeft = carousel.getBoundingClientRect().left;
      const cardLeft = cards[nextIndex].getBoundingClientRect().left;

      carousel.scrollTo({
        left: carousel.scrollLeft + cardLeft - carouselLeft,
        behavior: "smooth",
      });
    },
    { passive: true },
  );

  carousel.addEventListener("touchcancel", () => {
    touchStart = null;
  }, { passive: true });
}

function initializeCharacterMotion() {
  const { gsap, ScrollTrigger } = window;
  // Keep every character visible if the animation CDN is unavailable.
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const characters = [
    { id: "character-coding", x: 44, y: 36, rotation: 3, drift: 6 },
    { id: "character-whiteboard", x: -40, y: 28, rotation: -3, drift: 4 },
    { id: "character-uikit", x: 0, y: 48, rotation: 2, drift: 5 },
    { id: "character-multidevice", x: 40, y: 36, rotation: 4, drift: 6 },
    { id: "character-support", x: -32, y: 32, rotation: -3, drift: 4 },
    { id: "character-success", x: 0, y: 40, rotation: -4, drift: 3 },
  ];

  gsap.matchMedia().add(
    {
      compact: "(max-width: 74.999em)",
      desktop: "(min-width: 75em)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      // matchMedia reverts styles and kills the old triggers on preference/size changes.
      if (context.conditions.reduceMotion) return;
      const distance = context.conditions.compact ? 0.45 : 1;

      characters.forEach(({ id, x, y, rotation, drift }) => {
        const image = document.getElementById(id);
        if (!image) return;

        gsap.fromTo(
          image,
          {
            autoAlpha: 0,
            x: x * distance,
            y: y * distance,
            rotation: rotation * distance,
            scale: id === "character-success" ? 0.88 : 0.94,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1.15,
            ease: id === "character-success" ? "back.out(1.25)" : "power3.out",
            scrollTrigger: {
              trigger: image,
              start: "top 94%",
              once: true,
            },
          },
        );

        // Separate percentage translation from the entrance's pixel translation.
        // The stationary wrapper keeps scroll bounds stable as the image moves.
        gsap.fromTo(
          image,
          { yPercent: drift * distance },
          {
            yPercent: -drift * distance,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".char-wrapper"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });
    },
  );

  // Lazy-loaded images and web fonts can change the trigger positions.
  document.querySelectorAll(".character-image").forEach((image) => {
    if (!image.complete) {
      image.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
    }
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

window.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeProjectsCarousel();
  loadArchiveData();
  initializeCharacterMotion();
});
