


export interface AuditLog {
    id: string;
    user_id: string;
    action: 'create' | 'update' | 'delete'; 
    old_value: any; 
    new_value: any; 
    ip_address: string;
    created_at: string; 
  }
  