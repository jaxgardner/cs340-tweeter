import { ServerFacade } from "./ServerFacade";
import {
  RegisterRequest,
  LoginResponse,
  PagedUserItemRequest,
  GetFollowsCountRequest,
} from "tweeter-shared";
import "isomorphic-fetch";
import { Buffer } from "buffer";

describe("ServerFacade Integration Tests", () => {
  const serverFacade = new ServerFacade();

  test("register test", async () => {
    const request: RegisterRequest = {
      alias: "testuser",
      password: "password",
      firstName: "Test",
      lastName: "User",
      userImageBytes: Buffer.from(new Uint8Array([0, 1, 2, 3])), // Convert to Buffer
      imageFileExtension: "png",
    };

    const response: LoginResponse = await serverFacade.register(request);

    expect(response.success).toBe(true);
    expect(response.user).toBeDefined();
    expect(response.user.alias).toBe("@allen");
  });

  test("getMoreFollowers test", async () => {
    const request: PagedUserItemRequest = {
      requestingAlias: "testuser",
      token: "testtoken",
      userAlias: "testuser",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(followers).toBeDefined();
    expect(Array.isArray(followers)).toBe(true);
    expect(hasMore).toBeDefined();
    expect(typeof hasMore).toBe("boolean");
  });

  test("getFolloweeCount", async () => {
    const request: GetFollowsCountRequest = {
      requestingAlias: "testuser",
      token: "testtoken",
      userAlias: "testuser",
    };

    const count = await serverFacade.getFolloweeCount(request);

    expect(count).toBeDefined();
    expect(typeof count).toBe("number");
  });
});
