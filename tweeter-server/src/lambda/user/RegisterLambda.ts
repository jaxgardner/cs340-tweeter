import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { UserDaoFactory } from "../../model/dao/concrete/UserDaoFactory";
import { S3DaoFactory } from "../../model/dao/concrete/S3DaoFactory";

export const handler = async (
  request: RegisterRequest
): Promise<LoginResponse> => {
  const userDaoFactory = new UserDaoFactory();
  const s3DaoFactory = new S3DaoFactory("jax-cs340-tweeter-lambda");
  const userService = new UserService(userDaoFactory);
  try {
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension,
      s3DaoFactory.createS3Dao()
    );

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken.toJson(),
    };
  } catch (error) {
    throw error;
  }
};
