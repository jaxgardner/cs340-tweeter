import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/components/authentication/login/Login";
import React from "react";
import { LoginPresenter } from "../../../src/presenters/LoginPresenter";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  let mockPresenter: LoginPresenter;
  beforeEach(() => {
    mockPresenter = mock<LoginPresenter>();
  });

  it("should start with the sign in button disabled", () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { signInButton } = renderLoginAndGetElements("/", presenterInstance);
    expect(signInButton).toBeDisabled();
  });

  it("should enable the sign in button when the alias and password are entered", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/", presenterInstance);

    await userEvent.type(aliasField, "alias");
    await userEvent.type(passwordField, "password");

    expect(signInButton).toBeEnabled();
  });

  it("should disable the sign in button when either the alias or password are empty", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/", presenterInstance);

    await userEvent.type(aliasField, "alias");
    await userEvent.type(passwordField, "password");
    expect(signInButton).toBeEnabled();

    await userEvent.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await userEvent.type(aliasField, "alias");
    expect(signInButton).toBeEnabled();

    await userEvent.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("shouldc call login when sign in button is clicked", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const originalUrl = "http://someurl.com";
    const alias = "@SomeAlias";
    const password = "mypassword";

    const { signInButton, aliasField, passwordField } =
      renderLoginAndGetElements(originalUrl, presenterInstance);

    await userEvent.type(aliasField, alias);
    await userEvent.type(passwordField, password);

    await userEvent.click(signInButton);

    verify(
      mockPresenter.doAuthSubmission(
        { alias, password, afterLink: originalUrl },
        false,
        "login user"
      )
    ).once;
  });
});

const renderLogin = (originalUrl: string, presenter: LoginPresenter) => {
  return render(
    <MemoryRouter>
      <Login originalUrl={originalUrl} presenterGenerator={() => presenter} />
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField };
};
