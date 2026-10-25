/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PenTool, BookOpen, Sparkles, CheckCircle2, History, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'lab' | 'topics' | 'descriptors' | 'lexical' | 'drills' | 'history';
  onSelectTab: (tab: 'lab' | 'topics' | 'descriptors' | 'lexical' | 'drills' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div
            onClick={() => onSelectTab('lab')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <PenTool className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              IELTS Writing <span className="text-indigo-600 font-extrabold">MasterLab</span>
            </span>
          </div>

          {/* Zone 2: 4-5 Concise Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('lab')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'lab'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Phòng Luyện Viết
            </button>
            <button
              onClick={() => onSelectTab('topics')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'topics'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Kho Đề & Bài Mẫu
            </button>
            <button
              onClick={() => onSelectTab('descriptors')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'descriptors'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              4 Tiêu Chí Chấm Thi
            </button>
            <button
              onClick={() => onSelectTab('lexical')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'lexical'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Từ Vựng C1/C2
            </button>
            <button
              onClick={() => onSelectTab('drills')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'drills'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Bài Tập Nhanh
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Lịch Sử Chấm Bài
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('lab')}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Chấm Bài Ngay
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-3 border-t border-slate-100 text-xs text-slate-600 scrollbar-none">
          <button
            onClick={() => onSelectTab('lab')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'lab' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            Luyện Viết
          </button>
          <button
            onClick={() => onSelectTab('topics')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'topics' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            Kho Đề
          </button>
          <button
            onClick={() => onSelectTab('descriptors')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'descriptors' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            4 Tiêu Chí
          </button>
          <button
            onClick={() => onSelectTab('lexical')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'lexical' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            Từ Vựng
          </button>
          <button
            onClick={() => onSelectTab('drills')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'drills' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            Bài Tập
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}
          >
            Lịch Sử
          </button>
        </div>
      </div>
    </header>
  );
};
