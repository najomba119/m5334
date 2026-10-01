import React from 'react';
import {
  FileSpreadsheet,
  Printer,
  AlertTriangle,
  Award,
  Users,
  XCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { AppSettings, Candidate, CandidateResult, ScoreMatrix } from '../types';
import { exportResultsToCsv } from '../utils/csv';

interface ResultsViewProps {
  settings: AppSettings;
  results: CandidateResult[];
  scores: ScoreMatrix;
  onUpdateCandidateDecision: (
    candidateId: string,
    decision: 'auto' | 'pass' | 'fail' | 'reserve'
  ) => void;
  onOpenPrintModal: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  settings,
  results,
  scores,
  onUpdateCandidateDecision,
  onOpenPrintModal,
}) => {
  const { quota, sessionName } = settings;

  const handleCsvExport = () => {
    exportResultsToCsv(results, settings, scores);
  };

  const passCount = results.filter((r) => r.finalDecision === '합격').length;
  const boundaryTieList = results.filter((r) => r.isBoundaryTie);
  const disqualifiedCount = results.filter((r) => r.isDisqualified).length;
  const absentCount = results.filter((r) => r.candidate.isAbsent).length;
  const activeCount = results.length - absentCount;

  return (
    <div className="space-y-6">
      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>선발 예정 인원</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-slate-900">
            {quota} <span className="text-xs font-normal text-slate-500">명</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>합격 확정 인원</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-emerald-700">
            {passCount} <span className="text-xs font-normal text-slate-500">/ {quota}명</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>경계선 동점자</span>
          </div>
          <div className={`mt-1 text-xl font-bold font-mono ${boundaryTieList.length > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
            {boundaryTieList.length} <span className="text-xs font-normal text-slate-500">명</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>과락/결격자</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-rose-600">
            {disqualifiedCount} <span className="text-xs font-normal text-slate-500">명</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>응시 / 결시</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-slate-800">
            {activeCount} <span className="text-xs font-normal text-slate-500">/ {absentCount}결시</span>
          </div>
        </div>
      </div>

      {/* 경계선 동점자 발생 시 인사위원회 협의 안내 배너 */}
      {boundaryTieList.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-amber-950">
                선발 예정 인원 경계선에 동점자가 발생했습니다 ({boundaryTieList.length}명)
              </h4>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                인사위원회 협의 필요
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              선발 예정 인원({quota}명) 경계에 위치한 응시자들의 ‘상·중·하’ 개수가 완전히 일치합니다.
              우정사업본부 채용 지침에 따라 시험관리위원회 협의 후, 각 응시자의 [판정] 선택창에서
              <strong> 합격 / 불합격 / 예비합격</strong>을 직접 지정해주세요.
            </p>
          </div>
        </div>
      )}

      {/* 순위표 카드 */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">면접시험 최종 순위표</h3>
            <p className="text-xs text-slate-500">
              '상' 개수가 많은 순으로 자동 정렬되며, 선발인원 내 응시자는 합격으로 판정됩니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCsvExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors"
              title="엑셀(Excel)에서 한글 깨짐 없이 바로 열리는 CSV 파일로 저장합니다."
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>📊 엑셀(CSV) 저장</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
              title="공문서 양식의 집배원 채용 면접시험 집계표를 인쇄하거나 PDF로 저장합니다."
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ 공문서 인쇄 / PDF</span>
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto border border-slate-200 rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-2.5 px-3 text-center w-14">순위</th>
                <th className="py-2.5 px-3 w-24">수험번호</th>
                <th className="py-2.5 px-3 w-28">성명</th>
                <th className="py-2.5 px-3 w-32">응시지역</th>
                <th className="py-2.5 px-3 text-center w-20 text-blue-700">상 (우수)</th>
                <th className="py-2.5 px-3 text-center w-20 text-amber-700">중 (보통)</th>
                <th className="py-2.5 px-3 text-center w-20 text-rose-700">하 (미흡)</th>
                <th className="py-2.5 px-3 text-center w-20">평정 합계</th>
                <th className="py-2.5 px-3 text-center w-36">최종 판정</th>
                <th className="py-2.5 px-3">비고 및 특이사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((res, index) => {
                const cand = res.candidate;
                const isCutoffBorder = index === quota - 1 && quota < results.length && !res.isBoundaryTie;

                // 뱃지 스타일
                let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                if (res.finalDecision === '합격') {
                  badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                } else if (res.finalDecision === '동점(협의)') {
                  badgeClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse';
                } else if (res.finalDecision === '과락') {
                  badgeClass = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
                } else if (res.finalDecision === '결시') {
                  badgeClass = 'bg-slate-100 text-slate-400 border-slate-200 line-through';
                } else if (res.finalDecision === '예비') {
                  badgeClass = 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold';
                }

                return (
                  <React.Fragment key={cand.id}>
                    <tr
                      className={`hover:bg-slate-50 transition-colors ${
                        res.isBoundaryTie
                          ? 'bg-amber-50/60'
                          : cand.isAbsent
                          ? 'bg-slate-50/40 text-slate-400'
                          : ''
                      }`}
                    >
                      {/* 순위 */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 tabular-nums">
                        {res.rank !== null ? (
                          <div className="flex items-center justify-center gap-1">
                            <span>{res.rank}</span>
                            {res.isTie && (
                              <span className="text-[10px] text-amber-700 font-normal">
                                (동순위)
                              </span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      {/* 수험번호 */}
                      <td className={`py-2.5 px-3 font-mono font-bold ${cand.isAbsent ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {cand.examNumber}
                      </td>

                      {/* 성명 */}
                      <td className={`py-2.5 px-3 font-semibold ${cand.isAbsent ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {cand.name}
                      </td>

                      {/* 응시지역 */}
                      <td className="py-2.5 px-3 text-slate-600">
                        {cand.region || '-'}
                      </td>

                      {/* 상 */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700 tabular-nums text-sm">
                        {cand.isAbsent ? '-' : res.highCount}
                      </td>

                      {/* 중 */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-amber-700 tabular-nums">
                        {cand.isAbsent ? '-' : res.midCount}
                      </td>

                      {/* 하 */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-rose-700 tabular-nums">
                        {cand.isAbsent ? '-' : res.lowCount}
                      </td>

                      {/* 합계 */}
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600 tabular-nums">
                        {cand.isAbsent ? '-' : res.totalGrades}
                      </td>

                      {/* 최종 판정 & 수동 오버라이드 드롭다운 */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs border ${badgeClass}`}>
                            {res.finalDecision}
                          </span>

                          {res.isBoundaryTie && (
                            <select
                              value={cand.manualDecision || 'auto'}
                              onChange={(e) =>
                                onUpdateCandidateDecision(
                                  cand.id,
                                  e.target.value as 'auto' | 'pass' | 'fail' | 'reserve'
                                )
                              }
                              className="text-[11px] py-0.5 px-1.5 border border-amber-300 rounded bg-white font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                            >
                              <option value="auto">협의 대기 (자동)</option>
                              <option value="pass">합격 확정</option>
                              <option value="reserve">예비합격자 지정</option>
                              <option value="fail">불합격 처리</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* 비고 및 과락 사유 */}
                      <td className="py-2.5 px-3">
                        <div className="text-slate-600 text-xs">
                          {cand.notes}
                          {res.isDisqualified && (
                            <span className="text-rose-700 font-semibold block text-[11px]">
                              [과락 탈락: {res.disqualificationReason}]
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* 선발 기준선 컷오프 표시 */}
                    {isCutoffBorder && (
                      <tr className="bg-red-50/80 border-y-2 border-red-600">
                        <td colSpan={10} className="py-1.5 px-3 text-center text-xs font-bold text-red-950 tracking-wide">
                          ▼ 위 {quota}명까지 선발 예정 인원 합격선 (커트라인) ▼
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
