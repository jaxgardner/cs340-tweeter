import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IStatusDao } from "../interface/IStatusDao";
import { StatusDto } from "tweeter-shared";

export class StatusDao implements IStatusDao {
  private dynamoDbClient: DynamoDBDocumentClient;

  constructor() {
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: "Feeds",
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { alias: userAlias, post: lastItem.post }
        : undefined,
    };

    const data = await this.dynamoDbClient.send(new QueryCommand(params));
    const items = data.Items as StatusDto[];
    const hasMore = items.length === pageSize;

    return [items, hasMore];
  }

  async loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params = {
      TableName: "Statuses",
      KeyConditionExpression: "alias = :alias",
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem
        ? { alias: userAlias, post: lastItem.post }
        : undefined,
    };

    const data = await this.dynamoDbClient.send(new QueryCommand(params));
    if (!data.Items) {
      return [[], false];
    }
    const items = data.Items?.map(
      (item) =>
        ({
          post: item.post,
          user: item.user,
          timestamp: item.timestamp,
        } as StatusDto)
    );
    const hasMore = items.length === pageSize;

    return [items, hasMore];
  }

  async postStatus(
    postingAlias: string,
    newStatus: StatusDto,
    aliasesFollowing: string[]
  ): Promise<void> {
    const params = {
      TableName: "Statuses",
      Item: {
        alias: postingAlias,
        ...newStatus,
      },
    };

    await this.dynamoDbClient.send(new PutCommand(params));

    const feedItems = aliasesFollowing.map((alias) => ({
      PutRequest: {
        Item: {
          alias: alias,
          ...newStatus,
        },
      },
    }));

    const batchParams = {
      RequestItems: {
        Feeds: feedItems,
      },
    };

    await this.dynamoDbClient.send(new BatchWriteCommand(batchParams));
  }
}
