import React, { useRef } from 'react';
import { Download, FileSpreadsheet, RefreshCw, Upload, ShieldCheck, HelpCircle } from 'lucide-react';
import { AppState, exportBackupJson, DEFAULT_SETTINGS, SAMPLE_CANDIDATES, SAMPLE_SCORES } from '../utils/storage';
import { downloadStandaloneHtmlFile } from '../utils/exportHtml';

interface HeaderProps {
  state: AppState;
  onStateChange: (newState: AppState) => void;
  onOpenOfflineGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onStateChange, onOpenOfflineGuide }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackupExport = () => {
    exportBackupJson(state);
  };

  const handleStandaloneHtmlExport = () => {
    downloadStandaloneHtmlFile(state);
  };

  const handleReset = () => {
    if (window.confirm('정말로 모든 데이터를 초기화하시겠습니까? 입력된 평점과 명단이 삭제됩니다.')) {
      onStateChange({
        settings: DEFAULT_SETTINGS,
        candidates: [],
        scores: {},
      });
    }
  };

  const handleLoadSample = () => {
    if (window.confirm('테스트용 샘플 집배원 응시자 10명과 평정 데이터를 로드하시겠습니까?')) {
      onStateChange({
        settings: DEFAULT_SETTINGS,
        candidates: SAMPLE_CANDIDATES,
        scores: SAMPLE_SCORES,
      });
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings && parsed.candidates && parsed.scores) {
          onStateChange(parsed);
          alert('백업 파일이 성공적으로 복원되었습니다.');
        } else {
          alert('유효한 백업 파일 형식이 아닙니다.');
        }
      } catch (err) {
        alert('백업 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-b border-blue-800 text-white select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Zone: 입체감 있는 글자상자 (3D Bevel & Shadow Plate) */}
        <div className="bg-gradient-to-b from-slate-900/90 via-blue-950/85 to-slate-950/95 border-t border-l border-white/25 border-r border-slate-950/80 border-b-2 border-black/70 rounded-xl p-2.5 sm:px-4 sm:py-3 shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.35)] flex items-center gap-3.5 backdrop-blur-md">
          {/* 입체 엠블럼 아이콘 */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 border-t border-white/40 border-b-2 border-blue-950 shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                집배원 채용 면접 결과 정리기
              </h1>
              {/* 입체 뱃지 */}
              <span className="text-[11px] font-bold bg-gradient-to-b from-red-500 via-red-600 to-red-800 text-white px-2.5 py-0.5 rounded-md border-t border-red-300 border-b border-red-950 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                우정사업본부 채용지원
              </span>
            </div>
            <p className="text-xs text-blue-200/90 font-medium truncate max-w-md mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              {state.settings.orgName} · {state.settings.sessionName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 오프라인 단일 HTML 다운로드 (핵심 요구사항) */}
          <button
            onClick={handleStandaloneHtmlExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-md transition-colors shadow-sm whitespace-nowrap"
            title="인터넷이 없는 내부망 PC에서 바로 더블클릭해 쓸 수 있는 단일 HTML 파일을 생성하여 다운로드합니다."
          >
            <Download className="w-3.5 h-3.5" />
            <span>오프라인 단일 HTML 저장</span>
          </button>

          <button
            onClick={onOpenOfflineGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-100 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 rounded-md transition-colors whitespace-nowrap"
            title="내부망 폐쇄망 PC 사용 안내"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            <span>내부망 안내</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-100 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 rounded-md transition-colors whitespace-nowrap"
            title="테스트용 가상 응시자 10명과 점수를 로드합니다."
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>샘플 데이터</span>
          </button>

          <button
            onClick={handleBackupExport}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-100 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 rounded-md transition-colors whitespace-nowrap"
            title="현재 입력 상태를 JSON 백업 파일로 저장합니다."
          >
            <Download className="w-3.5 h-3.5" />
            <span>백업 저장</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-100 hover:text-white bg-blue-900/60 hover:bg-blue-800 border border-blue-700/80 rounded-md transition-colors whitespace-nowrap"
            title="JSON 백업 파일 복원"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>백업 복원</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJson}
          />

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-md transition-colors whitespace-nowrap"
            title="전체 초기화"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
