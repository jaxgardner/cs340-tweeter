import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../components/authenticationField";
import useUserInfo from "../../userInfo/useUserInfo";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthView } from "../../../presenters/AuthPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: AuthView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.doAuthSubmission(
        { alias, password, afterLink: "/" },
        rememberMe,
        "login user"
      );
    }
  };

  const view: AuthView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const [presenter] = useState(props.presenterGenerator(view));

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields
        onKeyDown={loginOnEnter}
        setPassword={setPassword}
        setAlias={setAlias}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={() =>
        presenter.doAuthSubmission(
          { alias, password, afterLink: "/" },
          rememberMe,
          "login user"
        )
      }
    />
  );
};

export default Login;
