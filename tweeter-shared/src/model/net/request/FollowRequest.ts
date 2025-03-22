import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest {
  userToFollowAlias: string;
}
