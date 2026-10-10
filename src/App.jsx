import React, { useState } from 'react'
import Header from './components/Header'
import StudentView from './components/StudentView'
import TeacherView from './components/TeacherView'

export default function App() {
  const [currentMode, setCurrentMode] = useState('student') // 'student' | 'teacher'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header currentMode={currentMode} setCurrentMode={setCurrentMode} />
      <main className="flex-1">
        {currentMode === 'student' ? <StudentView /> : <TeacherView />}
      </main>
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        ClassTuning Q&A Platform &copy; 2026 | 학생 비밀번호(PIN) 보호 및 교사 전용 대시보드
      </footer>
    </div>
  )
}
