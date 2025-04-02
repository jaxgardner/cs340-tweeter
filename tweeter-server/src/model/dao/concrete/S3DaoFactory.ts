import { IS3Dao, IS3DaoFactory } from "../interface/IS3Dao";
import { S3Dao } from "./S3Dao";

export class S3DaoFactory implements IS3DaoFactory {
  private readonly bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  public createS3Dao(): IS3Dao {
    return new S3Dao(this.bucketName);
  }
}
