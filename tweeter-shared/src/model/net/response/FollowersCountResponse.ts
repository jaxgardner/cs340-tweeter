import { TweeterResponse } from "./TweeterResponse";

export interface FollowsCountResponse extends TweeterResponse {
  count: number;
}
