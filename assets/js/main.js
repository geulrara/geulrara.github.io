let archiveData = [];
let currentPage = 1;
const itemsPerPage = 8;

/* ==========================================
    Tailwind Class Variables (디자인 토큰 패턴 분리)
   ========================================== */
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
const CLS_BTN_DISABLED = `${CLS_BTN_BASE} bg-slate-800 text-slate-500 cursor-not-allowed`;
const CLS_BTN_ACTIVE = `${CLS_BTN_BASE} bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20`;
const CLS_BTN_DEFAULT = `${CLS_BTN_BASE} bg-slate-800 ${TEXT_SLATE_BASE} hover:bg-slate-700`;
const CLS_BTN_NEXT_PREV = `${CLS_BTN_BASE} bg-slate-800 text-teal-300 hover:bg-slate-700`;

// AJAX(Fetch)를 통해 JSON 데이터 로드
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

  // Render Desktop Table
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

  // Render Mobile Cards
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

  // Update Pagination Info
  paginationInfo.textContent = `Showing ${startIdx + 1}-${Math.min(endIdx, archiveData.length)} of ${archiveData.length} projects`;

  // Render Pagination Buttons
  let buttonsHTML = `
    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? `disabled class="${CLS_BTN_DISABLED}"` : `class="${CLS_BTN_NEXT_PREV}"`}>이전</button>
    `;

  for (let i = 1; i <= totalPages; i++) {
    buttonsHTML += `
      <button onclick="changePage(${i})" class="${i === currentPage ? CLS_BTN_ACTIVE : CLS_BTN_DEFAULT}">${i}</button>
    `;
  }

  buttonsHTML += `
    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? `disabled class="${CLS_BTN_DISABLED}"` : `class="${CLS_BTN_NEXT_PREV}"`}>다음</button>
    `;

  paginationButtons.innerHTML = buttonsHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(archiveData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderArchive();
}

window.addEventListener("DOMContentLoaded", () => {
  loadArchiveData();
});
