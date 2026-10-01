import React from 'react';
import { Plus, Trash2, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AppSettings, EvaluationCriteria, Interviewer } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  onChange: (newSettings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onChange }) => {
  const updateField = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  // 면접위원 추가
  const handleAddInterviewer = () => {
    if (settings.interviewers.length >= 10) {
      alert('면접위원은 최대 10명까지 등록 가능합니다.');
      return;
    }
    const nextChar = String.fromCharCode(65 + settings.interviewers.length);
    const newInv: Interviewer = {
      id: `inv-${Date.now()}`,
      name: `면접위원 ${nextChar}`,
    };
    updateField('interviewers', [...settings.interviewers, newInv]);
  };

  const handleUpdateInterviewerName = (id: string, name: string) => {
    updateField(
      'interviewers',
      settings.interviewers.map((i) => (i.id === id ? { ...i, name } : i))
    );
  };

  const handleRemoveInterviewer = (id: string) => {
    if (settings.interviewers.length <= 1) {
      alert('최소 1명 이상의 면접위원이 필요합니다.');
      return;
    }
    if (confirm('해당 면접위원을 삭제하시겠습니까? 관련된 입력 점수도 지워집니다.')) {
      updateField(
        'interviewers',
        settings.interviewers.filter((i) => i.id !== id)
      );
    }
  };

  // 평가 항목 추가
  const handleAddCriteria = () => {
    const newCrit: EvaluationCriteria = {
      id: `crit-${Date.now()}`,
      name: `${settings.criteria.length + 1}. 신규 평가항목`,
      description: '평가 세부 기준 및 관찰 착안점',
    };
    updateField('criteria', [...settings.criteria, newCrit]);
  };

  const handleUpdateCriteria = (id: string, updates: Partial<EvaluationCriteria>) => {
    updateField(
      'criteria',
      settings.criteria.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleRemoveCriteria = (id: string) => {
    if (settings.criteria.length <= 1) {
      alert('최소 1개 이상의 평가항목이 필요합니다.');
      return;
    }
    if (confirm('해당 평가항목을 삭제하시겠습니까?')) {
      updateField(
        'criteria',
        settings.criteria.filter((c) => c.id !== id)
      );
    }
  };

  const handleResetToDefaultCriteria = () => {
    if (confirm('평가 항목을 집배원 표준 5대 직무 항목으로 초기화하시겠습니까?')) {
      updateField('criteria', DEFAULT_SETTINGS.criteria);
    }
  };

  return (
    <div className="space-y-6">
      {/* 가이드 배너 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div className="text-sm text-red-950 leading-relaxed">
          <p className="font-semibold">집배원 면접시험 설정 안내 (우체국 표준)</p>
          <p className="mt-0.5 text-red-900 text-xs sm:text-sm">
            면접관 수와 평가 항목을 지정하면 [3. 평정 입력] 시트가 해당 규격에 맞게 자동 구성됩니다.
            집배원 채용 규정상의 <strong>‘상’ 개수 우선 합격 판정</strong> 및 <strong>동점자 처리 규칙</strong>을
            자유롭게 변경할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 기본 정보 설정 */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>기본 채용 정보 및 선발 인원</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              주관 기관명
            </label>
            <input
              type="text"
              value={settings.orgName}
              onChange={(e) => updateField('orgName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-red-500"
              placeholder="예: 서울지방우정청 / 성남우체국"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              채용 시험명 (공고명)
            </label>
            <input
              type="text"
              value={settings.sessionName}
              onChange={(e) => updateField('sessionName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-red-500"
              placeholder="예: 2026년도 제1회 상시계약집배원 채용 면접"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              선발 예정 인원 (명)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="500"
                value={settings.quota}
                onChange={(e) => updateField('quota', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-semibold text-red-700 border border-slate-300 rounded-md focus:outline-none focus:border-red-500"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">명 선발</span>
            </div>
          </div>
        </div>

        {/* 집계 방식 & 동점 규칙 & 과락 */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ‘상’ 개수 집계 방식
            </label>
            <select
              value={settings.countingMethod}
              onChange={(e) => updateField('countingMethod', e.target.value as 'combined' | 'byInterviewer')}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
            >
              <option value="combined">모든 면접관의 '상' 개수 합산 (기본 표준)</option>
              <option value="byInterviewer">면접관별 세부 집계 열 포함</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              동점자 순위 결정 규칙
            </label>
            <select
              value={settings.tieBreakerRule}
              onChange={(e) => updateField('tieBreakerRule', e.target.value as 'high_mid_low' | 'high_low')}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
            >
              <option value="high_mid_low">1순위: 상 많은 순 ➔ 2순위: 중 많은 순 ➔ 3순위: 하 적은 순</option>
              <option value="high_low">1순위: 상 많은 순 ➔ 2순위: 하 적은 순 ➔ 3순위: 중 많은 순</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              과락(결격 탈락) 제도
            </label>
            <div className="flex items-center gap-2 mt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDisqualification}
                  onChange={(e) => updateField('enableDisqualification', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                <span className="ml-2 text-xs font-medium text-slate-700">
                  {settings.enableDisqualification ? '과락 규정 적용 중' : '과락 미적용 (단순집계)'}
                </span>
              </label>
            </div>
            {settings.enableDisqualification && (
              <p className="text-[11px] text-slate-500 mt-1">
                위원 과반수가 동일 항목에 '하' 평정 시 또는 전체 '하' 50% 이상 시 탈락
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 면접위원 및 평가 항목 관리 2열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 면접위원 구성 (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">면접위원 구성</h4>
                <p className="text-xs text-slate-500">현재 {settings.interviewers.length}명 등록됨 (1~10명)</p>
              </div>
              <button
                onClick={handleAddInterviewer}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>위원 추가</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {settings.interviewers.map((inv, idx) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <span className="w-6 text-center text-xs font-bold text-slate-500 tabular-nums">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={inv.name}
                    onChange={(e) => handleUpdateInterviewerName(inv.id, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-none focus:border-red-500 font-medium"
                    placeholder="면접위원 직책/명칭"
                  />
                  {settings.interviewers.length > 1 && (
                    <button
                      onClick={() => handleRemoveInterviewer(inv.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="면접위원 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            총 평정 셀 개수: {settings.interviewers.length}명 × {settings.criteria.length}개 항목 = 응시자당{' '}
            <strong className="text-red-700 font-mono">
              {settings.interviewers.length * settings.criteria.length}개 평정
            </strong>
          </div>
        </div>

        {/* 평정 항목 구성 (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">평가 항목 및 착안점</h4>
              <p className="text-xs text-slate-500">집배원 채용 실무에 맞춘 평가 척도</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefaultCriteria}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                title="집배원 표준 5대 평가항목으로 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>표준 항목 복원</span>
              </button>
              <button
                onClick={handleAddCriteria}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>항목 추가</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {settings.criteria.map((crit, idx) => (
              <div
                key={crit.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={crit.name}
                      onChange={(e) => handleUpdateCriteria(crit.id, { name: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 border border-slate-300 rounded bg-white focus:outline-none focus:border-red-500"
                      placeholder="항목 명칭"
                    />
                  </div>
                  {settings.criteria.length > 1 && (
                    <button
                      onClick={() => handleRemoveCriteria(crit.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded shrink-0"
                      title="항목 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={crit.description}
                  onChange={(e) => handleUpdateCriteria(crit.id, { description: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded bg-white focus:outline-none focus:border-red-500"
                  placeholder="면접관 평가 착안점 및 질문 기준"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
