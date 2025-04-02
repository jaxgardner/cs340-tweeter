import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { IS3Dao } from "../interface/IS3Dao";

export class S3Dao implements IS3Dao {
  private readonly region = "us-east-1";
  private readonly client = new S3Client({ region: this.region });
  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public async uploadFile(
    key: string,
    fileContent: Buffer,
    contentType: string
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    };

    await this.client.send(new PutObjectCommand(params));
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  public async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    await this.client.send(new DeleteObjectCommand(params));
  }
}
