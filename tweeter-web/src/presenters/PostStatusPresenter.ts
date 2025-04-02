import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface PostStatusView extends LoadingView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends LoadingPresenter<
  PostStatusView,
  StatusService
> {
  protected createService() {
    return new StatusService();
  }

  public async submitPost(
    currentUser: User | null,
    authToken: AuthToken,
    post: string
  ): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage!("Posting status...", 0);

        const status = new Status(post, currentUser!, Date.now());

        await this.service.postStatus(currentUser!.alias, authToken, status);

        this.view.displayInfoMessage!("Status posted!", 2000);
        this.view.setPost("");
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage!();
        this.isLoading = false;
      }
    );
  }
}
