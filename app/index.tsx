import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⚠️ 본인의 환경에 맞는 서버 주소로 변경하세요!
// iOS 시뮬레이터: 'http://localhost:3000/lotto/analyze'
// Android 에뮬레이터: 'http://10.0.2.2:3000/lotto/analyze'
// 실제 기기: 'http://192.168.x.x:3000/lotto/analyze' (터미널에서 ipconfig/ifconfig 확인)
const SERVER_URL = "http://192.168.219.102:3000/lotto/analyze";

export interface LottoCombination {
  numbers: number[];
  theme: string;
}

export default function App() {
  // 데이터 상태 관리
  const [luckyNumbers, setLuckyNumbers] = useState<LottoCombination[]>([]);
  const [analysisReport, setAnalysisReport] = useState(
    "아직 분석된 내용이 없습니다. 아래 버튼을 눌러주세요!"
  );

  // 로딩 상태 관리 (AI가 생각하는 동안 뺑뺑이 돌리기 위함)
  const [isLoading, setIsLoading] = useState(false);

  // API 호출 함수
  const fetchLottoAnalysis = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // NestJS 백엔드로 요청 전송
      const response = await axios.get<{
        report: string;
        combinations: LottoCombination[];
      }>(SERVER_URL);

      const { report, combinations } = response.data;

      console.info("reprot", report);
      console.info("combinations", combinations);

      // 상태 업데이트 (화면 갱신)
      setAnalysisReport(report);
      setLuckyNumbers(combinations);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "오류 발생",
        "서버와 연결할 수 없습니다.\nIP주소나 서버 상태를 확인해주세요."
      );
    } finally {
      setIsLoading(false); // 로딩 끝 (성공하든 실패하든)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>금요일의 행운 🍀</Text>
          <Text style={styles.headerSubtitle}>
            Gemini AI가 분석한 이번 주 번호
          </Text>
        </View>

        {/* AI 분석 리포트 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI 분석 리포트</Text>
          <Text style={styles.reportText}>
            {isLoading
              ? "Gemini가 최근 3년 데이터를 분석 중입니다..."
              : analysisReport}
          </Text>
        </View>

        {/* 추천 번호 리스트 */}
        <View style={styles.numbersSection}>
          <Text style={styles.sectionTitle}>추천 조합</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ffcc" />
              <Text style={styles.loadingText}>번호 생성 중...</Text>
            </View>
          ) : luckyNumbers.length > 0 ? (
            // [수정] item 구조 변경: { numbers: [], theme: "" }
            luckyNumbers.map((item, index) => (
              <View key={index} style={styles.numberRow}>
                {/* 왼쪽: 테마 표시 영역 (기존 '1세트' 대신 실제 테마 출력) */}
                <View style={styles.setTag}>
                  <Text style={styles.setText}>
                    {item.theme || `${index + 1}세트`}{" "}
                    {/* theme이 없으면 세트 번호 */}
                  </Text>
                </View>

                {/* 오른쪽: 번호 공 그리기 (item.numbers 배열 순회) */}
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
            <Text style={styles.emptyText}>
              버튼을 눌러 번호를 생성해보세요!
            </Text>
          )}
        </View>

        {/* 분석 요청 버튼 (로딩 중엔 비활성화) */}
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
              {isLoading ? "분석 중..." : "AI에게 번호 추천받기"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 번호 색상 함수 (그대로 유지)
const getBallColor = (num: number) => {
  if (num <= 10) return { backgroundColor: "#fbc400" };
  if (num <= 20) return { backgroundColor: "#69c8f2" };
  if (num <= 30) return { backgroundColor: "#ff7272" };
  if (num <= 40) return { backgroundColor: "#aaa" };
  return { backgroundColor: "#b0d840" };
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 20 },
  header: { marginBottom: 30, marginTop: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 16, color: "#aaa", marginTop: 5 },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    color: "#00ffcc",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  reportText: { color: "#ddd", lineHeight: 22 },
  numbersSection: { marginBottom: 30, minHeight: 150 }, // 높이 확보
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  numberRow: {
    flexDirection: "column", // [변경] 모바일 화면이 좁을 수 있으니 상하 배치 고려
    alignItems: "flex-start", // 왼쪽 정렬
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15, // 간격 조금 더 벌림
  },
  setTag: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10, // 번호와 테마 사이 간격
    alignSelf: "flex-start",
  },
  setText: {
    color: "#00ffcc", // 테마는 강조색으로 변경
    fontSize: 14,
    fontWeight: "bold",
  },
  ballContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // 가로 꽉 채우기
  },
  ball: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  ballText: { color: "#fff", fontWeight: "bold" },
  button: { marginTop: 10, borderRadius: 12, overflow: "hidden" },
  buttonDisabled: { opacity: 0.7 },
  gradientButton: { paddingVertical: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // 로딩 및 빈 상태 스타일 추가
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: { color: "#00ffcc", marginTop: 10 },
  emptyText: { color: "#777", textAlign: "center", marginTop: 20 },
});
