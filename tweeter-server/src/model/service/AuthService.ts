import { UserService } from "./UserService";
import { UserDaoFactory } from "../dao/concrete/UserDaoFactory";

export class AuthService {
  private userService: UserService;

  constructor() {
    const userDaoFactory = new UserDaoFactory();
    this.userService = new UserService(userDaoFactory);
  }

  async verifyAuthToken(
    requestingAlias: string,
    token: string
  ): Promise<boolean> {
    return this.userService.verifyAuthToken(requestingAlias, token);
  }

  async handleAuthenticatedRequest<T>(
    requestingAlias: string,
    token: string,
    callback: () => Promise<T>
  ): Promise<T | undefined> {
    try {
      if (await this.verifyAuthToken(requestingAlias, token)) {
        return await callback();
      }
    } catch (error) {
      console.error("Error during authenticated request:", error);
      throw error;
    }
  }
}
