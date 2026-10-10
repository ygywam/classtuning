import React, { useState } from 'react'
import { Filter, CheckCircle, Clock, MessageCircle, KeyRound, Inbox } from 'lucide-react'

export default function TeacherView({ questions, onUpdateAnswer }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'
  const [replyingId, setReplyingId] = useState(null)
  const [answerText, setAnswerText] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (passcode === '1234' || passcode === 'teacher') {
      setIsAuthenticated(true)
    } else {
      alert('비밀번호가 올바르지 않습니다. (테스트용 비밀코드: 1234)')
    }
  }

  const handleAnswerSubmit = (qId) => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해 주세요.')
      return
    }
    onUpdateAnswer(qId, answerText.trim())
    setReplyingId(null)
    setAnswerText('')
    alert('답변이 성공적으로 등록되었습니다.')
  }

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'pending') return q.status === '답변 대기중'
    if (filter === 'completed') return q.status === '답변 완료'
    return true
  })

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">교사 인증</h2>
          <p className="text-sm text-slate-500 mb-6">전체 질문 조회 및 답변 작성을 위해 비밀코드를 입력하세요.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="교사 비밀코드 입력"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold tracking-widest text-lg"
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm"
            >
              대시보드 접속
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-4">(테스트용 비밀코드: 1234)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">교사 Q&A 대시보드</h2>
          <p className="text-sm text-slate-500">학생들이 등록한 질문을 실시간으로 확인하고 피드백을 남깁니다. (총 {questions.length}건 접수됨)</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">필터:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">전체 보기 ({questions.length})</option>
            <option value="pending">답변 대기중 ({questions.filter(q => q.status === '답변 대기중').length})</option>
            <option value="completed">답변 완료 ({questions.filter(q => q.status === '답변 완료').length})</option>
          </select>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 ${
                    q.status === '답변 완료'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {q.status === '답변 완료' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{q.status}</span>
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    [{q.classCode}] 학생 별칭: <strong className="text-slate-800">{q.nickname}</strong>
                  </span>
                </div>
                <span className="text-xs text-slate-400">{q.createdAt}</span>
              </div>

              {q.content && (
                <p className="text-slate-800 font-medium text-base leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  {q.content}
                </p>
              )}

              {q.imageUrl && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 mb-2">📷 학생 첨부 사진:</p>
                  <img
                    src={q.imageUrl}
                    alt="학생 질문 첨부 이미지"
                    className="max-h-80 rounded-lg border border-slate-200 object-contain bg-white"
                  />
                </div>
              )}

              {q.answer && (
                <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>등록된 교사 답변</span>
                  </div>
                  <p className="text-sm font-semibold text-indigo-950 leading-relaxed">{q.answer}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                {replyingId === q.id ? (
                  <div className="w-full space-y-3 pt-2 border-t border-slate-100">
                    <textarea
                      rows={3}
                      placeholder="학생에게 전달할 피드백 답변을 작성해 주세요."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => { setReplyingId(null); setAnswerText(''); }}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-lg transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleAnswerSubmit(q.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>답변 남기기</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setReplyingId(q.id); setAnswerText(q.answer || ''); }}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{q.answer ? '답변 수정' : '답변 작성'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-500 shadow-sm">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">접수된 질문이 없거나 필터 조건에 부합하는 항목이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">학생 화면에서 질문을 등록하면 이곳에 실시간으로 표시됩니다.</p>
        </div>
      )}
    </div>
  )
}
