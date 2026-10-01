import React from 'react';
import { Sliders, Users, Edit3, Award } from 'lucide-react';

export type ActiveTab = 'settings' | 'candidates' | 'scoring' | 'results';

interface TabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  candidateCount: number;
  scoringProgressPercent: number;
  passCount: number;
  boundaryTieCount: number;
}

export const Tabs: React.FC<TabsProps> = ({
  activeTab,
  onChangeTab,
  candidateCount,
  scoringProgressPercent,
  passCount,
  boundaryTieCount,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2" aria-label="Tabs">
          <button
            onClick={() => onChangeTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-red-50 text-red-950 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-500" />
            <span>1. 기본 설정 (기준·배점)</span>
          </button>

          <button
            onClick={() => onChangeTab('candidates')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'candidates'
                ? 'bg-red-50 text-red-950 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>2. 응시자 명단</span>
            <span className="text-xs bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono">
              {candidateCount}명
            </span>
          </button>

          <button
            onClick={() => onChangeTab('scoring')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'scoring'
                ? 'bg-red-50 text-red-950 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>3. 평정 입력 (상·중·하)</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                scoringProgressPercent === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {scoringProgressPercent}%
            </span>
          </button>

          <button
            onClick={() => onChangeTab('results')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'results'
                ? 'bg-red-50 text-red-950 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4 text-slate-500" />
            <span>4. 결과 및 출력</span>
            {boundaryTieCount > 0 ? (
              <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-medium animate-pulse">
                동점 협의 {boundaryTieCount}
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full font-mono">
                합격 {passCount}명
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
