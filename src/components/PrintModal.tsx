import React from 'react';
import { Printer, X } from 'lucide-react';
import { AppSettings, CandidateResult } from '../types';

interface PrintModalProps {
  settings: AppSettings;
  results: CandidateResult[];
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ settings, results, onClose }) => {
  const { orgName, sessionName, examDate, quota, interviewers } = settings;

  const passCount = results.filter((r) => r.finalDecision === '합격').length;
  const absentCount = results.filter((r) => r.candidate.isAbsent).length;
  const activeCount = results.length - absentCount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-slate-300">
        {/* 상단 툴바 (인쇄 시 숨겨짐: no-print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm">공문서 양식 인쇄 미리보기</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>즉시 인쇄 (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 인쇄 본문 (A4 규격) */}
        <div className="p-8 sm:p-10 font-serif text-slate-900 leading-normal" id="printable-area">
          {/* 상단 결재란 */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs font-sans text-slate-500 font-semibold">{orgName}</div>
              <div className="text-[11px] font-sans text-slate-400">문서분류: 채용시험 집계표</div>
            </div>

            <div className="border border-black">
              <table className="text-center text-xs border-collapse">
                <tbody>
                  <tr>
                    <th rowSpan={2} className="w-7 border-r border-black bg-slate-100 font-bold p-1 text-[11px] writing-mode-vertical">
                      결<br />재
                    </th>
                    <th className="w-16 border-r border-b border-black py-1 font-semibold text-[11px]">담당</th>
                    <th className="w-16 border-r border-b border-black py-1 font-semibold text-[11px]">주무관</th>
                    <th className="w-16 border-r border-b border-black py-1 font-semibold text-[11px]">과장</th>
                    <th className="w-20 border-b border-black py-1 font-semibold text-[11px]">시험위원장</th>
                  </tr>
                  <tr className="h-14">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 공식 문서 제목 */}
          <div className="text-center my-6">
            <h1 className="text-2xl font-bold tracking-wider text-black border-b-2 border-black inline-block pb-1">
              집배원 채용 면접시험 집계표 및 최종 합격자 조서
            </h1>
          </div>

          {/* 시험 개요 요약표 */}
          <div className="mb-6">
            <table className="w-full text-xs border-collapse border border-black font-sans">
              <tbody>
                <tr>
                  <th className="border border-black bg-slate-100 py-1.5 px-2 w-28 text-left font-bold">채용 시험명</th>
                  <td className="border border-black py-1.5 px-3">{sessionName}</td>
                  <th className="border border-black bg-slate-100 py-1.5 px-2 w-24 text-left font-bold">면접 일시</th>
                  <td className="border border-black py-1.5 px-3 w-36">{examDate}</td>
                </tr>
                <tr>
                  <th className="border border-black bg-slate-100 py-1.5 px-2 text-left font-bold">선발 예정 인원</th>
                  <td className="border border-black py-1.5 px-3 font-semibold">{quota}명</td>
                  <th className="border border-black bg-slate-100 py-1.5 px-2 text-left font-bold">응시 현황</th>
                  <td className="border border-black py-1.5 px-3">
                    총 {results.length}명 (응시 {activeCount}명 / 결시 {absentCount}명)
                  </td>
                </tr>
                <tr>
                  <th className="border border-black bg-slate-100 py-1.5 px-2 text-left font-bold">합격자 결정 기준</th>
                  <td colSpan={3} className="border border-black py-1.5 px-3 text-[11px]">
                    1. '상'의 개수가 많은 순으로 순위를 결정하고, 선발예정인원 범위 내의 자를 합격자로 결정함.<br />
                    2. 동점자 발생 시: '상' 많은 순 ➔ '중' 많은 순 ➔ '하' 적은 순을 적용함.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 순위 및 집계 결과표 */}
          <div className="mb-8">
            <table className="w-full text-center text-xs border-collapse border border-black font-sans">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-black">
                  <th className="border border-black py-2 w-12">순위</th>
                  <th className="border border-black py-2 w-20">수험번호</th>
                  <th className="border border-black py-2 w-24">성명</th>
                  <th className="border border-black py-2 w-28">응시지역</th>
                  <th className="border border-black py-2 w-14">상</th>
                  <th className="border border-black py-2 w-14">중</th>
                  <th className="border border-black py-2 w-14">하</th>
                  <th className="border border-black py-2 w-16">계</th>
                  <th className="border border-black py-2 w-20">판정</th>
                  <th className="border border-black py-2">비고</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const cand = r.candidate;
                  return (
                    <tr key={cand.id} className="border-b border-black">
                      <td className="border border-black py-1.5 font-bold font-mono">
                        {r.rank !== null ? r.rank : '-'}
                      </td>
                      <td className="border border-black py-1.5 font-mono">{cand.examNumber}</td>
                      <td className="border border-black py-1.5 font-semibold">{cand.name}</td>
                      <td className="border border-black py-1.5">{cand.region || '-'}</td>
                      <td className="border border-black py-1.5 font-mono font-bold">
                        {cand.isAbsent ? '-' : r.highCount}
                      </td>
                      <td className="border border-black py-1.5 font-mono">
                        {cand.isAbsent ? '-' : r.midCount}
                      </td>
                      <td className="border border-black py-1.5 font-mono">
                        {cand.isAbsent ? '-' : r.lowCount}
                      </td>
                      <td className="border border-black py-1.5 font-mono">
                        {cand.isAbsent ? '-' : r.totalGrades}
                      </td>
                      <td className="border border-black py-1.5 font-bold">
                        {r.finalDecision}
                      </td>
                      <td className="border border-black py-1.5 text-left px-2 text-[11px]">
                        {cand.notes}
                        {r.disqualificationReason ? ` (${r.disqualificationReason})` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 위원 서명란 */}
          <div className="mt-12 text-sm">
            <p className="text-center font-bold mb-6">
              위와 같이 2026년도 집배원 채용 면접시험 평정 결과를 이상 없이 집계·보고합니다.
            </p>
            <div className="text-center font-semibold mb-8">
              {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일
            </div>

            <div className="space-y-4 max-w-md mx-auto font-sans text-xs">
              {interviewers.map((inv) => (
                <div key={inv.id} className="flex justify-between items-center border-b border-dotted border-black pb-1">
                  <span>{inv.name} :</span>
                  <span className="text-slate-400 font-serif">(인 또는 서명)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
