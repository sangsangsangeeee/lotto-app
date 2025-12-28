import { LinearGradient } from "expo-linear-gradient"; // Expo 사용 시
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [luckyNumbers, setLuckyNumbers] = useState([
    [7, 12, 23, 33, 35, 45],
    [1, 14, 19, 21, 34, 42],
  ]);

  const [analysisReport, setAnalysisReport] = useState(
    "이번 주는 30번대 번호의 출현 빈도가 높을 것으로 예상됩니다. 미출현 번호였던 12번을 주목하세요."
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>금요일의 행운 🍀</Text>
          <Text style={styles.headerSubtitle}>
            Gemini AI가 분석한 이번 주 번호
          </Text>
        </View>

        {/* AI 분석 리포트 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🤖 AI 분석 리포트</Text>
          <Text style={styles.reportText}>{analysisReport}</Text>
        </View>

        {/* 추천 번호 리스트 */}
        <View style={styles.numbersSection}>
          <Text style={styles.sectionTitle}>추천 조합</Text>
          {luckyNumbers.map((set, index) => (
            <View key={index} style={styles.numberRow}>
              <View style={styles.setTag}>
                <Text style={styles.setText}>{index + 1}세트</Text>
              </View>
              <View style={styles.ballContainer}>
                {set.map((num) => (
                  <View key={num} style={[styles.ball, getBallColor(num)]}>
                    <Text style={styles.ballText}>{num}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 분석 요청 버튼 */}
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>새로운 조합 분석하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// 번호 대역별 색상 지정 함수
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
  numbersSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  setTag: {
    marginRight: 10,
    backgroundColor: "#333",
    padding: 5,
    borderRadius: 5,
  },
  setText: { color: "#fff", fontSize: 12 },
  ballContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
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
  gradientButton: { paddingVertical: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
