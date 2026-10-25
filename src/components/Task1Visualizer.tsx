/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface Task1VisualizerProps {
  chartDetails: {
    type: 'line' | 'bar' | 'pie' | 'process' | 'map';
    title: string;
    labels: string[];
    datasets: {
      name: string;
      color: string;
      values: number[];
    }[];
    notes: string;
  };
}

export const Task1Visualizer: React.FC<Task1VisualizerProps> = ({ chartDetails }) => {
  const { title, labels, datasets, notes } = chartDetails;

  // Chart dimensions
  const svgWidth = 600;
  const svgHeight = 260;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const innerWidth = svgWidth - paddingLeft - paddingRight;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  // Find max value
  const allValues = datasets.flatMap((d) => d.values);
  const maxValue = Math.max(...allValues, 50);
  const yTicks = [0, 10, 20, 30, 40, 50];

  const getX = (index: number) => {
    return paddingLeft + (index / (labels.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return paddingTop + innerHeight - (val / maxValue) * innerHeight;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-indigo-700 tracking-wider uppercase">
            Biểu Đồ Đề Thi (Task 1 Visual Diagram)
          </span>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {datasets.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="font-medium">{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Line / Bar Rendering */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[620px] mx-auto select-none"
        >
          {/* Horizontal Grid lines and Y labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  className="font-mono tabular-nums"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* X Axis line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + innerHeight}
            x2={svgWidth - paddingRight}
            y2={paddingTop + innerHeight}
            stroke="#cbd5e1"
            strokeWidth="1"
          />

          {/* X Axis Labels */}
          {labels.map((label, idx) => {
            const x = getX(idx);
            return (
              <text
                key={label}
                x={x}
                y={paddingTop + innerHeight + 18}
                fill="#64748b"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                className="font-mono tabular-nums"
              >
                {label}
              </text>
            );
          })}

          {/* Data series lines and points */}
          {datasets.map((ds) => {
            const points = ds.values.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');
            return (
              <g key={ds.name}>
                <polyline
                  fill="none"
                  stroke={ds.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {ds.values.map((val, idx) => {
                  const cx = getX(idx);
                  const cy = getY(val);
                  return (
                    <g key={idx}>
                      <circle cx={cx} cy={cy} r="4" fill="#ffffff" stroke={ds.color} strokeWidth="2.5" />
                      <text
                        x={cx}
                        y={cy - 7}
                        fontSize="9"
                        fontWeight="600"
                        fill={ds.color}
                        textAnchor="middle"
                        className="font-mono tabular-nums"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <span className="font-semibold text-slate-700 not-italic">Lưu ý phân tích: </span>
        {notes}
      </p>
    </div>
  );
};
