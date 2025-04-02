import { IUserDao, IUserDaoFactory } from "../interface/IUserDao";
import { UserDao } from "./UserDao";

export class UserDaoFactory implements IUserDaoFactory {
  createUserDao(): IUserDao {
    return new UserDao();
  }
}
