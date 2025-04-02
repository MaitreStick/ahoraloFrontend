import {ahoraloApi} from '../../config/api/ahoraloApi';
import {openComposer} from 'react-native-email-link';

interface ExportAuditLogsParams {
  format: 'csv' | 'json';
  user?: string;
  action?: string;
}

export const exportAuditLogs = async ({
  format,
  user = '',
  action = '',
}: ExportAuditLogsParams): Promise<void> => {
  try {
    const {data} = await ahoraloApi.get('/audit-logs/export', {
      params: {format, user, action},
    });

    let emailBody = '';
    if (format === 'csv') {
      emailBody = `ID,Usuario,Acción,IP,Fecha\n${data}`;
    } else if (format === 'json') {
      emailBody = JSON.stringify(data, null, 2);
    }

    await openComposer({
      to: 'test@gmail.com',
      subject: `Registros de auditoría (${format.toUpperCase()})`,
      body: `Registros de auditoría en formato ${format.toUpperCase()}:\n\n${emailBody}`,
    });
  } catch (error) {
    console.error('Error exporting audit logs:', error);
  }
};
