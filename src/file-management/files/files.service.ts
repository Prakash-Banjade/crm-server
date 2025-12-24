import { Injectable, InternalServerErrorException, NotFoundException, Res } from '@nestjs/common';
import { CreateFileDto } from './dto/create-files.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { In, Repository } from 'typeorm';
import { getFileMetadata } from 'src/utils/getFileMetadata';
import { EFileMimeType } from 'src/common/types';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private filesRepository: Repository<File>,
    private readonly envService: EnvService,
  ) { }

  async upload(createFileDto: CreateFileDto) {

    const files: File[] = await Promise.all(createFileDto?.files.map(async (uploadFile) => {
      const metaData = await getFileMetadata(uploadFile);

      return this.filesRepository.create({
        ...metaData,
        name: createFileDto.name || metaData.originalName,
      });
    }));

    await this.filesRepository.save(files);

    return {
      message: 'File(s) Uploaded',
      count: createFileDto.files.length,
      files: files.map(file => ({ id: file.id, url: file.url, originalName: file.originalName }))
    }
  }

  async findAllByIds(ids: string[], mimeType?: EFileMimeType | EFileMimeType[]) {
    const mimeTypeArrayQuery = mimeType ? In(Array.isArray(mimeType) ? mimeType : [mimeType]) : undefined;
    const mimeTypeArrayQueryObject = mimeTypeArrayQuery ? { mimeType: mimeTypeArrayQuery } : {};

    return await this.filesRepository.find({
      where: [
        { id: In(ids), ...mimeTypeArrayQueryObject },
        { url: In(ids), ...mimeTypeArrayQueryObject }
      ],
      select: { id: true }
    })
  }
}
