/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OFFICIAL_BAND_DESCRIPTORS, BandDescriptorCriteria } from '../data/ieltsData';
import {
  Award,
  Layers,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const BandDescriptorsGuide: React.FC = () => {
  const [activeCriterion, setActiveCriterion] = useState<'TA' | 'CC' | 'LR' | 'GRA'>('TA');

  const currentDesc = OFFICIAL_BAND_DESCRIPTORS.find((d) => d.criterion === activeCriterion)!;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <span>Official Assessment Rubric</span>
            <span aria-hidden="true">·</span>
            <span>IDP / British Council Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Cẩm Nang 4 Tiêu Chí Chấm Thi IELTS Writing
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hiểu rõ tường tận từng tiêu chí giúp bạn tránh các bẫy trừ điểm oan uổng và biết chính xác giám khảo đang tìm kiếm điều gì trong bài viết của bạn.
          </p>
        </div>

        {/* 4 Criteria Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          {OFFICIAL_BAND_DESCRIPTORS.map((c) => (
            <button
              key={c.criterion}
              onClick={() => setActiveCriterion(c.criterion as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeCriterion === c.criterion
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="text-xs font-bold font-mono text-indigo-600">
                {c.criterion} ({c.weight})
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {c.titleVi.split('/')[0]}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                {c.titleEn}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Criterion Deep Dive */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Tiêu Chí: {currentDesc.titleEn}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {currentDesc.titleVi}
          </h3>
          <p className="text-sm text-slate-600 pt-1">
            {currentDesc.summaryVi}
          </p>
        </div>

        {/* Band Descriptors Breakdown (Band 9 vs Band 7 vs Band 5) */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Mức Độ Kỳ Vọng Theo Từng Thang Điểm:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentDesc.bandLevels.map((lvl) => (
              <div
                key={lvl.band}
                className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
                  lvl.band >= 8.5
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : lvl.band >= 7.0
                    ? 'bg-indigo-50/40 border-indigo-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Mức Điểm
                    </span>
                    <span
                      className={`text-sm font-extrabold font-mono px-2 py-0.5 rounded ${
                        lvl.band >= 8.5
                          ? 'bg-emerald-100 text-emerald-800'
                          : lvl.band >= 7.0
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      Band {lvl.band.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {lvl.descriptionVi}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900">Checklist đạt chuẩn:</div>
                  <ul className="space-y-1 text-slate-700">
                    {lvl.keyChecklist.map((chk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>

                  {lvl.commonMistakes.length > 0 && (
                    <div className="pt-2 text-amber-800">
                      <span className="font-semibold">Lỗi thường gặp: </span>
                      {lvl.commonMistakes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proven Writing Formulas Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task 1 Formula */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
            <FileText className="w-4 h-4" />
            <span>Công thức Task 1 (Biểu đồ)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Cấu Trúc 4 Đoạn Bất Bại Trong Task 1
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">1. Introduction (1 câu): </span>
              <span>Paraphrase lại đề bài bằng cấu trúc: The line graph / bar chart + [delineates / illustrates] + [the proportion / volume of...] + in [location] between [year] and [year].</span>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900">2. Overview (2 câu - Tối quan trọng!): </span>
              <span>Khái quát 2 đặc điểm lớn nhất (Xu hướng tăng/giảm nổi bật nhất + Đối tượng chiếm vị trí cao nhất/thấp nhất). <strong>Tuyệt đối KHÔNG đưa số liệu cụ thể vào đây!</strong></span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">3. Detail 1 (3-4 câu): </span>
              <span>Mô tả nhóm đối tượng thứ nhất kèm số liệu khởi đầu, biến động và điểm cao nhất.</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">4. Detail 2 (3-4 câu): </span>
              <span>Mô tả nhóm đối tượng còn lại với sự so sánh tương quan (higher than, eclipsed by, contrasting with).</span>
            </div>
          </div>
        </div>

        {/* Task 2 PEEL Formula */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Công thức Task 2 (Nghị luận)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Mô Hình PEEL Cho Đoạn Thân Bài Chuẩn Band 8+
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">P - Point (Câu chủ đề): </span>
              <span>Nêu trực diện luận điểm chính của đoạn văn (e.g. "Chief among the merits of renewable energy is its capacity to mitigate ecological degradation.").</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">E - Explanation (Câu giải thích vì sao): </span>
              <span>Đào sâu nguyên nhân - kết quả logic (e.g. "This is primarily because unlike fossil fuels, wind and solar harnessing generates negligible greenhouse emissions...").</span>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
              <span className="font-bold text-indigo-900">E - Example (Dẫn chứng cụ thể): </span>
              <span>Minh chứng thực tế hoặc nghiên cứu (e.g. "For instance, empirical evidence from northern European nations indicates a 40% reduction in urban smog...").</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">L - Link (Câu chốt kết nối lại): </span>
              <span>Khẳng định lại luận điểm (e.g. "Consequently, such transitions are imperative for enduring planetary resilience.").</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
