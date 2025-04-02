import {ahoraloApi} from '../../config/api/ahoraloApi';
import {AuditLog} from '../../infrastructure/interfaces/audit.response';

interface FetchAuditLogsParams {
  user?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export const fetchAuditLogs = async ({
  user = '',
  action = '',
  page = 0,
  limit = 10,
}: FetchAuditLogsParams): Promise<AuditLog[]> => {
  try {
    const offset = page * limit;
    const {data} = await ahoraloApi.get<AuditLog[]>('/audit-logs', {
      params: {user, action, offset, limit},
    });
    return data;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};
