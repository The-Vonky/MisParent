import { View, Text, StyleSheet } from 'react-native';
import { Megaphone } from 'lucide-react-native';

const Announcement = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Megaphone color="#1e3a8a" size={20} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Aviso Importante</Text>
        <Text style={styles.message}>
          As atividades da próxima semana serão postadas até sexta-feira.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eef2ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#1e3a8a',
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 15,
  },
  message: {
    color: '#334155',
    fontSize: 14,
  },
});

export default Announcement;