import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SelectionSheet } from '@/components/dispositivos/SelectionSheet';

export type ComponentIssue = {
  id: string;
  title: string;
  description: string;
};

type ComponentIssueSheetProps = {
  componentDescription: string;
  componentLabel: string;
  issueId?: string;
  issues: ComponentIssue[];
  onClose: () => void;
  onConfirm: (issueId: string) => void;
  visible: boolean;
};

const MODULE_ISSUES: ComponentIssue[] = [
  {
    id: 'sin-imagen',
    title: 'Sin imagen',
    description: 'El celular parece encender, pero la pantalla permanece negra o no muestra imagen.',
  },
  {
    id: 'vidrio-roto',
    title: 'Vidrio roto, imagen visible',
    description: 'El cristal está quebrado, pero la pantalla todavía muestra imagen.',
  },
  {
    id: 'tactil-sin-respuesta',
    title: 'Táctil sin respuesta',
    description: 'La imagen se ve correctamente, pero una parte o toda la pantalla no responde al tacto.',
  },
  {
    id: 'lineas-manchas',
    title: 'Líneas o manchas',
    description: 'La pantalla presenta líneas, manchas, zonas oscuras o píxeles visibles.',
  },
  {
    id: 'imagen-intermitente',
    title: 'Imagen intermitente',
    description: 'La pantalla aparece o desaparece de manera intermitente.',
  },
  {
    id: 'pantalla-estrellada',
    title: 'Pantalla físicamente destruida',
    description: 'El cristal o la estructura de la pantalla presentan daños severos.',
  },
];

export const COMPONENT_ISSUES: Record<string, ComponentIssue[]> = {
  modulo: MODULE_ISSUES,
  camara: [
    { id: 'no-abre', title: 'No abre la cámara', description: 'La aplicación no puede iniciar la cámara o muestra un error.' },
    { id: 'imagen-borrosa', title: 'Imagen borrosa', description: 'Las fotos o videos salen desenfocados aun con el lente limpio.' },
    { id: 'lente-roto', title: 'Lente roto', description: 'El vidrio que protege la cámara está rayado, roto o suelto.' },
    { id: 'flash-no-funciona', title: 'Flash no funciona', description: 'El flash no enciende al sacar fotos o usar la linterna.' },
  ],
  tapa: [
    { id: 'tapa-rota', title: 'Tapa rota o quebrada', description: 'La tapa trasera presenta grietas, golpes o partes faltantes.' },
    { id: 'tapa-suelta', title: 'Tapa suelta', description: 'La tapa no encastra correctamente o se despega del equipo.' },
    { id: 'tapa-rayada', title: 'Rayones visibles', description: 'La tapa tiene marcas estéticas visibles por uso o golpes.' },
  ],
  sim: [
    { id: 'no-lee-sim', title: 'No reconoce la SIM', description: 'El equipo no detecta la tarjeta SIM instalada.' },
    { id: 'sin-senal', title: 'Sin señal', description: 'La SIM está detectada, pero el teléfono no toma señal móvil.' },
    { id: 'bandeja-rota', title: 'Bandeja dañada', description: 'La bandeja SIM está rota, trabada o no cierra correctamente.' },
  ],
  bateria: [
    { id: 'no-carga', title: 'No carga', description: 'El porcentaje de batería no aumenta al conectar el cargador.' },
    { id: 'dura-poco', title: 'Dura poco', description: 'La batería se descarga mucho más rápido de lo esperado.' },
    { id: 'hinchada', title: 'Batería hinchada', description: 'La batería está inflada o provoca que la tapa se levante.' },
  ],
  carga: [
    { id: 'pin-no-carga', title: 'Pin de carga no funciona', description: 'El equipo no carga o necesita mover el cable para hacerlo.' },
    { id: 'carga-lenta', title: 'Carga lenta', description: 'El teléfono demora demasiado tiempo en completar la carga.' },
    { id: 'conector-suelto', title: 'Conector flojo', description: 'El cable no encastra bien o se desconecta con facilidad.' },
  ],
  botones: [
    { id: 'encendido-falla', title: 'Botón de encendido falla', description: 'El botón no responde, está hundido o requiere mucha presión.' },
    { id: 'volumen-falla', title: 'Botones de volumen fallan', description: 'Uno o ambos botones de volumen no responden correctamente.' },
    { id: 'boton-faltante', title: 'Botón faltante o roto', description: 'Falta una tecla física o presenta daño visible.' },
  ],
  audio: [
    { id: 'sin-audio', title: 'Sin audio', description: 'No se escucha sonido por el parlante del equipo.' },
    { id: 'audio-distorsionado', title: 'Audio distorsionado', description: 'El sonido se escucha bajo, entrecortado o con ruido.' },
    { id: 'microfono-falla', title: 'Micrófono no funciona', description: 'La otra persona no escucha la voz durante las llamadas.' },
  ],
  placa: [
    { id: 'no-enciende', title: 'No enciende', description: 'El equipo no muestra señales de encendido.' },
    { id: 'se-reinicia', title: 'Se reinicia solo', description: 'El teléfono se apaga o reinicia sin intervención.' },
    { id: 'humedad', title: 'Daño por humedad', description: 'Hay señales de corrosión o contacto con líquido.' },
  ],
};

export function ComponentIssueSheet({
  componentDescription,
  componentLabel,
  issueId,
  issues,
  onClose,
  onConfirm,
  visible,
}: ComponentIssueSheetProps) {
  const [temporaryIssueId, setTemporaryIssueId] = useState(issueId);

  return (
    <SelectionSheet
      closeLabel={`Cerrar selector de fallas de ${componentLabel}`}
      description={componentDescription}
      footer={(
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.86}
          disabled={!temporaryIssueId}
          onPress={() => temporaryIssueId && onConfirm(temporaryIssueId)}
          style={[styles.confirmButton, !temporaryIssueId && styles.confirmButtonDisabled]}
        >
          <Text style={styles.confirmButtonText}>Agregar 1 falla</Text>
        </TouchableOpacity>
      )}
      onClose={onClose}
      title={`Estado de ${componentLabel.toLowerCase()}`}
      visible={visible}
    >
      <ScrollView
        contentContainerStyle={styles.options}
        showsVerticalScrollIndicator={false}
        style={styles.optionsScroll}
      >
        {issues.map((issue) => {
              const isSelected = temporaryIssueId === issue.id;
              return (
                <TouchableOpacity
                  key={issue.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  activeOpacity={0.82}
                  onPress={() => setTemporaryIssueId(issue.id)}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <View style={styles.preview}>
                    <Image
                      source={require('@/assets/images/phone-preview-a03.png')}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>{issue.title}</Text>
                    <Text style={styles.optionDescription}>{issue.description}</Text>
                  </View>
                  <Ionicons
                    color={isSelected ? '#168FD3' : '#9AB8D2'}
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                  />
                </TouchableOpacity>
              );
        })}
      </ScrollView>
    </SelectionSheet>
  );
}

const styles = StyleSheet.create({
  optionsScroll: { flexShrink: 1 },
  options: { gap: 6, paddingBottom: 9, paddingTop: 9 },
  option: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E0EDF6', borderRadius: 10, borderWidth: 1, flexDirection: 'row', height: 50, paddingHorizontal: 8, paddingVertical: 5 },
  optionSelected: { backgroundColor: '#F1FAFF', borderColor: '#2BA9EE', borderWidth: 1.5 },
  preview: { alignItems: 'center', backgroundColor: '#EDF5FB', borderRadius: 7, height: 40, justifyContent: 'center', marginRight: 8, overflow: 'hidden', width: 32 },
  previewImage: { height: 38, width: 27 },
  optionCopy: { flex: 1, paddingRight: 8 },
  optionTitle: { color: '#263746', fontSize: 10.5, fontWeight: '800', marginBottom: 1 },
  optionDescription: { color: '#718398', fontSize: 8, lineHeight: 10 },
  confirmButton: { alignItems: 'center', backgroundColor: '#2C9FDC', borderRadius: 18, height: 36, justifyContent: 'center', marginBottom: 3 },
  confirmButtonDisabled: { backgroundColor: '#B8DDEC' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
