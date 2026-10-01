import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { AppSettings, Candidate, EvaluationGrade, ScoreMatrix } from '../types';

interface ScoringViewProps {
  settings: AppSettings;
  candidates: Candidate[];
  scores: ScoreMatrix;
  onUpdateGrade: (candidateId: string, interviewerId: string, criteriaId: string, grade: EvaluationGrade) => void;
  onBatchSetCandidateGrades: (candidateId: string, grade: EvaluationGrade) => void;
}

export const ScoringView: React.FC<ScoringViewProps> = ({
  settings,
  candidates,
  scores,
  onUpdateGrade,
  onBatchSetCandidateGrades,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [filterUnratedOnly, setFilterUnratedOnly] = useState(false);

  const activeCandidates = candidates.filter((c) => !c.isAbsent);

  // 초기 선택값 보정
  useEffect(() => {
    if (!selectedCandidateId && activeCandidates.length > 0) {
      setSelectedCandidateId(activeCandidates[0].id);
    } else if (
      selectedCandidateId &&
      !candidates.some((c) => c.id === selectedCandidateId)
    ) {
      setSelectedCandidateId(activeCandidates[0]?.id || '');
    }
  }, [candidates, activeCandidates, selectedCandidateId]);

  const currentCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const currentIndex = activeCandidates.findIndex((c) => c.id === selectedCandidateId);

  // 응시자별 평정 완료 여부 및 개수 계산
  const getCandidateStats = (candId: string) => {
    const candScores = scores[candId] || {};
    let high = 0;
    let mid = 0;
    let low = 0;
    let unrated = 0;

    const critLowCounts: Record<string, number> = {};
    settings.criteria.forEach((c) => (critLowCounts[c.id] = 0));

    settings.interviewers.forEach((inv) => {
      const invScores = candScores[inv.id] || {};
      settings.criteria.forEach((crit) => {
        const grade = invScores[crit.id];
        if (grade === 'high') high++;
        else if (grade === 'mid') mid++;
        else if (grade === 'low') {
          low++;
          critLowCounts[crit.id] = (critLowCounts[crit.id] || 0) + 1;
        } else {
          unrated++;
        }
      });
    });

    const isComplete = unrated === 0;
    const majority = Math.ceil(settings.interviewers.length / 2);
    const hasDisqualifyingCriterion = settings.criteria.some(
      (c) => critLowCounts[c.id] >= majority
    );

    return { high, mid, low, unrated, isComplete, hasDisqualifyingCriterion };
  };

  const currentStats = currentCandidate ? getCandidateStats(currentCandidate.id) : null;

  // 이전/다음 응시자 이동
  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedCandidateId(activeCandidates[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < activeCandidates.length - 1) {
      setSelectedCandidateId(activeCandidates[currentIndex + 1].id);
    }
  };

  // 키보드 단축키 (좌우 화살표로 응시자 이동)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 텍스트 입력창 포커스 중에는 무시
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeCandidates]);

  if (candidates.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="font-semibold text-slate-800">등록된 응시자가 없습니다.</p>
        <p className="text-xs text-slate-500 mt-1">
          [2. 응시자 명단] 탭에서 응시자를 먼저 등록해주세요.
        </p>
      </div>
    );
  }

  // 필터링된 응시자 목록
  const displayedCandidates = filterUnratedOnly
    ? activeCandidates.filter((c) => !getCandidateStats(c.id).isComplete)
    : activeCandidates;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 좌측: 응시자 빠른 선택 사이드바 (3 cols) */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">응시자 선택</h4>
          <label className="text-[11px] text-slate-600 flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnratedOnly}
              onChange={(e) => setFilterUnratedOnly(e.target.checked)}
              className="rounded text-blue-600 w-3.5 h-3.5"
            />
            <span>미입력만 보기</span>
          </label>
        </div>

        <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
          {displayedCandidates.map((c) => {
            const stats = getCandidateStats(c.id);
            const isSelected = c.id === selectedCandidateId;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`w-full text-left p-2.5 rounded-md border text-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-50 border-red-400 text-red-950 font-bold shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-900">{c.examNumber}</span>
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.region && (
                    <span className="text-[10px] text-slate-400 block truncate">{c.region}</span>
                  )}
                </div>

                <div className="text-right shrink-0 ml-2">
                  {stats.isComplete ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
                      <span>상 {stats.high}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded">
                      미입력 {stats.unrated}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {displayedCandidates.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              {filterUnratedOnly ? '모든 응시자의 평정이 완료되었습니다!' : '해당 응시자가 없습니다.'}
            </div>
          )}
        </div>
      </div>

      {/* 우측: 메트릭스 평정 입력 시트 (9 cols) */}
      <div className="lg:col-span-9 space-y-4">
        {currentCandidate ? (
          <>
            {/* 상단 액션 바 */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* 응시자 정보 & 내비게이션 */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex <= 0}
                    className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                    title="이전 응시자 (단축키: ←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex >= activeCandidates.length - 1}
                    className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                    title="다음 응시자 (단축키: →)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {currentCandidate.examNumber}
                    </span>
                    <span className="text-base font-bold text-slate-900">{currentCandidate.name}</span>
                    {currentCandidate.region && (
                      <span className="text-xs text-slate-500 font-normal">
                        ({currentCandidate.region})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    전체 {activeCandidates.length}명 중 {currentIndex + 1}번째 응시자
                  </div>
                </div>
              </div>

              {/* 일괄 채우기 단축 버튼 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">일괄 입력:</span>
                <button
                  onClick={() => onBatchSetCandidateGrades(currentCandidate.id, 'high')}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                  title="현재 응시자의 모든 항목을 '상'으로 일괄 입력"
                >
                  전체 '상'
                </button>
                <button
                  onClick={() => onBatchSetCandidateGrades(currentCandidate.id, 'mid')}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors"
                  title="현재 응시자의 모든 항목을 '중'으로 일괄 입력"
                >
                  전체 '중'
                </button>
                <button
                  onClick={() => onBatchSetCandidateGrades(currentCandidate.id, null)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                  title="현재 응시자 평정 초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 실시간 현재 응시자 평정 요약 배너 */}
            {currentStats && (
              <div className="bg-slate-900 text-white rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">상 (우수):</span>
                    <strong className="text-blue-400 text-sm font-mono">{currentStats.high}개</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">중 (보통):</span>
                    <strong className="text-amber-400 text-sm font-mono">{currentStats.mid}개</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">하 (미흡):</span>
                    <strong className="text-rose-400 text-sm font-mono">{currentStats.low}개</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">미입력:</span>
                    <strong className={`text-sm font-mono ${currentStats.unrated > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
                      {currentStats.unrated}개
                    </strong>
                  </div>
                </div>

                {settings.enableDisqualification && currentStats.hasDisqualifyingCriterion && (
                  <div className="bg-rose-900/70 border border-rose-500 text-rose-200 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>주의: 과반수 위원이 동일 항목에 '하' 평정함 (과락 탈락 기준 해당)</span>
                  </div>
                )}
              </div>
            )}

            {/* 평정 메트릭스 테이블 */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-4 w-72">평가 항목 및 세부 착안점</th>
                      {settings.interviewers.map((inv) => (
                        <th
                          key={inv.id}
                          className="py-3 px-3 text-center border-l border-slate-200 min-w-[150px]"
                        >
                          <div className="font-bold text-slate-900">{inv.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">상 / 중 / 하 선택</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {settings.criteria.map((crit, critIdx) => (
                      <tr key={crit.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* 평가요소 명칭 & 설명 */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {critIdx + 1}
                            </span>
                            <span>{crit.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 leading-relaxed pl-5">
                            {crit.description}
                          </div>
                        </td>

                        {/* 각 면접관별 평정 버튼 셀 */}
                        {settings.interviewers.map((inv) => {
                          const candScores = scores[currentCandidate.id] || {};
                          const invScores = candScores[inv.id] || {};
                          const currentGrade = invScores[crit.id] || null;

                          return (
                            <td
                              key={inv.id}
                              className="py-3.5 px-3 text-center align-middle border-l border-slate-200 bg-white"
                            >
                              <div className="inline-flex rounded-md shadow-xs" role="group">
                                {/* 상 버튼 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateGrade(
                                      currentCandidate.id,
                                      inv.id,
                                      crit.id,
                                      currentGrade === 'high' ? null : 'high'
                                    )
                                  }
                                  className={`px-3 py-1.5 text-xs font-bold rounded-l-md border transition-all ${
                                    currentGrade === 'high'
                                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm z-10'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                                  }`}
                                  title="상 (우수)"
                                >
                                  상
                                </button>

                                {/* 중 버튼 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateGrade(
                                      currentCandidate.id,
                                      inv.id,
                                      crit.id,
                                      currentGrade === 'mid' ? null : 'mid'
                                    )
                                  }
                                  className={`px-3 py-1.5 text-xs font-bold border-t border-b border-r transition-all ${
                                    currentGrade === 'mid'
                                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm z-10'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                                  }`}
                                  title="중 (보통)"
                                >
                                  중
                                </button>

                                {/* 하 버튼 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateGrade(
                                      currentCandidate.id,
                                      inv.id,
                                      crit.id,
                                      currentGrade === 'low' ? null : 'low'
                                    )
                                  }
                                  className={`px-3 py-1.5 text-xs font-bold rounded-r-md border-t border-b border-r transition-all ${
                                    currentGrade === 'low'
                                      ? 'bg-red-600 text-white border-red-700 shadow-sm z-10'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-700'
                                  }`}
                                  title="하 (미흡)"
                                >
                                  하
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
            응시자를 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};
