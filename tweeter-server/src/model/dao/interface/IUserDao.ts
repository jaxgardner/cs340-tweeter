export interface IUserDao {
  setAuthToken(
    alias: string,
    authToken: string,
    expirationTime: number
  ): Promise<void>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    authToken: string,
    expirationTime: number
  ): Promise<any>;
  getUser(alias: string): Promise<any>;
}

export interface IUserDaoFactory {
  createUserDao(): IUserDao;
}
