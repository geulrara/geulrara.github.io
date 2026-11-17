let archiveData = [];
let currentPage = 1;
const archiveTableQuery = window.matchMedia("(min-width: 53.75em)");
let itemsPerPage = archiveTableQuery.matches ? 8 : 4;

archiveTableQuery.addEventListener("change", (event) => {
  const firstItemIndex = (currentPage - 1) * itemsPerPage;
  itemsPerPage = event.matches ? 8 : 4;
  currentPage = Math.floor(firstItemIndex / itemsPerPage) + 1;
  const bookmark = document.getElementById("archive-list-bookmark");
  if (bookmark) bookmark.style.minHeight = "";
  if (archiveData.length) renderArchive();
});

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
}

function changePageFromInput(input) {
  const page = input.valueAsNumber;
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);

  if (!Number.isInteger(page) || page < 1 || page > totalPages) {
    input.value = currentPage;
    return;
  }

  const restoreFocus = document.activeElement === input;
  changePage(page, true);
  if (restoreFocus) {
    document.querySelector(".pagination-mobile-position input")?.focus({ preventScroll: true });
  }
}

function changePage(page, preserveScrollPosition = false) {
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;

  const scrollPosition = window.scrollY;
  const scrollLeft = window.scrollX;
  const bookmark = document.getElementById("archive-list-bookmark");
  if (bookmark) {
    // Keep a shorter final page from shrinking the document and shifting the viewport.
    bookmark.style.minHeight = preserveScrollPosition
      ? `${bookmark.getBoundingClientRect().height}px`
      : "";
  }
  currentPage = page;
  renderArchive();

  if (preserveScrollPosition) {
    window.scrollTo({ left: scrollLeft, top: scrollPosition, behavior: "instant" });
    return;
  }

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

function initializeGradientMotion() {
  const { gsap } = window;
  if (!gsap) return;

  gsap.matchMedia().add(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const cleanups = [];
      document.querySelectorAll("main > .hero-gradient, main > .line-gradient").forEach((section) => {
        // Reuse two tweens so pointer events do not create new animations.
        const xTo = gsap.quickTo(section, "--gradient-x", { duration: 1.8, ease: "power3.out" });
        const yTo = gsap.quickTo(section, "--gradient-y", { duration: 1.8, ease: "power3.out" });
        const followPointer = (event) => {
          if (event.pointerType === "touch") return;
          const bounds = section.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          const x = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
          const y = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);
          // Keep the center within the section's middle 40% for a gentle drift.
          xTo(30 + x * 40);
          yTo(30 + y * 40);
        };
        const returnToCenter = () => {
          xTo(50);
          yTo(50);
        };
        section.addEventListener("pointermove", followPointer, { passive: true });
        section.addEventListener("pointerleave", returnToCenter);
        cleanups.push(() => {
          section.removeEventListener("pointermove", followPointer);
          section.removeEventListener("pointerleave", returnToCenter);
        });
      });
      // matchMedia also reverts the tweens and inline styles when preferences change.
      return () => cleanups.forEach((cleanup) => cleanup());
    },
  );
}

window.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeProjectsCarousel();
  loadArchiveData();
  initializeGradientMotion();
});
