import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Tabs, ActiveTab } from './components/Tabs';
import { SettingsView } from './components/SettingsView';
import { CandidatesView } from './components/CandidatesView';
import { ScoringView } from './components/ScoringView';
import { ResultsView } from './components/ResultsView';
import { PrintModal } from './components/PrintModal';
import { OfflineGuideModal } from './components/OfflineGuideModal';
import { AppState, loadAppState, saveAppState } from './utils/storage';
import { calculateCandidateResults } from './utils/scoring';
import { EvaluationGrade } from './types';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('results');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isOfflineGuideOpen, setIsOfflineGuideOpen] = useState(false);

  // 상태 변경 시 LocalStorage 자동 동기화
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // 최종 결과 및 순위 자동 계산 (메모이제이션)
  const results = useMemo(() => {
    return calculateCandidateResults(state.candidates, state.scores, state.settings);
  }, [state.candidates, state.scores, state.settings]);

  // 평정 진행률 계산
  const scoringProgress = useMemo(() => {
    const active = state.candidates.filter((c) => !c.isAbsent);
    const totalItems = active.length * state.settings.interviewers.length * state.settings.criteria.length;
    if (totalItems === 0) return 0;

    let filledCount = 0;
    active.forEach((c) => {
      const candScores = state.scores[c.id] || {};
      state.settings.interviewers.forEach((inv) => {
        const invScores = candScores[inv.id] || {};
        state.settings.criteria.forEach((crit) => {
          if (invScores[crit.id]) filledCount++;
        });
      });
    });

    return Math.round((filledCount / totalItems) * 100);
  }, [state.candidates, state.scores, state.settings]);

  // 통계값
  const passCount = useMemo(() => {
    return results.filter((r) => r.finalDecision === '합격').length;
  }, [results]);

  const boundaryTieCount = useMemo(() => {
    return results.filter((r) => r.isBoundaryTie).length;
  }, [results]);

  // 평정 단위 업데이트
  const handleUpdateGrade = (
    candidateId: string,
    interviewerId: string,
    criteriaId: string,
    grade: EvaluationGrade
  ) => {
    setState((prev) => {
      const newScores = { ...prev.scores };
      if (!newScores[candidateId]) newScores[candidateId] = {};
      if (!newScores[candidateId][interviewerId]) newScores[candidateId][interviewerId] = {};

      newScores[candidateId][interviewerId][criteriaId] = grade;
      return { ...prev, scores: newScores };
    });
  };

  // 응시자 전 항목 일괄 등급 지정 (상/중 일괄)
  const handleBatchSetCandidateGrades = (candidateId: string, grade: EvaluationGrade) => {
    setState((prev) => {
      const newScores = { ...prev.scores };
      if (!newScores[candidateId]) newScores[candidateId] = {};

      prev.settings.interviewers.forEach((inv) => {
        if (!newScores[candidateId][inv.id]) newScores[candidateId][inv.id] = {};
        prev.settings.criteria.forEach((crit) => {
          newScores[candidateId][inv.id][crit.id] = grade;
        });
      });

      return { ...prev, scores: newScores };
    });
  };

  // 응시자 삭제 시 점수 데이터 정리
  const handleClearScoresForCandidate = (candidateId: string) => {
    setState((prev) => {
      const newScores = { ...prev.scores };
      delete newScores[candidateId];
      return { ...prev, scores: newScores };
    });
  };

  // 동점자 협의 후 수동 판정 조정
  const handleUpdateCandidateDecision = (
    candidateId: string,
    decision: 'auto' | 'pass' | 'fail' | 'reserve'
  ) => {
    setState((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c) =>
        c.id === candidateId ? { ...c, manualDecision: decision } : c
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* 글로벌 상단 헤더 */}
      <Header
        state={state}
        onStateChange={setState}
        onOpenOfflineGuide={() => setIsOfflineGuideOpen(true)}
      />

      {/* 탭 네비게이션 */}
      <Tabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        candidateCount={state.candidates.length}
        scoringProgressPercent={scoringProgress}
        passCount={passCount}
        boundaryTieCount={boundaryTieCount}
      />

      {/* 메인 뷰포트 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'settings' && (
          <SettingsView
            settings={state.settings}
            onChange={(newSettings) => setState((prev) => ({ ...prev, settings: newSettings }))}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidatesView
            candidates={state.candidates}
            onChangeCandidates={(newCandidates) =>
              setState((prev) => ({ ...prev, candidates: newCandidates }))
            }
            onClearScoresForCandidate={handleClearScoresForCandidate}
          />
        )}

        {activeTab === 'scoring' && (
          <ScoringView
            settings={state.settings}
            candidates={state.candidates}
            scores={state.scores}
            onUpdateGrade={handleUpdateGrade}
            onBatchSetCandidateGrades={handleBatchSetCandidateGrades}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            settings={state.settings}
            results={results}
            scores={state.scores}
            onUpdateCandidateDecision={handleUpdateCandidateDecision}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />
        )}
      </main>

      {/* 인쇄 모달 */}
      {isPrintModalOpen && (
        <PrintModal
          settings={state.settings}
          results={results}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* 내부망 오프라인 안내 모달 */}
      {isOfflineGuideOpen && (
        <OfflineGuideModal
          state={state}
          onClose={() => setIsOfflineGuideOpen(false)}
        />
      )}
    </div>
  );
}
