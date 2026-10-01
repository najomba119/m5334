import { AppSettings, Candidate, CandidateResult, ScoreMatrix } from '../types';

/**
 * 엑셀(Excel)에서 한글이 깨지지 않도록 UTF-8 BOM(\uFEFF)을 포함하여 CSV 다운로드
 */
export function exportResultsToCsv(
  results: CandidateResult[],
  settings: AppSettings,
  scores: ScoreMatrix
): void {
  const { sessionName, quota, interviewers, countingMethod } = settings;

  const rows: string[][] = [];

  // 헤더 메타정보
  rows.push([`[${sessionName}] 면접시험 결과 집계표`]);
  rows.push([`선발예정인원: ${quota}명`, `생성일시: ${new Date().toLocaleString('ko-KR')}`]);
  rows.push([]);

  // 컬럼 헤더 구성
  const headers = ['순위', '수험번호', '성명', '응시지역', '상(개수)', '중(개수)', '하(개수)', '총평정수', '최종판정', '비고'];

  if (countingMethod === 'byInterviewer') {
    // 면접관별 상/중/하 세부 열 추가
    interviewers.forEach((inv) => {
      headers.push(`${inv.name} (상)`, `${inv.name} (중)`, `${inv.name} (하)`);
    });
  }

  rows.push(headers);

  // 데이터 행
  results.forEach((res) => {
    const cand = res.candidate;
    const rankStr = res.rank !== null ? `${res.rank}` : '-';
    let decisionStr: string = res.finalDecision;
    if (res.isBoundaryTie && cand.manualDecision === 'auto') {
      decisionStr = '동점(협의필요)';
    }

    const remarks = [
      cand.notes || '',
      res.disqualificationReason ? `[과락사유: ${res.disqualificationReason}]` : '',
    ].filter(Boolean).join(' ');

    const row = [
      rankStr,
      cand.examNumber,
      cand.name,
      cand.region || '-',
      cand.isAbsent ? '-' : `${res.highCount}`,
      cand.isAbsent ? '-' : `${res.midCount}`,
      cand.isAbsent ? '-' : `${res.lowCount}`,
      cand.isAbsent ? '-' : `${res.totalGrades}`,
      decisionStr,
      remarks,
    ];

    if (countingMethod === 'byInterviewer') {
      interviewers.forEach((inv) => {
        if (cand.isAbsent) {
          row.push('-', '-', '-');
        } else {
          const invScores = (scores[cand.id] || {})[inv.id] || {};
          let h = 0, m = 0, l = 0;
          Object.values(invScores).forEach((grade) => {
            if (grade === 'high') h++;
            else if (grade === 'mid') m++;
            else if (grade === 'low') l++;
          });
          row.push(`${h}`, `${m}`, `${l}`);
        }
      });
    }

    rows.push(row);
  });

  // CSV 문자열로 변환 (따옴표 및 쉼표 이스케이프)
  const csvContent = rows
    .map((r) =>
      r
        .map((cell) => {
          const escaped = `${cell ?? ''}`.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
    .join('\r\n');

  // UTF-8 BOM 추가
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `집배원면접집계결과_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * CSV 또는 엑셀에서 복사한 텍스트 파싱
 */
export function parseCandidatesText(text: string): Partial<Candidate>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: Partial<Candidate>[] = [];

  lines.forEach((line) => {
    // 쉼표 또는 탭(엑셀 복사-붙여넣기)으로 분리
    const delimiter = line.includes('\t') ? '\t' : ',';
    const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

    // 헤더 행 무시
    if (parts[0] === '수험번호' || parts[0] === '번호' || parts[1] === '성명' || parts[1] === '이름') {
      return;
    }

    if (parts.length >= 2) {
      const examNumber = parts[0];
      const name = parts[1];
      const region = parts[2] || '';
      const notes = parts[3] || '';

      if (examNumber && name) {
        results.push({
          examNumber,
          name,
          region,
          notes,
          isAbsent: false,
        });
      }
    } else if (parts.length === 1 && parts[0].includes(' ')) {
      // "1001 홍길동" 형식 지원
      const subParts = parts[0].split(/\s+/);
      if (subParts.length >= 2) {
        results.push({
          examNumber: subParts[0],
          name: subParts[1],
          region: subParts[2] || '',
          notes: '',
          isAbsent: false,
        });
      }
    }
  });

  return results;
}
