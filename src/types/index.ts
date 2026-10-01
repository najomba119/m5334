export type EvaluationGrade = 'high' | 'mid' | 'low' | null;

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
}

export interface Interviewer {
  id: string;
  name: string;
}

export interface Candidate {
  id: string;
  examNumber: string; // 수험번호 (예: 1001)
  name: string;       // 성명 (예: 홍길동)
  region?: string;    // 응시지역/배정국 (예: 서울중앙우체국)
  isAbsent: boolean;  // 결시 여부
  manualDecision?: 'auto' | 'pass' | 'fail' | 'reserve'; // 동점자 등 위원회 협의 후 수동 판정
  notes?: string;     // 비고
}

export type ScoreMatrix = Record<string, Record<string, Record<string, EvaluationGrade>>>;
// candidateId -> interviewerId -> criteriaId -> grade

export interface AppSettings {
  orgName: string;          // 기관명 (예: 우정사업본부 서울지방우정청)
  sessionName: string;      // 전형명 (예: 2026년도 제1회 상시계약집배원 채용 면접시험)
  examDate: string;         // 면접일자
  quota: number;            // 선발 예정 인원
  interviewers: Interviewer[];
  criteria: EvaluationCriteria[];
  countingMethod: 'combined' | 'byInterviewer'; // 합산집계 vs 면접관별 세부집계
  tieBreakerRule: 'high_mid_low' | 'high_low';  // 1:상 2:중 3:하 vs 1:상 2:하적은순
  enableDisqualification: boolean; // 과락 제도 적용 여부
  disqualificationRuleText: string;
}

export interface CandidateResult {
  candidate: Candidate;
  highCount: number;
  midCount: number;
  lowCount: number;
  unratedCount: number;
  totalGrades: number;
  isCompleted: boolean;
  isDisqualified: boolean;
  disqualificationReason?: string;
  rank: number | null;
  isTie: boolean;
  isBoundaryTie: boolean; // 선발 배수 경계선에 위치한 동점자 (예: 5명 선발인데 5위와 6위가 동점)
  finalDecision: '합격' | '불합격' | '동점(협의)' | '결시' | '과락' | '예비';
}
