import { IStatusDao, IStatusDaoFactory } from "../interface/IStatusDao";
import { StatusDao } from "./StatusDao";

export class StatusDaoFactory implements IStatusDaoFactory {
  public createStatusDao(): IStatusDao {
    return new StatusDao();
  }
}
