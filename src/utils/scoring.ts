import { AppSettings, Candidate, CandidateResult, ScoreMatrix } from '../types';

export function calculateCandidateResults(
  candidates: Candidate[],
  scores: ScoreMatrix,
  settings: AppSettings
): CandidateResult[] {
  const { interviewers, criteria, quota, tieBreakerRule, enableDisqualification } = settings;
  const totalItemsPerCandidate = interviewers.length * criteria.length;

  // 1. 각 응시자별 상, 중, 하 개수 및 과락 여부 집계
  const rawResults = candidates.map((cand) => {
    if (cand.isAbsent) {
      return {
        candidate: cand,
        highCount: 0,
        midCount: 0,
        lowCount: 0,
        unratedCount: totalItemsPerCandidate,
        totalGrades: 0,
        isCompleted: false,
        isDisqualified: false,
        rank: null,
        isTie: false,
        isBoundaryTie: false,
        finalDecision: '결시' as const,
      };
    }

    const candScores = scores[cand.id] || {};
    let high = 0;
    let mid = 0;
    let low = 0;
    let unrated = 0;

    // 각 평정 항목별 '하'를 부여한 면접관 수 (동일 항목에 대해 과반수 위원이 '하' 평정 시 과락 규정 검사용)
    const criteriaLowCount: Record<string, number> = {};
    criteria.forEach((c) => (criteriaLowCount[c.id] = 0));

    interviewers.forEach((interviewer) => {
      const interviewerScores = candScores[interviewer.id] || {};
      criteria.forEach((crit) => {
        const grade = interviewerScores[crit.id];
        if (grade === 'high') {
          high++;
        } else if (grade === 'mid') {
          mid++;
        } else if (grade === 'low') {
          low++;
          criteriaLowCount[crit.id] = (criteriaLowCount[crit.id] || 0) + 1;
        } else {
          unrated++;
        }
      });
    });

    const isCompleted = unrated === 0;
    let isDisqualified = false;
    let disqualificationReason = '';

    if (enableDisqualification && isCompleted) {
      // 공무원/공무직 채용 규정: 위원의 과반수가 어느 하나의 동일한 평정요소에 대하여 "하"로 평정하였거나,
      // "하"의 개수가 전체 평정성적의 50% 이상인 경우 불합격
      const majorityThreshold = Math.ceil(interviewers.length / 2);
      const halfTotalThreshold = Math.ceil(totalItemsPerCandidate / 2);

      for (const crit of criteria) {
        if (criteriaLowCount[crit.id] >= majorityThreshold) {
          isDisqualified = true;
          disqualificationReason = `[${crit.name}] 항목 위원 과반수(${criteriaLowCount[crit.id]}명) '하' 평정`;
          break;
        }
      }

      if (!isDisqualified && low >= halfTotalThreshold) {
        isDisqualified = true;
        disqualificationReason = `전체 평정 중 '하' 평정 50% 이상 (${low}개 / ${totalItemsPerCandidate}개)`;
      }
    }

    return {
      candidate: cand,
      highCount: high,
      midCount: mid,
      lowCount: low,
      unratedCount: unrated,
      totalGrades: high + mid + low,
      isCompleted,
      isDisqualified,
      disqualificationReason,
      rank: null as number | null,
      isTie: false,
      isBoundaryTie: false,
      finalDecision: (isDisqualified ? '과락' : '불합격') as CandidateResult['finalDecision'],
    };
  });

  // 2. 응시자 순위 산정 대상 (결시자 제외, 과락자는 맨 뒤 순위 또는 탈락)
  const activeCandidates = rawResults.filter((r) => !r.candidate.isAbsent);

  // 정렬 함수
  activeCandidates.sort((a, b) => {
    // 과락자는 정상 응시자보다 뒤로
    if (a.isDisqualified !== b.isDisqualified) {
      return a.isDisqualified ? 1 : -1;
    }

    // 1순위: '상' 개수 많은 순
    if (b.highCount !== a.highCount) {
      return b.highCount - a.highCount;
    }

    // 2순위: 동점 처리 규칙에 따라
    if (tieBreakerRule === 'high_mid_low') {
      // '중' 많은 순 -> '하' 적은 순
      if (b.midCount !== a.midCount) {
        return b.midCount - a.midCount;
      }
      if (a.lowCount !== b.lowCount) {
        return a.lowCount - b.lowCount; // 하가 적을수록 우위
      }
    } else {
      // '하' 적은 순 -> '중' 많은 순
      if (a.lowCount !== b.lowCount) {
        return a.lowCount - b.lowCount;
      }
      if (b.midCount !== a.midCount) {
        return b.midCount - a.midCount;
      }
    }

    // 완전히 동일한 경우 수험번호 오름차순 (기본 정렬)
    return a.candidate.examNumber.localeCompare(b.candidate.examNumber, undefined, { numeric: true });
  });

  // 3. 순위 부여 (Dense Rank or Standard Rank) 및 동점자 감지
  let currentRank = 1;
  for (let i = 0; i < activeCandidates.length; i++) {
    if (i > 0) {
      const prev = activeCandidates[i - 1];
      const curr = activeCandidates[i];

      const isSameGrade =
        prev.highCount === curr.highCount &&
        prev.midCount === curr.midCount &&
        prev.lowCount === curr.lowCount &&
        prev.isDisqualified === curr.isDisqualified;

      if (isSameGrade) {
        curr.rank = prev.rank;
        curr.isTie = true;
        prev.isTie = true;
      } else {
        curr.rank = i + 1;
      }
    } else {
      activeCandidates[i].rank = 1;
    }
  }

  // 4. 선발 인원(quota) 경계선 동점 확인 및 판정 부여
  // quota 경계: 예컨대 quota=5일 때, 5번째 합격자와 순위가 같지만 6번째 이후로 밀린 사람이 있는지,
  // 혹은 quota 범위 내외에 걸친 동일 점수 동점자가 있는지 확인
  if (quota > 0 && activeCandidates.length > 0) {
    const candidateAtCutoff = activeCandidates[Math.min(quota - 1, activeCandidates.length - 1)];

    // 컷오프 지점에 있는 후보와 정확히 동일한 상/중/하/과락 상태를 가진 후보들 탐색
    const tiedAtCutoff = activeCandidates.filter(
      (c) =>
        !c.isDisqualified &&
        c.highCount === candidateAtCutoff.highCount &&
        c.midCount === candidateAtCutoff.midCount &&
        c.lowCount === candidateAtCutoff.lowCount
    );

    // 동점자 군의 시작 인덱스와 끝 인덱스
    const firstTiedIdx = activeCandidates.indexOf(tiedAtCutoff[0]);
    const lastTiedIdx = activeCandidates.indexOf(tiedAtCutoff[tiedAtCutoff.length - 1]);

    // 경계선에 걸친 경우: 시작은 quota 이하인데 끝은 quota 이상인 경우
    const spansBoundary = firstTiedIdx < quota && lastTiedIdx >= quota && tiedAtCutoff.length > 1;

    if (spansBoundary) {
      tiedAtCutoff.forEach((c) => {
        c.isBoundaryTie = true;
      });
    }
  }

  // 5. 최종 판정 (수동 오버라이드 우선, 그다음 자동 합격/불합격)
  activeCandidates.forEach((item, index) => {
    const { candidate, isDisqualified, isBoundaryTie } = item;

    if (candidate.manualDecision && candidate.manualDecision !== 'auto') {
      if (candidate.manualDecision === 'pass') item.finalDecision = '합격';
      else if (candidate.manualDecision === 'fail') item.finalDecision = '불합격';
      else if (candidate.manualDecision === 'reserve') item.finalDecision = '예비';
      return;
    }

    if (isDisqualified) {
      item.finalDecision = '과락';
      return;
    }

    if (isBoundaryTie) {
      item.finalDecision = '동점(협의)';
      return;
    }

    if (index < quota) {
      item.finalDecision = '합격';
    } else {
      item.finalDecision = '불합격';
    }
  });

  // 결시자 다시 합치기 (원래 목록 순서 또는 정렬 순서)
  const absentCandidates = rawResults.filter((r) => r.candidate.isAbsent);

  return [...activeCandidates, ...absentCandidates];
}
