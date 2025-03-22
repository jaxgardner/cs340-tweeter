import { TweeterRequest } from "./TweeterRequest";

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  userAlias: string;
  selectedUserAlias: string;
}
