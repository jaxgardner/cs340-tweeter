export interface View {
  displayErrorMessage: (message: string) => void;
}

export abstract class Presenter<V extends View, Service> {
  private _view: V;
  private _service: Service;

  public constructor(view: V) {
    this._view = view;
    this._service = this.createService();
  }

  protected abstract createService(): Service;

  public get service() {
    return this._service;
  }

  protected get view() {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: () => Promise<any>,
    operationDescription: string,
    finallyOperation: () => void | null
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      console.log("GETTING ERROR");
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (finallyOperation) {
        finallyOperation();
      }
    }
  }
}
