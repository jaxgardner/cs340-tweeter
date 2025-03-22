import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import React from "react";
import useUserInfo from "../../../src/components/userInfo/useUserInfo";
import { AuthToken, User } from "tweeter-shared";
import "@testing-library/jest-dom";

jest.mock("../../../src/components/userInfo/useUserInfo", () => ({
  ...jest.requireActual("../../../src/components/userInfo/useUserInfo"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockPresenter: PostStatusPresenter;
  const mockUserInstance = new User("jax", "gardner", "jaxrocs", "image");
  const mockAuthTokenInstance = new AuthToken("token", Date.now());

  beforeEach(() => {
    mockPresenter = mock<PostStatusPresenter>();

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("should start with the post and clear buttons disabled", () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { postButton, clearButton } =
      renderPostStatusAndGetElements(presenterInstance);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should enable the post and clear buttons when the post is entered", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { postButton, postField, clearButton } =
      renderPostStatusAndGetElements(presenterInstance);

    await userEvent.type(postField, "This is a post");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("should disable the post and clear buttons when the post is empty", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const { postButton, postField, clearButton } =
      renderPostStatusAndGetElements(presenterInstance);

    await userEvent.type(postField, "This is a post");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await userEvent.clear(postField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should call submitPost when post button is clicked", async () => {
    const presenterInstance = instance(mockPresenter);
    presenterInstance.isLoading = false;

    const post = "This is a post";

    const { postButton, postField } =
      renderPostStatusAndGetElements(presenterInstance);

    await userEvent.type(postField, post);
    expect(postButton).toBeEnabled();

    await userEvent.click(postButton);
    verify(
      mockPresenter.submitPost(mockUserInstance, mockAuthTokenInstance, post)
    ).once();
  });
});

function renderPostStatusAndGetElements(presenter: PostStatusPresenter) {
  const user = userEvent.setup();

  const { getByTestId } = render(
    <PostStatus presenterGenerator={() => presenter} />
  );

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByLabelText("status-field");

  return { postButton, clearButton, postField };
}
