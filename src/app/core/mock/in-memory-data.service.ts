import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    return {
      users: [
        { id: 1, username: 'admin', password: '1234', role: 'ADMIN' }
      ]
    };
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.req.url.includes('/login')) {

      const body = reqInfo.utils.getJsonBody(reqInfo.req);
      const { username, password } = body;

      const user = this.createDb().users.find(
        (u: any) =>
          u.username === username &&
          u.password === password
      );

      if (user) {
        return reqInfo.utils.createResponse$(() => ({
          status: 200,
          body: {
            token: 'fake-jwt-token',
            role: user.role
          }
        }));
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 401,
        body: { message: 'Invalid credentials' }
      }));
    }

    return undefined;
  }
}