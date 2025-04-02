import { IUserDao } from "../interface/IUserDao";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UserDao implements IUserDao {
  private dynamoDbClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient());
    this.tableName = "Users";
  }

  async setAuthToken(
    alias: string,
    authToken: string,
    expirationTime: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        alias: alias,
      },
      UpdateExpression:
        "SET authToken = :authToken, expirationTime = :expirationTime",
      ExpressionAttributeValues: {
        ":authToken": authToken,
        ":expirationTime": expirationTime,
      },
    };

    await this.dynamoDbClient.send(new UpdateCommand(params));
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    authToken: string,
    expirationTime: number
  ): Promise<any> {
    const params = {
      TableName: this.tableName,
      Item: {
        alias: alias,
        firstName: firstName,
        lastName: lastName,
        password: password,
        imageUrl: imageUrl,
        authToken: authToken,
        expirationTime: expirationTime,
      },
    };

    await this.dynamoDbClient.send(new PutCommand(params));
    return { alias, firstName, lastName, imageUrl };
  }

  async getUser(alias: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: {
        alias: alias,
      },
    };

    const result = await this.dynamoDbClient.send(new GetCommand(params));
    if (!result.Item) {
      throw new Error("Bad Request Failed to get user");
    }
    return result.Item;
  }
}
