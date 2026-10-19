import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { EstadoGuardadoProyecto, estadosGuardadoProyecto } from '@/data/guardarProyectoMock';

type ProjectStatusCardProps = {
  estado: EstadoGuardadoProyecto;
  expanded: boolean;
  onToggle: () => void;
  onChange: (estado: EstadoGuardadoProyecto) => void;
};

export function ProjectStatusCard({ estado, expanded, onToggle, onChange }: ProjectStatusCardProps) {
  const seleccionado = estadosGuardadoProyecto[estado];
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.headingIcon}>
          <Ionicons name="briefcase" size={25} color="#1B74D3" />
        </View>
        <Text style={styles.title}>Estado del proyecto</Text>
      </View>

      <TouchableOpacity accessibilityRole="button" activeOpacity={0.78} onPress={onToggle} style={styles.selection}>
        <StateIcon color={seleccionado.color} fondo={seleccionado.fondo} icon={seleccionado.icono} />
        <View style={styles.selectionCopy}>
          <Text style={styles.selectionTitle}>{seleccionado.titulo}</Text>
          <Text style={styles.selectionDescription}>{seleccionado.descripcion}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={26} color="#1672D2" />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.options}>
          {(Object.keys(estadosGuardadoProyecto) as EstadoGuardadoProyecto[]).map((key) => {
            const option = estadosGuardadoProyecto[key];
            const isSelected = key === estado;
            return (
              <TouchableOpacity key={key} activeOpacity={0.75} onPress={() => onChange(key)} style={styles.option}>
                <StateIcon color={option.color} fondo={option.fondo} icon={option.icono} small />
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.titulo}</Text>
                {isSelected && <Ionicons name="checkmark" color="#1672D2" size={20} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

function StateIcon({ color, fondo, icon, small = false }: { color: string; fondo: string; icon: 'time' | 'search' | 'construct' | 'pricetag'; small?: boolean }) {
  return (
    <View style={[styles.stateIcon, small && styles.stateIconSmall, { backgroundColor: fondo }]}>
      <Ionicons color={color} name={icon} size={small ? 18 : 29} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 30, padding: 18, shadowColor: '#284E8F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 13 },
  heading: { alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 15 },
  headingIcon: { alignItems: 'center', backgroundColor: '#E7F3FF', borderRadius: 15, height: 45, justifyContent: 'center', width: 45 },
  title: { color: '#071B49', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  selection: { alignItems: 'center', borderColor: '#C6DCFA', borderRadius: 23, borderWidth: 1.5, flexDirection: 'row', minHeight: 83, paddingHorizontal: 15 },
  stateIcon: { alignItems: 'center', borderRadius: 28, height: 56, justifyContent: 'center', marginRight: 14, width: 56 },
  stateIconSmall: { borderRadius: 18, height: 36, marginRight: 11, width: 36 },
  selectionCopy: { flex: 1 },
  selectionTitle: { color: '#071B49', fontSize: 17, fontWeight: '800' },
  selectionDescription: { color: '#5D7199', fontSize: 12.5, fontWeight: '500', marginTop: 2 },
  options: { gap: 3, paddingHorizontal: 5, paddingTop: 8 },
  option: { alignItems: 'center', flexDirection: 'row', minHeight: 43, paddingHorizontal: 8 },
  optionText: { color: '#506795', flex: 1, fontSize: 14, fontWeight: '600' },
  optionTextSelected: { color: '#071B49', fontWeight: '800' },
});
