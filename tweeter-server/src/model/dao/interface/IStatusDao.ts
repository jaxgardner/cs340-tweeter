import { StatusDto } from "tweeter-shared";

export interface IStatusDao {
  loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(
    postingUserAlias: string,
    newStatus: StatusDto,
    followingAliases: string[]
  ): Promise<void>;
}

export interface IStatusDaoFactory {
  createStatusDao(): IStatusDao;
}
