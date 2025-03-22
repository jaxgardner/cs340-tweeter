import { StatusService } from "./StatusService";
import { AuthToken, Status } from "tweeter-shared";
import "isomorphic-fetch";

describe("StatusService Integration Test", () => {
  let statusService: StatusService;
  let authToken: AuthToken;
  let userAlias: string;
  let pageSize: number;
  let lastItem: Status | null;

  beforeEach(() => {
    statusService = new StatusService();
    authToken = new AuthToken("test", 2000);
    userAlias = "testUser";
    pageSize = 10;
    lastItem = null;
  });

  it("should return a user's story pages successfully", async () => {
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );

    expect(statuses).toBeInstanceOf(Array);
    expect(statuses.length).toBeLessThanOrEqual(pageSize);
    expect(typeof hasMore).toBe("boolean");

    if (statuses.length > 0) {
      expect(statuses[0]).toBeInstanceOf(Status);
    }
  });
});
