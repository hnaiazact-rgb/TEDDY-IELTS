/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ACADEMIC_COLLOCATIONS, CollocationItem } from '../data/ieltsData';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  Send,
} from 'lucide-react';

export const LexicalBank: React.FC = () => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [searchWord, setSearchWord] = useState<string>('');

  // Paraphrase Studio states
  const [inputSentence, setInputSentence] = useState<string>(
    'Governments should spend more money on public transport to reduce traffic congestion in big cities.'
  );
  const [isParaphrasing, setIsParaphrasing] = useState<boolean>(false);
  const [paraphraseResults, setParaphraseResults] = useState<any[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const topics = ['all', 'Nguyên nhân & Hậu quả', 'Tầm quan trọng', 'Giải quyết vấn đề', 'Xu hướng & Thay đổi (Task 1)', 'Ý kiến & Tranh luận (Task 2)', 'Môi trường'];

  const filteredCollocations = ACADEMIC_COLLOCATIONS.filter((item) => {
    if (selectedTopicFilter !== 'all' && item.topic !== selectedTopicFilter) return false;
    if (searchWord.trim()) {
      const q = searchWord.toLowerCase();
      return (
        item.simpleWord.toLowerCase().includes(q) ||
        item.advancedCollocation.toLowerCase().includes(q) ||
        item.explanationVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleParaphrase = async () => {
    if (!inputSentence.trim()) return;
    setIsParaphrasing(true);
    setParaphraseResults(null);
    try {
      const res = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: inputSentence }),
      });
      const data = await res.json();
      if (data.success && data.data?.variations) {
        setParaphraseResults(data.data.variations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <span>Academic Lexical Resource</span>
            <span aria-hidden="true">·</span>
            <span>Band 7.5 - 9.0 Vocabulary Bank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kho Từ Vựng & Cụm Từ Học Thuật C1/C2
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Nâng cấp từ vựng từ mức cơ bản (Band 5-6) lên các cụm collocation học thuật tự nhiên (Band 8-9) giúp bạn ghi trọn điểm tiêu chí Lexical Resource.
          </p>
        </div>
      </div>

      {/* AI Paraphrase Studio Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Paraphrase Studio (Công cụ biến hóa câu học thuật)</span>
          </div>
          <span className="text-xs text-slate-500">Chuẩn Band 8.0+</span>
        </div>

        <p className="text-xs text-slate-600">
          Nhập một câu bất kỳ từ đề bài hoặc ý tưởng của bạn, AI sẽ tạo ra 3 cách diễn đạt học thuật khác nhau (Danh từ hóa, Câu bị động, Cụm từ C1/C2):
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            placeholder="Nhập câu tiếng Anh bạn muốn paraphrase..."
            className="flex-1 p-3 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleParaphrase}
            disabled={isParaphrasing || !inputSentence.trim()}
            className="px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {isParaphrasing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Paraphrase Ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Paraphrase Results */}
        {paraphraseResults && (
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3 Cách Diễn Đạt Nâng Cấp:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paraphraseResults.map((item, idx) => (
                <div key={idx} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200 inline-block">
                      {item.method}
                    </span>
                    <p className="font-medium text-slate-900 italic text-sm leading-snug">
                      "{item.text}"
                    </p>
                    <p className="text-slate-600">
                      {item.explanationVi}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.text, idx)}
                    className="pt-2 text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 text-xs self-start"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép câu</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Collocations Bank Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Bảng Chuyển Đổi Cụm Từ Band 6.0 ➔ Band 8.5+
            </h3>
            <p className="text-xs text-slate-500">
              Học cách thay thế các cụm từ phổ thông bằng collocations tinh tế của người bản ngữ.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Tìm từ vựng..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopicFilter(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedTopicFilter === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'Tất cả chủ đề' : t}
            </button>
          ))}
        </div>

        {/* Collocations Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCollocations.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-2">
                <span className="font-semibold text-indigo-700">{item.topic}</span>
              </div>

              {/* Band 6 vs Band 8 Comparison */}
              <div className="space-y-2">
                <div className="p-2.5 bg-red-50/70 rounded-lg border border-red-100">
                  <div className="text-red-700 font-bold uppercase text-[10px]">Band 5.5 - 6.0 (Từ cơ bản):</div>
                  <div className="font-semibold text-slate-800 line-through mt-0.5">{item.simpleWord}</div>
                  <div className="text-slate-600 italic text-[11px] mt-0.5">"{item.band6Example}"</div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-emerald-800 font-bold uppercase text-[10px]">Nâng cấp Band 8.0 - 9.0:</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{item.advancedCollocation}</div>
                  <div className="text-slate-800 italic text-[11px] mt-1 bg-white p-1.5 rounded border border-emerald-100">
                    "{item.band8Example}"
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-[11px] pt-1">
                <span className="font-semibold text-slate-700">Phân tích: </span>
                {item.explanationVi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
