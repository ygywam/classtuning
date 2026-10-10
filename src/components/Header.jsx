import React from 'react'
import { MessageSquare, UserCheck, ShieldCheck } from 'lucide-react'

export default function Header({ currentMode, setCurrentMode }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ClassTuning</h1>
            <p className="text-xs text-slate-500 font-medium">수업 실시간 Q&A 피드백</p>
          </div>
        </div>

        <nav className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrentMode('student')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentMode === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>학생 화면</span>
          </button>
          <button
            onClick={() => setCurrentMode('teacher')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              currentMode === 'teacher'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>교사 대시보드</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
