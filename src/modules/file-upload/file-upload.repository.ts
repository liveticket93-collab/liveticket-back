import { BadRequestException, Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 } from "cloudinary";
import toStream = require("buffer-to-stream");

type UploadFileOptions = {
  folder?: string; 
  resource_type?: "image" | "video" | "raw" | "auto";
};

@Injectable()
export class FileUploadRepository {
  async uploadFile(
    file: Express.Multer.File,
    options: UploadFileOptions = {}
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const {
      folder = "liveticket",
      resource_type = "auto",
    } = options;

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type, folder },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: "image", folder: "liveticket" },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    return v2.uploader.destroy(publicId);
  }
}
