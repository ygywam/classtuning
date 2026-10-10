# ClassTuning 시스템 아키텍처 (Gen-B)

## 1. 개요
ClassTuning은 수업 후 학생들의 질문(글, 이미지)을 수집하고 교사가 이를 효율적으로 관리/답변하는 Q&A 웹 응용 프로그램입니다.

## 2. 폴더 구조
```
ClassTuning/
├── PROJECT.md              # 프로젝트 메타 정보 및 규칙
├── index.html              # HTML 엔트리포인트
├── package.json            # 의존성 패키지 관리
├── vite.config.js          # Vite 빌드 설정
├── docs/                   # 프로젝트 문서
│   ├── TASKS.md            # 작업 목록
│   ├── DECISIONS.md        # 주요 결정 사항
│   └── ARCHITECTURE.md     # 시스템 아키텍처
├── 공유용/                 # Vercel 빌드/배포 산출물
└── src/
    ├── main.jsx            # React 루트 엔트리
    ├── App.jsx             # 메인 네비게이션 및 상태 분기
    ├── index.css           # 전역 CSS 및 Tailwind 지시어
    ├── components/         # UI 컴포넌트 모듈
    │   ├── Header.jsx      # 상단 헤더 및 사용자/교사 모드 전환
    │   ├── StudentView.jsx # 학생용 질문 등록 및 내 질문 보기
    │   └── TeacherView.jsx # 교사용 대시보드 (질문 목록 및 답변)
    └── lib/
        └── supabase.js     # Supabase DB/Storage 클라이언트 연동
```

## 3. 데이터 흐름
1. **학생 모드**: 클래스코드 + 학생 별칭 + 4자리 PIN 입력 -> 질문 작성(텍스트, 사진) -> Supabase DB에 등록.
2. **내 질문 조회**: 클래스코드 + PIN 입력 시 Supabase RLS 정책에 의해 자신의 질문 목록만 응답.
3. **교사 모드**: 교사 비밀코드 입력 -> 전체 질문 수신 -> 답변 등록 및 답변 완료 처리.
