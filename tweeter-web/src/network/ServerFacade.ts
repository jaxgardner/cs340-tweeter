import {
  FollowRequest,
  FollowsCountResponse,
  GetFollowsCountRequest,
  GetIsFollowerStatusRequest,
  GetUserRequest,
  GetUserResponse,
  IsFollowerStatusResponse,
  LoadStatusItemsRequest,
  LoginRequest,
  LoginResponse,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  UnfollowRequest,
  User,
  UserCountResponse,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://1vtvxgs2u7.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      IsFollowerStatusResponse
    >(request, "/is-follower-status");

    // Handle errors
    if (response.success) {
      if (response == null) {
        throw new Error(`No status found`);
      } else {
        return response.isFollower;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getFolloweeCount(
    request: GetFollowsCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowsCountRequest,
      FollowsCountResponse
    >(request, "/followee/count");

    // Handle errors
    if (response.success) {
      if (response == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getFollowerCount(
    request: GetFollowsCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowsCountRequest,
      FollowsCountResponse
    >(request, "/follower/count");

    // Handle errors
    if (response.success) {
      if (response == null) {
        throw new Error(`No count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async follow(request: FollowRequest): Promise<UserCountResponse> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      UserCountResponse
    >(request, "/follow");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to follow`);
      } else {
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async unfollow(request: UnfollowRequest): Promise<UserCountResponse> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UserCountResponse
    >(request, "/unfollow");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to unfollow`);
      } else {
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreStoryItems(
    request: LoadStatusItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      LoadStatusItemsRequest,
      PagedStatusItemResponse
    >(request, "/story-items");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreFeedItems(
    request: LoadStatusItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      LoadStatusItemsRequest,
      PagedStatusItemResponse
    >(request, "/feed-items");

    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/post-status");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to post status`);
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/user-info");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to get user data`);
      } else {
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async logout(request: TweeterRequest): Promise<void> {
    await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(
      request,
      "/user/logout"
    );
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to login`);
      } else {
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async register(request: RegisterRequest): Promise<LoginResponse> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/user/register");

    if (response.success) {
      if (response == null) {
        throw new Error(`Unable to register`);
      } else {
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }
}
