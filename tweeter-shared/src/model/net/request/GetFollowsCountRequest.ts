import { TweeterRequest } from "./TweeterRequest";

export interface GetFollowsCountRequest extends TweeterRequest {
  userAlias: string;
}
