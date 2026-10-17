import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { Colors } from '@/constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export const ProyectosSearch = ({ value, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por modelo o número..."
        value={value}
        onChangeText={onChangeText}
        style={styles.searchbar}
        inputStyle={styles.input}
        iconColor={Colors.textSecondary}
        placeholderTextColor={Colors.textSecondary}
        elevation={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchbar: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 46,
  },
  input: {
    fontSize: 14,
    color: Colors.textMain,
    alignSelf: 'center',
  },
});
