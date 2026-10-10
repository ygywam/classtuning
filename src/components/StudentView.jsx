import React, { useState, useRef } from 'react'
import { Send, Lock, Image as ImageIcon, CheckCircle, Search, Globe } from 'lucide-react'

export default function StudentView({ questions, onAddQuestion }) {
  const [activeTab, setActiveTab] = useState('create')
  const [classCode, setClassCode] = useState('MATH-101')
  const [nickname, setNickname] = useState('')
  const [pin, setPin] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const [searchClassCode, setSearchClassCode] = useState('')
  const [searchPin, setSearchPin] = useState('')
  const [myQuestions, setMyQuestions] = useState([])
  const [searched, setSearched] = useState(false)

  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일 용량은 5MB 이하만 업로드 가능합니다.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleQuestionSubmit = (e) => {
    e.preventDefault()
    if (!classCode.trim() || !nickname.trim() || !pin.trim() || pin.trim().length !== 4) {
      alert('클래스 코드, 별칭, PIN 비밀번호 4자리를 입력해 주세요.')
      return
    }
    if (!questionText.trim() && !imagePreview) {
      alert('질문 내용이나 사진을 등록해야 합니다.')
      return
    }

    const newQ = {
      id: Date.now(),
      classCode: classCode.trim().toUpperCase(),
      nickname: nickname.trim(),
      pin: pin.trim(),
      content: questionText.trim(),
      imageUrl: imagePreview,
      isPublic: isPublic,
      status: '답변 대기중',
      answer: null,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddQuestion(newQ)

    alert(`질문이 등록되었습니다!\n` +
      `[보안: ${isPublic ? '🌐 공용 게시판 공개 공유' : '🔒 비공개 (선생님과 나만 보기)'}]\n` +
      `작성한 질문은 '내 개인 질문함'에서 언제든 확인 가능합니다.`
    )

    setQuestionText('')
    setImagePreview(null)
    setIsPublic(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchClassCode || !searchPin) {
      alert('클래스 코드와 PIN 4자리를 입력해 주세요.')
      return
    }
    setSearched(true)
    const filtered = questions.filter(
      (q) => q.classCode.toUpperCase() === searchClassCode.trim().toUpperCase() && q.pin === searchPin.trim()
    )
    setMyQuestions(filtered)
  }

  const publicQuestions = questions.filter(q => q.isPublic)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-bold border-b-2 text-base whitespace-nowrap transition-colors ${
            activeTab === 'create'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          ✏️ 질문 작성하기
        </button>
        <button
          onClick={() => setActiveTab('public-board')}
          className={`px-4 py-3 font-bold border-b-2 text-base whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'public-board'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>🌐 공용 질문 게시판</span>
          <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full font-extrabold">
            {publicQuestions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('my-questions')}
          className={`px-4 py-3 font-bold border-b-2 text-base whitespace-nowrap transition-colors ${
            activeTab === 'my-questions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          🔒 내 개인 질문함 (PIN)
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-1">✏️ 새로운 질문 작성</h2>
          <p className="text-xs text-slate-500 mb-5">궁금한 점을 적어 남기시면 선생님 대시보드로 즉시 전송됩니다.</p>

          <form onSubmit={handleQuestionSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">클래스 코드</label>
                <input
                  type="text"
                  placeholder="예: MATH-101"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">별칭 / 닉네임</label>
                <input
                  type="text"
                  placeholder="예: 탐구왕"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>PIN 비밀번호 (4자리)</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="숫자 4자리"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">질문 내용</label>
              <textarea
                rows={4}
                placeholder="수업 중 이해가 안 가는 문제나 개념을 작성해 주세요."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">사진 첨부 (선택)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="question-image-file"
              />

              {imagePreview ? (
                <div className="border rounded-xl p-3 bg-slate-50 flex items-center gap-4">
                  <img src={imagePreview} alt="미리보기" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">📷 사진 첨부 완료</p>
                    <button type="button" onClick={handleRemoveImage} className="text-xs text-rose-600 font-bold underline mt-1">
                      사진 삭제
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="question-image-file"
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50 block"
                >
                  <ImageIcon className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                  <p className="text-sm font-bold text-slate-700">클릭하여 문제/풀이 사진 첨부 (최대 5MB)</p>
                </label>
              )}
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>다른 친구들과 함께 공유하기 (공용 게시판 게시)</span>
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    체크하지 않으면 <strong>[🔒 나만 보기]</strong> 설정되어 교사 및 본인만 열람 가능한 비공개 상태로 제출됩니다.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-base"
            >
              <Send className="w-5 h-5" />
              <span>질문 등록하기</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === 'public-board' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
              <span>🌐 공용 질문 게시판</span>
            </h2>
            <p className="text-sm text-slate-500">
              학생들이 공유 체크박스를 켜고 질문한 함께 보는 공부 공간입니다.
            </p>
          </div>

          {publicQuestions.length > 0 ? (
            <div className="space-y-4">
              {publicQuestions.map((q) => (
                <div key={q.id} className="border border-slate-200 bg-slate-50 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        q.status === '답변 완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        🌐 공개 공유
                      </span>
                      <span className="text-xs text-slate-500">작성자: <strong>{q.nickname}</strong></span>
                    </div>
                    <span className="text-xs text-slate-400">{q.createdAt}</span>
                  </div>

                  {q.content && <p className="text-slate-800 font-medium text-base leading-relaxed">{q.content}</p>}

                  {q.imageUrl && (
                    <div className="mt-2">
                      <img src={q.imageUrl} alt="첨부 사진" className="max-h-60 rounded-lg border border-slate-200 bg-white object-contain" />
                    </div>
                  )}

                  {q.answer && (
                    <div className="mt-3 p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-1">
                      <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>선생님 피드백 답변</span>
                      </div>
                      <p className="text-sm font-semibold text-indigo-950 leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50 rounded-xl p-10 text-center text-slate-500">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">아직 공용 게시판에 공개 공유된 질문이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">질문 작성 시 '다른 친구들과 함께 공유하기'를 체크하면 이곳에 게시됩니다.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-questions' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <span>🔒 내 개인 질문함 (마이 대시보드)</span>
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            질문 작성 시 설정한 클래스 코드와 PIN 4자리를 입력하면, 비공개 질문을 포함하여 <strong>내가 쓴 전체 질문과 선생님 답변</strong>이 조회됩니다.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-8">
            <input
              type="text"
              placeholder="클래스 코드 (예: MATH-101)"
              value={searchClassCode}
              onChange={(e) => setSearchClassCode(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              maxLength={4}
              placeholder="PIN 4자리"
              value={searchPin}
              onChange={(e) => setSearchPin(e.target.value)}
              className="w-full md:w-36 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>내 질문함 열기</span>
            </button>
          </form>

          {searched ? (
            myQuestions.length > 0 ? (
              <div className="space-y-4">
                {myQuestions.map((q) => (
                  <div key={q.id} className="border border-slate-200 bg-slate-50 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          q.status === '답변 완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {q.status}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          q.isPublic ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}>
                          {q.isPublic ? '🌐 공개 공유됨' : '🔒 비공개 (나만 보기)'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{q.createdAt}</span>
                    </div>

                    {q.content && <p className="text-slate-800 font-medium text-base">{q.content}</p>}

                    {q.imageUrl && (
                      <div className="mt-2">
                        <img src={q.imageUrl} alt="첨부 사진" className="max-h-60 rounded-lg border border-slate-200 bg-white object-contain" />
                      </div>
                    )}

                    {q.answer ? (
                      <div className="mt-3 p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-1">
                        <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>선생님 피드백 답변</span>
                        </div>
                        <p className="text-sm font-semibold text-indigo-950 leading-relaxed">{q.answer}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 font-semibold mt-2">⏳ 선생님께서 아직 질문을 확인 중입니다.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-8 text-center text-slate-500">
                <p className="font-semibold text-slate-700">입력하신 클래스 코드 및 PIN에 일치하는 질문이 없습니다.</p>
              </div>
            )
          ) : (
            <div className="border border-slate-100 bg-slate-50 rounded-xl p-8 text-center text-slate-500">
              <Lock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">클래스 코드와 PIN 4자리를 입력하여 내 질문함을 열어보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
