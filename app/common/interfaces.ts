// 1. 개별 번호 조합 (theme + 번호 배열)
export interface LottoCombination {
  theme: string; // 예: "균형 잡힌 조합", "미출현 번호 위주"
  numbers: number[]; // 예: [1, 2, 3, 4, 5, 6]
}

// 2. Hot Number 상세 정보 (번호 + 출현 횟수)
export interface HotNumber {
  number: number; // 로또 번호
  count: number; // 기간 내 출현 횟수
}

// 3. 통계 데이터 객체 (Stats)
export interface LottoStats {
  latestDrwNo: number; // 분석에 사용된 최신 회차 번호
  hotNumbers: HotNumber[]; // 최다 출현 번호 목록 (Top 5)
  coldNumbers: number[]; // 오랫동안 안 나온 번호 목록
  recentSums: number[]; // 최근 5회차 당첨 번호 총합 배열
  sectionMap: Record<string, number>; // 번호대별 분포 (Key: '1-10', '11-20'...)
}

// 4. 최종 API 응답 (Response)
export interface LottoApiResponse {
  report: string; // AI 분석 요약 멘트
  combinations: LottoCombination[]; // 추천 조합 리스트
  stats: LottoStats; // 시각화용 통계 데이터
}
