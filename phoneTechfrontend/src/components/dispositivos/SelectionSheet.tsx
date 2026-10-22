import React, { ReactNode } from 'react';
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type SelectionSheetProps = {
  children: ReactNode;
  closeLabel: string;
  description: string;
  footer: ReactNode;
  onClose: () => void;
  sheetStyle?: StyleProp<ViewStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  visible: boolean;
};

/** Base reutilizable para todos los selectores de la pantalla de diagnóstico. */
export function SelectionSheet({
  children,
  closeLabel,
  description,
  footer,
  onClose,
  sheetStyle,
  subtitleStyle,
  title,
  titleStyle,
  visible,
}: SelectionSheetProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        <TouchableOpacity
          accessibilityLabel={closeLabel}
          accessibilityRole="button"
          activeOpacity={1}
          onPress={onClose}
          style={styles.backdrop}
        />
        <SafeAreaView edges={['bottom']} style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={[styles.subtitle, subtitleStyle]}>{description}</Text>
          {children}
          {footer}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 20, 52, 0.52)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    maxHeight: '78%',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  handle: { alignSelf: 'center', backgroundColor: '#9BAAC9', borderRadius: 4, height: 5, marginBottom: 22, width: 59 },
  title: { color: Colors.analisis.title, fontSize: 25, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#566C9B', fontSize: 15, lineHeight: 20, marginTop: 4 },
});
