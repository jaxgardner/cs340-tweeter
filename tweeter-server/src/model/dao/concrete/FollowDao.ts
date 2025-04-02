import {
  DeleteCommand,
  DynamoDBDocumentClient,
  QueryCommandInput,
  QueryCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { IFollowsDao } from "../interface/IFollowsDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PagedUserItemResponse, UserDto } from "tweeter-shared";

export class FollowDao implements IFollowsDao {
  private dynamoDbClient: DynamoDBDocumentClient;
  private tableName: string;
  readonly indexName = "follower_handle";
  readonly followerAttr = "follower_handle";
  readonly followeeAttr = "followee_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeNameAttr = "followee_name";

  constructor() {
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient());
    this.tableName = "follows";
  }

  public async getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<PagedUserItemResponse> {
    const followsParams: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "follows_index",
      KeyConditionExpression: `${this.followeeAttr} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFollowerHandle
        ? {
            [this.followerAttr]: lastFollowerHandle,
            [this.followeeAttr]: userAlias,
          }
        : undefined,
    };

    const followsOutput = await this.dynamoDbClient.send(
      new QueryCommand(followsParams)
    );

    const items = (followsOutput.Items || []).map((item) => ({
      firstName: item["follower_first_name"] || "",
      lastName: item["follower_last_name"] || "",
      alias: item["follower_handle"] || "",
      imageUrl: item["follower_image_url"] || "",
    }));

    return {
      items,
      hasMore: !!followsOutput.LastEvaluatedKey,
      success: true,
      message: "",
    };
  }

  public async getPageOfFollowing(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<PagedUserItemResponse> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttr} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": followerHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFolloweeHandle
        ? {
            [this.followerAttr]: followerHandle,
            [this.followeeAttr]: lastFolloweeHandle,
          }
        : undefined,
    };

    const output = await this.dynamoDbClient.send(new QueryCommand(params));
    const items = (output.Items || []).map((item) => ({
      firstName: item["followee_first_name"] || "",
      lastName: item["followee_last_name"] || "",
      alias: item["followee_handle"] || "",
      imageUrl: item["followee_image_url"] || "",
    }));

    const hasMore = !!output.LastEvaluatedKey;

    return { items, hasMore, success: true, message: "" };
  }

  public async unfollow(requestingAlias: string, unfollowAlias: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: requestingAlias,
        [this.followeeAttr]: unfollowAlias,
      },
    };
    await this.dynamoDbClient.send(new DeleteCommand(params));
  }

  public async addFollower(
    requestingUserData: UserDto,
    userToFollowData: UserDto
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: requestingUserData.alias,
        [this.followeeAttr]: userToFollowData.alias,
        follower_first_name: requestingUserData.firstName,
        follower_last_name: requestingUserData.lastName,
        follower_image_url: requestingUserData.imageUrl,
        followee_first_name: userToFollowData.firstName,
        followee_last_name: userToFollowData.lastName,
        followee_image_url: userToFollowData.imageUrl,
      },
    };
    await this.dynamoDbClient.send(new PutCommand(params));
  }

  public async isFollowing(
    requestingAlias: string,
    maybeIsFollowingAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttr} = :follower_handle AND ${this.followeeAttr} = :followee_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": requestingAlias,
        ":followee_handle": maybeIsFollowingAlias,
      },
      Limit: 1,
    };

    const output = await this.dynamoDbClient.send(new QueryCommand(params));
    return !!output.Items?.length;
  }

  public async getFollowersCount(userAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: "follows_index",
      KeyConditionExpression: `${this.followeeAttr} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": userAlias,
      },
    };

    const output = await this.dynamoDbClient.send(new QueryCommand(params));
    return output.Count || 0;
  }

  public async getFollowingCount(userAlias: string): Promise<number> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttr} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": userAlias,
      },
    };

    const output = await this.dynamoDbClient.send(new QueryCommand(params));
    return output.Count || 0;
  }
}
