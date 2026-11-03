let archiveData = [];
let currentPage = 1;
const itemsPerPage = 8;

const PREFIX_PY = "py-4";
const TEXT_SLATE_BASE = "text-slate-100";

const CLS_TABLE_ROW = "hover:bg-slate-900/50 transition";
const CLS_CELL_BASE = `${PREFIX_PY} ${TEXT_SLATE_BASE}`;
const CLS_CELL_TITLE = `${PREFIX_PY} font-semibold text-white`;
const CLS_CELL_SHARE = `${PREFIX_PY} text-right font-bold text-teal-300`;

const CLS_MOBILE_CARD =
  "p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2";
const CLS_MOBILE_BADGE =
  "px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold whitespace-nowrap";
const CLS_MOBILE_SUB = `text-xs ${TEXT_SLATE_BASE}`;

const CLS_BTN_BASE = "px-3 py-1.5 rounded-lg text-xs font-semibold transition";
const CLS_BTN_ACTIVE = `${CLS_BTN_BASE} bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20`;
const CLS_BTN_DEFAULT = `${CLS_BTN_BASE} bg-slate-800 ${TEXT_SLATE_BASE} hover:bg-slate-700`;
const CLS_BTN_ICON_DISABLED = "rounded-lg text-xs font-semibold transition bg-slate-800 text-slate-500 cursor-not-allowed";
const CLS_BTN_ICON_ACTIVE = "rounded-lg text-xs font-semibold transition bg-slate-800 text-teal-300 hover:bg-slate-700";

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
          <div class="flex justify-between items-start gap-2">
            <span class="font-bold text-white text-base">${item.title}</span>
            <span class="${CLS_MOBILE_BADGE}">${item.share}</span>
          </div>
          <div class="text-xs text-teal-400 font-semibold">${item.period} | ${item.role}</div>
          <div class="${CLS_MOBILE_SUB}">기술환경: ${item.tech}</div>
        </div>
    `,
    )
    .join("");

  paginationInfo.textContent = `Showing ${firstItem}-${lastItem} of ${archiveData.length} projects`;

  let buttonsHTML = `
    <div class="pagination-arrow-group">
    <button onclick="changePage(1)" aria-label="첫 페이지" ${currentPage === 1 ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18l-6-6 6-6M12 18L6 12l6-6"></path></svg>
    </button>
    <button onclick="changePage(${currentPage - 1})" aria-label="이전 페이지" ${currentPage === 1 ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6"></path></svg>
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
      <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l6 6-6 6"></path></svg>
    </button>
    <button onclick="changePage(${totalPages})" aria-label="마지막 페이지" ${currentPage === totalPages ? `disabled class="pagination-page pagination-icon-button ${CLS_BTN_ICON_DISABLED}"` : `class="pagination-page pagination-icon-button ${CLS_BTN_ICON_ACTIVE}"`}>
      <svg aria-hidden="true" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l6 6-6 6M12 6l6 6-6 6"></path></svg>
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

window.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeProjectsCarousel();
  loadArchiveData();
});
