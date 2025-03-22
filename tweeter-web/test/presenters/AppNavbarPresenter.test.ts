import { instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import {
  AppNavbarPresenter,
  AppNavView,
} from "../../src/presenters/AppNavbarPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavView>();
    const mockViewInstance = instance(mockAppNavbarPresenterView);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockViewInstance));
    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
    appNavbarPresenter = instance(appNavbarPresenterSpy);
  });

  it("should tell the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(
      mockAppNavbarPresenterView.displayInfoMessage("Logging out...", 0)
    ).once();
  });

  it("should call logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockUserService.logout(authToken)).once();
  });

  it("should tell the view to clear the last info message and navigate to the login page", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
  });

  it("should tell the view to display an error message if the logout operation fails", async () => {
    const error = new Error("Failed to log out");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(
      mockAppNavbarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      )
    ).once();

    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
  });
});
