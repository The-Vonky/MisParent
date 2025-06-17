import { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDiary({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2º Bimestre');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dados do estudante vindos da tela anterior
  const { studentId, studentName } = route.params || {};

  // Dados mockados do diário
  const diaryData = useMemo(() => ({
    student: {
      name: studentName || 'Lucas Oliveira',
      class: '2A',
      year: '2025'
    },
    periods: ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'],
    subjects: {
      '1º Bimestre': [
        {
          id: '1',
          name: 'Matemática',
          teacher: 'Prof. Carlos Silva',
          grades: [
            { type: 'Prova', value: 8.5, weight: 4.0, date: '2025-03-15' },
            { type: 'Trabalho', value: 9.0, weight: 3.0, date: '2025-03-22' },
            { type: 'Exercícios', value: 7.5, weight: 3.0, date: '2025-03-29' }
          ],
          average: 8.3,
          attendance: { present: 18, total: 20, percentage: 90 },
          observations: 'Aluno demonstra boa compreensão dos conceitos. Precisa melhorar a atenção durante as explicações.',
          skills: [
            { name: 'Resolução de problemas', level: 'Bom' },
            { name: 'Cálculo mental', level: 'Satisfatório' },
            { name: 'Interpretação', level: 'Excelente' }
          ]
        },
        {
          id: '2',
          name: 'Português',
          teacher: 'Prof. Ana Santos',
          grades: [
            { type: 'Prova', value: 9.0, weight: 4.0, date: '2025-03-18' },
            { type: 'Redação', value: 8.5, weight: 3.0, date: '2025-03-25' },
            { type: 'Seminário', value: 9.5, weight: 3.0, date: '2025-04-01' }
          ],
          average: 8.9,
          attendance: { present: 19, total: 20, percentage: 95 },
          observations: 'Excelente desenvolvimento na escrita. Participação ativa nas discussões em classe.',
          skills: [
            { name: 'Leitura e interpretação', level: 'Excelente' },
            { name: 'Produção textual', level: 'Bom' },
            { name: 'Gramática', level: 'Bom' }
          ]
        },
        {
          id: '3',
          name: 'Ciências',
          teacher: 'Prof. Roberto Lima',
          grades: [
            { type: 'Prova', value: 7.5, weight: 4.0, date: '2025-03-20' },
            { type: 'Experimento', value: 8.0, weight: 3.0, date: '2025-03-27' },
            { type: 'Relatório', value: 8.5, weight: 3.0, date: '2025-04-03' }
          ],
          average: 7.9,
          attendance: { present: 17, total: 20, percentage: 85 },
          observations: 'Mostra curiosidade científica. Recomenda-se maior dedicação aos estudos teóricos.',
          skills: [
            { name: 'Observação científica', level: 'Excelente' },
            { name: 'Experimentação', level: 'Bom' },
            { name: 'Conceitos teóricos', level: 'Satisfatório' }
          ]
        }
      ],
      '2º Bimestre': [
        {
          id: '1',
          name: 'Matemática',
          teacher: 'Prof. Carlos Silva',
          grades: [
            { type: 'Prova', value: 9.0, weight: 4.0, date: '2025-05-15' },
            { type: 'Trabalho', value: 8.5, weight: 3.0, date: '2025-05-22' },
            { type: 'Lista de Exercícios', value: 9.5, weight: 3.0, date: '2025-06-05' }
          ],
          average: 8.9,
          attendance: { present: 19, total: 20, percentage: 95 },
          observations: 'Notável melhoria no desempenho. Demonstra maior concentração e interesse pela matéria.',
          skills: [
            { name: 'Resolução de problemas', level: 'Excelente' },
            { name: 'Cálculo mental', level: 'Bom' },
            { name: 'Interpretação', level: 'Excelente' }
          ]
        },
        {
          id: '2',
          name: 'Português',
          teacher: 'Prof. Ana Santos',
          grades: [
            { type: 'Prova', value: 8.8, weight: 4.0, date: '2025-05-18' },
            { type: 'Redação', value: 9.2, weight: 3.0, date: '2025-05-25' },
            { type: 'Projeto de Leitura', value: 9.0, weight: 3.0, date: '2025-06-08' }
          ],
          average: 9.0,
          attendance: { present: 20, total: 20, percentage: 100 },
          observations: 'Mantém excelente desempenho. Liderança natural em atividades em grupo.',
          skills: [
            { name: 'Leitura e interpretação', level: 'Excelente' },
            { name: 'Produção textual', level: 'Excelente' },
            { name: 'Gramática', level: 'Bom' }
          ]
        },
        {
          id: '3',
          name: 'Ciências',
          teacher: 'Prof. Roberto Lima',
          grades: [
            { type: 'Prova', value: 8.2, weight: 4.0, date: '2025-05-20' },
            { type: 'Projeto Sistema Solar', value: 9.5, weight: 3.0, date: '2025-06-01' },
            { type: 'Seminário', value: 8.8, weight: 3.0, date: '2025-06-10' }
          ],
          average: 8.7,
          attendance: { present: 18, total: 20, percentage: 90 },
          observations: 'Evolução significativa! O projeto do sistema solar demonstrou dedicação e criatividade.',
          skills: [
            { name: 'Observação científica', level: 'Excelente' },
            { name: 'Experimentação', level: 'Excelente' },
            { name: 'Conceitos teóricos', level: 'Bom' }
          ]
        }
      ]
    }
  }), [studentName]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados do diário');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubjectPress = useCallback((subject) => {
    setSelectedSubject(subject);
    setModalVisible(true);
  }, []);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedSubject(null);
  }, []);

  // Cálculo da média geral do período
  const periodAverage = useMemo(() => {
    const subjects = diaryData.subjects[selectedPeriod] || [];
    if (subjects.length === 0) return 0;
    const sum = subjects.reduce((acc, subject) => acc + subject.average, 0);
    return (sum / subjects.length).toFixed(1);
  }, [diaryData.subjects, selectedPeriod]);

  // Cálculo da frequência geral do período
  const periodAttendance = useMemo(() => {
    const subjects = diaryData.subjects[selectedPeriod] || [];
    if (subjects.length === 0) return { present: 0, total: 0, percentage: 0 };
    
    const totals = subjects.reduce((acc, subject) => {
      acc.present += subject.attendance.present;
      acc.total += subject.attendance.total;
      return acc;
    }, { present: 0, total: 0 });
    
    const percentage = totals.total > 0 ? Math.round((totals.present / totals.total) * 100) : 0;
    
    return { ...totals, percentage };
  }, [diaryData.subjects, selectedPeriod]);

  // Render functions
  const renderPeriodSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.periodSelector}
    >
      {diaryData.periods.map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.activePeriodButton
          ]}
          onPress={() => handlePeriodChange(period)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.activePeriodButtonText
          ]}>
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSummaryCard = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Resumo do {selectedPeriod}</Text>
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="school-outline" size={24} color="#3b82f6" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{periodAverage}</Text>
            <Text style={styles.summaryLabel}>Média Geral</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="calendar-outline" size={24} color="#10b981" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{periodAttendance.percentage}%</Text>
            <Text style={styles.summaryLabel}>Frequência</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.attendanceDetail}>
        <Text style={styles.attendanceText}>
          {periodAttendance.present} de {periodAttendance.total} aulas presentes
        </Text>
      </View>
    </View>
  );

  const getGradeColor = useCallback((grade) => {
    if (grade >= 9) return '#10b981';
    if (grade >= 7) return '#3b82f6';
    if (grade >= 5) return '#f59e0b';
    return '#ef4444';
  }, []);

  const getAttendanceColor = useCallback((percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  }, []);

  const getSkillLevelColor = useCallback((level) => {
    switch (level) {
      case 'Excelente': return '#10b981';
      case 'Bom': return '#3b82f6';
      case 'Satisfatório': return '#f59e0b';
      default: return '#6b7280';
    }
  }, []);

  const renderSubjectItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.subjectCard} onPress={() => handleSubjectPress(item)}>
      <View style={styles.subjectHeader}>
        <View>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.teacherName}>{item.teacher}</Text>
        </View>
        <View style={styles.subjectStats}>
          <View style={[styles.gradeCircle, { borderColor: getGradeColor(item.average) }]}>
            <Text style={[styles.gradeText, { color: getGradeColor(item.average) }]}>
              {item.average.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.subjectInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="clipboard-outline" size={16} color="#6b7280" />
          <Text style={styles.infoText}>{item.grades.length} avaliações</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={16} color={getAttendanceColor(item.attendance.percentage)} />
          <Text style={[styles.infoText, { color: getAttendanceColor(item.attendance.percentage) }]}>
            {item.attendance.percentage}% frequência
          </Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" style={styles.chevronIcon} />
    </TouchableOpacity>
  ), [handleSubjectPress, getGradeColor, getAttendanceColor]);

  const renderSubjectModal = () => {
    if (!selectedSubject) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSubject.name}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Notas */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Avaliações</Text>
                {selectedSubject.grades.map((grade, index) => (
                  <View key={index} style={styles.gradeItem}>
                    <View style={styles.gradeInfo}>
                      <Text style={styles.gradeType}>{grade.type}</Text>
                      <Text style={styles.gradeDate}>
                        {new Date(grade.date).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                    <View style={styles.gradeValueContainer}>
                      <Text style={[styles.gradeValue, { color: getGradeColor(grade.value) }]}>
                        {grade.value.toFixed(1)}
                      </Text>
                      <Text style={styles.gradeWeight}>Peso {grade.weight}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Habilidades */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Desenvolvimento de Habilidades</Text>
                {selectedSubject.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <View style={[styles.skillLevel, { backgroundColor: getSkillLevelColor(skill.level) + '20' }]}>
                      <Text style={[styles.skillLevelText, { color: getSkillLevelColor(skill.level) }]}>
                        {skill.level}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Observações */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Observações do Professor</Text>
                <View style={styles.observationContainer}>
                  <Text style={styles.observationText}>{selectedSubject.observations}</Text>
                </View>
              </View>

              {/* Frequência Detalhada */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Frequência</Text>
                <View style={styles.attendanceContainer}>
                  <View style={styles.attendanceStats}>
                    <Text style={styles.attendanceNumber}>
                      {selectedSubject.attendance.present}/{selectedSubject.attendance.total}
                    </Text>
                    <Text style={styles.attendanceLabel}>aulas presentes</Text>
                  </View>
                  <View style={[
                    styles.attendancePercentage, 
                    { backgroundColor: getAttendanceColor(selectedSubject.attendance.percentage) + '20' }
                  ]}>
                    <Text style={[
                      styles.attendancePercentageText, 
                      { color: getAttendanceColor(selectedSubject.attendance.percentage) }
                    ]}>
                      {selectedSubject.attendance.percentage}%
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const currentSubjects = diaryData.subjects[selectedPeriod] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Diário Escolar</Text>
          <Text style={styles.headerSubtitle}>{diaryData.student.name}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Period Selector */}
        {renderPeriodSelector()}

        {/* Summary Card */}
        {renderSummaryCard()}

        {/* Subjects List */}
        <View style={styles.subjectsContainer}>
          <Text style={styles.subjectsTitle}>Disciplinas</Text>
          <FlatList
            data={currentSubjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ScrollView>

      {/* Subject Detail Modal */}
      {renderSubjectModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 2,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activePeriodButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activePeriodButtonText: {
    color: 'white',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryTextContainer: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  attendanceDetail: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  attendanceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  subjectsContainer: {
    margin: 16,
  },
  subjectsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  teacherName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  subjectStats: {
    alignItems: 'center',
  },
  gradeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  subjectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  chevronIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
  separator: {
    height: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  gradeInfo: {
    flex: 1,
  },
  gradeType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  gradeDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  gradeValueContainer: {
    alignItems: 'flex-end',
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  gradeWeight: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  skillName: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  skillLevel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  observationContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  observationText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  attendanceStats: {
    flex: 1,
  },
  attendanceNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  attendancePercentage: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  attendancePercentageText: {
    fontSize: 16,
    fontWeight: '600',
  },
});