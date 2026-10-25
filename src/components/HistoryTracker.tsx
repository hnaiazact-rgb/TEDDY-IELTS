/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  Calendar,
  FileText,
  Trash2,
  TrendingUp,
  Award,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { getBandLabel } from '../utils/ieltsCalculator';

export interface PracticeRecord {
  id: string;
  timestamp: string;
  taskType: 'task1' | 'task2';
  topic: string;
  wordCount: number;
  overallBand: number;
  criteriaScores: {
    ta: { band: number; feedbackVi: string };
    cc: { band: number; feedbackVi: string };
    lr: { band: number; feedbackVi: string };
    gra: { band: number; feedbackVi: string };
  };
  essay: string;
}

interface HistoryTrackerProps {
  records: PracticeRecord[];
  onClearHistory: () => void;
  onSelectRecordToReview: (record: PracticeRecord) => void;
}

export const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  records,
  onClearHistory,
  onSelectRecordToReview,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<PracticeRecord | null>(null);

  // Compute average band
  const avgBand =
    records.length > 0
      ? (
          records.reduce((acc, curr) => acc + curr.overallBand, 0) / records.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              <span>Lịch Sử Bài Viết & Tiến Độ</span>
              <span aria-hidden="true">·</span>
              <span>Personal Writing Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Nhật Ký Luyện Thi IELTS Writing
            </h2>
            <p className="text-sm text-slate-600">
              Theo dõi sự tiến bộ điểm số qua từng bài viết, xem lại các nhận xét và lỗi câu từng mắc phải.
            </p>
          </div>

          {records.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử</span>
            </button>
          )}
        </div>

        {/* Stats Row */}
        {records.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Tổng số bài đã luyện</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {records.length} bài
              </div>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="text-xs text-indigo-700 font-medium">Điểm số trung bình</div>
              <div className="text-2xl font-bold text-indigo-700 font-mono mt-1">
                Band {avgBand}
              </div>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
              <div className="text-xs text-emerald-800 font-medium">Bài viết gần nhất</div>
              <div className="text-sm font-bold text-emerald-900 mt-1 truncate">
                {records[0].taskType.toUpperCase()} · Band {records[0].overallBand.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Record list */}
      {records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Chưa có bài viết nào được lưu
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Hãy chuyển sang mục "Phòng Luyện Viết", hoàn thành bài luận và nhấn nút "Chấm Điểm" để lưu kết quả vào đây.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-indigo-700 uppercase">
                    {rec.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                  </span>
                  <span>·</span>
                  <span>{new Date(rec.timestamp).toLocaleDateString('vi-VN')}</span>
                  <span>·</span>
                  <span>{rec.wordCount} từ</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {rec.topic}
                </h4>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                  <span>TA: {rec.criteriaScores.ta.band.toFixed(1)}</span>
                  <span>·</span>
                  <span>CC: {rec.criteriaScores.cc.band.toFixed(1)}</span>
                  <span>·</span>
                  <span>LR: {rec.criteriaScores.lr.band.toFixed(1)}</span>
                  <span>·</span>
                  <span>GRA: {rec.criteriaScores.gra.band.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-indigo-600 font-display tabular-nums">
                    Band {rec.overallBand.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {getBandLabel(rec.overallBand).split('(')[0]}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem lại</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase">
                  <span>Lịch Sử Chấm Bài</span>
                  <span>·</span>
                  <span>Band {selectedRecord.overallBand.toFixed(1)}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedRecord.topic}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">TA/TR</div>
                  <div className="font-bold text-indigo-700">Band {selectedRecord.criteriaScores.ta.band.toFixed(1)}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">CC</div>
                  <div className="font-bold text-indigo-700">Band {selectedRecord.criteriaScores.cc.band.toFixed(1)}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">LR</div>
                  <div className="font-bold text-indigo-700">Band {selectedRecord.criteriaScores.lr.band.toFixed(1)}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">GRA</div>
                  <div className="font-bold text-indigo-700">Band {selectedRecord.criteriaScores.gra.band.toFixed(1)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  Bài làm của bạn ({selectedRecord.wordCount} từ):
                </h4>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                  {selectedRecord.essay}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
