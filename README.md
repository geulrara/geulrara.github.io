# 정인영 | UI Architect & Senior Publisher Portfolio

모던 테크 업계의 채용 트렌드와 시니어 UI 엔지니어의 전문성을 담아낸 **인터랙티브 웹 포트폴리오 사이트**입니다. 기획부터 디자인 시스템, 모던 마크업, 웹 접근성 검수, 그리고 프론트엔드(React/Thymeleaf) 협업에 이르는 16년 간의 여정을 매거진 형태의 감각적인 UI로 구현했습니다.

---

## 🎨 1. 제작 배경 및 기획 의도

* **타겟 오디언스:** IT·테크 기업 채용 담당자, CTO, 프로덕트 오너(PO) 및 에이전시 파트너
* **핵심 메시지:** 단순한 마크업 코더를 넘어, 서비스의 뼈대를 세우고 디자이너와 개발자를 잇는 **시니어 UI 아키텍트**로서의 가치 전달
* **스토리텔링:** 휑한 공백이나 딱딱한 이력서 형식을 탈피하고, 각 섹션별 맞춤형 3D 캐릭터 피사체와 모던한 글래스모피즘(Glassmorphism) UI를 통해 한 편의 매거진을 읽듯 자연스럽게 몰입하도록 기획

---

## 💎 2. 디자인 시스템 (Design System)

사이트 전체의 시각적 일관성과 유지보수 용이성을 위해 엄격한 토큰 기반 디자인 시스템을 구축했습니다.

* **글래스모피즘 & 다크모드 테마:**
  * 고급스러운 다크 네이비 베이스(`--color-bg-primary: #030712`) 위에 미세한 블러 효과(`backdrop-filter: blur(20px)`)를 주는 카드 컴포넌트(`glass-card`)를 적용하여 깊이감 있는 입체감을 부여했습니다.
* **타이포그래피 스케일 (Typography System):**
  * 기본 글꼴은 Pretendard GOV이며, `h1`과 `h2`에는 잘난 고딕을 적용했습니다. 제목 크기는 화면 너비에 따라 반응형으로 조정됩니다.
  * `typography-h1` (3.5rem), `typography-h2` (3rem), `typography-h3` (1.75rem) 등 시각적 위계를 정의했습니다.
* **BEM (Block Element Modifier) 방법론:**
  * CSS 클래스 네이밍 규칙을 BEM 구조(`.portfolio-card`, `.portfolio-card__header`, `.equal-grid`, `.char-wrapper`)로 체계화하여 확장성과 유지보수성을 극대화했습니다.

---

## 🌈 3. 컬러 시스템 & 접근성 (Color System & Accessibility)

* **브랜드 컬러 (Teal & Cyan Accent):**
  * 핵심 포인트 컬러로 틸(`--color-accent-teal: #2DD4BF`)과 사이언(`--color-accent-cyan: #38BDF8`) 그라데이션을 사용하여 테크니컬하고 세련된 인상을 줍니다.
* **텍스트 대비와 가독성 (High Contrast & Accessibility):**
  * 다크 배경에서도 읽기 쉽도록 기본 텍스트 색상을 밝은 계열(`--color-text-secondary: #F8FAFC`, `--color-text-primary: #FFFFFF`)로 설정했습니다.
* **인터랙션 피드백:**
  * 호버(`hover`) 시 미세한 상향 이동(`-translate-y-2px`)과 테두리 컬러 전환 애니메이션을 주어 인터랙티브한 반응성을 제공합니다.

---

## 📐 4. 그리드 시스템 & 레이아웃 (Grid System)

* **12컬럼 CSS Grid & Equal Height:**
  * 데스크톱 뷰포트에서 콘텐츠의 균형을 맞추기 위해 12컬럼 기반의 `.equal-grid` 유틸리티를 구축하여 자식 컴포넌트들의 높이가 항상 균일하게 정렬되도록 처리했습니다.
* **반응형 모바일 퍼스트 대응:**
  * 모바일 화면에서는 단일 컬럼으로 유연하게 전환되며, 전체 경력 아카이브 테이블을 모바일 전용 카드 리스트 뷰로 표시합니다.
* **페이징 및 인터랙티브 컨트롤:**
  * 방대한 이력을 한 번에 보여주지 않고 페이지네이션(페이지당 8개 아이템)을 적용하여 정보 과부하를 방지하고 탐색 편의성을 높였습니다.

---

## 🗂️ 5. 프로젝트 파일 구조

```text
portfolio/
├── .editorconfig                  # 공백 2칸 들여쓰기 기본 설정
├── .vscode/
│   └── tasks.json                 # 로컬 브라우저 미리보기 실행 작업
├── README.md                      # 프로젝트 안내 및 변경 기록
├── index.html                     # 포트폴리오 화면과 섹션 마크업
└── assets/
    ├── css/
    │   └── style.css              # 폰트, 공통 스타일, 컴포넌트 스타일
    ├── data/
    │   └── archive.json           # 경력 및 프로젝트 아카이브 데이터
    ├── img/
    │   ├── character-coding.png
    │   ├── character-multidevice.png
    │   ├── character-success.png
    │   ├── character-support.png
    │   ├── character-uikit.png
    │   ├── character-whiteboard.png
    │   └── logo_symbol.png
    └── js/
        └── main.js                # 아카이브 로딩, 렌더링, 페이지네이션
```

### 페이지 섹션

`index.html`은 다음 섹션으로 구성됩니다.

1. `hero` — 소개 및 주요 행동 버튼
2. `profile` — 디자인 철학과 주요 강점
3. `skills` — 기술 역량과 교육·자격
4. `projects` — 주요 프로젝트 쇼케이스
5. `archive` — 경력 및 프로젝트 아카이브
6. `contact` — 연락처와 협업 제안

## ⚙️ 6. 주요 동작과 미리보기

* `assets/js/main.js`가 `assets/data/archive.json`을 가져와 데스크톱 테이블과 모바일 카드 목록을 렌더링합니다.
* 아카이브는 페이지당 8개씩 표시되며 페이지 버튼으로 이동할 수 있습니다. 현재 JSON에는 59개 항목이 있습니다.
* 외부 리소스는 Tailwind CSS CDN, Pretendard GOV 및 잘난 고딕 웹폰트를 사용합니다.
* VS Code에서 `Ctrl + Shift + P` → **Tasks: Run Task** → **Portfolio browser preview**를 실행하면 `http://127.0.0.1:4173`에서 사이트를 미리 볼 수 있습니다. 미리보기 작업은 Node.js를 사용합니다.