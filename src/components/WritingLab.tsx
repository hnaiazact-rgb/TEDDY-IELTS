/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SAMPLE_PROMPTS,
  PromptTopic,
} from '../data/ieltsData';
import {
  countWords,
  countParagraphs,
  analyzeWritingMetrics,
  getBandLabel,
} from '../utils/ieltsCalculator';
import { Task1Visualizer } from './Task1Visualizer';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Flame,
  Lightbulb,
} from 'lucide-react';

interface EvaluationResult {
  overallBand: number;
  criteriaScores: {
    ta: { band: number; feedbackVi: string; strengths: string[]; improvements: string[] };
    cc: { band: number; feedbackVi: string; strengths: string[]; improvements: string[] };
    lr: { band: number; feedbackVi: string; strengths: string[]; improvements: string[] };
    gra: { band: number; feedbackVi: string; strengths: string[]; improvements: string[] };
  };
  sentenceCorrections: Array<{
    original: string;
    corrected: string;
    issueType: string;
    explanationVi: string;
  }>;
  suggestedCollocations: Array<{
    studentWord: string;
    advancedAlternative: string;
    bandLevel: string;
    exampleUsage: string;
  }>;
  modelRewrite: string;
  generalVerdict: string;
}

interface WritingLabProps {
  initialPrompt?: PromptTopic | null;
  onSaveToHistory: (record: any) => void;
}

export const WritingLab: React.FC<WritingLabProps> = ({ initialPrompt, onSaveToHistory }) => {
  const [selectedTask, setSelectedTask] = useState<'task1' | 'task2'>('task2');
  const [currentPrompt, setCurrentPrompt] = useState<PromptTopic>(
    initialPrompt || SAMPLE_PROMPTS.find((p) => p.taskType === 'task2') || SAMPLE_PROMPTS[0]
  );
  const [customPromptMode, setCustomPromptMode] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>('');

  const [essayText, setEssayText] = useState<string>('');
  const [targetBand, setTargetBand] = useState<number>(7.5);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(40 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // AI states
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evalSource, setEvalSource] = useState<string>('');

  // Brainstorm states
  const [isBrainstorming, setIsBrainstorming] = useState<boolean>(false);
  const [brainstormData, setBrainstormData] = useState<any | null>(null);
  const [showBrainstorm, setShowBrainstorm] = useState<boolean>(false);

  // UI state for copied model essay
  const [copiedRewrite, setCopiedRewrite] = useState<boolean>(false);
  const [activeResultTab, setActiveResultTab] = useState<'criteria' | 'corrections' | 'vocab' | 'rewrite'>('criteria');

  // Metrics
  const metrics = analyzeWritingMetrics(essayText, selectedTask);

  // Handle task type switch
  const handleSwitchTask = (task: 'task1' | 'task2') => {
    setSelectedTask(task);
    setCustomPromptMode(false);
    const firstMatching = SAMPLE_PROMPTS.find((p) => p.taskType === task) || SAMPLE_PROMPTS[0];
    setCurrentPrompt(firstMatching);
    setTimerSeconds(task === 'task1' ? 20 * 60 : 40 * 60);
    setIsTimerRunning(false);
    setEvalResult(null);
    setBrainstormData(null);
    setShowBrainstorm(false);
  };

  // Select a preset prompt
  const handleSelectPrompt = (prompt: PromptTopic) => {
    setCurrentPrompt(prompt);
    setSelectedTask(prompt.taskType);
    setCustomPromptMode(false);
    setTimerSeconds(prompt.timeLimitMinutes * 60);
    setIsTimerRunning(false);
    setEvalResult(null);
    setBrainstormData(null);
    setShowBrainstorm(false);
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(selectedTask === 'task1' ? 20 * 60 : 40 * 60);
  };

  // Load sample model answer into editor for quick demonstration/testing
  const handleLoadSampleEssay = () => {
    if (currentPrompt?.modelAnswer?.text) {
      setEssayText(currentPrompt.modelAnswer.text);
    }
  };

  // Brainstorm ideas
  const handleBrainstorm = async () => {
    const activeTopic = customPromptMode ? customTopic : currentPrompt.prompt;
    if (!activeTopic.trim()) return;

    setIsBrainstorming(true);
    setShowBrainstorm(true);
    try {
      const res = await fetch('/api/brainstorm-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeTopic,
          taskType: selectedTask,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBrainstormData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBrainstorming(false);
    }
  };

  // Evaluate essay
  const handleEvaluate = async () => {
    const activeTopic = customPromptMode ? customTopic : currentPrompt.prompt;
    if (!essayText.trim()) {
      setEvalError('Vui lòng viết hoặc dán nội dung bài làm trước khi bấm chấm điểm.');
      return;
    }

    setEvalError(null);
    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const res = await fetch('/api/evaluate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: selectedTask,
          topic: activeTopic,
          essay: essayText,
          targetBand,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Lỗi khi chấm bài');
      }

      setEvalResult(data.evaluation);
      setEvalSource(data.source);
      setActiveResultTab('criteria');

      // Save to practice history
      onSaveToHistory({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        taskType: selectedTask,
        topic: activeTopic,
        wordCount: metrics.wordCount,
        overallBand: data.evaluation.overallBand,
        criteriaScores: data.evaluation.criteriaScores,
        essay: essayText,
      });

      // Smooth scroll down to results
      setTimeout(() => {
        document.getElementById('evaluation-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err: any) {
      setEvalError(err.message || 'Không thể kết nối đến máy chủ chấm điểm. Vui lòng thử lại.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyRewrite = () => {
    if (evalResult?.modelRewrite) {
      navigator.clipboard.writeText(evalResult.modelRewrite);
      setCopiedRewrite(true);
      setTimeout(() => setCopiedRewrite(false), 2000);
    }
  };

  const activeTopicString = customPromptMode ? customTopic : currentPrompt.prompt;

  return (
    <div className="space-y-8">
      {/* Hero Banner / Academic Introduction */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-md">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="/src/assets/images/hero_ielts_study_1792916309256.jpg"
            alt="IELTS Writing Workspace"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            <span>Official Assessment Standards</span>
            <span aria-hidden="true">·</span>
            <span>IDP & British Council Descriptors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance">
            Phòng Luyện Viết & Chấm Điểm AI IELTS Writing
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Thực hành viết bài bấm giờ, nhận phản hồi tức thì chuẩn 4 tiêu chí chấm thi quốc tế (TR/TA, CC, LR, GRA), phân tích lỗi câu và viết lại bài mẫu chuẩn Band 8.5+.
          </p>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Topic Details & Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* Task 1 vs Task 2 Segmented Controller */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitchTask('task1')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  selectedTask === 'task1'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Task 1 (Báo cáo biểu đồ · 150 từ)
              </button>
              <button
                onClick={() => handleSwitchTask('task2')}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  selectedTask === 'task2'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Task 2 (Nghị luận xã hội · 250 từ)
              </button>
            </div>
          </div>

          {/* Topic Selector Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Đề bài thực hành
              </span>
              <button
                onClick={() => setCustomPromptMode(!customPromptMode)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {customPromptMode ? 'Chọn từ kho đề mẫu' : '+ Tự nhập đề bài của bạn'}
              </button>
            </div>

            {customPromptMode ? (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Nhập đề thi bạn muốn viết:
                </label>
                <textarea
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ví dụ: Some people say that the main purpose of education is to prepare individuals for employment..."
                  className="w-full h-24 p-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Chọn đề bài từ ngân hàng đề thi:
                </label>
                <select
                  value={currentPrompt.id}
                  onChange={(e) => {
                    const found = SAMPLE_PROMPTS.find((p) => p.id === e.target.value);
                    if (found) handleSelectPrompt(found);
                  }}
                  className="w-full p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SAMPLE_PROMPTS.filter((p) => p.taskType === selectedTask).map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.subType}] {p.title}
                    </option>
                  ))}
                </select>

                <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <div className="font-semibold text-slate-900 mb-1">
                    {currentPrompt.subType} · {currentPrompt.category}
                  </div>
                  <p className="font-medium text-slate-800 italic">
                    "{currentPrompt.prompt}"
                  </p>
                </div>
              </div>
            )}

            {/* Task 1 Chart Visualizer */}
            {selectedTask === 'task1' && currentPrompt.chartDetails && !customPromptMode && (
              <Task1Visualizer chartDetails={currentPrompt.chartDetails} />
            )}

            {/* Brainstorm Action Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={handleBrainstorm}
                disabled={isBrainstorming}
                className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 border border-indigo-200"
              >
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                {isBrainstorming ? 'Đang lên ý tưởng...' : 'Gợi ý Ý tưởng & Từ vựng AI'}
              </button>
            </div>

            {/* Brainstorm result drawer */}
            {showBrainstorm && brainstormData && (
              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-indigo-900 pb-2 border-b border-indigo-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Dàn Ý & Từ Vựng Gợi Ý
                  </span>
                  <button
                    onClick={() => setShowBrainstorm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Đóng
                  </button>
                </div>

                {brainstormData.suggestedOverviewOrThesis && (
                  <div>
                    <span className="font-bold text-indigo-950">
                      {selectedTask === 'task1' ? 'Gợi ý Overview:' : 'Gợi ý Thesis Statement:'}
                    </span>
                    <p className="mt-1 text-slate-800 italic bg-white p-2 rounded border border-indigo-100">
                      "{brainstormData.suggestedOverviewOrThesis}"
                    </p>
                  </div>
                )}

                {brainstormData.outlineIdeas && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-indigo-950">Luận điểm then chốt:</span>
                    {brainstormData.outlineIdeas.map((idea: any, i: number) => (
                      <div key={i} className="bg-white p-2 rounded border border-indigo-100">
                        <div className="font-semibold text-indigo-900">{idea.title}</div>
                        <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                          {idea.points.map((pt: string, idx: number) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {brainstormData.keyVocabulary && (
                  <div>
                    <span className="font-bold text-indigo-950">Từ vựng C1/C2 ghi điểm:</span>
                    <div className="mt-1 grid grid-cols-1 gap-1">
                      {brainstormData.keyVocabulary.map((v: any, i: number) => (
                        <div key={i} className="bg-white p-1.5 rounded border border-indigo-100 text-slate-800">
                          <span className="font-bold text-indigo-700">{v.word}</span>{' '}
                          <span className="text-slate-500">({v.meaningVi})</span>: {v.collocation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Target Band Config */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Mục tiêu điểm số của bạn:</span>
            <div className="flex items-center gap-1.5">
              {[6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                <button
                  key={b}
                  onClick={() => setTargetBand(b)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    targetBand === b
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Writing Canvas & Diagnostic Controller */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Toolbar Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tabular-nums ${
                    timerSeconds < 300
                      ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                  title={isTimerRunning ? 'Tạm dừng' : 'Bắt đầu tính giờ'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                  title="Đặt lại thời gian"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sample Essay Quick Load */}
              {!customPromptMode && currentPrompt.modelAnswer && (
                <button
                  onClick={handleLoadSampleEssay}
                  className="text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Dán bài mẫu tham khảo
                </button>
              )}
            </div>

            {/* Textarea Input */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder={
                  selectedTask === 'task1'
                    ? 'Bắt đầu viết bài Task 1 tại đây (tối thiểu 150 từ, bao gồm Introduction, Overview và 2 đoạn Detail)...'
                    : 'Bắt đầu viết bài luận Task 2 tại đây (tối thiểu 250 từ, bao gồm Mở bài, 2 Thân bài có ví dụ và Kết bài)...'
                }
                rows={16}
                className="w-full text-slate-900 text-sm leading-relaxed p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans resize-y min-h-[320px]"
              />

              {/* Real-time Writing HUD & Word Counter */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">Số từ:</span>
                    <span
                      className={`font-mono font-bold tabular-nums text-sm ${
                        metrics.meetsMinWordCount ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {metrics.wordCount}
                    </span>
                    <span className="text-slate-400">/ {metrics.minRequired} từ tối thiểu</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-slate-500">Đoạn văn:</span>
                    <span className="font-mono font-medium text-slate-800 tabular-nums">
                      {metrics.paragraphCount}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-slate-500">Độ dài TB câu:</span>
                    <span className="font-mono font-medium text-slate-800 tabular-nums">
                      {metrics.avgSentenceLength} từ/câu
                    </span>
                  </div>
                </div>

                {/* Word Count Indicator Badge */}
                <div>
                  {metrics.meetsMinWordCount ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã đạt độ dài quy định
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Còn thiếu {metrics.wordCountDeficit} từ
                    </span>
                  )}
                </div>
              </div>

              {/* Penalty Warning Callout */}
              {metrics.penaltyWarning && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  {metrics.penaltyWarning}
                </div>
              )}
            </div>

            {/* Submit Action Deck */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {essayText.length > 0 ? (
                  <span>Tự động kiểm tra chính tả & 4 tiêu chí</span>
                ) : (
                  <span>Hãy hoàn thành bài viết để nhận chẩn đoán chi tiết</span>
                )}
              </div>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !essayText.trim()}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Giám khảo AI đang chấm thi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Chấm Điểm & Phân Tích Toàn Diện</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {evalError && (
            <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{evalError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Results Section (Visible after evaluation) */}
      {evalResult && (
        <div id="evaluation-results-section" className="space-y-6 pt-6 border-t border-slate-200">
          {/* Overall Band Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  <span>Kết Quả Đánh Giá Chính Thức</span>
                  <span aria-hidden="true">·</span>
                  <span>Quarter-Band Official Rounding</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Bảng Điểm & Nhận Xét Chi Tiết
                </h2>
                <p className="text-xs text-slate-500">
                  {evalResult.generalVerdict}
                </p>
              </div>

              {/* Big Score Stamp */}
              <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:px-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-display tabular-nums">
                    Band {evalResult.overallBand.toFixed(1)}
                  </div>
                  <div className="text-xs font-semibold text-indigo-900 mt-0.5">
                    {getBandLabel(evalResult.overallBand)}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Official Criteria Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* Criteria 1: TA / TR */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {selectedTask === 'task1' ? 'Task Achievement' : 'Task Response'}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 font-mono tabular-nums">
                    Band {evalResult.criteriaScores.ta.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evalResult.criteriaScores.ta.feedbackVi}
                </p>
                {evalResult.criteriaScores.ta.improvements?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-amber-700">
                    <span className="font-semibold">Cần cải thiện: </span>
                    {evalResult.criteriaScores.ta.improvements[0]}
                  </div>
                )}
              </div>

              {/* Criteria 2: CC */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Coherence & Cohesion</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono tabular-nums">
                    Band {evalResult.criteriaScores.cc.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evalResult.criteriaScores.cc.feedbackVi}
                </p>
                {evalResult.criteriaScores.cc.improvements?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-amber-700">
                    <span className="font-semibold">Cần cải thiện: </span>
                    {evalResult.criteriaScores.cc.improvements[0]}
                  </div>
                )}
              </div>

              {/* Criteria 3: LR */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Lexical Resource</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono tabular-nums">
                    Band {evalResult.criteriaScores.lr.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evalResult.criteriaScores.lr.feedbackVi}
                </p>
                {evalResult.criteriaScores.lr.improvements?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-amber-700">
                    <span className="font-semibold">Cần cải thiện: </span>
                    {evalResult.criteriaScores.lr.improvements[0]}
                  </div>
                )}
              </div>

              {/* Criteria 4: GRA */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Grammar & Accuracy</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono tabular-nums">
                    Band {evalResult.criteriaScores.gra.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evalResult.criteriaScores.gra.feedbackVi}
                </p>
                {evalResult.criteriaScores.gra.improvements?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-amber-700">
                    <span className="font-semibold">Cần cải thiện: </span>
                    {evalResult.criteriaScores.gra.improvements[0]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Deep-Dive Tabs (Corrections / Collocations / Model Rewrite) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-2 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-1">
              <button
                onClick={() => setActiveResultTab('criteria')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeResultTab === 'criteria'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Điểm Mạnh & Điểm Yếu
              </button>
              <button
                onClick={() => setActiveResultTab('corrections')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeResultTab === 'corrections'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Chữa Lỗi Câu Chi Tiết ({evalResult.sentenceCorrections.length} lỗi)
              </button>
              <button
                onClick={() => setActiveResultTab('vocab')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeResultTab === 'vocab'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Từ Vựng Nâng Cấp C1/C2 ({evalResult.suggestedCollocations.length} từ)
              </button>
              <button
                onClick={() => setActiveResultTab('rewrite')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeResultTab === 'rewrite'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4. Bài Viết Mẫu Band 8.5+ Hoàn Chỉnh
              </button>
            </div>

            {/* Tab 1: Detailed Strengths & Improvements */}
            {activeResultTab === 'criteria' && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Những điểm làm tốt trong bài
                    </h4>
                    <div className="space-y-2">
                      {[
                        ...evalResult.criteriaScores.ta.strengths,
                        ...evalResult.criteriaScores.cc.strengths,
                        ...evalResult.criteriaScores.lr.strengths,
                        ...evalResult.criteriaScores.gra.strengths,
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      Điểm cần khắc phục để bứt phá Band
                    </h4>
                    <div className="space-y-2">
                      {[
                        ...evalResult.criteriaScores.ta.improvements,
                        ...evalResult.criteriaScores.cc.improvements,
                        ...evalResult.criteriaScores.lr.improvements,
                        ...evalResult.criteriaScores.gra.improvements,
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs text-slate-800 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Sentence Corrections */}
            {activeResultTab === 'corrections' && (
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500">
                  Dưới đây là các câu trích từ bài viết của bạn được giám khảo chỉ ra lỗi sai và viết lại chuẩn học thuật:
                </p>
                <div className="space-y-4">
                  {evalResult.sentenceCorrections.map((corr, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-500 uppercase">
                          Lỗi #{idx + 1} ({corr.issueType})
                        </span>
                      </div>
                      <div className="p-2.5 bg-red-50 text-red-800 rounded-lg border border-red-100 font-sans">
                        <span className="font-semibold">Câu của bạn: </span>
                        <span>"{corr.original}"</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-sans">
                        <span className="font-semibold">Sửa lại chuẩn Band 8+: </span>
                        <span>"{corr.corrected}"</span>
                      </div>
                      <p className="text-slate-600 italic pt-1">
                        <span className="font-medium not-italic text-slate-700">Giải thích: </span>
                        {corr.explanationVi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Suggested Collocations */}
            {activeResultTab === 'vocab' && (
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500">
                  Nâng cấp các từ vựng đơn giản sang cụm từ học thuật C1/C2 để đẩy mạnh tiêu chí Lexical Resource:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evalResult.suggestedCollocations.map((col, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="text-slate-500 line-through">
                          Từ thông thường: {col.studentWord}
                        </span>
                        <span className="font-bold text-indigo-700 font-mono">
                          {col.bandLevel}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        {col.advancedAlternative}
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 italic">
                        "{col.exampleUsage}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Model Rewrite */}
            {activeResultTab === 'rewrite' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Bài Viết Hoàn Chỉnh Chuẩn Band 8.5 - 9.0
                    </h3>
                    <p className="text-xs text-slate-500">
                      Giữ nguyên luận điểm gốc của bạn nhưng nâng cấp hoàn toàn ngữ pháp, liên kết và từ vựng.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyRewrite}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copiedRewrite ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép bài</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 font-sans whitespace-pre-line">
                  {evalResult.modelRewrite}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
