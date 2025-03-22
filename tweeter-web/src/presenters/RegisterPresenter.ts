import { UserService } from "../model/service/UserService";
import { AuthPresenter, AuthSubmissionData } from "./AuthPresenter";

export interface RegistrationData extends AuthSubmissionData {
  firstName: string;
  lastName: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
}

export class RegisterPresenter extends AuthPresenter<
  UserService,
  RegistrationData
> {
  protected createService() {
    return new UserService();
  }

  protected async handleAuthSubmission(
    submitData: RegistrationData,
    rememberMe: boolean
  ): Promise<void> {
    const [user, authToken] = await this.service.register(
      submitData.firstName,
      submitData.lastName,
      submitData.alias,
      submitData.password,
      submitData.imageBytes,
      submitData.imageFileExtension
    );

    this.view.updateUserInfo(user, user, authToken, rememberMe);
  }
}
