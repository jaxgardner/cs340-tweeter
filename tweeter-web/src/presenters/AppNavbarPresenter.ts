import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavView extends View {
  clearUserInfo: () => void;
  clearLastInfoMessage: () => void;
  displayInfoMessage: (message: string, duration: number) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavView, UserService> {
  protected createService() {
    return new UserService();
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    this.view.displayInfoMessage("Logging out...", 0);

    await this.doFailureReportingOperation(
      async () => {
        await this.service.logout(authToken);

        this.view.clearLastInfoMessage();
        this.view.clearUserInfo();
      },
      "log user out",
      () => null
    );
  }
}
