/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WritingLab } from './components/WritingLab';
import { TopicBank } from './components/TopicBank';
import { BandDescriptorsGuide } from './components/BandDescriptorsGuide';
import { LexicalBank } from './components/LexicalBank';
import { MicroSkillsTrainer } from './components/MicroSkillsTrainer';
import { HistoryTracker, PracticeRecord } from './components/HistoryTracker';
import { PromptTopic } from './data/ieltsData';
import { PenTool, CheckCircle, Award } from 'lucide-react';

const STORAGE_KEY = 'ielts_writing_practice_history';

// Sample seed record for first-time visitors
const SEED_RECORD: PracticeRecord = {
  id: 'seed-1',
  timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  taskType: 'task2',
  topic: 'Some people believe that artificial intelligence will completely replace human teachers in the future. To what extent do you agree or disagree?',
  wordCount: 278,
  overallBand: 7.5,
  criteriaScores: {
    ta: { band: 7.5, feedbackVi: 'Quan điểm rõ ràng, lập luận mạch lạc, đáp ứng tốt yêu cầu đề.' },
    cc: { band: 7.5, feedbackVi: 'Tổ chức đoạn văn chuẩn mực, liên kết câu tự nhiên.' },
    lr: { band: 7.5, feedbackVi: 'Sử dụng nhiều từ vựng học thuật C1/C2 linh hoạt.' },
    gra: { band: 7.5, feedbackVi: 'Cấu trúc ngữ pháp phức phong phú, ít lỗi ngữ pháp.' },
  },
  essay: `In recent years, the rapid advancement of artificial intelligence has sparked intense debate concerning the future role of educators in modern society. While some people argue that automated software will eventually replace teachers, I firmly disagree with this view. Although digital tools can enhance the learning experience, the fundamental importance of human connection and mentorship remains irreplaceable.\n\nOn the one hand, AI undoubtedly brings remarkable improvements to education. Digital algorithms can analyze student progress in real-time and provide tailored exercises for individual learning speeds. Furthermore, online platforms make high-quality educational resources accessible to students regardless of their geographic location.\n\nOn the other hand, teaching involves far more than merely transferring theoretical knowledge. Human educators offer emotional support, cultivate critical thinking, and inspire moral values—qualities that computer programs fundamentally lack. An empathetic teacher can perceive when a student is struggling and adapt teaching methods accordingly.\n\nIn conclusion, while artificial intelligence will continue to serve as a powerful teaching aid, it cannot supplant human educators. A blended approach combining technological efficiency with human wisdom remains the optimal solution.`,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'lab' | 'topics' | 'descriptors' | 'lexical' | 'drills' | 'history'>('lab');
  const [selectedPromptForLab, setSelectedPromptForLab] = useState<PromptTopic | null>(null);
  const [practiceRecords, setPracticeRecords] = useState<PracticeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return [SEED_RECORD];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(practiceRecords));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }, [practiceRecords]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleSaveToHistory = (newRecord: PracticeRecord) => {
    setPracticeRecords((prev) => [newRecord, ...prev]);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử làm bài?')) {
      setPracticeRecords([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSelectTopicToPractice = (topic: PromptTopic) => {
    setSelectedPromptForLab(topic);
    setActiveTab('lab');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar Contract (3 zones) */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'lab' && (
          <WritingLab
            initialPrompt={selectedPromptForLab}
            onSaveToHistory={handleSaveToHistory}
          />
        )}

        {activeTab === 'topics' && (
          <TopicBank onSelectTopicToPractice={handleSelectTopicToPractice} />
        )}

        {activeTab === 'descriptors' && <BandDescriptorsGuide />}

        {activeTab === 'lexical' && <LexicalBank />}

        {activeTab === 'drills' && <MicroSkillsTrainer />}

        {activeTab === 'history' && (
          <HistoryTracker
            records={practiceRecords}
            onClearHistory={handleClearHistory}
            onSelectRecordToReview={(rec) => {
              // Could open review or load back
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              IW
            </div>
            <span className="font-semibold text-slate-700">
              IELTS Writing MasterLab
            </span>
            <span aria-hidden="true">·</span>
            <span>Chuẩn Tiêu Chí Chấm Thi IDP & British Council</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('lab')} className="hover:text-slate-900">
              Luyện Viết
            </button>
            <button onClick={() => setActiveTab('descriptors')} className="hover:text-slate-900">
              4 Tiêu Chí
            </button>
            <button onClick={() => setActiveTab('lexical')} className="hover:text-slate-900">
              Từ Vựng C1/C2
            </button>
            <button onClick={() => setActiveTab('topics')} className="hover:text-slate-900">
              Kho Đề Thi
            </button>
          </div>

          <div>
            <span>© 2026 IELTS Writing MasterLab. Học tập & Rèn luyện chuyên sâu.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
