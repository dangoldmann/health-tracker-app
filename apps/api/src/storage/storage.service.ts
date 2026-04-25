import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

import type { Environment } from '../config/environment';

@Injectable()
export class StorageService {
  private readonly client: S3Client;

  constructor(
    private readonly configService: ConfigService<Environment, true>,
  ) {
    // this.client = new S3Client({
    //   region: this.configService.getOrThrow("STORAGE_REGION"),
    //   endpoint: this.configService.get("STORAGE_ENDPOINT"),
    //   forcePathStyle: this.configService.getOrThrow("STORAGE_FORCE_PATH_STYLE"),
    //   credentials: {
    //     accessKeyId: this.configService.getOrThrow("STORAGE_ACCESS_KEY_ID"),
    //     secretAccessKey: this.configService.getOrThrow(
    //       "STORAGE_SECRET_ACCESS_KEY",
    //     ),
    //   },
    // });
  }

  // get bucket() {
  //   return this.configService.getOrThrow("STORAGE_BUCKET");
  // }

  buildMedicalDocumentKey(
    profileId: string,
    checkupId: string,
    fileName: string,
  ) {
    return `profiles/${profileId}/checkups/${checkupId}/${fileName}`;
  }

  getClient() {
    return this.client;
  }
}
