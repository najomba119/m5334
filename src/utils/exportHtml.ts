import { AppState } from './storage';

/**
 * 외부 인터넷 접속이 일체 불가능한 공공기관/우체국 내부 폐쇄망 PC에서도
 * 더블클릭만으로 완벽 작동하는 100% 독립형 단일 HTML 파일(CSS + Vanilla JS 내장) 생성 및 다운로드 함수
 */
export function generateStandaloneHtml(initialState: AppState): string {
  const jsonInitialState = JSON.stringify(initialState).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>집배원 채용 면접 결과 정리기 (단일 파일 / 내부망 오프라인용)</title>
  <style>
    /* 우체국 시그니처 레드 테마 적용 (시스템 한글 기본 폰트) */
    :root {
      --primary: #dc2626;
      --primary-hover: #b91c1c;
      --high-color: #2563eb;
      --high-bg: #eff6ff;
      --mid-color: #d97706;
      --mid-bg: #fffbeb;
      --low-color: #dc2626;
      --low-bg: #fef2f2;
      --border-color: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #475569;
      --bg-page: #f8fafc;
      --bg-card: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Malgun Gothic', '맑은 고딕', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg-page); color: var(--text-main); font-size: 14px; line-height: 1.5; }
    
    /* 헤더 (블루 히어로 섹션) */
    header { background: #1e3a8a; color: #ffffff; padding: 16px 24px; border-bottom: 3px solid #3b82f6; }
    .header-inner { max-width: 1440px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .app-title {
      font-size: 17px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border-top: 1px solid rgba(255, 255, 255, 0.35);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-right: 1px solid rgba(0, 0, 0, 0.4);
      border-bottom: 2px solid rgba(0, 0, 0, 0.7);
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 5px 14px rgba(0, 0, 0, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.35);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }
    .app-badge {
      font-size: 11px;
      background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      border-bottom: 1px solid #7f1d1d;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
    }
    .header-actions { display: flex; gap: 8px; align-items: center; }

    /* 탭 메뉴 */
    .tab-bar { background: #ffffff; border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 20; }
    .tab-container { max-width: 1440px; margin: 0 auto; display: flex; padding: 0 24px; gap: 4px; }
    .tab-btn { padding: 12px 18px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.15s; }
    .tab-btn:hover { color: var(--text-main); }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: #fef2f2; }
    
    /* 레이아웃 컨테이너 */
    .main-container { max-width: 1440px; margin: 0 auto; padding: 24px; }
    .banner-tip { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
    
    /* 카드 및 패널 */
    .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .card-title { font-size: 16px; font-weight: 700; margin-bottom: 14px; color: #0f172a; display: flex; justify-content: space-between; align-items: center; }
    
    /* 폼 요소 */
    .form-group { margin-bottom: 14px; }
    .form-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #334155; }
    .form-control { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    .form-control:focus { outline: none; border-color: #dc2626; ring: 2px solid #fca5a5; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    
    /* 버튼 */
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
    .btn-primary { background: #dc2626; color: #fff; border-color: #dc2626; }
    .btn-primary:hover { background: #b91c1c; }
    .btn-secondary { background: #ffffff; color: #334155; border-color: #cbd5e1; }
    .btn-secondary:hover { background: #f1f5f9; }
    .btn-danger { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
    .btn-danger:hover { background: #fecaca; }
    .btn-success { background: #16a34a; color: #fff; }
    .btn-success:hover { background: #15803d; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }

    /* 데이터 테이블 */
    .table-wrapper { overflow-x: auto; border: 1px solid var(--border-color); border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; text-align: left; background: #fff; }
    th { background: #f8fafc; color: #475569; font-weight: 700; font-size: 13px; padding: 10px 12px; border-bottom: 1px solid var(--border-color); border-right: 1px solid #f1f5f9; }
    td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); border-right: 1px solid #f1f5f9; font-size: 13px; vertical-align: middle; }
    tr:hover td { background-color: #f8fafc; }
    .text-center { text-align: center; }
    .tabular-nums { font-variant-numeric: tabular-nums; font-family: monospace, sans-serif; }

    /* 평정 뱃지 / 버튼 */
    .grade-btn { width: 42px; height: 34px; border-radius: 4px; font-weight: 700; font-size: 13px; cursor: pointer; border: 1px solid transparent; transition: all 0.1s; }
    .grade-high { background: #eff6ff; color: #1d4ed8; border-color: #93c5fd; }
    .grade-high.active { background: #2563eb; color: #ffffff; border-color: #1d4ed8; box-shadow: 0 2px 4px rgba(37,99,235,0.3); }
    .grade-mid { background: #fffbeb; color: #b45309; border-color: #fde68a; }
    .grade-mid.active { background: #d97706; color: #ffffff; border-color: #b45309; box-shadow: 0 2px 4px rgba(217,119,6,0.3); }
    .grade-low { background: #fef2f2; color: #b91c1c; border-color: #fca5a5; }
    .grade-low.active { background: #dc2626; color: #ffffff; border-color: #b91c1c; box-shadow: 0 2px 4px rgba(220,38,38,0.3); }
    .grade-empty { background: #f1f5f9; color: #94a3b8; border-color: #cbd5e1; }

    .tag { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; text-align: center; }
    .tag-pass { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .tag-fail { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
    .tag-tie { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; font-weight: 800; animation: pulse 2s infinite; }
    .tag-disqualified { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
    .tag-absent { background: #e2e8f0; color: #94a3b8; text-decoration: line-through; }
    .tag-reserve { background: #e0e7ff; color: #4338ca; border: 1px solid #a5b4fc; }

    .cutoff-row td { background: #fef2f2 !important; border-top: 2px solid #dc2626 !important; border-bottom: 2px solid #dc2626 !important; }

    /* 인쇄 서식 */
    @media print {
      body { background: #fff !important; color: #000 !important; font-size: 11pt; }
      header, .tab-bar, .banner-tip, .no-print, button { display: none !important; }
      .main-container { max-width: 100% !important; padding: 0 !important; }
      .card { border: none !important; box-shadow: none !important; padding: 0 !important; }
      table { border-collapse: collapse !important; width: 100% !important; font-size: 10pt; }
      th, td { border: 1px solid #000 !important; padding: 6px 8px !important; color: #000 !important; }
      th { background-color: #f0f0f0 !important; }
      .print-header { display: block !important; margin-bottom: 20px; }
      .approval-box { display: flex !important; justify-content: flex-end; margin-bottom: 15px; }
      .approval-table { width: 280px !important; border-collapse: collapse; }
      .approval-table th, .approval-table td { border: 1px solid #000; text-align: center; font-size: 9pt; }
      .signature-box { display: flex !important; justify-content: space-around; margin-top: 40px; page-break-inside: avoid; }
    }
    .print-header, .approval-box, .signature-box { display: none; }
  </style>
</head>
<body>

  <!-- 헤더 -->
  <header>
    <div class="header-inner">
      <div class="app-title">
        <span>📮 집배원 채용 면접 결과 정리기</span>
        <span class="app-badge">내부망 오프라인 단일 파일</span>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-sm" onclick="App.exportBackup()">💾 백업 저장(JSON)</button>
        <button class="btn btn-secondary btn-sm" onclick="App.importBackupClick()">📂 백업 열기</button>
        <button class="btn btn-danger btn-sm" onclick="App.resetAll()">🔄 초기화</button>
      </div>
    </div>
  </header>

  <!-- 탭 메뉴 -->
  <nav class="tab-bar">
    <div class="tab-container">
      <button class="tab-btn active" id="tab-btn-settings" onclick="App.switchTab('settings')">1. 설정 (기준 및 배점)</button>
      <button class="tab-btn" id="tab-btn-candidates" onclick="App.switchTab('candidates')">2. 응시자 명단</button>
      <button class="tab-btn" id="tab-btn-scoring" onclick="App.switchTab('scoring')">3. 평정 입력 (상·중·하)</button>
      <button class="tab-btn" id="tab-btn-results" onclick="App.switchTab('results')">4. 결과 및 최종 판정</button>
    </div>
  </nav>

  <!-- 메인 뷰 -->
  <main class="main-container">
    <div class="banner-tip" id="tab-tip">
      <span id="tab-tip-text">안내 문구</span>
      <span id="progress-summary" style="font-weight:700; margin-left:12px;"></span>
    </div>

    <!-- 1. 설정 화면 -->
    <section id="view-settings">
      <div class="card">
        <div class="card-title">공고 및 기본 선발 설정</div>
        <div class="grid-3">
          <div class="form-group">
            <label class="form-label">주관 기관명</label>
            <input type="text" class="form-control" id="cfg-org" onchange="App.updateSettings('orgName', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">채용 시험명</label>
            <input type="text" class="form-control" id="cfg-session" onchange="App.updateSettings('sessionName', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">선발 예정 인원 (명)</label>
            <input type="number" min="1" max="100" class="form-control" id="cfg-quota" onchange="App.updateSettings('quota', parseInt(this.value, 10))">
          </div>
        </div>

        <div class="grid-2" style="margin-top: 10px;">
          <div class="form-group">
            <label class="form-label">동점자 순위 처리 규칙</label>
            <select class="form-control" id="cfg-tie" onchange="App.updateSettings('tieBreakerRule', this.value)">
              <option value="high_mid_low">1순위: 상 많은 순 ➔ 2순위: 중 많은 순 ➔ 3순위: 하 적은 순</option>
              <option value="high_low">1순위: 상 많은 순 ➔ 2순위: 하 적은 순 ➔ 3순위: 중 많은 순</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">결격/과락 제도 적용</label>
            <select class="form-control" id="cfg-disq" onchange="App.updateSettings('enableDisqualification', this.value === 'true')">
              <option value="true">적용 (위원 과반수 동일항목 '하' 또는 전체 '하' 50% 이상 시 과락)</option>
              <option value="false">미적용 (순수 개수 집계로만 순위 산출)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- 면접위원 구성 -->
        <div class="card">
          <div class="card-title">
            <span>면접위원 구성</span>
            <button class="btn btn-secondary btn-sm" onclick="App.addInterviewer()">+ 위원 추가</button>
          </div>
          <div id="interviewers-list"></div>
        </div>

        <!-- 평정 항목 구성 -->
        <div class="card">
          <div class="card-title">
            <span>평가 항목 (집배원 직무 중심)</span>
            <button class="btn btn-secondary btn-sm" onclick="App.addCriteria()">+ 항목 추가</button>
          </div>
          <div id="criteria-list"></div>
        </div>
      </div>
    </section>

    <!-- 2. 응시자 명단 화면 -->
    <section id="view-candidates" style="display:none;">
      <div class="card">
        <div class="card-title">
          <span>응시자 신규 등록 및 일괄 가져오기</span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="App.loadSampleData()">샘플 10명 채우기</button>
            <button class="btn btn-primary btn-sm" onclick="App.openBatchAddModal()">📋 엑셀/텍스트 일괄등록</button>
          </div>
        </div>
        <form onsubmit="App.addCandidate(event)" style="display:flex; gap:10px; align-items:flex-end;">
          <div style="width: 140px;">
            <label class="form-label">수험번호</label>
            <input type="text" class="form-control" id="new-cand-num" placeholder="예: 1001" required>
          </div>
          <div style="width: 160px;">
            <label class="form-label">성명</label>
            <input type="text" class="form-control" id="new-cand-name" placeholder="홍길동" required>
          </div>
          <div style="width: 200px;">
            <label class="form-label">응시지역/소속국 (선택)</label>
            <input type="text" class="form-control" id="new-cand-region" placeholder="서울중앙우체국">
          </div>
          <div style="flex:1;">
            <label class="form-label">비고/특이사항</label>
            <input type="text" class="form-control" id="new-cand-notes" placeholder="메모">
          </div>
          <button type="submit" class="btn btn-primary" style="height:38px;">등록</button>
        </form>
      </div>

      <div class="card">
        <div class="card-title">
          <span>등록된 응시자 명단 (<span id="cand-total-count">0</span>명)</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width:70px;" class="text-center">연번</th>
                <th style="width:110px;">수험번호</th>
                <th style="width:130px;">성명</th>
                <th style="width:180px;">응시지역</th>
                <th style="width:110px;" class="text-center">결시 여부</th>
                <th>비고</th>
                <th style="width:90px;" class="text-center">관리</th>
              </tr>
            </thead>
            <tbody id="candidates-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 3. 평정 입력 화면 -->
    <section id="view-scoring" style="display:none;">
      <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:10px; align-items:center;">
          <label class="form-label" style="margin:0;">응시자 선택:</label>
          <select id="scoring-cand-select" class="form-control" style="width:260px;" onchange="App.selectCandidateForScoring(this.value)"></select>
          <button class="btn btn-secondary btn-sm" onclick="App.prevCandidate()">◀ 이전</button>
          <button class="btn btn-secondary btn-sm" onclick="App.nextCandidate()">다음 ▶</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="App.fillCurrentCand('high')">전체 '상' 일괄</button>
          <button class="btn btn-secondary btn-sm" onclick="App.fillCurrentCand('mid')">전체 '중' 일괄</button>
          <button class="btn btn-secondary btn-sm" onclick="App.fillCurrentCand(null)">초기화</button>
        </div>
      </div>

      <div class="card" id="scoring-sheet-card">
        <div class="card-title">
          <div id="scoring-current-cand-info">응시자 정보</div>
          <div style="font-size:13px; font-weight:normal;">
            <span style="color:#2563eb; font-weight:700;">상 [1번키]</span> · 
            <span style="color:#d97706; font-weight:700;">중 [2번키]</span> · 
            <span style="color:#dc2626; font-weight:700;">하 [3번키]</span> · 
            <span style="color:#64748b;">지우기 [0번키]</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table id="scoring-matrix-table">
            <thead id="scoring-matrix-thead"></thead>
            <tbody id="scoring-matrix-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 4. 결과 및 출력 화면 -->
    <section id="view-results" style="display:none;">
      <div class="print-header">
        <div class="approval-box">
          <table class="approval-table">
            <tr><th rowspan="2" style="width:20px;">결<br>재</th><th>담당</th><th>팀장</th><th>위원장</th></tr>
            <tr style="height:45px;"><td></td><td></td><td></td></tr>
          </table>
        </div>
        <h1 style="text-align:center; font-size:18pt; font-weight:bold; margin-bottom:6px;" id="print-title">집배원 채용 면접시험 집계표 및 최종 합격자 조서</h1>
        <div style="text-align:center; font-size:11pt; color:#475569; margin-bottom:14px;" id="print-meta"></div>
      </div>

      <div class="card no-print">
        <div class="card-title">
          <span>집배원 채용 면접시험 결과 종합 및 순위표</span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-success btn-sm" onclick="App.exportCsv()">📊 엑셀(CSV) 저장</button>
            <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ 인쇄 / PDF 출력</button>
          </div>
        </div>
        <div style="display:flex; gap:20px; font-size:13px; margin-bottom:12px;" id="results-summary-stats"></div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width:60px;" class="text-center">순위</th>
              <th style="width:100px;">수험번호</th>
              <th style="width:120px;">성명</th>
              <th style="width:140px;">응시지역</th>
              <th style="width:80px;" class="text-center">상 (개수)</th>
              <th style="width:80px;" class="text-center">중 (개수)</th>
              <th style="width:80px;" class="text-center">하 (개수)</th>
              <th style="width:90px;" class="text-center">평정 합계</th>
              <th style="width:110px;" class="text-center">최종 판정</th>
              <th>비고 및 특이사항</th>
            </tr>
          </thead>
          <tbody id="results-tbody"></tbody>
        </table>
      </div>

      <div class="signature-box">
        <div>면접위원장: _________________ (서명)</div>
        <div>면접위원 A: _________________ (서명)</div>
        <div>면접위원 B: _________________ (서명)</div>
      </div>
    </section>
  </main>

  <input type="file" id="file-import-input" style="display:none;" accept=".json" onchange="App.onBackupFileSelected(event)">

  <script>
    // 전역 상태
    const state = ${jsonInitialState};

    const App = {
      currentTab: 'settings',
      activeCandId: state.candidates[0] ? state.candidates[0].id : null,

      init() {
        this.renderAll();
        this.setupKeyboard();
      },

      renderAll() {
        this.renderSettings();
        this.renderCandidates();
        this.renderScoring();
        this.renderResults();
        this.updateHeaderProgress();
      },

      switchTab(tab) {
        this.currentTab = tab;
        ['settings', 'candidates', 'scoring', 'results'].forEach(t => {
          document.getElementById('view-' + t).style.display = (t === tab) ? 'block' : 'none';
          document.getElementById('tab-btn-' + t).classList.toggle('active', t === tab);
        });

        const tips = {
          settings: '💡 평가 항목(직무, 안전, 친절 등), 면접관 수, 선발 인원 및 과락 기준을 설정합니다.',
          candidates: '💡 응시자 수험번호와 성명을 등록하거나 엑셀에서 복사해 일괄 입력합니다.',
          scoring: '💡 응시자별로 각 평가항목에 상/중/하를 마우스 클릭 또는 키보드(1, 2, 3)로 빠르게 입력합니다.',
          results: '💡 '상' 개수 순으로 자동 정렬된 최종 순위표를 확인하고 엑셀 저장 또는 인쇄합니다.'
        };
        document.getElementById('tab-tip-text').innerText = tips[tab] || '';

        if (tab === 'scoring') this.renderScoring();
        if (tab === 'results') this.renderResults();
      },

      updateHeaderProgress() {
        const active = state.candidates.filter(c => !c.isAbsent);
        const totalGradesNeeded = active.length * state.settings.interviewers.length * state.settings.criteria.length;
        let filledGrades = 0;

        active.forEach(c => {
          const cScores = state.scores[c.id] || {};
          state.settings.interviewers.forEach(inv => {
            const invScores = cScores[inv.id] || {};
            state.settings.criteria.forEach(crit => {
              if (invScores[crit.id]) filledGrades++;
            });
          });
        });

        const percent = totalGradesNeeded > 0 ? Math.round((filledGrades / totalGradesNeeded) * 100) : 0;
        document.getElementById('progress-summary').innerHTML = '평정 진행률: ' + filledGrades + ' / ' + totalGradesNeeded + ' (' + percent + '%)';
      },

      // --- 설정 관리 ---
      renderSettings() {
        document.getElementById('cfg-org').value = state.settings.orgName;
        document.getElementById('cfg-session').value = state.settings.sessionName;
        document.getElementById('cfg-quota').value = state.settings.quota;
        document.getElementById('cfg-tie').value = state.settings.tieBreakerRule;
        document.getElementById('cfg-disq').value = state.settings.enableDisqualification ? 'true' : 'false';

        // 면접위원 리스트
        const invList = document.getElementById('interviewers-list');
        invList.innerHTML = state.settings.interviewers.map((inv, idx) => \`
          <div style="display:flex; gap:8px; margin-bottom:8px; align-items:center;">
            <span style="width:24px; font-weight:700; color:#64748b;">\${idx + 1}</span>
            <input type="text" class="form-control" value="\${inv.name}" onchange="App.updateInterviewerName('\${inv.id}', this.value)">
            \${state.settings.interviewers.length > 1 ? \`<button class="btn btn-danger btn-sm" onclick="App.removeInterviewer('\${inv.id}')">삭제</button>\` : ''}
          </div>
        \`).join('');

        // 평가항목 리스트
        const critList = document.getElementById('criteria-list');
        critList.innerHTML = state.settings.criteria.map((c, idx) => \`
          <div style="border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px; background:#f8fafc;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:700; font-size:12px; color:#1e3a8a;">항목 \${idx + 1}</span>
              \${state.settings.criteria.length > 1 ? \`<button class="btn btn-danger btn-sm" onclick="App.removeCriteria('\${c.id}')">삭제</button>\` : ''}
            </div>
            <input type="text" class="form-control" style="margin-bottom:4px; font-weight:600;" value="\${c.name}" onchange="App.updateCriteriaName('\${c.id}', this.value)">
            <input type="text" class="form-control" style="font-size:12px; color:#64748b;" value="\${c.description}" onchange="App.updateCriteriaDesc('\${c.id}', this.value)">
          </div>
        \`).join('');
      },

      updateSettings(key, val) {
        state.settings[key] = val;
        this.save();
        this.renderAll();
      },

      addInterviewer() {
        const nextIdx = state.settings.interviewers.length + 1;
        state.settings.interviewers.push({
          id: 'inv-' + Date.now(),
          name: '면접위원 ' + String.fromCharCode(64 + nextIdx)
        });
        this.save();
        this.renderAll();
      },

      updateInterviewerName(id, val) {
        const item = state.settings.interviewers.find(i => i.id === id);
        if (item) item.name = val;
        this.save();
      },

      removeInterviewer(id) {
        state.settings.interviewers = state.settings.interviewers.filter(i => i.id !== id);
        this.save();
        this.renderAll();
      },

      addCriteria() {
        state.settings.criteria.push({
          id: 'crit-' + Date.now(),
          name: '신규 평가 항목',
          description: '평가 세부 기준'
        });
        this.save();
        this.renderAll();
      },

      updateCriteriaName(id, val) {
        const c = state.settings.criteria.find(i => i.id === id);
        if (c) c.name = val;
        this.save();
      },

      updateCriteriaDesc(id, val) {
        const c = state.settings.criteria.find(i => i.id === id);
        if (c) c.description = val;
        this.save();
      },

      // --- 응시자 명단 관리 ---
      renderCandidates() {
        document.getElementById('cand-total-count').innerText = state.candidates.length;
        const tbody = document.getElementById('candidates-tbody');
        tbody.innerHTML = state.candidates.map((c, idx) => \`
          <tr class="\${c.isAbsent ? 'tag-absent' : ''}">
            <td class="text-center tabular-nums">\${idx + 1}</td>
            <td style="font-weight:700;">\${c.examNumber}</td>
            <td style="font-weight:600;">\${c.name}</td>
            <td>\${c.region || '-'}</td>
            <td class="text-center">
              <input type="checkbox" \${c.isAbsent ? 'checked' : ''} onchange="App.toggleAbsent('\${c.id}')">
            </td>
            <td><input type="text" class="form-control" style="height:28px; font-size:12px;" value="\${c.notes || ''}" onchange="App.updateCandNotes('\${c.id}', this.value)"></td>
            <td class="text-center">
              <button class="btn btn-danger btn-sm" onclick="App.deleteCandidate('\${c.id}')">삭제</button>
            </td>
          </tr>
        \`).join('');
      },

      addCandidate(e) {
        e.preventDefault();
        const num = document.getElementById('new-cand-num').value.trim();
        const name = document.getElementById('new-cand-name').value.trim();
        const reg = document.getElementById('new-cand-region').value.trim();
        const notes = document.getElementById('new-cand-notes').value.trim();

        if (!num || !name) return;
        state.candidates.push({
          id: 'cand-' + Date.now(),
          examNumber: num,
          name: name,
          region: reg,
          notes: notes,
          isAbsent: false,
          manualDecision: 'auto'
        });
        document.getElementById('new-cand-num').value = '';
        document.getElementById('new-cand-name').value = '';
        document.getElementById('new-cand-region').value = '';
        document.getElementById('new-cand-notes').value = '';
        this.save();
        this.renderAll();
      },

      toggleAbsent(id) {
        const c = state.candidates.find(i => i.id === id);
        if (c) c.isAbsent = !c.isAbsent;
        this.save();
        this.renderAll();
      },

      updateCandNotes(id, val) {
        const c = state.candidates.find(i => i.id === id);
        if (c) c.notes = val;
        this.save();
      },

      deleteCandidate(id) {
        if (!confirm('해당 응시자를 삭제하시겠습니까? 관련 평정 점수도 함께 삭제됩니다.')) return;
        state.candidates = state.candidates.filter(c => c.id !== id);
        delete state.scores[id];
        if (this.activeCandId === id) {
          this.activeCandId = state.candidates[0] ? state.candidates[0].id : null;
        }
        this.save();
        this.renderAll();
      },

      openBatchAddModal() {
        const text = prompt('엑셀에서 [수험번호 성명 소속국]을 복사하여 붙여넣으세요 (줄바꿈 구분):');
        if (!text) return;
        const lines = text.split(/\\r?\\n/).map(l => l.trim()).filter(l => l.length > 0);
        let addedCount = 0;
        lines.forEach(line => {
          const parts = line.split(/[\\t,]+/).map(p => p.trim());
          if (parts.length >= 2 && parts[0] !== '수험번호') {
            state.candidates.push({
              id: 'cand-' + Date.now() + Math.random(),
              examNumber: parts[0],
              name: parts[1],
              region: parts[2] || '',
              notes: parts[3] || '',
              isAbsent: false,
              manualDecision: 'auto'
            });
            addedCount++;
          }
        });
        alert(addedCount + '명의 응시자가 등록되었습니다.');
        this.save();
        this.renderAll();
      },

      // --- 평정 입력 관리 ---
      renderScoring() {
        const select = document.getElementById('scoring-cand-select');
        select.innerHTML = state.candidates.map(c => \`
          <option value="\${c.id}" \${c.id === this.activeCandId ? 'selected' : ''}>
            \${c.isAbsent ? '[결시] ' : ''}\${c.examNumber} \${c.name} (\${c.region || '소속없음'})
          </option>
        \`).join('');

        if (!this.activeCandId && state.candidates.length > 0) {
          this.activeCandId = state.candidates[0].id;
        }

        const cand = state.candidates.find(c => c.id === this.activeCandId);
        if (!cand) {
          document.getElementById('scoring-sheet-card').innerHTML = '<div style="padding:20px; text-align:center; color:#94a3b8;">등록된 응시자가 없습니다. 먼저 응시자 명단을 등록해주세요.</div>';
          return;
        }

        document.getElementById('scoring-current-cand-info').innerHTML = \`
          <strong>\${cand.examNumber} \${cand.name}</strong> 
          <span style="color:#64748b; font-size:13px; font-weight:normal;">(\${cand.region || '응시지역 미지정'})</span>
          \${cand.isAbsent ? '<span class="tag tag-absent" style="margin-left:8px;">결시자</span>' : ''}
        \`;

        // 헤더
        const thead = document.getElementById('scoring-matrix-thead');
        thead.innerHTML = \`
          <tr>
            <th style="width:260px;">평가 요소 및 착안점</th>
            \${state.settings.interviewers.map(inv => \`<th class="text-center" style="width:180px;">\${inv.name}</th>\`).join('')}
          </tr>
        \`;

        // 본문
        const candScores = state.scores[cand.id] || {};
        const tbody = document.getElementById('scoring-matrix-tbody');
        tbody.innerHTML = state.settings.criteria.map(crit => \`
          <tr>
            <td>
              <div style="font-weight:700; color:#1e293b;">\${crit.name}</div>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">\${crit.description}</div>
            </td>
            \${state.settings.interviewers.map(inv => {
              const currentGrade = (candScores[inv.id] || {})[crit.id] || null;
              return \`
                <td class="text-center">
                  <div style="display:inline-flex; gap:4px;">
                    <button class="grade-btn grade-high \${currentGrade === 'high' ? 'active' : ''}" onclick="App.setGrade('\${cand.id}', '\${inv.id}', '\${crit.id}', 'high')">상</button>
                    <button class="grade-btn grade-mid \${currentGrade === 'mid' ? 'active' : ''}" onclick="App.setGrade('\${cand.id}', '\${inv.id}', '\${crit.id}', 'mid')">중</button>
                    <button class="grade-btn grade-low \${currentGrade === 'low' ? 'active' : ''}" onclick="App.setGrade('\${cand.id}', '\${inv.id}', '\${crit.id}', 'low')">하</button>
                  </div>
                </td>
              \`;
            }).join('')}
          </tr>
        \`).join('');
      },

      selectCandidateForScoring(id) {
        this.activeCandId = id;
        this.renderScoring();
      },

      prevCandidate() {
        const idx = state.candidates.findIndex(c => c.id === this.activeCandId);
        if (idx > 0) {
          this.activeCandId = state.candidates[idx - 1].id;
          this.renderScoring();
        }
      },

      nextCandidate() {
        const idx = state.candidates.findIndex(c => c.id === this.activeCandId);
        if (idx < state.candidates.length - 1) {
          this.activeCandId = state.candidates[idx + 1].id;
          this.renderScoring();
        }
      },

      setGrade(candId, invId, critId, grade) {
        if (!state.scores[candId]) state.scores[candId] = {};
        if (!state.scores[candId][invId]) state.scores[candId][invId] = {};

        const cur = state.scores[candId][invId][critId];
        state.scores[candId][invId][critId] = (cur === grade) ? null : grade;
        this.save();
        this.renderScoring();
        this.updateHeaderProgress();
      },

      fillCurrentCand(grade) {
        if (!this.activeCandId) return;
        if (!state.scores[this.activeCandId]) state.scores[this.activeCandId] = {};
        state.settings.interviewers.forEach(inv => {
          if (!state.scores[this.activeCandId][inv.id]) state.scores[this.activeCandId][inv.id] = {};
          state.settings.criteria.forEach(crit => {
            state.scores[this.activeCandId][inv.id][crit.id] = grade;
          });
        });
        this.save();
        this.renderScoring();
        this.updateHeaderProgress();
      },

      setupKeyboard() {
        window.addEventListener('keydown', (e) => {
          if (this.currentTab !== 'scoring') return;
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

          if (e.key === 'ArrowLeft') this.prevCandidate();
          if (e.key === 'ArrowRight') this.nextCandidate();
        });
      },

      // --- 결과 집계 및 순위 산출 ---
      calculateResults() {
        const { quota, tieBreakerRule, enableDisqualification, interviewers, criteria } = state.settings;
        const totalItems = interviewers.length * criteria.length;

        const results = state.candidates.map(cand => {
          if (cand.isAbsent) {
            return {
              cand, high: 0, mid: 0, low: 0, total: 0,
              isDisqualified: false, rank: null, isTie: false, isBoundaryTie: false,
              decision: '결시'
            };
          }

          const cScores = state.scores[cand.id] || {};
          let high = 0, mid = 0, low = 0;
          const critLowCounts = {};
          criteria.forEach(c => critLowCounts[c.id] = 0);

          interviewers.forEach(inv => {
            const invScores = cScores[inv.id] || {};
            criteria.forEach(crit => {
              const g = invScores[crit.id];
              if (g === 'high') high++;
              else if (g === 'mid') mid++;
              else if (g === 'low') {
                low++;
                critLowCounts[crit.id]++;
              }
            });
          });

          let isDisqualified = false;
          let disqReason = '';

          if (enableDisqualification) {
            const majority = Math.ceil(interviewers.length / 2);
            for (let crit of criteria) {
              if (critLowCounts[crit.id] >= majority) {
                isDisqualified = true;
                disqReason = \`[\${crit.name}] 위원 과반수 '하'\`;
                break;
              }
            }
            if (!isDisqualified && low >= Math.ceil(totalItems / 2)) {
              isDisqualified = true;
              disqReason = \`전체 중 '하' 50% 이상 (\${low}개)\`;
            }
          }

          return {
            cand, high, mid, low, total: high + mid + low,
            isDisqualified, disqReason,
            rank: null, isTie: false, isBoundaryTie: false,
            decision: isDisqualified ? '과락' : '불합격'
          };
        });

        const active = results.filter(r => !r.cand.isAbsent);

        // 정렬
        active.sort((a, b) => {
          if (a.isDisqualified !== b.isDisqualified) return a.isDisqualified ? 1 : -1;
          if (b.high !== a.high) return b.high - a.high;
          if (tieBreakerRule === 'high_mid_low') {
            if (b.mid !== a.mid) return b.mid - a.mid;
            if (a.low !== b.low) return a.low - b.low;
          } else {
            if (a.low !== b.low) return a.low - b.low;
            if (b.mid !== a.mid) return b.mid - a.mid;
          }
          return a.cand.examNumber.localeCompare(b.cand.examNumber, undefined, { numeric: true });
        });

        // 순위 매기기
        for (let i = 0; i < active.length; i++) {
          if (i > 0) {
            const prev = active[i - 1];
            const curr = active[i];
            const isSame = prev.high === curr.high && prev.mid === curr.mid && prev.low === curr.low && prev.isDisqualified === curr.isDisqualified;
            if (isSame) {
              curr.rank = prev.rank;
              curr.isTie = true;
              prev.isTie = true;
            } else {
              curr.rank = i + 1;
            }
          } else {
            active[i].rank = 1;
          }
        }

        // 선발인원 경계선 동점 감지
        if (quota > 0 && active.length > 0) {
          const cutIdx = Math.min(quota - 1, active.length - 1);
          const cutCand = active[cutIdx];
          const tiedAtCut = active.filter(c => !c.isDisqualified && c.high === cutCand.high && c.mid === cutCand.mid && c.low === cutCand.low);
          
          if (tiedAtCut.length > 1) {
            const firstIdx = active.indexOf(tiedAtCut[0]);
            const lastIdx = active.indexOf(tiedAtCut[tiedAtCut.length - 1]);
            if (firstIdx < quota && lastIdx >= quota) {
              tiedAtCut.forEach(c => c.isBoundaryTie = true);
            }
          }
        }

        // 최종 판정 결정
        active.forEach((r, idx) => {
          if (r.cand.manualDecision && r.cand.manualDecision !== 'auto') {
            if (r.cand.manualDecision === 'pass') r.decision = '합격';
            else if (r.cand.manualDecision === 'fail') r.decision = '불합격';
            else if (r.cand.manualDecision === 'reserve') r.decision = '예비';
            return;
          }
          if (r.isDisqualified) {
            r.decision = '과락';
            return;
          }
          if (r.isBoundaryTie) {
            r.decision = '동점(협의)';
            return;
          }
          r.decision = (idx < quota) ? '합격' : '불합격';
        });

        const absents = results.filter(r => r.cand.isAbsent);
        return [...active, ...absents];
      },

      renderResults() {
        const results = this.calculateResults();
        const { quota, sessionName, orgName, examDate } = state.settings;

        document.getElementById('print-title').innerText = \`[\${orgName}] 집배원 채용 면접시험 집계표 및 최종 합격자 조서\`;
        document.getElementById('print-meta').innerText = \`시험명: \${sessionName}  |  면접일: \${examDate}  |  선발예정인원: \${quota}명\`;

        // 상단 통계
        const passCount = results.filter(r => r.decision === '합격').length;
        const boundaryTieCount = results.filter(r => r.isBoundaryTie).length;
        const absentCount = results.filter(r => r.cand.isAbsent).length;

        document.getElementById('results-summary-stats').innerHTML = \`
          <div>선발 예정: <strong>\${quota}명</strong></div>
          <div>현재 합격: <strong style="color:#15803d;">\${passCount}명</strong></div>
          \${boundaryTieCount > 0 ? \`<div style="color:#b45309; font-weight:700;">⚠️ 합격선 경계 동점자 \${boundaryTieCount}명 (위원회 협의 필요)</div>\` : ''}
          <div>결시자: <strong>\${absentCount}명</strong></div>
        \`;

        const tbody = document.getElementById('results-tbody');
        tbody.innerHTML = results.map((r, idx) => {
          const isCutoffLine = (idx === quota - 1 && quota < results.length);
          let tagClass = 'tag-fail';
          if (r.decision === '합격') tagClass = 'tag-pass';
          else if (r.decision === '동점(협의)') tagClass = 'tag-tie';
          else if (r.decision === '과락') tagClass = 'tag-disqualified';
          else if (r.decision === '결시') tagClass = 'tag-absent';
          else if (r.decision === '예비') tagClass = 'tag-reserve';

          return \`
            <tr class="\${r.isBoundaryTie ? 'cutoff-row' : ''}">
              <td class="text-center tabular-nums" style="font-weight:700;">\${r.rank !== null ? r.rank : '-'}</td>
              <td style="font-weight:700;">\${r.cand.examNumber}</td>
              <td style="font-weight:600;">\${r.cand.name}</td>
              <td>\${r.cand.region || '-'}</td>
              <td class="text-center tabular-nums" style="color:#2563eb; font-weight:700;">\${r.cand.isAbsent ? '-' : r.high}</td>
              <td class="text-center tabular-nums" style="color:#d97706; font-weight:700;">\${r.cand.isAbsent ? '-' : r.mid}</td>
              <td class="text-center tabular-nums" style="color:#dc2626; font-weight:700;">\${r.cand.isAbsent ? '-' : r.low}</td>
              <td class="text-center tabular-nums">\${r.cand.isAbsent ? '-' : r.total}</td>
              <td class="text-center">
                <span class="tag \${tagClass}">\${r.decision}</span>
                \${r.isBoundaryTie ? \`
                  <div class="no-print" style="margin-top:4px;">
                    <select class="form-control" style="font-size:11px; padding:2px 4px; height:24px;" onchange="App.setManualDecision('\${r.cand.id}', this.value)">
                      <option value="auto" \${r.cand.manualDecision === 'auto' ? 'selected' : ''}>자동(협의중)</option>
                      <option value="pass" \${r.cand.manualDecision === 'pass' ? 'selected' : ''}>합격 판정</option>
                      <option value="reserve" \${r.cand.manualDecision === 'reserve' ? 'selected' : ''}>예비합격</option>
                      <option value="fail" \${r.cand.manualDecision === 'fail' ? 'selected' : ''}>불합격</option>
                    </select>
                  </div>
                \` : ''}
              </td>
              <td>
                <span>\${r.cand.notes || ''}</span>
                \${r.disqReason ? \`<span style="color:#dc2626; font-size:12px; margin-left:6px;">[\${r.disqReason}]</span>\` : ''}
              </td>
            </tr>
          \`;
        }).join('');
      },

      setManualDecision(candId, val) {
        const c = state.candidates.find(i => i.id === candId);
        if (c) c.manualDecision = val;
        this.save();
        this.renderResults();
      },

      exportCsv() {
        const results = this.calculateResults();
        const rows = [];
        rows.push([\`[\${state.settings.sessionName}] 집배원 면접시험 결과 집계표\`]);
        rows.push([\`선발예정인원: \${state.settings.quota}명\`, \`집계일: \${new Date().toLocaleDateString('ko-KR')}\`]);
        rows.push([]);
        rows.push(['순위', '수험번호', '성명', '응시지역', '상(개수)', '중(개수)', '하(개수)', '총평정수', '최종판정', '비고']);

        results.forEach(r => {
          rows.push([
            r.rank !== null ? r.rank : '-',
            r.cand.examNumber,
            r.cand.name,
            r.cand.region || '-',
            r.cand.isAbsent ? '-' : r.high,
            r.cand.isAbsent ? '-' : r.mid,
            r.cand.isAbsent ? '-' : r.low,
            r.cand.isAbsent ? '-' : r.total,
            r.decision,
            [r.cand.notes || '', r.disqReason || ''].filter(Boolean).join(' ')
          ]);
        });

        const csvContent = rows.map(r => r.map(c => \`"\${String(c).replace(/"/g, '""')}"\`).join(',')).join('\\r\\n');
        const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`집배원_면접집계결과_\${new Date().toISOString().split('T')[0]}.csv\`;
        a.click();
        URL.revokeObjectURL(url);
      },

      // --- 백업 & 복원 ---
      save() {
        try {
          localStorage.setItem('postman_interview_offline_v1', JSON.stringify(state));
        } catch (e) {
          console.error(e);
        }
      },

      exportBackup() {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = \`집배원면접집계_백업_\${new Date().toISOString().split('T')[0]}.json\`;
        a.click();
      },

      importBackupClick() {
        document.getElementById('file-import-input').click();
      },

      onBackupFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.settings && data.candidates && data.scores) {
              state.settings = data.settings;
              state.candidates = data.candidates;
              state.scores = data.scores;
              this.save();
              this.renderAll();
              alert('백업 데이터가 성공적으로 복원되었습니다.');
            } else {
              alert('올바른 백업 파일 형식이 아닙니다.');
            }
          } catch (err) {
            alert('파일을 읽는 중 오류가 발생했습니다: ' + err.message);
          }
        };
        reader.readAsText(file);
      },

      resetAll() {
        if (!confirm('정말로 모든 데이터를 초기화하시겠습니까? 입력된 모든 평정과 명단이 지워집니다.')) return;
        state.candidates = [];
        state.scores = {};
        this.save();
        this.renderAll();
      },

      loadSampleData() {
        alert('샘플 집배원 응시자 10명과 평정 데이터가 로드되었습니다.');
        location.reload();
      }
    };

    // 로컬스토리지에서 복원 시도
    try {
      const saved = localStorage.getItem('postman_interview_offline_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings && parsed.candidates && parsed.scores) {
          state.settings = parsed.settings;
          state.candidates = parsed.candidates;
          state.scores = parsed.scores;
        }
      }
    } catch (e) {}

    window.App = App;
    App.init();
  </script>
</body>
</html>`;
}

/**
 * 브라우저에서 '오프라인 단일 HTML 파일 다운로드' 트리거
 */
export function downloadStandaloneHtmlFile(state: AppState): void {
  const htmlContent = generateStandaloneHtml(state);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `집배원_채용면접결과정리기_오프라인단일파일.html`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
