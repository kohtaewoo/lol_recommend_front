# 🖥️ LOL 챔피언 추천 프론트엔드 (`lol_recommend_front`)

> 유저 클러스터링 기반 LOL 챔피언 추천 시스템의 **프론트엔드 애플리케이션**입니다.  
> Next.js 기반으로 구축되었으며, 결과 페이지에서 클러스터별 추천 챔피언을 직관적으로 시각화합니다.

---

## 📦 기술 스택

- **Framework**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: CSS Modules
- **아이콘/에셋**: SVG, Riot 인증 파일 포함
- **배포 대상**: Vercel 또는 로컬

---

## 📁 디렉토리 구조

```
lol_recommend_front/
├── app/
│   ├── all/page.tsx             # 전체 챔피언 보기
│   ├── cluster/page.tsx         # 클러스터 선택 및 결과 요청
│   ├── result/page.tsx          # 추천 결과 시각화
│   ├── layout.tsx               # 공통 레이아웃
│   └── page.tsx                 # 홈 페이지
│
├── components/
│   └── ChampionCard.tsx         # 챔피언 카드 UI 컴포넌트
│
├── styles/
│   ├── globals.css              # 전체 스타일
│   └── components.css           # 컴포넌트 전용 스타일
│
├── public/
│   ├── data/
│   │   └── champion_face_positions.json  # 챔피언 이미지 위치 정보
│   ├── riot.txt                 # Riot 인증 파일
│   └── *.svg                    # 아이콘 에셋
│
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
```

---

## 🚀 실행 방법

### 1. 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 🧩 주요 기능

### ✅ 클러스터 기반 추천 UI
- 유저의 클러스터 선택 → 추천 결과로 이동
- 클러스터별 대표 챔피언 시각화

### ✅ 챔피언 카드 컴포넌트
- 챔피언 이미지와 이름이 표시된 UI 구성
- 포지션별 필터링을 위한 기반 구조 지원

### ✅ 정적 자원 연동
- `public/data/champion_face_positions.json`: 챔피언 이미지 위치 조정 정보
- `riot.txt`: Riot API 인증을 위한 정적 파일

---

## 🛠️ 빌드

```bash
npm run build
```

정적 파일은 `.next/`에 생성됩니다.

---

## ☁️ 배포 (Vercel)

[Vercel](https://vercel.com/)에 연동하여 한 줄로 배포 가능:

```bash
npx vercel
```

---

## 📮 API 연동 계획

> 추후 백엔드 API(`lol_recommend_py`)와 연동하여 클러스터 ID 전송 → 추천 결과 수신 구조로 확장 예정
