import { Presenter, View } from "./Presenter";

export interface LoadingView extends View {
  displayInfoMessage?: (message: string, time: number) => void;
  clearLastInfoMessage?: () => void;
}

export abstract class LoadingPresenter<
  V extends View,
  Service
> extends Presenter<V, Service> {
  private _isLoading: boolean = false;

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
