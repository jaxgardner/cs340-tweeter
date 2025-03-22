import { TweeterResponse } from "./TweeterResponse";

export interface UserCountResponse extends TweeterResponse {
  followerCount: number;
  followeeCount: number;
}
