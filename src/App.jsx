import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  PlusCircle,
  QrCode,
  ShieldCheck,
  X,
  Image as ImageIcon,
  CheckCircle,
  Globe,
  Lock,
  Search,
  ThumbsUp,
  Award,
  Trash2
} from 'lucide-react'


// 10종 스타터 동물 데이터베이스 (준비 완료: 호랑이, 고양이, 코알라, 드래곤 / 준비 중: 그 외 동물)
const STARTER_PETS = [
  { id: 'tiger', name: '호랑이 🐯', icon: '🐯', desc: '용맹하고 지혜로운 수학 호랑이', isReady: true },
  { id: 'cat', name: '샤인 고양이 🐱', icon: '🐱', desc: '영리하고 신속한 피드백 냥이', isReady: true },
  { id: 'koala', name: '잠만보 코알라 🐨', icon: '🐨', desc: '집중력이 뛰어난 포근 코알라', isReady: true },
  { id: 'dragon', name: '전설 드래곤 🐉', icon: '🐉', desc: '만점을 상징하는 용', isReady: true },
  { id: 'dino', name: '티라노 🦖', icon: '🦖', desc: '강력한 모의고사 킬러 공룡', isReady: true },
  { id: 'dog', name: '시바 강사 🐶', icon: '🐶', desc: '충직하고 친절한 공부 멍멍이', isReady: false },
  { id: 'deer', name: '꽃사슴 🦌', icon: '🦌', desc: '섬세하고 우아한 개념 사슴', isReady: false },
  { id: 'giraffe', name: '키다리 기린 🦒', icon: '🦒', desc: '멀리 내다보는 수식 기린', isReady: false },
  { id: 'hippo', name: '포동 하마 🦛', icon: '🦛', desc: '든든하고 푸근한 기출 하마', isReady: false },
  { id: 'penguin', name: '황제 펭귄 🐧', icon: '🐧', desc: '차가운 이성의 논리 펭귄', isReady: false }
]

// 학습 펫 경험치 레벨 및 5단계 진화 시스템
function getLevelInfo(xp = 0, selectedPet) {
  const petName = selectedPet ? selectedPet.name : '학습 펫'
  const petIcon = selectedPet ? selectedPet.icon : '🐯'
  if (xp >= 1000) return { level: 5, stageName: `5단계 전설 펫 👑 (${petName} 마스터)`, maxXp: 1000, avatar: '👑' }
  if (xp >= 600) return { level: 4, stageName: `4단계 학사 펫 🎓 (${petName} 학자)`, maxXp: 1000, avatar: `🎓` }
  if (xp >= 300) return { level: 3, stageName: `3단계 학생 펫 🌿 (${petName} 초등)`, maxXp: 600, avatar: `🌿` }
  if (xp >= 100) return { level: 2, stageName: `2단계 아기 펫 🐣 (${petName} 부화)`, maxXp: 300, avatar: `🐣` }
  return { level: 1, stageName: `1단계 신비의 알 🥚 (${petName} 부화 대기)`, maxXp: 100, avatar: '🥚' }
}

// 학생 실명 보호 자동 마스킹 함수 (학번이 있을 때만 괄호 추가)
function maskStudentInfo(name, studentId = '') {
  if (!name) return '학생'
  let maskedName = name
  if (name.length <= 2) {
    maskedName = name[0] + '*'
  } else {
    maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }
  return studentId ? `${maskedName} (${studentId})` : maskedName
}

// 3D 고화질 펫 그래픽 렌더링 컴포넌트
function PetAvatar({ petId, stageLevel = 1, fallbackIcon, className = "w-14 h-14" }) {
  const [imgError, setImgError] = useState(false)

  const imageMap = {
    egg: '/assets/3d_egg.jpg',
    tiger: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_tiger_baby.jpg',
      3: '/assets/3d_tiger_child.jpg',
      4: '/assets/3d_tiger_scholar.jpg',
      5: '/assets/3d_tiger_master.jpg'
    },
    cat: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_cat_baby.jpg',
      3: '/assets/3d_cat_child.jpg',
      4: '/assets/3d_cat_scholar.jpg',
      5: '/assets/3d_cat_master.jpg'
    },
    koala: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_koala_baby.jpg',
      3: '/assets/3d_koala_child.jpg',
      4: '/assets/3d_koala_scholar.jpg',
      5: '/assets/3d_koala_master.jpg'
    },
    dragon: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_dragon_baby.jpg',
      3: '/assets/3d_dragon_child.jpg',
      4: '/assets/3d_dragon_scholar.jpg',
      5: '/assets/3d_dragon_master.jpg'
    },
    dino: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_dino_baby.jpg',
      3: '/assets/3d_dino_child.jpg',
      4: '/assets/3d_dino_scholar.jpg',
      5: '/assets/3d_dino_master.jpg'
    }
  }

  let imgSrc = null
  if (stageLevel === 1) {
    imgSrc = imageMap['egg']
  } else if (imageMap[petId]) {
    if (typeof imageMap[petId] === 'string') {
      imgSrc = imageMap[petId]
    } else if (typeof imageMap[petId] === 'object' && imageMap[petId][stageLevel]) {
      imgSrc = imageMap[petId][stageLevel]
    }
  }

  if (imgSrc && !imgError) {
    return (
      <img
        src={imgSrc}
        alt="3D Render Pet"
        className={`${className} rounded-2xl object-cover border-2 border-amber-300 shadow-md animate-float-3d inline-block`}
        onError={() => setImgError(true)}
      />
    )
  }
  return <span className="text-4xl animate-breathe-3d inline-block">{fallbackIcon || '🐯'}</span>
}

// KaTeX 수식 텍스트 렌더링 컴포넌트
function MathText({ text }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && text) {
      if (window.katex) {
        try {
          // ₩ 및 역슬래시/W 오탈자 통합 보정
          const sanitizedText = text
            .replace(/₩/g, '\\')
            .replace(/\\W/g, '\\')
            .replace(/W(frac|pm|sqrt|lim|sum|int|infty|alpha|beta|theta|pi)/g, '\\$1')
          const regex = /\$(.*?)\$/g
          const parts = sanitizedText.split(regex)
          containerRef.current.innerHTML = ''

          parts.forEach((part, index) => {
            if (index % 2 === 1) {
              const formattedPart = part.replace(/\\(lim|sum|int|prod|max|min)(?!\\limits)_/g, '\\$1\\limits_')
              const span = document.createElement('span')
              span.className = 'px-1 inline-block text-indigo-950 font-bold'
              window.katex.render(formattedPart, span, { throwOnError: false, displayMode: false })
              containerRef.current.appendChild(span)
            } else {
              const txt = document.createTextNode(part)
              containerRef.current.appendChild(txt)
            }
          })
          return
        } catch (e) {
          console.warn('KaTeX render error:', e)
        }
      }
      containerRef.current.innerText = text
    }
  }, [text])

  return <span ref={containerRef} className="leading-relaxed inline" />
}

// 수식 기호 툴바 컴포넌트
function MathToolbar({ onInsertMath }) {
  const [activeCategory, setActiveCategory] = useState('basic')

  const categories = [
    { id: 'basic', name: '기본연산' },
    { id: 'calculus', name: '미적분·극한' },
    { id: 'prob', name: '확률·순열·조합' },
    { id: 'func', name: '삼각·로그' },
    { id: 'sym', name: '특수기호·행렬' }
  ]

  const mathButtons = {
    basic: [
      { label: '분수 a/b', latex: '\\frac{a}{b}' },
      { label: '거듭제곱 xⁿ', latex: 'x^{n}' },
      { label: '아래첨자 xₙ', latex: 'x_{n}' },
      { label: '루트 √x', latex: '\\sqrt{x}' },
      { label: 'n제곱근 ⁿ√x', latex: '\\sqrt[n]{x}' },
      { label: '플러스마이너스 ±', latex: '\\pm' },
      { label: '같지않음 ≠', latex: '\\neq' },
      { label: '작거나같음 ≤', latex: '\\le' },
      { label: '크거나같음 ≥', latex: '\\ge' }
    ],
    calculus: [
      { label: '극한 lim_{n→∞}', latex: '\\lim\\limits_{n \\to \\infty}' },
      { label: '극한 lim_{x→a}', latex: '\\lim\\limits_{x \\to a}' },
      { label: '무한대 ∞', latex: '\\infty' },
      { label: '미분 f\'(x)', latex: 'f\'(x)' },
      { label: '정적분 ∫_a^b', latex: '\\int\\limits_{a}^{b} f(x) dx' },
      { label: '시그마 ∑_{k=1}^n', latex: '\\sum\\limits_{k=1}^{n}' }
    ],
    prob: [
      { label: '순열 ₙPᵣ', latex: '_{n}P_{r}' },
      { label: '조합 ₙCᵣ', latex: '_{n}C_{r}' },
      { label: '팩토리얼 n!', latex: 'n!' },
      { label: '확률 P(A)', latex: 'P(A)' }
    ],
    func: [
      { label: '로그 log_a(x)', latex: '\\log_{a}(x)' },
      { label: '사인 sin(θ)', latex: '\\sin\\theta' },
      { label: '코사인 cos(θ)', latex: '\\cos\\theta' },
      { label: '탄젠트 tan(θ)', latex: '\\tan\\theta' },
      { label: '파이 π', latex: '\\pi' }
    ],
    sym: [
      { label: '절대값 |x|', latex: '|x|' },
      { label: '원소 ∈', latex: '\\in' },
      { label: '그러므로 ∴', latex: '\\therefore' },
      { label: '왜냐하면 ∵', latex: '\\because' }
    ]
  }

  return (
    <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
          <span>📐 Visual 수식 툴바 (커서 위치 즉시 삽입)</span>
        </span>

        <div className="flex space-x-1 bg-slate-200/70 p-0.5 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {mathButtons[activeCategory].map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onInsertMath(`$${btn.latex}$`)
            }}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm hover:border-indigo-300"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// 헤더 및 상단 탭 네비게이션
function Header({ user, activeTab, setActiveTab, onGoogleLogin, onLogout, onOpenCreateClass, onOpenSupabaseModal, onOpenOnboarding }) {
  const levelInfo = user ? getLevelInfo(user.xp) : null
  const isTeacher = user && user.role === 'teacher'

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">ClassTuning</h1>
              <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 rounded-full font-bold">서울외고 P2P</span>
              {isTeacher ? (
                <span className="px-2.5 py-0.5 text-[10px] bg-indigo-700 text-white font-black rounded-full border border-indigo-800 shadow-sm flex items-center gap-1">
                  👨‍🏫 교사 관리자
                </span>
              ) : user && user.isStarTutor ? (
                <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-extrabold rounded-full border border-amber-500 shadow-sm flex items-center gap-1">
                  ⭐ 명예 스타 튜터 (5단계 달성)
                </span>
              ) : (
                user && (
                  <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 font-bold rounded-full border border-slate-200">
                    성장: {user.xp}/1000 XP (5단계 전설 펫 달성 시 스타 튜터)
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">실시간 학급 P2P 질의응답 & 학습 펫 파트너</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'qa' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌐 Q&A 피드백
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'pets' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🐾 펫 보관함
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'showcase' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 명예의 전당
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800'
            }`}
          >
            <span>📖 사용법 안내</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSupabaseModal}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DB/OAuth</span>
          </button>

          {isTeacher && (
            <button
              onClick={onOpenCreateClass}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>클래스 개설</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center space-x-2">
              <div 
                onClick={onOpenOnboarding}
                title="클릭하여 프로필/학급 설정 변경"
                className="cursor-pointer flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 transition-all px-3 py-1.5 rounded-xl border border-slate-300"
              >
                <PetAvatar petId={user.activePetId || 'tiger'} stageLevel={levelInfo ? levelInfo.level : 1} fallbackIcon={levelInfo ? levelInfo.avatar : '🐯'} className="w-6 h-6" />
                <span className="text-xs font-black text-slate-800">
                  {isTeacher ? user.nickname : user.nickname}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black text-white ${isTeacher ? 'bg-indigo-700' : 'bg-emerald-600'}`}>
                  {isTeacher ? '교사' : `Lv.${levelInfo ? levelInfo.level : 1}`}
                </span>
              </div>
              <button onClick={onLogout} className="text-xs text-slate-400 font-bold hover:text-rose-500">
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={onGoogleLogin}
              className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:border-indigo-500 shadow-sm px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all"
            >
              <span>구글 로그인 (@sfl.sen.hs.kr)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

// 3D 펫 보관함 & 알 상점
function PetStorageView({ user, petCollection, onSelectActivePet, onBuyRandomEgg, onAllocateXp }) {
  const activePet = petCollection.find(p => p.isSelected) || petCollection[0]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-indigo-700">
        <div className="space-y-2 max-w-lg">
          <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-sm">
            🐾 3D 반려동물 보관함 & 수집소
          </span>
          <h2 className="text-2xl font-black">나만의 학습 펫 컬렉션 ({petCollection.length}종 보유)</h2>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Q&A 답변으로 얻은 경험치를 원하는 펫에게 집중 전달하고 5단계까지 성장시켜 스타강사 뱃지를 획득하세요!
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center space-y-2 backdrop-blur-sm flex flex-col items-center">
          <span className="text-xs font-bold text-indigo-200">현재 선택된 대표 펫</span>
          <PetAvatar
            petId={activePet ? activePet.id : 'tiger'}
            stageLevel={activePet ? getLevelInfo(activePet.xp, activePet).level : 1}
            fallbackIcon={activePet ? activePet.icon : '🐯'}
            className="w-16 h-16"
          />
          <div className="font-black text-sm text-amber-300">{activePet ? activePet.name : '호랑이'}</div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-amber-200 rounded-2xl flex items-center justify-center p-1 border border-amber-300">
              <PetAvatar petId="egg" stageLevel={1} fallbackIcon="🥚" className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800">🎁 신비의 3D 랜덤 알 상점</h3>
              <p className="text-xs text-slate-600">질문/답변 활동으로 모은 100 XP로 새 무작위 펫 알을 부화시키세요!</p>
            </div>
          </div>

          <button
            onClick={onBuyRandomEgg}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md transition-all text-sm flex items-center space-x-2 animate-breathe-3d"
          >
            <span>🥚 랜덤 알 부화하기 (100 XP 소모)</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-slate-800 text-lg">보유 중인 3D 학습 펫 목록</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {petCollection.map((pet) => {
            const info = getLevelInfo(pet.xp, pet)
            return (
              <div
                key={pet.id}
                className={`bg-white rounded-3xl p-5 border-2 transition-all space-y-3 shadow-sm ${
                  pet.isSelected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    Lv.{info.level} / 5단계
                  </span>
                  {pet.isSelected && (
                    <span className="text-[10px] bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full">
                      ⭐ 현재 대표 펫
                    </span>
                  )}
                </div>

                <div className="text-center py-2 space-y-2">
                  <div className="flex justify-center">
                    <PetAvatar
                      petId={pet.id}
                      stageLevel={info.level}
                      fallbackIcon={pet.icon}
                      className="w-24 h-24"
                    />
                  </div>
                  <h4 className="font-black text-slate-800 text-base mt-2">{pet.name}</h4>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">{info.stageName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>성장 경험치</span>
                    <span>{pet.xp} / {info.maxXp} XP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (pet.xp / info.maxXp) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!pet.isSelected && (
                    <button
                      onClick={() => onSelectActivePet(pet.id)}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-all"
                    >
                      대표 펫 설정
                    </button>
                  )}
                  <button
                    onClick={() => onAllocateXp(pet.id)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    XP 주입 (+50)
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 🏆 명예의 전당 (5단계 마스터 펫 쇼케이스)
function PetShowcaseView({ user, showcases, onLikeShowcase, onPostShowcase, petCollection }) {
  const hasStage5Pet = petCollection.some(p => p.xp >= 1000)
  const [sloganInput, setSloganInput] = useState('')

  const handleSubmitShowcase = (e) => {
    e.preventDefault()
    if (!sloganInput.trim()) {
      alert('학습 노하우와 마스터 한줄평을 입력해 주세요.')
      return
    }
    const stage5Pet = petCollection.find(p => p.xp >= 1000) || petCollection[0]
    onPostShowcase({
      id: Date.now(),
      authorName: user ? (user.role === 'teacher' ? user.nickname : user.nickname) : '학습자',
      className: user ? (user.myClassId || '수학 학급') : '수학 학급',
      petName: stage5Pet.name,
      petIcon: stage5Pet.icon,
      slogan: sloganInput.trim(),
      likes: 0,
      createdAt: '방금 전'
    })
    setSloganInput('')
    alert('🎉 명예의 전당 쇼케이스 글이 등록되었습니다!')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-black rounded-full border border-white/30">
            🏆 명예의 전당 (마스터 펫 쇼케이스)
          </span>
          <h2 className="text-2xl font-black">5단계 전설 펫 마스터 명예의 전당</h2>
          <p className="text-xs text-amber-100 leading-relaxed">
            학습 펫을 5단계(1,000 XP)까지 키우고 스타 튜터 자격을 획득한 열정적인 학습자들의 노하우 공유 공간입니다!
          </p>
        </div>

        <div className="text-6xl animate-egg-pulse">🏆</div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-slate-800 text-base flex items-center justify-between">
          <span>✏️ 내 5단계 전설 펫 쇼케이스 등록</span>
          {hasStage5Pet ? (
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✅ 5단계 마스터 달성 완료
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              🔒 펫 1종 5단계 (1,000 XP) 달성 시 등록 가능
            </span>
          )}
        </h3>

        <form onSubmit={handleSubmitShowcase} className="space-y-3">
          <input
            type="text"
            placeholder={hasStage5Pet ? "예: 시그마 킬러문항 완전 정복! 수식 Q&A 언제든 물어보세요!" : "펫을 5단계까지 성장시키면 이곳에 수학 공부 팁과 자랑을 등록할 수 있습니다."}
            value={sloganInput}
            onChange={(e) => setSloganInput(e.target.value)}
            disabled={!hasStage5Pet}
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-amber-500 font-bold text-sm disabled:bg-slate-100"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!hasStage5Pet}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-black rounded-xl text-xs shadow-md transition-all"
            >
              자랑글 올리기 🚀
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-slate-800 text-lg">전설 마스터 명예 자랑글 ({showcases.length}건)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showcases.map((sc) => (
            <div key={sc.id} className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4 hover:shadow-md transition-all relative">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                    <PetAvatar petId={sc.petId || 'tiger'} stageLevel={5} fallbackIcon={sc.petIcon} className="w-full h-full" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-slate-800 text-sm">{sc.authorName}</span>
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full">
                        ⭐ 스타강사
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{sc.className} | {sc.petName}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{sc.createdAt}</span>
              </div>

              <p className="text-sm font-bold text-slate-800 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                "{sc.slogan}"
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-amber-700">👑 5단계 전설 마스터 펫</span>
                <button
                  onClick={() => onLikeShowcase(sc.id)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-xl text-xs flex items-center space-x-1 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>멋져요 ({sc.likes})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 📖 ClassTuning 대화형 인터랙티브 사용법 안내 컴포넌트
function UserGuideView({ user, onGoogleLogin, onGoToQa }) {
  const [activeStep, setActiveStep] = useState(1)

  // 1단계 온보딩 시뮬레이터 상태
  const [simRole, setSimRole] = useState('student')
  const [simStudentId, setSimStudentId] = useState('10305')
  const [simName, setSimName] = useState('홍길동')
  const [simPetId, setSimPetId] = useState('koala')

  // 2단계 수식 툴바 시뮬레이터 상태
  const [simMathInput, setSimMathInput] = useState('수학 함수 $f(x) = \\frac{a}{b}$ 의 극한값 $\\lim\\limits_{x \\to 0}$')

  // 3단계 XP 차등 보상 시뮬레이터 상태
  const [simXp, setSimXp] = useState(100)
  const [simXpToast, setSimXpToast] = useState(null)

  // 4단계 3D 펫 진화 뷰어 상태
  const [previewPetId, setPreviewPetId] = useState('koala')
  const [previewLevel, setPreviewLevel] = useState(3)

  // 5단계 알 부화 시뮬레이터 상태
  const [simHatched, setSimHatched] = useState(null)

  // 1단계 학년/반 계산
  const calculatedGrade = simStudentId && simStudentId.length >= 3 ? simStudentId[0] : '1'
  const calculatedClass = simStudentId && simStudentId.length >= 3 ? simStudentId.substring(1, 3).replace(/^0/, '') : '3'
  const calculatedNumber = simStudentId && simStudentId.length >= 5 ? simStudentId.substring(3).replace(/^0/, '') : '5'

  const steps = [
    { num: 1, title: '1. 가입 & 자동 반배정', icon: '🎓', desc: '학교 계정 1초 로그인 & 학번으로 자동 반배정' },
    { num: 2, title: '2. 수식 질문 올리기', icon: '✍️', desc: 'Visual 수식 툴바 & KaTeX 실시간 렌더링' },
    { num: 3, title: '3. 동료 답변 & 차등 XP', icon: '💬', desc: '내 학급 +50 XP vs 타 학급 +25 XP & 채택 +100 XP' },
    { num: 4, title: '4. 3D 펫 5단계 성장', icon: '🐾', desc: '1,000 XP 달성 시 스타 튜터 등극 & 3D 진화' },
    { num: 5, title: '5. 명예의 전당 & 알 상점', icon: '🏆', desc: '전설 쇼케이스 등록 & 100 XP 랜덤 알 부화' }
  ]

  const handleSimAddXp = (amount, desc) => {
    setSimXp(prev => Math.min(1000, prev + amount))
    setSimXpToast(`🎉 ${desc} (+${amount} XP)`)
    setTimeout(() => setSimXpToast(null), 3000)
  }

  const handleSimHatch = () => {
    const readyPets = STARTER_PETS.filter(p => p.isReady)
    const picked = readyPets[Math.floor(Math.random() * readyPets.length)]
    setSimHatched(picked)
  }

  const previewInfo = getLevelInfo(
    previewLevel === 1 ? 0 : previewLevel === 2 ? 150 : previewLevel === 3 ? 350 : previewLevel === 4 ? 650 : 1000,
    STARTER_PETS.find(p => p.id === previewPetId)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 히어로 헤더 */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-indigo-700 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow-sm">
              📖 완전 정복 가이드
            </span>
            <span className="px-3 py-1 bg-white/10 text-indigo-200 text-xs font-bold rounded-full border border-white/20">
              로그인 없이 누구나 열람 가능
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            ClassTuning 대화형 인터랙티브 사용법 안내
          </h2>
          <p className="text-xs md:text-sm text-indigo-100 leading-relaxed">
            서울외고 전용 실시간 학급 P2P 질의응답 및 3D 펫 파트너 성장 플랫폼에 오신 것을 환영합니다! 아래 5단계 코스를 통해 로그인부터 자동 반배정, 수식 질문 작성, 차등 XP 획득, 그리고 5단계 3D 펫 성장까지 실제 화면 모형으로 직접 체험하며 쉽게 배울 수 있습니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onGoToQa}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🌐 Q&A 질문 피드로 이동</span>
            </button>
            {!user && (
              <button
                onClick={onGoogleLogin}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>🔑 학교 구글 계정으로 로그인</span>
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 hidden sm:block text-7xl animate-float-3d">
          🎓
        </div>
      </div>

      {/* 5단계 네비게이션 탭 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        {steps.map((st) => (
          <button
            key={st.num}
            onClick={() => setActiveStep(st.num)}
            className={`p-3 rounded-xl text-left transition-all space-y-1 ${
              activeStep === st.num
                ? 'bg-white text-indigo-700 shadow-md ring-2 ring-indigo-400'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="text-base">{st.icon}</span>
              <span className="font-black text-xs">{st.title}</span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1">{st.desc}</p>
          </button>
        ))}
      </div>

      {/* 단계별 대화형 상세 안내 본문 */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-8">
        {/* STEP 1: 가입 & 자동 반배정 */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                STEP 1 코스
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                🎓 학교 구글 계정 1초 로그인 & 학번에 의한 자동 반배정
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                번거로운 가입 절차나 초대 QR코드 없이, 서울외고 공식 계정(@sfl.sen.hs.kr)으로 로그인하면 학번에 따라 소속 학급으로 자동 배정됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* 왼쪽: 설명 카드 */}
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                  <h4 className="font-black text-sm text-indigo-900 flex items-center gap-1.5">
                    <span>1️⃣ 구글 공식 학교 계정 확인</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    상단 우측 <span className="font-bold text-indigo-700">[학교 구글 로그인]</span> 버튼을 누르면 서울외고 Google Workspace 계정으로 안전하게 로그인됩니다. 외부 개인 이메일은 접속이 차단되어 교내 보안이 철저히 유지됩니다.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                    <span>2️⃣ 학번 입력 시 자동 반배정 (QR 불필요)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    학생이 5자리 학번(예: <b>10305</b>)을 입력하면, 1학년 3반 5번임을 시스템이 즉시 인식하여 <b>1학년 3반 수학</b> 학급으로 자동 배정됩니다.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                  <h4 className="font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <span>3️⃣ 실명 자동 마스킹 보호 & 0 XP 공정 시작</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    학생 이름은 화면에 <b>조** (10305)</b> 형태로 마스킹 처리되어 교내 개인정보가 안전하게 보호됩니다. 또한 모든 사용자는 <b>0 XP 신비의 알</b>에서 공정하게 시작합니다.
                  </p>
                </div>
              </div>

              {/* 오른쪽: 인터랙티브 실시간 모형 시뮬레이터 */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs text-slate-700 flex items-center gap-1">
                    <span>🖥️ 실제 온보딩 화면 미니 체험</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-full border">
                    직접 값을 입력해보세요!
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">역할 선택</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSimRole('student')}
                        className={`py-2 rounded-xl font-bold transition-all ${
                          simRole === 'student' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border text-slate-600'
                        }`}
                      >
                        🧑‍🎓 학생 모드
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimRole('teacher')}
                        className={`py-2 rounded-xl font-bold transition-all ${
                          simRole === 'teacher' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border text-slate-600'
                        }`}
                      >
                        👨‍🏫 교사 관리자
                      </button>
                    </div>
                  </div>

                  {simRole === 'student' ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block font-bold text-slate-600 mb-0.5">학번 5자리 (입력 시 자동 계산)</label>
                        <input
                          type="text"
                          value={simStudentId}
                          onChange={(e) => setSimStudentId(e.target.value)}
                          placeholder="예: 10305"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-0.5">이름 또는 별칭</label>
                        <input
                          type="text"
                          value={simName}
                          onChange={(e) => setSimName(e.target.value)}
                          placeholder="예: 홍길동"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-indigo-900 font-bold text-xs">
                      👨‍🏫 교사는 로그인 시 별칭 설정 및 '새 학급 개설' 권한을 가지며 학생들의 전체 질문을 총괄 지도합니다.
                    </div>
                  )}

                  {/* 자동 계산 결과 미리보기 */}
                  <div className="p-4 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-1.5">
                    <span className="text-[10px] font-black text-indigo-600 uppercase">⚡ 실시간 자동 감지 결과</span>
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>소속 배정 학급:</span>
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                        {simRole === 'teacher' ? '교사 관리 학급' : `${calculatedGrade}학년 ${calculatedClass}반 수학`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>화면 표시 닉네임:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        {simRole === 'teacher' ? `${simName || '선생님'} 선생님 (교사)` : `${maskStudentInfo(simName || '학생')} (${simStudentId})`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>초기 시작 경험치:</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                        0 XP (1단계 신비의 알 🥚)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: 수식 질문 올리기 & Visual 수식 툴바 */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                STEP 2 코스
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                ✍️ 풀이 사진 첨부 & Visual 수식 툴바로 손쉬운 질문 작성
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                복잡한 수학 기호도 클릭 한 번으로 커서 위치에 바로 삽입! KaTeX 엔진이 실시간으로 미려한 수학 공식을 그려줍니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-2">
                  <h4 className="font-black text-sm text-indigo-900 flex items-center gap-1.5">
                    <span>📐 클릭 한 번으로 수식 완성 (Visual 툴바)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    키보드로 입력하기 어려운 분수, 거듭제곱, 루트, 미분, 정적분($\int$), 시그마($\sum$), 삼각함수, 행렬을 버튼 클릭만으로 커서 위치에 쏙 삽입할 수 있습니다.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                  <h4 className="font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <span>📷 손글씨 풀이 사진 바로 첨부</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    교재나 연습장에 적은 문제 및 풀이를 스마트폰이나 PC에서 사진 파일로 즉시 등록하여 친구들과 시각적으로 공유할 수 있습니다.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                    <span>✨ 질문 등록 시 +30 XP 보상</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    학습 질문을 적극적으로 등록할 때마다 파트너 펫에게 <b>+30 XP</b>의 성실 질문 보너스 경험치가 지급됩니다.
                  </p>
                </div>
              </div>

              {/* 오른쪽: 인터랙티브 수식 툴바 체험 샌드박스 */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs text-slate-700">📐 수식 툴바 직접 눌러보기</span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-full border">
                    버튼을 누르면 아래 입력창에 삽입됩니다
                  </span>
                </div>

                {/* 미니 툴바 버튼 */}
                <div className="flex flex-wrap gap-1.5 bg-slate-200/60 p-2 rounded-xl">
                  {[
                    { label: '분수 a/b', latex: '$\\frac{a}{b}$' },
                    { label: '루트 √x', latex: '$\\sqrt{x}$' },
                    { label: '거듭제곱 xⁿ', latex: '$x^{n}$' },
                    { label: '극한 lim', latex: '$\\lim\\limits_{x \\to 0}$' },
                    { label: '시그마 ∑', latex: '$\\sum\\limits_{k=1}^{n}$' },
                    { label: '적분 ∫', latex: '$\\int\\limits_{a}^{b} f(x) dx$' },
                    { label: '파이 π', latex: '$\\pi$' }
                  ].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => setSimMathInput(prev => prev + ' ' + btn.latex)}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">입력 텍스트 ($...$ 안의 내용이 수식으로 렌더링):</label>
                  <textarea
                    rows={2}
                    value={simMathInput}
                    onChange={(e) => setSimMathInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 실시간 렌더링 미리보기 상자 */}
                <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-1">
                  <span className="text-[10px] font-black text-indigo-700">✨ 실시간 수식 렌더링 결과:</span>
                  <div className="text-sm font-bold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-indigo-100 min-h-[48px] flex items-center">
                    <MathText text={simMathInput} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 동료 답변 & 차등 XP 포인트 보상 */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                STEP 3 코스
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                💬 동료 답변 & 우리 반 집중을 위한 차등 XP 보상 시스템
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                내 학급 친구의 질문에 먼저 정성을 쏟을 수 있도록 스마트한 차등 경험치 보상 엔진이 작동합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <h4 className="font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <span>🏠 내 학급 질문에 답변: +50 XP (100% 풀보상)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    자신이 소속된 학급 친구의 질문에 친절한 풀이를 남기면 <b>+50 XP 전액</b>이 지급됩니다. 우리 반 친구들을 먼저 돕는 것이 가장 빠른 성장 지름길입니다!
                  </p>
                </div>

                <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                    <span>🌐 타 학급 질문에 답변: +25 XP (50% 보상)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    다른 반 질문에 답변할 경우 경험치가 50%로 조정됩니다. 단, <b>5단계 마스터를 달성하여 '명예 스타 튜터'</b>가 되면 타 학급 답변도 100%(+50 XP) 전액을 받게 됩니다!
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <h4 className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                    <span>🏆 질문자 답변 채택 시: +100 XP 대박 보상</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    질문자가 가장 유익한 답변 1건을 [채택]하면, 답변 작성자에게 <b>+100 XP의 축하 보상</b>이 즉시 지급됩니다!
                  </p>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 font-bold text-[11px]">
                  ⚠️ 공정성 원칙: 자기 질문에 자신이 답변하거나 채택하는 '자문자답'은 포인트 부풀리기 방지를 위해 엄격히 차단됩니다.
                </div>
              </div>

              {/* 오른쪽: 인터랙티브 차등 경험치 적립 체험기 */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs text-slate-700">🎮 경험치 획득 시뮬레이터</span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-full border">
                    버튼을 눌러 경험치를 모아보세요!
                  </span>
                </div>

                {/* 현재 게이지 */}
                <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-slate-700">시뮬레이터 누적 경험치:</span>
                    <span className="text-indigo-600 text-sm">{simXp} / 1000 XP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (simXp / 1000) * 100)}%` }}
                    ></div>
                  </div>
                  {simXpToast && (
                    <div className="p-2 bg-amber-100 text-amber-900 font-black text-xs rounded-xl text-center animate-bounce">
                      {simXpToast}
                    </div>
                  )}
                </div>

                {/* 체험 액션 버튼들 */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSimAddXp(50, '내 학급 질문에 답변 완료!')}
                    className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-between"
                  >
                    <span>🏠 내 학급 질문에 답변 남기기</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">+50 XP (100%)</span>
                  </button>

                  <button
                    onClick={() => handleSimAddXp(25, '타 학급 질문에 답변 완료!')}
                    className="w-full py-2.5 px-3 bg-slate-700 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-between"
                  >
                    <span>🌐 타 학급 질문에 답변 남기기</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">+25 XP (50%)</span>
                  </button>

                  <button
                    onClick={() => handleSimAddXp(100, '질문자가 내 답변을 최고로 채택!')}
                    className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-between"
                  >
                    <span>🏆 질문자에게 답변 채택 받기</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px]">+100 XP (대박!)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: 3D 펫 5단계 진화 & 스타 튜터 달성 */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                STEP 4 코스
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                🐾 나만의 파트너 3D 펫 5단계 성장 & 명예 스타 튜터 달성
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                0 XP 신비의 알에서 시작하여 1,000 XP 전설 마스터까지! 호랑이, 고양이, 코알라 등 생동감 넘치는 3D 그래픽으로 진화합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🥚</span>
                    <div>
                      <h5 className="font-black text-slate-800">1단계: 신비의 알 (0 ~ 99 XP)</h5>
                      <p className="text-[11px] text-slate-500">부화를 기다리는 잠재력의 알</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-400">초기 상태</span>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🐣</span>
                    <div>
                      <h5 className="font-black text-amber-900">2단계: 아기 펫 (100 ~ 299 XP)</h5>
                      <p className="text-[11px] text-amber-700">알을 깨고 아장아장 부화한 귀여운 아기 펫</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-700">부화 성공</span>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <h5 className="font-black text-emerald-900">3단계: 학생 펫 (300 ~ 599 XP)</h5>
                      <p className="text-[11px] text-emerald-700">책가방을 메고 기본 수학 개념을 정복한 펫</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700">개념 마스터</span>
                </div>

                <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🎓</span>
                    <div>
                      <h5 className="font-black text-indigo-900">4단계: 학사 펫 (600 ~ 999 XP)</h5>
                      <p className="text-[11px] text-indigo-700">도서관에서 학사모를 쓰고 심화 킬러문항을 해결</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-indigo-700">심화 튜터</span>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-500 to-indigo-600 text-white rounded-2xl shadow-md space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-sm flex items-center gap-1.5">
                      <span>👑 5단계: 전설 마스터 펫 (1,000 XP 이상)</span>
                    </h5>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full">
                      ⭐ 스타 튜터 등극
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100 leading-relaxed">
                    황금 왕관을 쓴 전설의 마스터! 명예의 전당 쇼케이스 등록 권한 및 타 학급 답변 100%(+50 XP) 풀보상 특권을 영구 획득합니다.
                  </p>
                </div>
              </div>

              {/* 오른쪽: 3D 펫 5단계 실시간 미스터리 프리뷰어 */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs text-slate-700">🐾 성장 단계별 미리보기</span>
                  <div className="flex space-x-1">
                    {STARTER_PETS.filter(p => p.isReady).map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPreviewPetId(p.id)}
                        className={`px-2 py-1 text-[11px] font-black rounded-lg transition-all ${
                          previewPetId === p.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border text-slate-600'
                        }`}
                      >
                        {p.icon} {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 단계 버튼들 */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setPreviewLevel(lv)}
                      className={`py-1.5 rounded-xl font-black text-xs transition-all ${
                        previewLevel === lv
                          ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                          : 'bg-white border text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lv}단계 {lv === 1 ? '🥚' : lv === 2 ? '🐣' : lv === 3 ? '🌿' : lv === 4 ? '🎓' : '👑'}
                    </button>
                  ))}
                </div>

                {/* 미스터리 잠금 및 렌더링 화면 */}
                <div className="bg-white rounded-2xl p-6 border border-indigo-100 text-center space-y-3 shadow-inner">
                  {previewLevel === 1 ? (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <PetAvatar
                          petId="egg"
                          stageLevel={1}
                          className="w-32 h-32"
                        />
                      </div>
                      <h4 className="font-black text-slate-800 text-base">1단계 신비의 알 🥚</h4>
                      <p className="text-xs text-indigo-600 font-bold">
                        0 ~ 99 XP: 누구나 처음 지급받는 잠재력의 신비의 알입니다.
                      </p>
                    </div>
                  ) : (
                    <div className="py-2 space-y-3">
                      {/* 미스터리 시크릿 카드 */}
                      <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-950 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center space-y-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-amber-400/10 animate-pulse"></div>
                        <span className="text-4xl animate-bounce">
                          {previewLevel === 2 ? '🐣' : previewLevel === 3 ? '🌿' : previewLevel === 4 ? '🎓' : '👑'}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-300 font-black text-[11px] z-10">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>비밀 잠금</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-black text-slate-800 text-sm flex items-center justify-center gap-1.5">
                          <span>🔒 {previewLevel}단계:</span>
                          <span className="text-amber-600">
                            {previewLevel === 2 && '아기 펫 부화 (100 XP)'}
                            {previewLevel === 3 && '학생 펫 진화 (300 XP)'}
                            {previewLevel === 4 && '학사 펫 진화 (600 XP)'}
                            {previewLevel === 5 && '전설 마스터 등극 (1,000 XP)'}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                          다음 카드를 여는 짜릿한 기쁨을 위해 진화 모습은 비밀입니다! Q&A 활동으로 경험치를 모아 직접 잠금 해제하세요! ✨
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: 명예의 전당 & 알 상점 */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                STEP 5 코스
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-2">
                🏆 명예의 전당 쇼케이스 자랑 & 100 XP 랜덤 알 상점
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                5단계 마스터들의 공부 비법 공유와 활동 포인트로 새로운 3D 펫을 부화시키는 다채로운 수집 공간입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4 text-xs text-slate-700">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <h4 className="font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <span>🏆 5단계 마스터 전용 명예의 전당</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    1,000 XP를 달성한 학습자는 자신의 파트너 펫과 함께 학습 슬로건 및 수학 공부 팁을 영구 등록할 수 있습니다. 전교생이 '멋져요 👍'를 누르며 노하우를 함께 나눕니다.
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                  <h4 className="font-black text-sm text-indigo-900 flex items-center gap-1.5">
                    <span>🎁 100 XP 신비의 랜덤 알 상점</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    열심히 질문/답변 활동으로 모은 100 XP를 사용하여 알 상점에서 새로운 동물 알을 부화시킬 수 있습니다. 이미 보유한 동물이 나오면 해당 펫에 즉시 +100 XP가 주입되어 더 빠르게 마스터로 진화합니다!
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <h4 className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                    <span>📱 스마트폰 홈 화면 추가 (PWA 앱처럼 사용)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    스마트폰 브라우저 메뉴에서 [홈 화면에 추가]를 누르면 전용 3D 아이콘과 함께 언제든지 앱처럼 터치 한 번으로 바로 접속할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 오른쪽: 알 부화 미니 가챠 체험 (스포일러 방지 비밀 모드) */}
              <div className="bg-slate-50 p-5 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-black text-xs text-slate-700">🥚 신비의 알 부화 시뮬레이터</span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-white px-2 py-0.5 rounded-full border">
                    100 XP 체험 버튼
                  </span>
                </div>

                <div className="text-center py-4 space-y-3 bg-white rounded-2xl border border-indigo-100 shadow-inner">
                  {simHatched ? (
                    <div className="space-y-2">
                      <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-indigo-500 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-200 animate-bounce">
                        ✨
                      </div>
                      <h4 className="font-black text-indigo-950 text-sm">
                        🎉 새로운 3D 생명의 기운이 깨어났습니다!
                      </h4>
                      <p className="text-xs text-amber-700 font-bold">
                        🔒 부화한 동물은 비밀! 실제 100 XP로 부화시켜 확인하세요 🎁
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-6xl animate-egg-pulse">🥚</div>
                      <h4 className="font-black text-slate-800 text-sm">신비의 3D 알이 잠들어 있습니다</h4>
                      <p className="text-xs text-slate-400">아래 버튼을 눌러 알 부화의 기운을 체험해보세요!</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleSimHatch}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all animate-breathe-3d"
                    >
                      {simHatched ? '🔄 알 부화 다시 체험하기' : '🥚 신비의 알 부화 반응 체험 (+100 XP)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 자주 묻는 질문 (FAQ) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <span>❓ 자주 묻는 질문 (FAQ)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-black text-slate-900">Q. 개인 지메일이나 타 학교 계정으로 로그인할 수 있나요?</h4>
            <p className="text-slate-600 leading-relaxed">
              아닙니다. 교내 보안과 안전한 학급 질의응답을 위해 <b>@sfl.sen.hs.kr</b> 학교 공식 계정으로만 접근이 허용됩니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-black text-slate-900">Q. 제 실명이나 학번이 다른 학생에게 그대로 노출되나요?</h4>
            <p className="text-slate-600 leading-relaxed">
              노출되지 않습니다! 모든 학생의 이름은 <b>조** (10305)</b> 형태로 자동 마스킹되어 개인정보가 철저하게 보호됩니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-black text-slate-900">Q. 클래스 참여를 위해 QR 코드를 찍어야 하나요?</h4>
            <p className="text-slate-600 leading-relaxed">
              전혀 필요 없습니다! 학교 계정으로 로그인 후 5자리 학번만 입력하면 해당 학년/반 수학 클래스로 자동 배정됩니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <h4 className="font-black text-slate-900">Q. 명예 스타 튜터가 되면 어떤 특권이 주어지나요?</h4>
            <p className="text-slate-600 leading-relaxed">
              펫 1종 5단계(1,000 XP)를 달성하면 타 학급 질문에 답변해도 50%가 아닌 <b>100% (+50 XP)</b> 전액을 보상받으며, 명예의 전당 쇼케이스에 영구 등재됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 CTA 바 */}
      <div className="bg-gradient-to-r from-indigo-50 to-amber-50 rounded-3xl p-6 border border-indigo-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-slate-800 text-sm">지금 바로 ClassTuning을 시작해보세요!</h4>
          <p className="text-xs text-slate-500">서울외고 친구들과 함께 수학 질문을 나누고 나만의 3D 펫을 성장시키세요.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGoToQa}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all"
          >
            질문 피드로 이동하기 ➔
          </button>
          {!user && (
            <button
              onClick={onGoogleLogin}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all"
            >
              학교 계정 로그인 🔑
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// 최초 접속 온보딩 모달 (교사: 닉네임 설정 + 첫 클래스 개설 / 학생: 학번 + 별칭 + 펫 알 선택)
function FirstTimeOnboardingModal({ isOpen, onClose, user, classes = [], onSaveOnboarding }) {
  const isDefaultTeacher = user && (user.role === 'teacher' || (user.email && user.email.includes('ygywam5202')))
  const [role, setRole] = useState(isDefaultTeacher ? 'teacher' : 'student')
  const [nicknameInput, setNicknameInput] = useState(user ? (user.nickname ? user.nickname.replace(' 선생님 (교사)', '') : '') : '')
  const [studentIdInput, setStudentIdInput] = useState('10301')
  const [classNameInput, setClassNameInput] = useState('1학년 3반 수학')
  const [classCodeInput, setClassCodeInput] = useState('MATH103')
  const [selectedPetId, setSelectedPetId] = useState('tiger')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nicknameInput.trim()) {
      alert('성함 또는 닉네임을 입력해 주세요.')
      return
    }

    const chosenPet = STARTER_PETS.find(p => p.id === selectedPetId) || STARTER_PETS[0]
    
    // 학생 학번 기반 소속 학급 자동 배정
    let studentClassId = ''
    if (role === 'student' && studentIdInput) {
      const g = studentIdInput.length >= 3 ? studentIdInput[0] : '1'
      const c = studentIdInput.length >= 3 ? studentIdInput.substring(1, 3).replace(/^0/, '') : '1'
      const matched = classes.find(cls => 
        (cls.grade === g && cls.classNum === c) || 
        (cls.name && cls.name.includes(`${g}학년 ${c}반`)) ||
        cls.code === `MATH${g}${c.padStart(2, '0')}`
      )
      studentClassId = matched ? matched.id : (classes[0] ? classes[0].id : '')
    }

    let finalUser = {
      ...user,
      role,
      nickname: role === 'teacher' 
        ? `${nicknameInput.trim()} 선생님 (교사)` 
        : `${maskStudentInfo(nicknameInput.trim())} (${studentIdInput.trim()})`,
      studentId: role === 'student' ? studentIdInput.trim() : null,
      myClassId: role === 'student' ? studentClassId : (user ? user.myClassId : ''),
      xp: 0,
      isStarTutor: false,
      activePetId: selectedPetId,
      isOnboarded: true
    }

    let initialClass = null
    if (role === 'teacher' && classNameInput.trim()) {
      initialClass = {
        id: 'c_' + Date.now(),
        name: classNameInput.trim(),
        grade: classNameInput.includes('1학년') ? '1' : classNameInput.includes('2학년') ? '2' : '3',
        classNum: '3',
        subject: '수학',
        description: '교사 개설 수학 피드백 학급',
        code: classCodeInput.trim() || 'MATH' + Math.floor(100 + Math.random() * 900),
        teacherName: nicknameInput.trim() || '교사',
        studentCount: 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      finalUser.myClassId = initialClass.id
    }

    onSaveOnboarding(finalUser, initialClass, chosenPet)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-indigo-400 space-y-4 text-left relative max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            🎓
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">ClassTuning 첫 시작 설정</h3>
          <p className="text-xs text-slate-500 font-medium">선생님과 학생 모두 0 XP 신비의 알에서 함께 시작합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">내 역할 선택</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-2.5 px-3 rounded-2xl font-black text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'teacher'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>👨‍🏫 교사 관리자</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2.5 px-3 rounded-2xl font-black text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🧑‍🎓 학생</span>
              </button>
            </div>
          </div>

          {role === 'teacher' ? (
            <div className="space-y-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <div>
                <label className="block font-bold text-slate-700 mb-1">선생님 성함 / 호칭</label>
                <input
                  type="text"
                  placeholder="예: 조OO 선생님"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">첫 번째 개설할 학급 이름</label>
                <input
                  type="text"
                  placeholder="예: 1학년 3반 수학"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">학급 참여 코드</label>
                <input
                  type="text"
                  placeholder="예: MATH103"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase bg-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">학번 (5자리)</label>
                <input
                  type="text"
                  placeholder="예: 10305 (1학년 3반 5번)"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">이름 또는 별칭</label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 개인정보 보호를 위해 화면에는 <span className="font-bold text-indigo-700">[{maskStudentInfo(nicknameInput || '학생')} ({studentIdInput})]</span> 형태로 자동 마스킹 표시됩니다.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>🥚 1호 펫 알 수령 & 성장 목표 동물 선택 (0 XP 시작)</span>
              <span className="text-[10px] text-indigo-600 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-full">
                현재 3D 완료: 호랑이 · 고양이 · 코알라 · 드래곤 · 공룡
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STARTER_PETS.map((pet) => {
                const isReady = pet.isReady !== false
                const isSelected = selectedPetId === pet.id
                return (
                  <div
                    key={pet.id}
                    onClick={() => {
                      if (!isReady) {
                        alert(`⚠️ [${pet.name}]은(는) 현재 3D 입체 그래픽 준비 중입니다.\n현재 부화 가능한 동물: 호랑이 🐯, 고양이 🐱, 코알라 🐨, 드래곤 🐉, 공룡 🦖`)
                        return
                      }
                      setSelectedPetId(pet.id)
                    }}
                    className={`relative p-3 rounded-2xl border transition-all text-center space-y-1 ${
                      !isReady
                        ? 'opacity-55 cursor-not-allowed bg-slate-50 border-slate-200'
                        : isSelected
                        ? 'cursor-pointer border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-400'
                        : 'cursor-pointer border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {!isReady ? (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[9px] font-black rounded-md border border-slate-300">
                        준비 중
                      </span>
                    ) : isSelected ? (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-md shadow-sm">
                        선택됨 ✨
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md">
                        부화 가능
                      </span>
                    )}
                    <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden shadow-sm">
                      <PetAvatar petId={pet.id} stageLevel={1} className="w-full h-full" />
                    </div>
                    <div className="font-extrabold text-xs text-slate-800">{pet.name}</div>
                    <div className="text-[10px] text-slate-400">{pet.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-2"
          >
            설정 완료하고 ClassTuning 시작하기 🚀
          </button>
        </form>
      </div>
    </div>
  )
}

// 교사용 새 학급(클래스) 개설 모달
function CreateClassModal({ isOpen, onClose, onCreateClass, teacherName }) {
  const [grade, setGrade] = useState('1')
  const [classNum, setClassNum] = useState('4')
  const [subject, setSubject] = useState('수학')
  const [className, setClassName] = useState('1학년 4반 수학')
  const [classCode, setClassCode] = useState('MATH104')
  const [description, setDescription] = useState('서울외고 1학년 4반 수학 Q&A 및 피드백 학급')

  // 학년/반/과목 변경 시 기본 이름과 코드 자동 동기화
  const handleGradeChange = (g) => {
    setGrade(g)
    const codeNum = `${g}${classNum.padStart(2, '0')}`
    setClassName(`${g}학년 ${classNum}반 ${subject}`)
    setClassCode(`MATH${codeNum}`)
    setDescription(`서울외고 ${g}학년 ${classNum}반 ${subject} Q&A 및 피드백 학급`)
  }

  const handleClassNumChange = (c) => {
    setClassNum(c)
    const codeNum = `${grade}${c.padStart(2, '0')}`
    setClassName(`${grade}학년 ${c}반 ${subject}`)
    setClassCode(`MATH${codeNum}`)
    setDescription(`서울외고 ${grade}학년 ${c}반 ${subject} Q&A 및 피드백 학급`)
  }

  const handleSubjectChange = (s) => {
    setSubject(s)
    setClassName(`${grade}학년 ${classNum}반 ${s}`)
    setDescription(`서울외고 ${grade}학년 ${classNum}반 ${s} Q&A 및 피드백 학급`)
  }

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!className.trim()) {
      alert('클래스 이름을 입력해 주세요.')
      return
    }

    const newClass = {
      id: 'c_' + Date.now(),
      name: className.trim(),
      grade,
      classNum,
      subject,
      code: classCode.trim() || `MATH${grade}${classNum.padStart(2, '0')}`,
      teacherName: teacherName || '교사 관리자',
      description: description.trim() || '수학 Q&A 학급',
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }

    onCreateClass(newClass)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-indigo-400 space-y-4 text-left relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
              🏫
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">새로운 학급(클래스) 개설</h3>
              <p className="text-xs text-slate-500">교사 전용 학급 개설 & 학생 학번 자동 배정 연동</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 학년 선택 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">학년 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGradeChange(g)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    grade === g
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* 학급(반) 선택 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">학급(반) 선택 (1~12반)</label>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleClassNumChange(c)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    classNum === c
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c}반
                </button>
              ))}
            </div>
          </div>

          {/* 교과목 선택 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">교과목</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['수학', '수학 I', '수학 II', '미적분'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSubjectChange(s)}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                    subject === s
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 클래스명 (자동 생성 + 직접 수정 가능) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">클래스 표시 이름</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-indigo-500"
              placeholder="예: 1학년 4반 수학"
              required
            />
          </div>

          {/* 학급 식별 코드 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">학급 식별 코드</label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-500"
              placeholder="예: MATH104"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * 학생 학번(예: 104xx) 입력 시 이 학급으로 자동 매칭 및 반배정됩니다.
            </p>
          </div>

          {/* 학급 소개 */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">학급 안내 및 공지</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              placeholder="학급 소개 및 학생들에게 전할 안내 메시지"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>🏫 클래스 개설 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Supabase DB & Google OAuth 연동 정보 모달
function SupabaseConfigModal({ isOpen, onClose }) {
  const [urlInput, setUrlInput] = useState(localStorage.getItem('CLASS_TUNING_SUPABASE_URL') || '')
  const [keyInput, setKeyInput] = useState(localStorage.getItem('CLASS_TUNING_SUPABASE_KEY') || '')

  if (!isOpen) return null

  const handleSaveConfig = (e) => {
    e.preventDefault()
    const cleanUrl = urlInput.trim()
    const cleanKey = keyInput.trim()

    if (!cleanUrl || !cleanKey) {
      alert('⚠️ Supabase Project URL과 Anon Key를 모두 입력해 주세요!')
      return
    }

    localStorage.setItem('CLASS_TUNING_SUPABASE_URL', cleanUrl)
    localStorage.setItem('CLASS_TUNING_SUPABASE_KEY', cleanKey)
    try {
      localStorage.setItem('CT_ENC_URL', btoa(encodeURIComponent(cleanUrl)))
      localStorage.setItem('CT_ENC_KEY', btoa(encodeURIComponent(cleanKey)))
    } catch(e){}

    if (window.CLASS_TUNING_CONFIG) {
      window.CLASS_TUNING_CONFIG.supabaseUrl = cleanUrl
      window.CLASS_TUNING_CONFIG.supabaseKey = cleanKey
    }

    alert('🔑 [Supabase 설정 저장 완료]\n구글 OAuth 2.0 및 라이브 DB 연결 설정이 적용되었습니다.')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-indigo-400 space-y-4 text-left relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Supabase DB & Google OAuth 설정</h3>
            <p className="text-xs text-slate-500">서울외고 (@sfl.sen.hs.kr) 구글 로그인 및 라이브 DB 연결</p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Supabase Project URL</label>
            <input
              type="text"
              placeholder="예: https://xyz.supabase.co"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Supabase Anon Key</label>
            <input
              type="password"
              placeholder="eyJhbGciOi..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-indigo-700">🔒 구글 OAuth 학교 제한 코드 스펙:</span>
            <p className="text-slate-700 font-mono text-[11px]">queryParams: &#123; hd: 'sfl.sen.hs.kr' &#125;</p>
            <p className="text-slate-500 text-[10px]">서울외고 구글 Workspace 전용 계정으로만 서비스 로그인이 허용됩니다.</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              🚀 연동 정보 저장 및 연결
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 메인 Q&A 대시보드
function MainDashboard({ user, classes, questions, onAddQuestion, onAddAnswer, onAdoptAnswer, onDeleteClass, onGoToGuide }) {
  const [selectedClassId, setSelectedClassId] = useState('all')
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [qImage, setQImage] = useState(null)
  const [category, setCategory] = useState('일반질문')
  const [replyingQId, setReplyingQId] = useState(null)
  const [answerText, setAnswerText] = useState('')
  const [ansImage, setAnsImage] = useState(null)

  const levelInfo = user ? getLevelInfo(user.xp) : getLevelInfo(0)
  const myClass = classes.find(c => c.id === user?.myClassId) || classes[0]

  const lastFocusedInputRef = useRef(null)
  const titleInputRef = useRef(null)
  const contentInputRef = useRef(null)
  const ansInputRef = useRef(null)

  const qFileRef = useRef(null)
  const ansFileRef = useRef(null)

  const handleQImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setQImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnsImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAnsImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleInsertMathToQ = (latexSnippet) => {
    const targetInput = lastFocusedInputRef.current || contentInputRef.current
    if (targetInput) {
      const start = targetInput.selectionStart || 0
      const end = targetInput.selectionEnd || 0
      const currentVal = targetInput.value || ''
      const newVal = currentVal.substring(0, start) + ' ' + latexSnippet + ' ' + currentVal.substring(end)

      if (targetInput.id === 'q-title-input') {
        setQuestionTitle(newVal)
      } else {
        setQuestionContent(newVal)
      }

      setTimeout(() => {
        targetInput.focus()
        const newPos = start + latexSnippet.length + 2
        targetInput.setSelectionRange(newPos, newPos)
      }, 10)
    } else {
      setQuestionContent((prev) => (prev ? prev + ' ' + latexSnippet : latexSnippet))
    }
  }

  const handleInsertMathToAns = (latexSnippet) => {
    const targetInput = ansInputRef.current
    if (targetInput) {
      const start = targetInput.selectionStart || 0
      const end = targetInput.selectionEnd || 0
      const currentVal = targetInput.value || ''
      const newVal = currentVal.substring(0, start) + ' ' + latexSnippet + ' ' + currentVal.substring(end)
      setAnswerText(newVal)
      setTimeout(() => {
        targetInput.focus()
        const newPos = start + latexSnippet.length + 2
        targetInput.setSelectionRange(newPos, newPos)
      }, 10)
    } else {
      setAnswerText((prev) => (prev ? prev + ' ' + latexSnippet : latexSnippet))
    }
  }

  const handleQuestionSubmit = (e) => {
    e.preventDefault()
    if (!questionTitle.trim()) {
      alert('질문 제목을 입력해 주세요.')
      return
    }

    const newQ = {
      id: Date.now(),
      classId: selectedClassId === 'all' ? (user ? user.myClassId : classes[0].id) : selectedClassId,
      className: selectedClassId === 'all' ? (myClass ? myClass.name : classes[0].name) : classes.find(c=>c.id===selectedClassId).name,
      category,
      authorName: user ? maskStudentInfo(user.nickname) : '서울외고 학생',
      title: questionTitle.trim(),
      content: questionContent.trim(),
      imageUrl: qImage,
      answers: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddQuestion(newQ)
    alert('질문이 등록되었습니다! 질문 작성 (+30 XP)')
    setQuestionTitle('')
    setQuestionContent('')
    setQImage(null)
  }

  const handleAnswerSubmit = (qId) => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해 주세요.')
      return
    }

    const targetQ = questions.find((q) => q.id === qId)

    if (targetQ && targetQ.authorName === (user ? maskStudentInfo(user.nickname) : '')) {
      alert('⚠️ [자문자답 제한 정책]\n자신의 질문에는 셀프 답변을 달아 경험치를 올릴 수 없습니다!')
      return
    }

    const alreadyAnswered = targetQ.answers.some(
      (ans) => ans.authorName === (user ? maskStudentInfo(user.nickname) : '')
    )

    let xpGained = 50
    let xpNotice = ''

    if (alreadyAnswered) {
      xpGained = 0
      xpNotice = 'ℹ️ [중복 답변 경험치 제한] 동일한 질문에는 첫 번째 답변에만 경험치가 부여됩니다.'
    } else if (targetQ.classId === (user ? user.myClassId : 'c1')) {
      xpGained = 50
      xpNotice = '🎉 내 소속 클래스 최초 답변 등록! (+50 XP 풀 적립!)'
    } else if (user && user.isStarTutor) {
      xpGained = 50
      xpNotice = '⭐ 스타강사 프리패스 특권! 타 클래스에서도 100% 풀 경험치(+50 XP) 적립!'
    } else {
      xpGained = 25
      xpNotice = '🌐 타 클래스 질문 답변으로 50% 차등 경험치(+25 XP)가 적립되었습니다.'
    }

    const newAns = {
      id: Date.now(),
      authorName: user ? maskStudentInfo(user.nickname) : '서울외고 피드백어',
      content: answerText.trim(),
      imageUrl: ansImage,
      likes: 0,
      isAdopted: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddAnswer(qId, newAns, xpGained, xpNotice)
    setReplyingQId(null)
    setAnswerText('')
    setAnsImage(null)
  }

  const filteredQuestions = selectedClassId === 'all'
    ? questions
    : questions.filter(q => q.classId === selectedClassId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="space-y-4">
        {user && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 text-white shadow-md space-y-3 border border-indigo-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                🌱 나만의 학습 펫 파트너
              </span>
              {user.role === 'teacher' ? (
                <span className="text-[10px] bg-indigo-500 text-white font-black px-2 py-0.5 rounded-full">
                  👨‍🏫 교사 관리자
                </span>
              ) : user.isStarTutor ? (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  ⭐ 스타 튜터
                </span>
              ) : null}
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                <PetAvatar petId={user.activePetId || 'tiger'} stageLevel={levelInfo.level} fallbackIcon={levelInfo.avatar} className="w-full h-full" />
              </div>
              <div>
                <h4 className="font-black text-sm text-amber-300">{levelInfo.stageName}</h4>
                <p className="text-[11px] text-indigo-200 mt-0.5">내 클래스: <span className="font-bold text-white">{myClass ? myClass.name : '1학년 3반 수학'}</span></p>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-bold text-indigo-200">
                <span>경험치 (XP)</span>
                <span>{user.xp} / {levelInfo.maxXp} XP</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(100, (user.xp / levelInfo.maxXp) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-[10px] space-y-1 text-indigo-100">
              <div className="flex items-center justify-between">
                <span>🏠 내 학급 답변:</span>
                <span className="font-extrabold text-amber-300">+50 XP (100%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌐 타 학급 답변:</span>
                <span className="font-bold text-slate-300">{user.isStarTutor ? '+50 XP (⭐풀특권)' : '+25 XP (50%)'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>🏫 소속 클래스 목록</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{classes.length}개</span>
          </h3>

          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedClassId('all')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedClassId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🌐 전체 학급 질문 피드
            </button>

            {classes.map((c) => (
              <div
                key={c.id}
                className={`group w-full rounded-xl transition-all flex items-center justify-between pr-2 ${
                  selectedClassId === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedClassId(c.id)}
                  className="flex-1 text-left px-3.5 py-2.5 text-xs font-bold truncate flex items-center justify-between"
                >
                  <span className="truncate">{c.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1.5 ${
                    selectedClassId === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {c.studentCount || 0}명
                  </span>
                </button>
                {user && user.role === 'teacher' && onDeleteClass && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`⚠️ [${c.name}] 학급을 정말 삭제하시겠습니까?\n해당 학급에 등록된 질문과 답변 데이터도 함께 정리됩니다.`)) {
                        onDeleteClass(c.id, c.name)
                      }
                    }}
                    title="학급 삭제 (교사 전용)"
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                      selectedClassId === c.id
                        ? 'text-white/80 hover:text-white hover:bg-white/20'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        {/* 상단 1분 사용법 안내 바로가기 카드 배너 */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-amber-50 rounded-3xl p-4 md:p-5 border border-indigo-100 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  ClassTuning 사용법이 궁금하신가요?
                </h3>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full">
                  1분 완전 정복
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                자동 반배정 원리부터 Visual 수식 툴바 입력법, 3D 펫 5단계 성장 및 차등 XP 규칙을 대화형으로 안내합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToGuide}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>대화형 사용법 안내 보기 ➔</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>✏️ 새 질문 등록하기</span>
            <span className="text-xs text-indigo-600 font-bold">(커서 위치 수식 즉시 삽입 & 작성 시 +30 XP!)</span>
          </h2>

          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <input
                  id="q-title-input"
                  ref={titleInputRef}
                  onFocus={() => { lastFocusedInputRef.current = titleInputRef.current }}
                  type="text"
                  placeholder="질문 제목을 입력해 주세요. (수식 기호 삽입 가능)"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 cursor-pointer"
              >
                <option value="일반질문">일반질문</option>
                <option value="모의고사">모의고사 킬러</option>
                <option value="지필기출">지필고사 기출</option>
              </select>
            </div>

            <MathToolbar onInsertMath={handleInsertMathToQ} />

            <textarea
              id="q-content-textarea"
              ref={contentInputRef}
              onFocus={() => { lastFocusedInputRef.current = contentInputRef.current }}
              rows={3}
              placeholder="질문 세부 내용 및 문제 풀이 과정"
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            ></textarea>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
              <div className="text-[11px] font-extrabold text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ 실시간 수식 합성 미리보기</span>
              </div>

              <div className="space-y-1">
                {questionTitle.trim() && (
                  <div className="text-sm font-extrabold text-slate-900 border-b border-indigo-100 pb-1">
                    <span>[제목 미리보기] </span>
                    <MathText text={questionTitle} />
                  </div>
                )}
                <div className="text-sm font-bold text-indigo-950 min-h-[24px]">
                  {questionContent.trim() ? (
                    <MathText text={questionContent} />
                  ) : (
                    <span className="text-slate-400 font-normal italic text-xs">제목이나 내용을 적으시면 수식 합성 미리보기가 작동합니다.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <input type="file" ref={qFileRef} accept="image/*" onChange={handleQImageChange} className="hidden" id="q-file" />
                {qImage ? (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">📷 사진 첨부됨</span>
                ) : (
                  <label htmlFor="q-file" className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer inline-flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>문제 사진 첨부</span>
                  </label>
                )}
              </div>

              <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md">
                질문 등록하기
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base">💬 피드백 Q&A 질문 목록 ({filteredQuestions.length}건)</h3>

          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs border-b pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold rounded-md">{q.category}</span>
                  <span className="font-bold text-slate-700">[{q.className}] {q.authorName}</span>
                </div>
                <span className="text-slate-400">{q.createdAt}</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug">
                <MathText text={q.title} />
              </h4>

              {q.content && (
                <div className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <MathText text={q.content} />
                </div>
              )}

              {q.imageUrl && (
                <img src={q.imageUrl} alt="질문 사진" className="max-h-64 rounded-xl border object-contain bg-white" />
              )}

              <div className="pt-2 border-t space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">답변 목록 ({q.answers.length})</span>
                  {replyingQId !== q.id && (
                    <button
                      onClick={() => setReplyingQId(q.id)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg"
                    >
                      + 답변 달기
                    </button>
                  )}
                </div>

                {replyingQId === q.id && (
                  <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                    <MathToolbar onInsertMath={handleInsertMathToAns} />
                    <textarea
                      ref={ansInputRef}
                      rows={2}
                      placeholder="친절한 답변 작성 (커서 위치 수식 삽입)"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border text-xs"
                    ></textarea>

                    {answerText.trim() && (
                      <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-950">
                        <span>✨ 답변 미리보기: </span>
                        <MathText text={answerText} />
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <input type="file" ref={ansFileRef} accept="image/*" onChange={handleAnsImageChange} className="hidden" id="ans-file" />
                        <label htmlFor="ans-file" className="text-xs text-slate-500 font-bold cursor-pointer underline">
                          📷 풀이 사진 첨부
                        </label>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => setReplyingQId(null)} className="text-xs text-slate-500 font-bold">취소</button>
                        <button onClick={() => handleAnswerSubmit(q.id)} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg">등록</button>
                      </div>
                    </div>
                  </div>
                )}

                {q.answers.map((ans) => {
                  const isSelfAnswer = user && ans.authorName === maskStudentInfo(user.nickname)

                  return (
                    <div key={ans.id} className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                      ans.isAdopted ? 'bg-amber-50/80 border-amber-300 shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center font-bold text-slate-700">
                        <div className="flex items-center space-x-2">
                          <span>{ans.authorName}</span>
                          {ans.isAdopted && (
                            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full flex items-center gap-1 shadow-sm">
                              🏆 질문자 채택 답변 (+100 XP 보상)
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400">{ans.createdAt}</span>
                      </div>

                      <div className="text-slate-800 leading-relaxed"><MathText text={ans.content} /></div>
                      {ans.imageUrl && <img src={ans.imageUrl} alt="답변 풀이 사진" className="max-h-40 rounded border bg-white" />}

                      <div className="flex justify-end items-center pt-1">
                        {!q.hasAdopted && (
                          <button
                            onClick={() => {
                              if (isSelfAnswer) {
                                alert('⚠️ 자신의 답변은 채택할 수 없습니다!')
                                return
                              }
                              onAdoptAnswer(q.id, ans.id, ans.authorName)
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-sm transition-all text-xs flex items-center space-x-1"
                          >
                            <span>✔ 이 답변 채택하기 (+100 XP 보상)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const DEFAULT_CLASSES = [
  {
    id: 'c_101',
    name: '1학년 1반 수학',
    grade: '1',
    classNum: '1',
    subject: '수학',
    code: 'MATH101',
    teacherName: '교사 관리자',
    description: '서울외고 1학년 1반 수학 Q&A 및 피드백 학급',
    studentCount: 24,
    createdAt: '2026-03-01'
  },
  {
    id: 'c_102',
    name: '1학년 2반 수학',
    grade: '1',
    classNum: '2',
    subject: '수학',
    code: 'MATH102',
    teacherName: '교사 관리자',
    description: '서울외고 1학년 2반 수학 Q&A 및 피드백 학급',
    studentCount: 25,
    createdAt: '2026-03-01'
  },
  {
    id: 'c_103',
    name: '1학년 3반 수학',
    grade: '1',
    classNum: '3',
    subject: '수학',
    code: 'MATH103',
    teacherName: '교사 관리자',
    description: '서울외고 1학년 3반 수학 Q&A 및 피드백 학급',
    studentCount: 26,
    createdAt: '2026-03-01'
  }
]

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    classId: 'c_103',
    className: '1학년 3반 수학',
    category: '일반질문',
    authorName: '김** (10312)',
    authorRole: 'student',
    title: '유리함수 점근선 $x=a$, $y=b$ 구하는 공식 질문입니다!',
    content: '함수 $f(x) = \\frac{2x+3}{x-1}$ 에서 점근선의 방정식과 대칭점 좌표를 쉽게 구하는 요령이 궁금해요!',
    imageUrl: null,
    likes: 4,
    createdAt: '2026-03-05 10:20',
    hasAdopted: true,
    answers: [
      {
        id: 101,
        authorName: '이** (10305)',
        authorRole: 'student',
        content: '분모가 0이 되는 $x=1$이 세로 점근선이고, 최고차항 계수 비인 $\\frac{2}{1} = 2$가 가로 점근선 $y=2$가 됩니다! 대칭점은 바로 점근선의 교점인 $(1, 2)$예요.',
        imageUrl: null,
        isAdopted: true,
        createdAt: '2026-03-05 10:25'
      }
    ]
  }
]

// App 메인 컴포넌트
export default function App() {
  const [activeTab, setActiveTab] = useState('qa')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('CLASS_TUNING_ACTIVE_USER')
    if (savedUser) {
      try { return JSON.parse(savedUser) } catch(e){}
    }
    return {
      id: 'teacher-main',
      email: 'ygywam5202@sfl.sen.hs.kr',
      nickname: '교사 관리자',
      role: 'teacher',
      myClassId: 'c_103',
      xp: 0,
      isStarTutor: false,
      activePetId: 'tiger',
      isOnboarded: false
    }
  })

  const [petCollection, setPetCollection] = useState([
    { id: 'tiger', name: '호랑이 🐯', icon: '🐯', xp: 0, isSelected: true }
  ])

  const [showcases, setShowcases] = useState([])
  const [selectedPet, setSelectedPet] = useState(STARTER_PETS[0])
  const [isStarterModalOpen, setIsStarterModalOpen] = useState(false)
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('CLASS_TUNING_CLASSES')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return DEFAULT_CLASSES
  })
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('CLASS_TUNING_QUESTIONS')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return DEFAULT_QUESTIONS
  })

  const [supabaseClient, setSupabaseClient] = useState(null)

  // 🛡️ Supabase Real OAuth 로그인 감지 & 실시간 중앙 DB (classes, questions) 연동
  useEffect(() => {
    let url = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseUrl) || localStorage.getItem('CLASS_TUNING_SUPABASE_URL') || ''
    let key = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseKey) || localStorage.getItem('CLASS_TUNING_SUPABASE_KEY') || ''

    if (window.supabase && url && key && url.startsWith('http')) {
      try {
        const client = window.supabase.createClient(url, key)
        setSupabaseClient(client)

        // 1. 중앙 DB에서 클래스 목록 실시간 동기화
        const loadClasses = async () => {
          try {
            const { data, error } = await client.from('classes').select('*').order('created_at', { ascending: false })
            if (!error && data && data.length > 0) {
              setClasses(data)
              localStorage.setItem('CLASS_TUNING_CLASSES', JSON.stringify(data))
            }
          } catch(e) {
            console.warn('DB classes load error:', e)
          }
        }
        loadClasses()

        // 2. 중앙 DB에서 질문 및 답변 목록 실시간 동기화
        const loadQuestions = async () => {
          try {
            const { data, error } = await client.from('questions').select('*, answers(*)').order('created_at', { ascending: false })
            if (!error && data && data.length > 0) {
              setQuestions(data)
              localStorage.setItem('CLASS_TUNING_QUESTIONS', JSON.stringify(data))
            }
          } catch(e) {
            console.warn('DB questions load error:', e)
          }
        }
        loadQuestions()

        // 3. 실시간 변경사항 웹소켓 수신 (다른 사용자가 작성한 클래스/질문/답변 즉시 반영)
        const channel = client.channel('public:classtuning_realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, () => {
            loadClasses()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => {
            loadQuestions()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, () => {
            loadQuestions()
          })
          .subscribe()

        // 4. 서울외고 구글 로그인 상태 감지
        const applyAuthUser = (authUser) => {
          if (!authUser) return
          const email = (authUser.email || '').toLowerCase()
          const googleName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0] || '사용자'
          const isTeacher = email.includes('ygywam5202') || email.includes('teacher') || email.includes('admin') || (!/\d{5,}/.test(email) && email.endsWith('@sfl.sen.hs.kr'))

          const savedUser = localStorage.getItem('CLASS_TUNING_ACTIVE_USER')
          let parsedUser = null
          if (savedUser) {
            try { parsedUser = JSON.parse(savedUser) } catch(e){}
          }

          if (parsedUser && parsedUser.isOnboarded && parsedUser.email === email) {
            setUser(parsedUser)
          } else {
            const freshUser = {
              id: authUser.id,
              email: email,
              nickname: isTeacher ? `${googleName} 선생님 (교사)` : googleName,
              role: isTeacher ? 'teacher' : 'student',
              myClassId: 'c_103',
              xp: 0,
              isStarTutor: false,
              activePetId: 'tiger',
              isOnboarded: false
            }
            setUser(freshUser)
            setIsOnboardingOpen(true)
          }
        }

        client.auth.getSession().then(({ data: { session } }) => {
          if (session && session.user) {
            applyAuthUser(session.user)
          }
        })

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          if (session && session.user) {
            applyAuthUser(session.user)
          } else if (_event === 'SIGNED_OUT') {
            setUser(null)
            localStorage.removeItem('CLASS_TUNING_ACTIVE_USER')
          }
        })

        return () => {
          subscription?.unsubscribe()
          channel?.unsubscribe()
        }
      } catch (e) {
        console.warn('Supabase DB/Auth sync error:', e)
      }
    }
  }, [])

  const handleSaveOnboarding = async (updatedUser, initialClass, chosenPet) => {
    setUser(updatedUser)
    localStorage.setItem('CLASS_TUNING_ACTIVE_USER', JSON.stringify(updatedUser))

    if (initialClass) {
      setClasses(prev => {
        const next = [initialClass, ...prev.filter(c => c.id !== initialClass.id)]
        localStorage.setItem('CLASS_TUNING_CLASSES', JSON.stringify(next))
        return next
      })

      // Supabase 중앙 DB에 초기 클래스 영구 저장
      if (supabaseClient) {
        try {
          await supabaseClient.from('classes').insert([
            {
              id: initialClass.id,
              name: initialClass.name,
              code: initialClass.code,
              creator_name: initialClass.teacherName || '교사',
              creator_role: 'teacher',
              description: initialClass.description,
              student_count: 1
            }
          ])
        } catch (err) {
          console.warn('초기 클래스 DB 저장 실패:', err)
        }
      }
    }

    if (chosenPet) {
      setPetCollection([
        { id: chosenPet.id, name: chosenPet.name, icon: chosenPet.icon, xp: 0, isSelected: true }
      ])
      setSelectedPet(chosenPet)
    }

    setIsOnboardingOpen(false)
    alert(`🎉 [ClassTuning 설정 완료!]\n0 XP 신비의 알 [${chosenPet ? chosenPet.name : '학습 펫'}]과 함께 활동을 시작합니다!`)
  }

  const handleSelectActivePet = (petId) => {
    setPetCollection(prev =>
      prev.map(p => ({ ...p, isSelected: p.id === petId }))
    )
    const selected = petCollection.find(p => p.id === petId)
    if (selected) {
      setSelectedPet(selected)
      setUser(u => ({ ...u, activePetId: petId }))
    }
  }

  const handleBuyRandomEgg = () => {
    if (user.xp < 100) {
      alert('⚠️ 알을 부화시키려면 최소 100 XP가 필요합니다. Q&A 답변 활동으로 경험치를 모으세요!')
      return
    }

    const readyPets = STARTER_PETS.filter(p => p.isReady !== false)
    const randomPet = readyPets[Math.floor(Math.random() * readyPets.length)] || STARTER_PETS[0]
    setUser(prev => ({ ...prev, xp: prev.xp - 100 }))

    setPetCollection(prev => {
      const exists = prev.find(p => p.id === randomPet.id)
      if (exists) {
        alert(`🥚 [랜덤 알 부화 성과!]\n이미 보유 중인 [${randomPet.name}] 알을 추가 획득하여 경험치 +100 XP가 주입되었습니다!`)
        return prev.map(p => p.id === randomPet.id ? { ...p, xp: p.xp + 100 } : p)
      } else {
        alert(`🎉 [새로운 3D 펫 알 부화!]\n축하합니다! 신비의 알에서 새로운 [${randomPet.name}] 펫을 부화시켰습니다!`)
        return [...prev, { id: randomPet.id, name: randomPet.name, icon: randomPet.icon, xp: 0, isSelected: false }]
      }
    })
  }

  const handleAllocateXp = (petId) => {
    setPetCollection(prev =>
      prev.map(p => {
        if (p.id === petId) {
          const newXp = p.xp + 50
          if (newXp >= 1000 && p.xp < 1000) {
            alert(`🎉 [⭐ 스타강사 자동 획득!]\n[${p.name}] 펫이 5단계 전설 마스터(1,000 XP)로 성장하여 스타강사 자격을 달성하셨습니다!`)
            setUser(u => ({ ...u, isStarTutor: true }))
          }
          return { ...p, xp: newXp }
        }
        return p
      })
    )
  }

  const handleLikeShowcase = (id) => {
    setShowcases(prev =>
      prev.map(sc => sc.id === id ? { ...sc, likes: sc.likes + 1 } : sc)
    )
  }

  const handlePostShowcase = (newSc) => {
    setShowcases(prev => [newSc, ...prev])
  }

  const handleCreateClass = async (newClass) => {
    // 1. 낙관적 UI 즉시 반영 & 로컬 캐시
    setClasses((prev) => {
      const next = [newClass, ...prev.filter(c => c.id !== newClass.id)]
      localStorage.setItem('CLASS_TUNING_CLASSES', JSON.stringify(next))
      return next
    })
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, myClassId: newClass.id }
      localStorage.setItem('CLASS_TUNING_ACTIVE_USER', JSON.stringify(updated))
      return updated
    })
    setIsCreateClassOpen(false)

    // 2. Supabase 중앙 DB 영구 저장 (모든 학생/교사 기기에 실시간 공유)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('classes').insert([
          {
            id: newClass.id,
            name: newClass.name,
            code: newClass.code,
            creator_name: newClass.teacherName || '교사 관리자',
            creator_role: 'teacher',
            description: newClass.description,
            student_count: 0
          }
        ])
        if (error) console.warn('Supabase class insert error:', error.message)
      } catch (err) {
        console.warn('DB 클래스 저장 실패:', err)
      }
    }

    alert(`🎉 [${newClass.name}] 클래스가 성공적으로 개설되었습니다!\n${supabaseClient ? '중앙 DB에 저장되어 모든 학생/교사 기기에 실시간 동기화됩니다.' : '현재 DB 미연동 상태입니다. [DB 설정] 완료 시 전교생에게 실시간 동기화됩니다.'}`)
  }

  const handleDeleteClass = async (classId, className) => {
    // 1. 낙관적 로컬 상태 즉시 삭제
    setClasses((prev) => {
      const next = prev.filter((c) => c.id !== classId)
      localStorage.setItem('CLASS_TUNING_CLASSES', JSON.stringify(next))
      return next
    })

    // 선택 학급 조정
    if (user?.myClassId === classId) {
      setUser((prev) => {
        const remaining = classes.filter((c) => c.id !== classId)
        const updated = { ...prev, myClassId: remaining[0]?.id || '' }
        localStorage.setItem('CLASS_TUNING_ACTIVE_USER', JSON.stringify(updated))
        return updated
      })
    }

    // 2. Supabase 중앙 DB에서 영구 삭제 (전교생 화면에서도 실시간 제거)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('classes').delete().eq('id', classId)
        if (error) console.warn('Supabase class delete error:', error.message)
      } catch (err) {
        console.warn('DB 클래스 삭제 실패:', err)
      }
    }

    alert(`🗑️ [${className}] 학급이 성공적으로 삭제되었습니다.`)
  }

  const handleAddQuestion = async (newQ) => {
    setQuestions((prev) => {
      const next = [newQ, ...prev]
      localStorage.setItem('CLASS_TUNING_QUESTIONS', JSON.stringify(next))
      return next
    })
    setUser((prev) => ({ ...prev, xp: prev.xp + 30 }))

    // Supabase 중앙 DB 영구 저장 (전교생 질문 피드에 실시간 공유)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('questions').insert([
          {
            class_id: newQ.classId,
            class_name: newQ.className,
            category: newQ.category,
            author_id: user?.id || null,
            author_name: newQ.authorName,
            title: newQ.title,
            content: newQ.content,
            image_url: newQ.imageUrl
          }
        ])
        if (error) console.warn('Supabase question insert error:', error.message)
      } catch (err) {
        console.warn('DB 질문 저장 실패:', err)
      }
    }
  }

  const handleAddAnswer = async (qId, newAns, xpGained, xpNotice) => {
    setQuestions((prev) => {
      const next = prev.map((q) => (q.id === qId ? { ...q, answers: [...q.answers, newAns] } : q))
      localStorage.setItem('CLASS_TUNING_QUESTIONS', JSON.stringify(next))
      return next
    })

    if (xpGained > 0) {
      setUser((prev) => ({ ...prev, xp: prev.xp + xpGained }))
    }

    // Supabase 중앙 DB 영구 저장 (전교생 답변 피드에 실시간 공유)
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('answers').insert([
          {
            question_id: qId,
            author_id: user?.id || null,
            author_name: newAns.authorName,
            content: newAns.content,
            image_url: newAns.imageUrl,
            likes: 0,
            is_adopted: false
          }
        ])
        if (error) console.warn('Supabase answer insert error:', error.message)
      } catch (err) {
        console.warn('DB 답변 저장 실패:', err)
      }
    }

    alert(`[답변 등록 완료!]\n${xpNotice}`)
  }

  const handleAdoptAnswer = async (qId, ansId, ansAuthorName) => {
    setQuestions((prev) => {
      const next = prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            hasAdopted: true,
            answers: q.answers.map((a) => (a.id === ansId ? { ...a, isAdopted: true } : a))
          }
        }
        return q
      })
      localStorage.setItem('CLASS_TUNING_QUESTIONS', JSON.stringify(next))
      return next
    })

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 100
    }))

    // Supabase 중앙 DB 업데이트
    if (supabaseClient) {
      try {
        await supabaseClient.from('questions').update({ has_adopted: true }).eq('id', qId)
        await supabaseClient.from('answers').update({ is_adopted: true }).eq('id', ansId)
      } catch (err) {
        console.warn('DB 답변 채택 업데이트 실패:', err)
      }
    }

    alert(`🎉 [답변 채택 완료!]\n해당 답변 작성자(${ansAuthorName})에게 채택 보상 +100 XP가 추가 지급되었습니다!`)
  }

  const handleGoogleLogin = async () => {
    let url = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseUrl) || ''
    let key = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseKey) || ''

    if (!url) {
      const encUrl = localStorage.getItem('CT_ENC_URL')
      if (encUrl) try { url = decodeURIComponent(atob(encUrl)) } catch(e) { url = encUrl }
    }
    if (!url) url = localStorage.getItem('CLASS_TUNING_SUPABASE_URL') || ''

    if (!key) {
      const encKey = localStorage.getItem('CT_ENC_KEY')
      if (encKey) try { key = decodeURIComponent(atob(encKey)) } catch(e) { key = encKey }
    }
    if (!key) key = localStorage.getItem('CLASS_TUNING_SUPABASE_KEY') || ''

    url = url.trim()
    key = key.trim()

    if (!url || !key || !url.startsWith('http')) {
      alert('⚠️ Supabase Project URL과 Anon Key가 설정되지 않았거나 키가 누락되었습니다.\n설정 창에서 URL과 Key를 모두 입력하고 저장을 눌러주세요!')
      setIsSupabaseModalOpen(true)
      return
    }

    if (!window.supabase) {
      alert('⚠️ Supabase 라이브러리를 로드하는 중입니다. 페이지를 새로고침 후 시도해 주세요.')
      return
    }

    try {
      const redirectTarget = (window.location.origin && window.location.origin !== 'null' && window.location.protocol.startsWith('http')) 
        ? window.location.origin 
        : 'https://classtuning.vercel.app'

      const client = window.supabase.createClient(url, key)
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            hd: 'sfl.sen.hs.kr',
            prompt: 'select_account'
          },
          redirectTo: redirectTarget
        }
      })
      if (error) alert('구글 로그인 오류: ' + error.message)
    } catch (e) {
      alert('Supabase 구글 로그인 연결 오류: ' + e.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoogleLogin={handleGoogleLogin}
        onLogout={() => {
          setUser(null)
          localStorage.removeItem('CLASS_TUNING_ACTIVE_USER')
        }}
        onOpenCreateClass={() => setIsCreateClassOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'qa' && (
          <MainDashboard
            user={user}
            classes={classes}
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onAddAnswer={handleAddAnswer}
            onAdoptAnswer={handleAdoptAnswer}
            onDeleteClass={handleDeleteClass}
            onGoToGuide={() => setActiveTab('guide')}
          />
        )}

        {activeTab === 'pets' && (
          <PetStorageView
            user={user}
            petCollection={petCollection}
            onSelectActivePet={handleSelectActivePet}
            onBuyRandomEgg={handleBuyRandomEgg}
            onAllocateXp={handleAllocateXp}
          />
        )}

        {activeTab === 'showcase' && (
          <PetShowcaseView
            user={user}
            showcases={showcases}
            onLikeShowcase={handleLikeShowcase}
            onPostShowcase={handlePostShowcase}
            petCollection={petCollection}
          />
        )}

        {activeTab === 'guide' && (
          <UserGuideView
            user={user}
            onGoogleLogin={handleGoogleLogin}
            onGoToQa={() => setActiveTab('qa')}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        ClassTuning P2P Platform &copy; 2026 | 서울외고 학급 P2P 질의응답 & 학습 펫 파트너
      </footer>

      <CreateClassModal
        isOpen={isCreateClassOpen}
        onClose={() => setIsCreateClassOpen(false)}
        onCreateClass={handleCreateClass}
        teacherName={user?.nickname}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      <FirstTimeOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={user}
        classes={classes}
        onSaveOnboarding={handleSaveOnboarding}
      />
    </div>
  )
}
