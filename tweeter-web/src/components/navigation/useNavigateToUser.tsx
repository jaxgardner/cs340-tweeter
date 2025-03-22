import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "../userInfo/useUserInfo";
import useToastListener from "../toaster/ToastListenerHook";
import { UserService } from "../../model/service/UserService";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useNavigateToUser = (): UserNavigation => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();
  const userService = new UserService();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return {
    navigateToUser,
  };
};

export default useNavigateToUser;
