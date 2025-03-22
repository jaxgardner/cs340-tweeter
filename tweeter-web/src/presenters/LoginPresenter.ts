import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthSubmissionData } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<
  UserService,
  AuthSubmissionData
> {
  protected createService() {
    return new UserService();
  }

  protected async handleAuthSubmission(
    submitData: AuthSubmissionData,
    rememberMe: boolean
  ): Promise<void> {
    const [user, authToken] = await this.service.login(
      submitData.alias,
      submitData.password
    );

    this.view.updateUserInfo(user, user, authToken, rememberMe);
  }
}
