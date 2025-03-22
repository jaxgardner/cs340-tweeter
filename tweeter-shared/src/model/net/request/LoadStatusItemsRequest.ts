import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface LoadStatusItemsRequest extends TweeterRequest {
  userAlias: string;
  pageSize: number;
  lastItem: StatusDto | null;
}
