export interface IS3Dao {
  uploadFile(
    key: string,
    fileContent: Buffer,
    contentType: string
  ): Promise<string>;
  deleteFile(key: string): Promise<void>;
}

export interface IS3DaoFactory {
  createS3Dao(): IS3Dao;
}
