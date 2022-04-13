import { IFileResponse } from './file.interface';
import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FileService {
  async saveFile(
    files: Express.Multer.File[],
    folder: string = '',
  ): Promise<IFileResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    const response: IFileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: `${file.originalname}`,
        };
      }),
    );

    return response;
  }
}
