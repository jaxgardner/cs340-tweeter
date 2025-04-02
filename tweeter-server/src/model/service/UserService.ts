import { Buffer } from "buffer";
import bcrypt from "bcryptjs";
import { AuthToken, User, UserDto } from "tweeter-shared";
import { IUserDao, IUserDaoFactory } from "../dao/interface/IUserDao";
import { IS3Dao } from "../dao/interface/IS3Dao";

export class UserService {
  private readonly userDao: IUserDao;

  constructor(userDaoFactory: IUserDaoFactory) {
    this.userDao = userDaoFactory.createUserDao();
  }

  public async verifyAuthToken(
    requestingAlias: string,
    token: string
  ): Promise<boolean> {
    const requestingUser = await this.userDao.getUser(requestingAlias);
    if (requestingUser === null) {
      throw new Error("Bad Request Invalid token");
    }
    const authToken = AuthToken.fromJson(requestingUser.authToken);

    if (authToken?.token !== token) {
      throw new Error("Bad Request Invalid token", requestingUser.authToken);
    }
    const currentTime = Date.now();
    if (currentTime - authToken.timestamp > requestingUser.expirationTime) {
      throw new Error("Bad Request Token has expired");
    }

    return true;
  }

  public async getUser(alias: string): Promise<UserDto | null> {
    try {
      const userData = await this.userDao.getUser(alias);

      const user = new User(
        userData.firstName,
        userData.lastName,
        userData.alias,
        userData.imageUrl
      );

      return user?.dto ?? null;
    } catch (error) {
      throw new Error("Server Error Failed to get user", error as Error);
    }
  }

  public async logout(alias: string): Promise<void> {
    await this.userDao.setAuthToken(alias, "", 0);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthToken]> {
    const formattedAlias = alias.startsWith("@") ? alias : "@" + alias;
    let userData: Record<string, any> | null = null;
    try {
      userData = await this.userDao.getUser(formattedAlias);
    } catch (error) {
      throw new Error("Bad Request Failed to get user", error as Error);
    }
    if (userData === null) {
      throw new Error("Bad Request Invalid alias or password");
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("Bad Request Invalid alias or password");
    }
    const authToken = AuthToken.Generate();
    const expirationTime = 60 * 60 * 1000;
    try {
      await this.userDao.setAuthToken(
        formattedAlias,
        authToken.toJson(),
        expirationTime
      );
    } catch (error) {
      throw new Error("Server Error Failed to set auth token", error as Error);
    }

    const user = new User(
      userData.firstName,
      userData.lastName,
      formattedAlias,
      userData.imageUrl
    );

    return [user.dto, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
    s3Dao: IS3Dao
  ): Promise<[UserDto, AuthToken]> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const imageFileName = `${alias}.${imageFileExtension}`;
    const imageContentType = `image/${imageFileExtension}`;
    const imageKey = `user-images/${imageFileName}`;
    const imageBuffer = Buffer.from(userImageBytes);
    let imageUrl: string;
    try {
      imageUrl = await s3Dao.uploadFile(
        imageKey,
        imageBuffer,
        imageContentType
      );
    } catch (error) {
      throw new Error(
        "Server Error Failed to upload image to S3",
        error as Error
      );
    }

    const formattedAlias = alias.startsWith("@") ? alias : "@" + alias;
    const authToken = AuthToken.Generate();
    const expirationTime = 60 * 60 * 1000;
    try {
      const newUser = await this.userDao.register(
        firstName,
        lastName,
        formattedAlias,
        hashedPassword,
        imageUrl,
        authToken.toJson(),
        expirationTime
      );

      return [newUser, authToken];
    } catch (error) {
      throw new Error("Server Error Failed to register user", error as Error);
    }
  }
}
