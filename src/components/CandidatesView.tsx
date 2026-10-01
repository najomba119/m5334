import React, { useState } from 'react';
import { UserPlus, FileText, Trash2, Search, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Candidate } from '../types';
import { parseCandidatesText } from '../utils/csv';

interface CandidatesViewProps {
  candidates: Candidate[];
  onChangeCandidates: (candidates: Candidate[]) => void;
  onClearScoresForCandidate: (candidateId: string) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  candidates,
  onChangeCandidates,
  onClearScoresForCandidate,
}) => {
  // 개별 등록 폼 상태
  const [examNumber, setExamNumber] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [notes, setNotes] = useState('');

  // 일괄 등록 모달 상태
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // 검색 필터
  const [searchTerm, setSearchTerm] = useState('');

  // 단건 추가
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examNumber.trim() || !name.trim()) {
      alert('수험번호와 성명은 필수 입력 항목입니다.');
      return;
    }

    // 수험번호 중복 체크
    if (candidates.some((c) => c.examNumber === examNumber.trim())) {
      if (!confirm('이미 등록된 동일한 수험번호가 있습니다. 그래도 추가하시겠습니까?')) {
        return;
      }
    }

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      examNumber: examNumber.trim(),
      name: name.trim(),
      region: region.trim(),
      notes: notes.trim(),
      isAbsent: false,
      manualDecision: 'auto',
    };

    onChangeCandidates([...candidates, newCand]);
    setExamNumber('');
    setName('');
    setRegion('');
    setNotes('');
  };

  // 일괄 등록 처리
  const handleProcessBulk = () => {
    if (!bulkText.trim()) return;
    const parsed = parseCandidatesText(bulkText);
    if (parsed.length === 0) {
      alert('인식할 수 있는 데이터가 없습니다. 한 줄에 "수험번호 성명" 형식으로 입력해주세요.');
      return;
    }

    const newCandidates: Candidate[] = parsed.map((item, idx) => ({
      id: `cand-${Date.now()}-${idx}`,
      examNumber: item.examNumber || `${1000 + candidates.length + idx + 1}`,
      name: item.name || '무명',
      region: item.region || '',
      notes: item.notes || '',
      isAbsent: false,
      manualDecision: 'auto',
    }));

    onChangeCandidates([...candidates, ...newCandidates]);
    setBulkText('');
    setIsBulkModalOpen(false);
    alert(`${newCandidates.length}명의 응시자가 성공적으로 등록되었습니다.`);
  };

  // 결시 토글
  const handleToggleAbsent = (id: string) => {
    onChangeCandidates(
      candidates.map((c) => (c.id === id ? { ...c, isAbsent: !c.isAbsent } : c))
    );
  };

  // 비고 수정
  const handleUpdateNotes = (id: string, newNotes: string) => {
    onChangeCandidates(
      candidates.map((c) => (c.id === id ? { ...c, notes: newNotes } : c))
    );
  };

  // 지역 수정
  const handleUpdateRegion = (id: string, newRegion: string) => {
    onChangeCandidates(
      candidates.map((c) => (c.id === id ? { ...c, region: newRegion } : c))
    );
  };

  // 응시자 삭제
  const handleDeleteCandidate = (id: string) => {
    if (confirm('해당 응시자를 삭제하시겠습니까? 입력된 평정 점수도 함께 삭제됩니다.')) {
      onChangeCandidates(candidates.filter((c) => c.id !== id));
      onClearScoresForCandidate(id);
    }
  };

  // 전체 삭제
  const handleClearAll = () => {
    if (candidates.length === 0) return;
    if (confirm('등록된 모든 응시자 명단을 삭제하시겠습니까?')) {
      onChangeCandidates([]);
    }
  };

  // 필터링된 응시자
  const filteredCandidates = candidates.filter(
    (c) =>
      c.examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.region && c.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const absentCount = candidates.filter((c) => c.isAbsent).length;
  const activeCount = candidates.length - absentCount;

  return (
    <div className="space-y-6">
      {/* 응시자 신규 등록 카드 */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">응시자 등록</h3>
            <p className="text-xs text-slate-500">개별 등록하거나 엑셀에서 복사해 일괄 입력할 수 있습니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-red-600" />
              <span>📋 엑셀/텍스트 일괄 등록</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleAddCandidate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              수험번호 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={examNumber}
              onChange={(e) => setExamNumber(e.target.value)}
              placeholder="예: 1001"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              성명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              required
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              응시지역 / 소속국 (선택)
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예: 서울중앙우체국"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              비고 / 메모 (선택)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="특이사항"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full h-[34px] flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>추가</span>
            </button>
          </div>
        </form>
      </div>

      {/* 명단 리스트 카드 */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">등록된 응시자 현황</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600">
                총 <strong className="text-slate-900 font-mono">{candidates.length}</strong>명
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700">
                응시 <strong className="font-mono">{activeCount}</strong>명
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-700">
                결시 <strong className="font-mono">{absentCount}</strong>명
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="수험번호, 이름 검색..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 w-44"
              />
            </div>
            {candidates.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1.5 rounded transition-colors"
              >
                전체 비우기
              </button>
            )}
          </div>
        </div>

        {/* 테이블 */}
        {filteredCandidates.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {candidates.length === 0
              ? '등록된 응시자가 없습니다. 위 폼에서 추가하거나 일괄 등록 버튼을 눌러주세요.'
              : '검색 조건과 일치하는 응시자가 없습니다.'}
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3 text-center w-12">연번</th>
                  <th className="py-2.5 px-3 w-28">수험번호</th>
                  <th className="py-2.5 px-3 w-32">성명</th>
                  <th className="py-2.5 px-3 w-40">응시지역/소속국</th>
                  <th className="py-2.5 px-3 text-center w-24">결시 처리</th>
                  <th className="py-2.5 px-3">비고</th>
                  <th className="py-2.5 px-3 text-center w-16">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((cand, idx) => (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      cand.isAbsent ? 'bg-slate-100/70 text-slate-400' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-center font-mono text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className={`py-2 px-3 font-mono font-bold ${cand.isAbsent ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {cand.examNumber}
                    </td>
                    <td className={`py-2 px-3 font-semibold ${cand.isAbsent ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {cand.name}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={cand.region || ''}
                        onChange={(e) => handleUpdateRegion(cand.id, e.target.value)}
                        placeholder="지역 입력"
                        className="w-full px-1.5 py-0.5 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cand.isAbsent}
                          onChange={() => handleToggleAbsent(cand.id)}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                        />
                        <span className="ml-1 text-[11px] font-medium text-slate-600">
                          {cand.isAbsent ? '결시' : '정상'}
                        </span>
                      </label>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={cand.notes || ''}
                        onChange={(e) => handleUpdateNotes(cand.id, e.target.value)}
                        placeholder="메모 입력"
                        className="w-full px-1.5 py-0.5 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xs"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleDeleteCandidate(cand.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="응시자 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 일괄 등록 모달 */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-red-600" />
                <span>엑셀 / 텍스트 일괄 등록</span>
              </h4>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>엑셀 파일에서 <strong>[수험번호] [성명] [응시지역]</strong> 열을 복사하여 아래에 붙여넣으세요.</p>
              <p className="text-slate-500">예시 형식 (줄바꿈 구분):</p>
              <pre className="bg-slate-100 p-2 rounded text-[11px] font-mono text-slate-700">
{`1001	홍길동	서울중앙우체국
1002	김우정	동대문우체국
1003	이배달	강남우체국`}
              </pre>
            </div>

            <textarea
              rows={8}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="여기에 엑셀 데이터를 붙여넣으세요..."
              className="w-full p-3 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleProcessBulk}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
              >
                명단 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
