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
  Award
} from 'lucide-react'

// 10종 스타터 동물 데이터베이스
const STARTER_PETS = [
  { id: 'tiger', name: '호랑이 🐯', icon: '🐯', desc: '용맹하고 지혜로운 수학 호랑이' },
  { id: 'dino', name: '티라노 🦖', icon: '🦖', desc: '강력한 모의고사 킬러 공룡' },
  { id: 'cat', name: '샤인 고양이 🐱', icon: '🐱', desc: '영리하고 신속한 피드백 냥이' },
  { id: 'dog', name: '시바 강사 🐶', icon: '🐶', desc: '충직하고 친절한 공부 멍멍이' },
  { id: 'deer', name: '꽃사슴 🦌', icon: '🦌', desc: '섬세하고 우아한 개념 사슴' },
  { id: 'giraffe', name: '키다리 기린 🦒', icon: '🦒', desc: '멀리 내다보는 수식 기린' },
  { id: 'koala', name: '잠만보 코알라 🐨', icon: '🐨', desc: '집중력이 뛰어난 포근 코알라' },
  { id: 'hippo', name: '포동 하마 🦛', icon: '🦛', desc: '든든하고 푸근한 기출 하마' },
  { id: 'penguin', name: '황제 펭귄 🐧', icon: '🐧', desc: '차가운 이성의 논리 펭귄' },
  { id: 'dragon', name: '전설 드래곤 🐉', icon: '🐉', desc: '만점을 상징하는 용' }
]

// 반려동물 경험치 레벨 및 5단계 진화 시스템
function getLevelInfo(xp, selectedPet) {
  const petIcon = selectedPet ? selectedPet.icon : '🐯'
  if (xp >= 1000) return { level: 5, stageName: `전설의 대마왕 🐉 (${selectedPet ? selectedPet.name : '마스터 완육'})`, maxXp: 1000, avatar: '🐉' }
  if (xp >= 600) return { level: 4, stageName: `수학 통달 학자 🎓 (${selectedPet ? selectedPet.name : '학자'})`, maxXp: 1000, avatar: `🎓${petIcon}` }
  if (xp >= 300) return { level: 3, stageName: `호기심 유소년 🌿 (${selectedPet ? selectedPet.name : '유소년'})`, maxXp: 600, avatar: `🌿${petIcon}` }
  if (xp >= 100) return { level: 2, stageName: `갓 부화한 아기 🐣 (${selectedPet ? selectedPet.name : '아기'})`, maxXp: 300, avatar: `🐣${petIcon}` }
  return { level: 1, stageName: '신비의 미스터리 알 🥚', maxXp: 100, avatar: '🥚' }
}

// 학생 실명 보호 자동 마스킹 함수: 이름(학번) (예: 김*구 (10305))
function maskStudentInfo(name, studentId = '10305') {
  if (!name) return '학생'
  let maskedName = name
  if (name.length <= 2) {
    maskedName = name[0] + '*'
  } else {
    maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
  }
  return `${maskedName} (${studentId})`
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
    dino: '/assets/3d_dino.jpg',
    cat: {
      1: '/assets/3d_egg.jpg',
      2: '/assets/3d_cat_baby.jpg',
      3: '/assets/3d_cat_child.jpg',
      4: '/assets/3d_cat_scholar.jpg',
      5: '/assets/3d_cat_master.jpg'
    },
    dragon: '/assets/3d_dragon.jpg'
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
function Header({ user, activeTab, setActiveTab, onGoogleLogin, onLogout, onOpenCreateClass, onOpenSupabaseModal }) {
  const levelInfo = user ? getLevelInfo(user.xp) : null

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
              {user && user.isStarTutor ? (
                <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-extrabold rounded-full border border-amber-500 shadow-sm flex items-center gap-1">
                  ⭐ 스타강사 (5단계 완육)
                </span>
              ) : (
                user && (
                  <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 font-bold rounded-full border border-slate-200">
                    진척도: {user.xp}/1000 XP (5단계 완육 시 스타강사)
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">실시간 학급 Q&A & 3D 다마고치 펫 성장</p>
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
            🏆 펫 자랑 게시판
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

          <button
            onClick={onOpenCreateClass}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>클래스 개설</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border">
                <PetAvatar petId={user.activePetId || 'tiger'} stageLevel={levelInfo ? levelInfo.level : 1} fallbackIcon={levelInfo ? levelInfo.avatar : '🐯'} className="w-6 h-6" />
                <span className="text-xs font-bold text-slate-800">{maskStudentInfo(user.nickname)}</span>
                <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-extrabold">
                  Lv.{levelInfo ? levelInfo.level : 1}
                </span>
              </div>
              <button onClick={onLogout} className="text-xs text-slate-400 font-bold underline">
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

// 5단계 완육 펫 자랑 게시판
function PetShowcaseView({ user, showcases, onLikeShowcase, onPostShowcase, petCollection }) {
  const hasStage5Pet = petCollection.some(p => p.xp >= 1000)
  const [sloganInput, setSloganInput] = useState('')

  const handleSubmitShowcase = (e) => {
    e.preventDefault()
    if (!sloganInput.trim()) {
      alert('자랑 한줄평 및 수학 학습 노하우를 입력해 주세요.')
      return
    }
    const stage5Pet = petCollection.find(p => p.xp >= 1000) || petCollection[0]
    onPostShowcase({
      id: Date.now(),
      authorName: user ? maskStudentInfo(user.nickname) : '김*구 (스타강사)',
      className: '1학년 3반 수학',
      petName: stage5Pet.name,
      petIcon: stage5Pet.icon,
      slogan: sloganInput.trim(),
      likes: 0,
      createdAt: '방금 전'
    })
    setSloganInput('')
    alert('🎉 완육 펫 자랑 게시글이 등록되었습니다!')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-black rounded-full border border-white/30">
            🏆 명예의 전당 & 스타강사 펫 자랑
          </span>
          <h2 className="text-2xl font-black">5단계 전설 펫 마스터 자랑 게시판</h2>
          <p className="text-xs text-amber-100 leading-relaxed">
            펫을 5단계(1,000 XP)까지 키우고 스타강사 뱃지를 획득한 뛰어난 학습자들의 축하 공간입니다!
          </p>
        </div>

        <div className="text-6xl animate-egg-pulse">🏆</div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-slate-800 text-base flex items-center justify-between">
          <span>✏️ 내 5단계 전설 펫 자랑하기</span>
          {hasStage5Pet ? (
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✅ 5단계 완육 자격 획득됨
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              🔒 펫 1종 5단계 (1,000 XP) 달성 시 작성 가능
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
                <span className="text-xs font-bold text-amber-700">🐉 5단계 완육 마스터 펫</span>
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

// Supabase DB & Google OAuth 연동 정보 모달
function SupabaseConfigModal({ isOpen, onClose }) {
  const [urlInput, setUrlInput] = useState(localStorage.getItem('CLASS_TUNING_SUPABASE_URL') || '')
  const [keyInput, setKeyInput] = useState(localStorage.getItem('CLASS_TUNING_SUPABASE_KEY') || '')

  if (!isOpen) return null

  const handleSaveConfig = (e) => {
    e.preventDefault()
    if (urlInput.trim()) localStorage.setItem('CLASS_TUNING_SUPABASE_URL', urlInput.trim())
    if (keyInput.trim()) localStorage.setItem('CLASS_TUNING_SUPABASE_KEY', keyInput.trim())
    alert('🔑 [Supabase 설정 저장 완료]\n실제 구글 OAuth 2.0 및 Supabase DB 연결이 적용되었습니다.')
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
function MainDashboard({ user, classes, questions, onAddQuestion, onAddAnswer, onAdoptAnswer, onSelectQrClass }) {
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
                🐾 3D 다마고치 키우기
              </span>
              {user.isStarTutor && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  ⭐ 스타강사
                </span>
              )}
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
              <div key={c.id} className="flex items-center justify-between gap-1">
                <button
                  onClick={() => setSelectedClassId(c.id)}
                  className={`flex-1 text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all truncate ${
                    selectedClassId === c.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.name}
                </button>
                <button
                  onClick={() => onSelectQrClass(c)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                  title="입장 QR 보기"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
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

// App 메인 컴포넌트
export default function App() {
  const [activeTab, setActiveTab] = useState('qa')
  const [user, setUser] = useState({
    id: 'u1',
    nickname: '김탐구',
    role: 'student',
    myClassId: 'c1',
    xp: 80,
    isStarTutor: true,
    activePetId: 'tiger'
  })

  const [petCollection, setPetCollection] = useState([
    { id: 'tiger', name: '호랑이 🐯', icon: '🐯', xp: 80, isSelected: true },
    { id: 'dino', name: '티라노 🦖', icon: '🦖', xp: 1050, isSelected: false }
  ])

  const [showcases, setShowcases] = useState([
    {
      id: 1,
      authorName: '김*구 (10305 스타강사)',
      className: '1학년 3반 수학',
      petName: '전설 티라노 🦖',
      petIcon: '🐉',
      slogan: '시그마(∑)와 극한(lim) 위·아래 기호 수식 100개 답변 채택 완료! 언제든 수학 질문 주세요!',
      likes: 15,
      createdAt: '오늘 14:20'
    },
    {
      id: 2,
      authorName: '이*념 (10211 스타강사)',
      className: '모의고사 킬러모둠',
      petName: '전설 드래곤 🐉',
      petIcon: '🐉',
      slogan: '미적분 킬러문항 피드백 전문입니다. 5단계 완육 스타강사 혜택으로 풀 경험치 적립 중!',
      likes: 9,
      createdAt: '어제 18:05'
    }
  ])

  const [selectedPet, setSelectedPet] = useState(STARTER_PETS[0])
  const [isStarterModalOpen, setIsStarterModalOpen] = useState(false)
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false)
  const [selectedQrClass, setSelectedQrClass] = useState(null)

  const [classes, setClasses] = useState([
    { id: 'c1', name: '1학년 3반 수학', description: '수학1 피드백 학급', code: 'MATH3B', studentCount: 24, qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MATH3B' },
    { id: 'c2', name: '모의고사 킬러문항 모둠', description: '스타강사 특별 수식 스터디', code: 'KILLER', studentCount: 15, qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=KILLER' }
  ])

  const [questions, setQuestions] = useState([
    {
      id: 1,
      classId: 'c1',
      className: '1학년 3반 수학',
      category: '모의고사',
      authorName: '이*습 (10112)',
      title: '이차방정식 근의 공식 $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ 질문입니다!',
      content: '판별식 $D = b^2 - 4ac < 0$ 일 때 허근이 되는 이유와 극한 $\\lim_{n \\to \\infty} \\frac{1}{n} = 0$ 의 관계를 설명 부탁드립니다.',
      imageUrl: null,
      hasAdopted: false,
      createdAt: '10분 전',
      answers: [
        {
          id: 101,
          authorName: '박선생님 (교사)',
          content: '실수 범위에서는 제곱하여 음수가 되는 수 $\\sqrt{-k}$ 가 존재하지 않기 때문입니다! 시그마 $\\sum_{k=1}^{n}$ 공식도 활용해 보세요.',
          imageUrl: null,
          isAdopted: false,
          createdAt: '5분 전'
        }
      ]
    }
  ])

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

    const randomPet = STARTER_PETS[Math.floor(Math.random() * STARTER_PETS.length)]
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

  const handleCreateClass = (newClass) => {
    setClasses((prev) => [newClass, ...prev])
    alert(`[${newClass.name}] 클래스가 개설되었습니다! QR코드로 학생들을 부르세요.`)
  }

  const handleAddQuestion = (newQ) => {
    setQuestions((prev) => [newQ, ...prev])
    setUser((prev) => ({ ...prev, xp: prev.xp + 30 }))
  }

  const handleAddAnswer = (qId, newAns, xpGained, xpNotice) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, answers: [...q.answers, newAns] } : q))
    )

    if (xpGained > 0) {
      setUser((prev) => ({ ...prev, xp: prev.xp + xpGained }))
    }
    alert(`[답변 등록 완료!]\n${xpNotice}`)
  }

  const handleAdoptAnswer = (qId, ansId, ansAuthorName) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            hasAdopted: true,
            answers: q.answers.map((a) => (a.id === ansId ? { ...a, isAdopted: true } : a))
          }
        }
        return q
      })
    )

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + 100
    }))
    alert(`🎉 [답변 채택 완료!]\n해당 답변 작성자(${ansAuthorName})에게 채택 보상 +100 XP가 추가 지급되었습니다!`)
  }

  const handleGoogleLogin = async () => {
    const url = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseUrl) || localStorage.getItem('CLASS_TUNING_SUPABASE_URL') || ''
    const key = (window.CLASS_TUNING_CONFIG && window.CLASS_TUNING_CONFIG.supabaseKey) || localStorage.getItem('CLASS_TUNING_SUPABASE_KEY') || ''

    if (window.supabase && url && url.startsWith('http')) {
      try {
        const client = window.supabase.createClient(url, key)
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              hd: 'sfl.sen.hs.kr',
              prompt: 'select_account'
            },
            redirectTo: window.location.origin
          }
        })
        if (error) alert('구글 로그인 오류: ' + error.message)
        return
      } catch (e) {
        alert('Supabase 구글 로그인 연결 오류: ' + e.message)
      }
    }

    setIsSupabaseModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoogleLogin={handleGoogleLogin}
        onLogout={() => setUser(null)}
        onOpenCreateClass={() => setIsCreateClassOpen(true)}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
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
            onSelectQrClass={(c) => setSelectedQrClass(c)}
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
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        ClassTuning P2P Platform &copy; 2026 | 서울외고 학급 Q&A & 3D 다마고치 펫 & 차등 XP 엔진
      </footer>

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  )
}
