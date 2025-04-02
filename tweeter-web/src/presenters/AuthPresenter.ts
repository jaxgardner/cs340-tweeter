import { AuthToken, User } from "tweeter-shared";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface AuthSubmissionData {
  alias: string;
  password: string;
  afterLink: string;
}

export interface AuthView extends LoadingView {
  updateUserInfo(
    user: User,
    displayUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ): void;
  navigate: (url: string) => void;
}

export abstract class AuthPresenter<
  Service,
  SubmitData extends AuthSubmissionData
> extends LoadingPresenter<AuthView, Service> {
  public doAuthSubmission(
    submitData: SubmitData,
    rememberMe: boolean,
    message: string
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        await this.handleAuthSubmission(submitData, rememberMe);
        this.view.navigate(submitData.afterLink);
      },
      message,
      () => {
        this.isLoading = false;
      }
    );
  }

  protected abstract handleAuthSubmission(
    submitData: SubmitData,
    rememberMe: boolean
  ): Promise<void>;
}
