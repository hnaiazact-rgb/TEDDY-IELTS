/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAMPLE_PROMPTS, PromptTopic } from '../data/ieltsData';
import { Task1Visualizer } from './Task1Visualizer';
import {
  BookOpen,
  Filter,
  ArrowRight,
  Eye,
  CheckCircle,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';

interface TopicBankProps {
  onSelectTopicToPractice: (topic: PromptTopic) => void;
}

export const TopicBank: React.FC<TopicBankProps> = ({ onSelectTopicToPractice }) => {
  const [filterTask, setFilterTask] = useState<'all' | 'task1' | 'task2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<PromptTopic | null>(null);

  // Filter topics
  const filteredTopics = SAMPLE_PROMPTS.filter((topic) => {
    if (filterTask !== 'all' && topic.taskType !== filterTask) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.prompt.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q) ||
        topic.subType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <span>Thư Viện Đề Thi & Bài Mẫu</span>
            <span aria-hidden="true">·</span>
            <span>Band 8.5 - 9.0 Official Archive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kho Đề Thi IELTS Writing & Phân Tích Bài Mẫu
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tuyển chọn các đề thi thật IELTS Writing Task 1 & Task 2 kèm dàn bài chi tiết và bài mẫu Band 9.0 được phân tích câu trúc, từ vựng học thuật chuyên sâu.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterTask('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterTask === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả đề ({SAMPLE_PROMPTS.length})
            </button>
            <button
              onClick={() => setFilterTask('task1')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterTask === 'task1'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task 1 (Biểu đồ)
            </button>
            <button
              onClick={() => setFilterTask('task2')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterTask === 'task2'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task 2 (Nghị luận)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo chủ đề, từ khóa..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-700">
                  {topic.taskType === 'task1' ? 'Task 1' : 'Task 2'} · {topic.subType}
                </span>
                <span>{topic.category}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {topic.title}
              </h3>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{topic.prompt}"
              </p>

              {topic.taskType === 'task1' && topic.chartDetails && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Kèm biểu đồ số liệu trực quan</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedTopicDetail(topic)}
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem bài mẫu Band {topic.modelAnswer.band.toFixed(1)}
              </button>

              <button
                onClick={() => onSelectTopicToPractice(topic)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Luyện đề này</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Answer Inspection Modal */}
      {selectedTopicDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase">
                  <span>Bài Mẫu IELTS Chuẩn Giám Khảo</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-bold">Band {selectedTopicDetail.modelAnswer.band.toFixed(1)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedTopicDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTopicDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              {/* Prompt box */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900">Đề bài: </span>
                <span className="italic">{selectedTopicDetail.prompt}</span>
              </div>

              {/* Task 1 visual if applicable */}
              {selectedTopicDetail.taskType === 'task1' && selectedTopicDetail.chartDetails && (
                <Task1Visualizer chartDetails={selectedTopicDetail.chartDetails} />
              )}

              {/* Essay Text */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  Bài luận hoàn chỉnh (Full Model Essay):
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                  {selectedTopicDetail.modelAnswer.text}
                </div>
              </div>

              {/* Key Highlights & Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Điểm sáng nổi bật phân tích theo tiêu chí:
                </h4>
                <div className="space-y-2">
                  {selectedTopicDetail.modelAnswer.keyHighlights.map((hl, i) => (
                    <div key={i} className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 space-y-1">
                      <div className="font-bold text-indigo-900">{hl.label}</div>
                      <div className="font-mono text-slate-800 bg-white p-1.5 rounded border border-indigo-100">
                        "{hl.textSnippet}"
                      </div>
                      <p className="text-slate-600 italic">
                        {hl.explanationVi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedTopicDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const topic = selectedTopicDetail;
                  setSelectedTopicDetail(null);
                  onSelectTopicToPractice(topic);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Thực hành viết đề này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
