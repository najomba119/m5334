import { AppSettings, Candidate, ScoreMatrix } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  orgName: '우정사업본부 서울지방우정청',
  sessionName: '2026년도 제1회 상시계약집배원 채용 면접시험',
  examDate: new Date().toISOString().split('T')[0],
  quota: 4, // 10명 중 4명 선발
  interviewers: [
    { id: 'inv-1', name: '위원장 (우체국 물류과장)' },
    { id: 'inv-2', name: '면접위원 A (외부 인사위원)' },
    { id: 'inv-3', name: '면접위원 B (집배실 총괄팀장)' },
  ],
  criteria: [
    {
      id: 'crit-1',
      name: '1. 직무이해 및 배달업무 수행능력',
      description: '우편배달 프로세스, 주소지 탐색 이해도, 등기·소포 적기 배송 의지',
    },
    {
      id: 'crit-2',
      name: '2. 이륜차 안전운행 및 위기대처',
      description: '도로교통법 준수 의식, 방어운전 자세, 기상악화 시 안전수칙 준수',
    },
    {
      id: 'crit-3',
      name: '3. 대국민 친절봉사 및 민원응대',
      description: '고객 대면 친절도, 불만·민원 발생 시 유연한 대처 및 소통 능력',
    },
    {
      id: 'crit-4',
      name: '4. 성실성·책임감 및 공직가치관',
      description: '우편물 완배 의지, 성실한 근태 태도, 우정사업 종사자로서의 윤리의식',
    },
    {
      id: 'crit-5',
      name: '5. 직무 적응력 및 팀워크·협업',
      description: '야외 기후 적응 체력, 동료 집배원과의 소통·협업, 조직 융화도',
    },
  ],
  countingMethod: 'combined',
  tieBreakerRule: 'high_mid_low',
  enableDisqualification: true,
  disqualificationRuleText: "면접위원 과반수가 동일 평정요소에 '하'를 주거나, 전체 평정 중 '하'가 50% 이상인 경우 불합격",
};

export const SAMPLE_CANDIDATES: Candidate[] = [
  { id: 'cand-1', examNumber: '1001', name: '김우정', region: '강남우체국', isAbsent: false, notes: '우수 집배경력 보유' },
  { id: 'cand-2', examNumber: '1002', name: '박배달', region: '동대문우체국', isAbsent: false, notes: '이륜차 무사고 5년' },
  { id: 'cand-3', examNumber: '1003', name: '이신속', region: '마포우체국', isAbsent: false, notes: '' },
  { id: 'cand-4', examNumber: '1004', name: '최안전', region: '영등포우체국', isAbsent: false, notes: '동점 경계 후보 (4위)' },
  { id: 'cand-5', examNumber: '1005', name: '정성실', region: '송파우체국', isAbsent: false, notes: '동점 경계 후보 (5위 동점)' },
  { id: 'cand-6', examNumber: '1006', name: '한우편', region: '강북우체국', isAbsent: false, notes: '' },
  { id: 'cand-7', examNumber: '1007', name: '윤물류', region: '은평우체국', isAbsent: false, notes: '안전의식 우수' },
  { id: 'cand-8', examNumber: '1008', name: '오배송', region: '구로우체국', isAbsent: false, notes: '과락 판정 예시' },
  { id: 'cand-9', examNumber: '1009', name: '장성실', region: '노원우체국', isAbsent: true, notes: '개인사정 불참 (결시)' },
  { id: 'cand-10', examNumber: '1010', name: '강철수', region: '양천우체국', isAbsent: false, notes: '' },
];

export const SAMPLE_SCORES: ScoreMatrix = {
  // 1001: 상 13, 중 2, 하 0 (1위)
  'cand-1': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'high', 'crit-4': 'high', 'crit-5': 'high' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'high' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'high', 'crit-4': 'high', 'crit-5': 'mid' },
  },
  // 1002: 상 11, 중 4, 하 0 (2위)
  'cand-2': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'high', 'crit-4': 'mid', 'crit-5': 'high' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'high' },
  },
  // 1003: 상 9, 중 6, 하 0 (3위)
  'cand-3': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'high', 'crit-4': 'mid', 'crit-5': 'high' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
  },
  // 1004: 상 8, 중 6, 하 1 (4위 - 컷오프 경계선 동점)
  'cand-4': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'high', 'crit-4': 'mid', 'crit-5': 'mid' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'low' },
  },
  // 1005: 상 8, 중 6, 하 1 (5위 - 컷오프 4위와 완전 동점! 경계선 동점 발생)
  'cand-5': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'high', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'high', 'crit-3': 'low', 'crit-4': 'mid', 'crit-5': 'mid' },
  },
  // 1006: 상 6, 중 8, 하 1
  'cand-6': {
    'inv-1': { 'crit-1': 'mid', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'mid', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'low' },
  },
  // 1007: 상 5, 중 9, 하 1
  'cand-7': {
    'inv-1': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'high' },
    'inv-2': { 'crit-1': 'mid', 'crit-2': 'mid', 'crit-3': 'high', 'crit-4': 'mid', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'mid', 'crit-2': 'high', 'crit-3': 'mid', 'crit-4': 'high', 'crit-5': 'low' },
  },
  // 1008: 과락 대상 (안전운행 항목에서 위원 3명 중 2명이 '하' 평정)
  'cand-8': {
    'inv-1': { 'crit-1': 'mid', 'crit-2': 'low', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'mid' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'low', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'mid', 'crit-2': 'mid', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'low' },
  },
  // 1010: 상 3, 중 10, 하 2
  'cand-10': {
    'inv-1': { 'crit-1': 'mid', 'crit-2': 'mid', 'crit-3': 'high', 'crit-4': 'mid', 'crit-5': 'low' },
    'inv-2': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'mid', 'crit-4': 'mid', 'crit-5': 'mid' },
    'inv-3': { 'crit-1': 'high', 'crit-2': 'mid', 'crit-3': 'mid', 'crit-4': 'low', 'crit-5': 'mid' },
  },
};

const STORAGE_KEY = 'postman_interview_app_state_v1';

export interface AppState {
  settings: AppSettings;
  candidates: Candidate[];
  scores: ScoreMatrix;
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.settings && parsed.candidates && parsed.scores) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  // 기본 샘플 데이터 반환
  return {
    settings: DEFAULT_SETTINGS,
    candidates: SAMPLE_CANDIDATES,
    scores: SAMPLE_SCORES,
  };
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportBackupJson(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `집배원면접집계_백업_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
