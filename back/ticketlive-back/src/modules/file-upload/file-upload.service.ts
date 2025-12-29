import { Injectable, NotFoundException } from "@nestjs/common";
import { FileUploadRepository } from "./file-upload.repository";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    private readonly userRepository: UsersRepository
  ) {}
  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findById(userId);
    if (!user)
      throw new NotFoundException(`Producto de id ${userId} no encontrado`);

    //Elimina imagen anterior
    if (user.profile_photo_id)
      await this.fileUploadRepository.deleteImage(user.profile_photo_id);

    const response = await this.fileUploadRepository.uploadImage(file);
    if (!response?.secure_url || !response?.public_id)
      throw new NotFoundException("Error al cargar imagen");
    //Almacena la nueva imagen
    await this.userRepository.updateUser(userId, {
      profile_photo: response.secure_url,
      profile_photo_id: response.public_id,
    });

    const updatedImg = await this.userRepository.findById(userId);
    return updatedImg?.profile_photo;
  }
}
