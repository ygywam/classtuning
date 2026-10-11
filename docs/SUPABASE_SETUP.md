# ClassTuning Supabase DB & Google OAuth 2.0 설정 가이드

본 문서는 **ClassTuning** 플랫폼의 데이터베이스 스키마, 행 단위 보안 정책(RLS), 그리고 서울외고 전용 Google OAuth 2.0 domain 제한 연동 가이드입니다.

---

## 1. Supabase SQL DDL 테이블 스키마

Below is the complete PostgreSQL SQL migration script to execute in the Supabase SQL Editor:

```sql
-- 1. 사용자 (users) 테이블
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- 'student' | 'teacher'
  my_class_id TEXT DEFAULT 'c1',
  xp INT DEFAULT 80,
  is_star_tutor BOOLEAN DEFAULT FALSE,
  active_pet_id TEXT DEFAULT 'tiger',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 클래스 (classes) 테이블
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE NOT NULL,
  creator_name TEXT NOT NULL,
  creator_role TEXT DEFAULT 'teacher',
  student_count INT DEFAULT 1,
  qr_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 질문 (questions) 테이블
CREATE TABLE IF NOT EXISTS public.questions (
  id BIGSERIAL PRIMARY KEY,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  category TEXT DEFAULT '일반질문',
  author_id UUID REFERENCES public.users(id),
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  has_adopted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 답변 (answers) 테이블
CREATE TABLE IF NOT EXISTS public.answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT REFERENCES public.questions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes INT DEFAULT 0,
  is_adopted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 3D 학습 펫 보관함 (pet_collections) 테이블
CREATE TABLE IF NOT EXISTS public.pet_collections (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_icon TEXT NOT NULL,
  xp INT DEFAULT 0,
  stage INT DEFAULT 1,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 6. 5단계 완육 펫 자랑 게시판 (showcases) 테이블
CREATE TABLE IF NOT EXISTS public.showcases (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES public.users(id),
  author_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_icon TEXT NOT NULL,
  slogan TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Supabase RLS (Row Level Security) 행 단위 보안 정책

```sql
-- 테이블 RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcases ENABLE ROW LEVEL SECURITY;

-- Policy 1: 모든 인증된 학생/교사는 전체 클래스 조회 및 질문 작성 가능
CREATE POLICY "Allow authenticated read classes" ON public.classes
  FOR SELECT TO authenticated USING (true);

-- Policy 2: 질문 작성 및 조회 (본인 학급 또는 전체공개 질문 조회)
CREATE POLICY "Allow read questions" ON public.questions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert own questions" ON public.questions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- Policy 3: 자문자답 차단 (자신의 질문에는 본인이 답변 작성 불가 RLS)
CREATE POLICY "Prevent self-answer insert" ON public.answers
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND 
    NOT EXISTS (
      SELECT 1 FROM public.questions q 
      WHERE q.id = question_id AND q.author_id = auth.uid()
    )
  );

-- Policy 4: 답변 채택은 질문 작성자만 가능
CREATE POLICY "Allow adoption by question author" ON public.answers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q 
      WHERE q.id = question_id AND q.author_id = auth.uid()
    )
  );

-- Policy 5: 본인 펫 보관함만 CRUD 가능
CREATE POLICY "Manage own pets" ON public.pet_collections
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Policy 6: 펫 자랑 게시판 전체 읽기 및 스타강사 작성 권한
CREATE POLICY "Read showcase" ON public.showcases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Insert showcase" ON public.showcases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
```

---

## 3. Google OAuth 2.0 학교 전용 도메인 (`@sfl.sen.hs.kr`) 제한 설정 방법

1. **Google Cloud Console** 접속 (`https://console.cloud.google.com`)
2. `OAuth 2.0 클라이언트 ID` 생성 (웹 애플리케이션)
3. 승인된 리디렉션 URI에 Supabase OAuth callback URL 추가: `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`
4. Supabase Dashboard ➔ `Authentication` ➔ `Providers` ➔ `Google` 설정
   - Client ID 및 Client Secret 입력
5. **학교 계정 도메인 제한 (`hd: 'sfl.sen.hs.kr'`) 적용**:
   React Supabase Auth 로그인 코드 예시:
   ```javascript
   const { data, error } = await supabase.auth.signInWithOAuth({
     provider: 'google',
     options: {
       queryParams: {
         hd: 'sfl.sen.hs.kr', // 🛡️ 서울외고 구글 Workspace 전용 제한
         prompt: 'select_account'
       },
       redirectTo: window.location.origin
     }
   });
   ```

---
*수정 및 적용 완료: 2026-10-10*
