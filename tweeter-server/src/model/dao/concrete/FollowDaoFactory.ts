import { IFollowsDaoFactory } from "../interface/IFollowsDao";
import { FollowDao } from "./FollowDao";

export class FollowDaoFactory implements IFollowsDaoFactory {
  createFollowsDao(): any {
    return new FollowDao();
  }
}
