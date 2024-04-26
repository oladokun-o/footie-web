// API endpoints configuration
import { environment } from 'src/environments/environment';
/**
 * @description API endpoints
 */
export const ApiEndpoints = {
  auth: {
    login: {
      viaEmail: () => `${environment.apiUrl}/auth/loginWithEmail`,
      viaPhone: () => `${environment.apiUrl}/auth/loginWithPhone`,
      isAuthenticated: () => `${environment.apiUrl}/auth/validateToken`,
      logout: () => `${environment.apiUrl}/auth/logout`
    }
  },
  users: {
    getAll: () => `${environment.apiUrl}/users`
  }
}
