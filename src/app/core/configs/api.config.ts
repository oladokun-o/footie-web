// API endpoints configuration
import { environment } from 'src/environments/environment';
/**
 * Configuration
 * @type {Object}
 * @description API endpoints
 */
export const ApiEndpoints: object = {
  auth: {
    login: {
      viaEmail: () => `${environment.apiUrl}/auth/loginWithEmail`
    }
  },
  users: {
    getAll: () => `${environment.apiUrl}/users`
  }
}
