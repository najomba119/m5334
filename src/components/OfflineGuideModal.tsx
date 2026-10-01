import React from 'react';
import { X, Download, ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import { AppState } from '../utils/storage';
import { downloadStandaloneHtmlFile } from '../utils/exportHtml';

interface OfflineGuideModalProps {
  state: AppState;
  onClose: () => void;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({ state, onClose }) => {
  const handleDownload = () => {
    downloadStandaloneHtmlFile(state);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-5 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">
              내부 폐쇄망(인터넷 차단 PC) 사용 안내
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="bg-red-50 border border-red-200 rounded-md p-3.5 space-y-1 text-red-950">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>외부 인터넷 연결 없이 단독 실행 가능한 HTML 파일 1개 제공</span>
            </p>
            <p className="text-xs text-red-900">
              우체국 및 공공기관의 내부 업무망 PC는 외부망이 차단되어 있습니다.
              본 앱의 <strong>[오프라인 단일 HTML 저장]</strong> 버튼을 누르면, 외부 CDN/라이브러리/폰트를
              일체 사용하지 않는 순수 독립형 HTML 파일이 즉시 생성됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-slate-600" />
              <span>내부망 PC로 옮겨서 사용하는 3단계 방법</span>
            </h4>

            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>
                <strong>단일 HTML 파일 다운로드:</strong> 아래의 [오프라인 단일 HTML 파일 받기] 버튼을 클릭하여
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-700 font-mono">
                  집배원_채용면접결과정리기_오프라인단일파일.html
                </code>
                파일을 다운로드합니다.
              </li>
              <li>
                <strong>USB 또는 내부망 망연계 전송:</strong> 다운로드한 HTML 파일 1개만 업무용 보안 USB나
                망연계 시스템을 통해 내부망 PC로 이동시킵니다.
              </li>
              <li>
                <strong>더블클릭 실행:</strong> 내부망 PC에서 해당 HTML 파일을 더블클릭하면 엣지(Edge)나
                크롬(Chrome) 브라우저에서 인터넷 없이 즉시 열리며 모든 기능(순위 계산, 엑셀 저장, 인쇄)이 작동합니다.
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-1 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">🔒 개인정보 및 데이터 보안 주의사항</p>
            <p>
              - 입력된 응시자 정보와 평정 점수는 해당 PC의 브라우저(LocalStorage)에만 안전하게 저장되며,
              외부 서버로 일체 전송되지 않습니다.
            </p>
            <p>
              - 여러 사람이 함께 쓰는 공용 PC라면, 작업 완료 후 반드시 <strong>[백업 저장(JSON)]</strong>을
              받아두고 <strong>[초기화]</strong> 버튼을 눌러 브라우저 내 개인정보를 삭제해주세요.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
          >
            닫기
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>오프라인 단일 HTML 파일 받기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
