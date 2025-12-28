import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { LottoApiResponse, LottoStats } from "./common/interfaces";

// ⚠️ 본인의 환경에 맞는 서버 주소로 변경하세요!
// iOS 시뮬레이터: 'http://localhost:3000/lotto/analyze'
// Android 에뮬레이터: 'http://10.0.2.2:3000/lotto/analyze'
// 실제 기기: 'http://192.168.x.x:3000/lotto/analyze' (터미널에서 ipconfig/ifconfig 확인)
const SERVER_URL = "http://192.168.219.102:3000/lotto/analyze";
const SCREEN_WIDTH = Dimensions.get("window").width;

export interface LottoCombination {
  numbers: number[];
  theme: string;
}

export default function App() {
  const [luckyNumbers, setLuckyNumbers] = useState<LottoCombination[]>([]);
  const [analysisReport, setAnalysisReport] =
    useState("아직 분석된 내용이 없습니다.");
  const [stats, setStats] = useState<LottoStats | null>(null); // [추가] 통계 데이터 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  const fetchLottoAnalysis = async () => {
    setIsLoading(true);
    setStats(null); // 로딩 시 기존 통계 잠깐 숨김 (깔끔한 전환 위해)
    try {
      const response = await axios.get<LottoApiResponse>(SERVER_URL);

      const { report, combinations, stats } = response.data;

      setAnalysisReport(report);
      setLuckyNumbers(combinations);
      setStats(stats); // [추가] 백엔드에서 받은 통계 저장
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("오류", "서버 연결 실패. IP 주소와 서버 상태를 확인하세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>금요일의 행운 🍀</Text>
          <Text style={styles.headerSubtitle}>AI & Big Data 분석 시스템</Text>
        </View>

        {/* AI 분석 리포트 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI 분석 요약</Text>
          <Text style={styles.reportText}>
            {isLoading
              ? "최근 30회차 데이터를 정밀 분석 중입니다..."
              : analysisReport}
          </Text>
        </View>

        {/* [신규] 데이터 시각화 섹션 (데이터가 있을 때만 표시) */}
        {!isLoading && stats && (
          <View>
            {/* 1. Hot & Cold Numbers */}
            <View style={styles.statsRow}>
              {/* Hot Numbers */}
              <View style={[styles.statBox, { marginRight: 10 }]}>
                <Text style={styles.statLabel}>🔥 Hot (최다출현)</Text>
                <View style={styles.miniBallContainer}>
                  {stats.hotNumbers.slice(0, 3).map((item) => (
                    <View key={item.number} style={styles.hotBall}>
                      <Text style={styles.miniBallText}>{item.number}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Cold Numbers */}
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>❄️ Cold (장기미출현)</Text>
                <View style={styles.miniBallContainer}>
                  {stats.coldNumbers.slice(0, 3).map((num) => (
                    <View key={num} style={styles.coldBall}>
                      <Text style={styles.miniBallText}>{num}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* 2. 최근 총합 흐름 그래프 */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>
                📈 최근 5회차 당첨번호 총합 흐름
              </Text>
              <LineChart
                data={{
                  labels: ["4전", "3전", "2전", "1전", "최신"],
                  datasets: [{ data: stats.recentSums }],
                }}
                width={SCREEN_WIDTH - 60} // 화면 너비에 맞춤
                height={180}
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: "#1e1e1e",
                  backgroundGradientFrom: "#1e1e1e",
                  backgroundGradientTo: "#1e1e1e",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 255, 204, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "5", strokeWidth: "2", stroke: "#ffa726" },
                }}
                bezier // 곡선 그래프 적용
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
              <Text style={styles.chartCaption}>
                * 보통 120~160 사이가 안정적 범위입니다.
              </Text>
            </View>
          </View>
        )}

        {/* 추천 번호 리스트 */}
        <View style={styles.numbersSection}>
          <Text style={styles.sectionTitle}>추천 조합</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ffcc" />
              <Text style={styles.loadingText}>
                Gemini가 최적의 조합을 계산 중...
              </Text>
            </View>
          ) : luckyNumbers.length > 0 ? (
            luckyNumbers.map((item, index) => (
              <View key={index} style={styles.numberRow}>
                <View style={styles.setTag}>
                  <Text style={styles.setText}>{item.theme}</Text>
                </View>
                <View style={styles.ballContainer}>
                  {item.numbers.map((num) => (
                    <View key={num} style={[styles.ball, getBallColor(num)]}>
                      <Text style={styles.ballText}>{num}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>버튼을 눌러 분석을 시작하세요!</Text>
          )}
        </View>

        {/* 버튼 */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={fetchLottoAnalysis}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? ["#555", "#555"] : ["#6a11cb", "#2575fc"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "분석 중..." : "AI 정밀 분석 시작"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getBallColor = (num: number) => {
  if (num <= 10) return { backgroundColor: "#fbc400" };
  if (num <= 20) return { backgroundColor: "#69c8f2" };
  if (num <= 30) return { backgroundColor: "#ff7272" };
  if (num <= 40) return { backgroundColor: "#aaa" };
  return { backgroundColor: "#b0d840" };
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 20, paddingBottom: 50 },
  header: { marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#888", marginTop: 2 },

  card: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    color: "#00ffcc",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  reportText: { color: "#ddd", lineHeight: 22, fontSize: 14 },

  // [신규] 통계 스타일
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "bold",
  },
  miniBallContainer: { flexDirection: "row" },
  hotBall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff5e57",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  coldBall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0fb9b1",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  miniBallText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  chartContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 10,
    marginBottom: 25,
    alignItems: "center",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  chartCaption: { color: "#666", fontSize: 11, marginTop: 5 },

  // 추천 번호 섹션
  numbersSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  numberRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  setTag: {
    backgroundColor: "#333",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  setText: { color: "#00ffcc", fontSize: 13, fontWeight: "bold" },
  ballContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  ball: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  ballText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  button: { borderRadius: 12, overflow: "hidden", marginBottom: 20 },
  buttonDisabled: { opacity: 0.7 },
  gradientButton: { paddingVertical: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  loadingContainer: { alignItems: "center", padding: 30 },
  loadingText: { color: "#00ffcc", marginTop: 15, fontSize: 14 },
  emptyText: { color: "#555", textAlign: "center", marginTop: 20 },
});
