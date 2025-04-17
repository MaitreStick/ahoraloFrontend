import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {MainLayout} from '../../layouts/MainLayout';
import {exportAuditLogs} from '../../../actions/auditLogs/ExportAuditLogsParams';
import {fetchAuditLogs} from '../../../actions/auditLogs/FetchAuditLogsParams';
import {AuditLog} from '../../../infrastructure/interfaces/audit.response';
import {Input} from '@ui-kitten/components';
import {MyIcon} from '../../components/ui/MyIcon';
import {CustomAlert} from '../../components/ui/CustomAlert';

export const AuditLogsScreen = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({user: '', action: ''});
  const [selectedUserId, setSelectedUserId] = useState(
    'Seleccionar ID de Usuario',
  );
  const [selectedAction, setSelectedAction] = useState('Todas las acciones');
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const logsData = await fetchAuditLogs({...filters});
    setLogs(logsData);

    const uniqueUserIds = [...new Set(logsData.map(log => log.user_id))];
    setUserIds(uniqueUserIds);

    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadLogs();
  }, [filters, loadLogs]);

  const handleUserSelect = (userId: string) => {
    setFilters({...filters, user: userId});
    setSelectedUserId(userId === '' ? 'Seleccionar ID de Usuario' : userId);
    setShowUserModal(false);
  };

  const handleActionSelect = (action: string) => {
    setFilters({
      ...filters,
      action: action === 'Todas las acciones' ? '' : action,
    });
    setSelectedAction(action);
    setShowActionModal(false);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    await exportAuditLogs({format, ...filters});
    setAlertTitle('Éxito');
    setAlertMessage(
      'Registros exportados en formato ${format.toUpperCase()} y enviados por correo.',
    );
    setAlertVisible(true);
  };

  const toggleUserModal = useCallback(() => {
    setShowUserModal(prev => !prev);
  }, []);

  const toggleActionModal = useCallback(() => {
    setShowActionModal(prev => !prev);
  }, []);

  const renderItem = ({item}: {item: AuditLog}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.user_id}</Text>
      <Text style={styles.cell}>{item.action}</Text>
      <Text style={styles.cell}>
        {item.old_value ? JSON.stringify(item.old_value) : 'N/A'}
      </Text>
      <Text style={styles.cell}>
        {item.new_value ? JSON.stringify(item.new_value) : 'N/A'}
      </Text>
      <Text style={styles.cell}>{item.ip_address}</Text>
      <Text style={styles.cell}>{item.created_at}</Text>
    </View>
  );

  return (
    <MainLayout title="Generar Reporte">
      <Input
        style={styles.input}
        placeholder="Seleccionar ID de Usuario"
        disabled
        accessoryRight={() => (
          <TouchableOpacity onPress={toggleUserModal}>
            <MyIcon name="chevron-down-outline" />
          </TouchableOpacity>
        )}
      >
        {selectedUserId}
      </Input>

      <Input
        style={styles.input}
        placeholder="Seleccionar Acción"
        disabled
        accessoryRight={() => (
          <TouchableOpacity onPress={toggleActionModal}>
            <MyIcon name="chevron-down-outline" />
          </TouchableOpacity>
        )}
      >
        {selectedAction}
      </Input>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleExport('csv')}
        >
          <Text style={styles.buttonText}>Exportar CSV por Correo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleExport('json')}
        >
          <Text style={styles.buttonText}>Exportar JSON por Correo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>ID</Text>
            <Text style={styles.headerCell}>ID de Usuario</Text>
            <Text style={styles.headerCell}>Acción</Text>
            <Text style={styles.headerCell}>Valor Anterior</Text>
            <Text style={styles.headerCell}>Valor Actual</Text>
            <Text style={styles.headerCell}>IP</Text>
            <Text style={styles.headerCell}>Fecha</Text>
          </View>

          <FlatList
            data={logs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onRefresh={loadLogs}
            refreshing={loading}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No se encontraron registros de auditoría
              </Text>
            }
          />
        </View>
      </ScrollView>

      <Modal
        visible={showUserModal}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleUserModal}
      >
        <TouchableWithoutFeedback onPress={toggleUserModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
          </View>

          <FlatList
            data={userIds}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleUserSelect(item)}
                style={styles.modalItem}
              >
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleActionModal}
      >
        <TouchableWithoutFeedback onPress={toggleActionModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
          </View>

          {['Todas las acciones', 'create', 'update', 'delete'].map(action => (
            <TouchableOpacity
              key={action}
              onPress={() => handleActionSelect(action)}
              style={styles.modalItem}
            >
              <Text style={styles.modalText}>
                {action === 'Todas las acciones'
                  ? action
                  : action.charAt(0).toUpperCase() + action.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#343a40',
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerCell: {
    width: 120,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  cell: {
    width: 120,
    paddingHorizontal: 4,
    textAlign: 'center',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50%',
    minHeight: '25%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default AuditLogsScreen;
