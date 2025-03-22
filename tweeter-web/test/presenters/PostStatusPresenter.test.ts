import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { LoadingView } from "../../src/presenters/LoadingPresenter";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);

    mockService = mock<StatusService>();
    const mockServiceInstance = instance(mockService);

    // Create a real instance of PostStatusPresenter
    postStatusPresenter = new PostStatusPresenter(mockViewInstance);

    // Manually inject the mocked service (if `service` is a private property)
    (postStatusPresenter as any)._service = mockServiceInstance;
  });

  it("should display a posting status message", async () => {
    await postStatusPresenter.submitPost(null, authToken, "Hello, world!");

    verify(mockView.displayInfoMessage!("Posting status...", 0)).once();
  });

  it("should call status service to post the status", async () => {
    await postStatusPresenter.submitPost(null, authToken, "Hello, world!");

    verify(mockService.postStatus(authToken, anything())).once();
  });

  it("should clear the last info message and display a status posted message", async () => {
    when(mockService.postStatus(anything(), anything())).thenResolve();

    await postStatusPresenter.submitPost(
      new User("jaxon", "gardner", "jax", ""),
      authToken,
      "Hello, world!"
    );

    verify(mockView.displayInfoMessage!("Status posted!", 2000)).once();
    verify(mockView.setPost("")).never;

    await new Promise((resolve) => setTimeout(resolve, 10));

    verify(mockView.clearLastInfoMessage!()).once();
  });

  it("should display an error message if the post status operation fails", async () => {
    const error = new Error("Failed to post status");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(null, authToken, "Hello, world!");

    verify(
      mockView.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      )
    ).once();

    await new Promise((resolve) => setTimeout(resolve, 10));

    verify(mockView.clearLastInfoMessage!()).once();

    verify(mockView.setPost("")).never;
    verify(mockView.displayInfoMessage!("Status posted!", 2000)).never;
  });
});
