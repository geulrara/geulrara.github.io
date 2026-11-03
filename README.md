# 정인영 | UI/UX Publisher Portfolio

정인영의 UI/UX 퍼블리싱, 디자인 시스템, 웹 접근성 및 주요 프로젝트 경험을 소개하는 반응형 포트폴리오입니다.

## 주요 섹션

- **Intro**: 소개와 주요 행동 링크
- **Philosophy**: 디자인 철학과 강점
- **Skills**: 기술 역량, 교육 및 자격
- **Showcase**: 주요 프로젝트 카드
- **Archive**: 경력 목록과 페이지네이션
- **Contact**: 연락처 및 협업 제안

## 기술 구성

- 정적 HTML, CSS, JavaScript
- Tailwind CSS 유틸리티는 빌드 시 압축해 `assets/css/tailwind.min.css`로 생성
- `assets/data/archive.json`을 불러와 데스크톱 표와 모바일 카드 목록 표시
- 프로젝트 아카이브는 페이지당 8개 항목 표시

## 로컬 미리보기

필요 조건: Node.js와 npm

```sh
npm.cmd ci
npm.cmd run build
```

VS Code에서 **Tasks: Run Task → Portfolio browser preview**를 실행하면 스타일을 빌드한 뒤 `http://127.0.0.1:4173`에서 미리보기를 시작합니다.

## 배포

GitHub Pages가 `master` 브랜치의 저장소 루트를 게시합니다. 빌드된 `assets/css/tailwind.min.css`를 포함해 변경 사항을 `master`에 게시하면 배포됩니다.
