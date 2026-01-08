import { authApi } from './auth.api';
import { employeeApi } from './employee.api';
import { adminApi } from './admin.api';

export const api = {
  ...authApi,
  ...employeeApi,
  ...adminApi
};