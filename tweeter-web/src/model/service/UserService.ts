import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const userData = await this.serverFacade.getUser({
      token: authToken.token,
      alias: alias,
    });

    return User.fromDto(userData.user);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout({ token: authToken.token });
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const userResponse = await this.serverFacade.login({
      alias: alias,
      password: password,
    });

    if (userResponse === null) {
      throw new Error("Invalid alias or password");
    }

    const user = User.fromDto(userResponse.user);

    return [user!, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64 = Buffer.from(userImageBytes);

    const userData = await this.serverFacade.register({
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    });

    if (userData === null) {
      throw new Error("Invalid registration");
    }

    const user = User.fromDto(userData.user);

    return [user!, FakeData.instance.authToken];
  }
}
