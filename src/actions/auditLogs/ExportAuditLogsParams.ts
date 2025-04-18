import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { ahoraloApi } from '../../config/api/ahoraloApi';

interface ExportAuditLogsParams {
  format: 'html' | 'csv' | 'json';
  user?: string;
  action?: string;
}

export const exportAuditLogs = async ({
  format,
  user = '',
  action = '',
}: ExportAuditLogsParams): Promise<void> => {
  try {
    const response = await ahoraloApi.get('/audit-logs/export', {
      params: { format, user, action },
    });

    const csvString = response.data;
    if (typeof csvString !== 'string' || !csvString.includes(',')) {
      console.error('No parece ser un CSV válido:', csvString);
      return;
    }

    const fileName = 'audit-report.csv';
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    await RNFS.writeFile(filePath, csvString, 'utf8');

    await Share.open({
      title: 'Enviar Informe de Auditoría',
      message: 'Te comparto el informe de auditoría en formato CSV',
      url: 'file://' + filePath,
      type: 'text/csv',
      subject: 'Informe de Auditoría',
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
  }
};