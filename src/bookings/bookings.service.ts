import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { QueryDto } from 'src/common/dto/query.dto';
import paginatedData from 'src/utils/paginatedData';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly minioService: MinioService,
  ) { }

  private readonly _imagePrefix = 'bookings';

  async create(dto: CreateBookingDto) {
    const existingWitSameName = await this.bookingRepository.findOne({
      where: { name: dto.name }
    })
    if (existingWitSameName) throw new ConflictException('Booking with this name already exists');

    const passportAttachment = await this.minioService.moveFileToPermanent(dto.passportAttachment, this._imagePrefix);
    const paymentProof = await this.minioService.moveFileToPermanent(dto.paymentProof, this._imagePrefix);

    const booking = this.bookingRepository.create({
      ...dto,
      passportAttachment,
      paymentProof,
    });

    await this.bookingRepository.save(booking);

    return { message: 'Created successfully' }
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')

    queryBuilder
      .orderBy('booking.createdAt', queryDto.order)
      .take(queryDto.take)
      .skip(queryDto.skip);

    if (queryDto.q) {
      queryBuilder.where('booking.name ILIKE :q', { q: `${queryDto.q}%` });
    }

    queryBuilder.select([
      'booking.id',
      'booking.name',
      'booking.dob',
      'booking.email',
      'booking.type',
      'booking.subType',
      'booking.location',
      'booking.phNo',
      'booking.bookingDate',
      'booking.passportAttachment',
      'booking.paymentProof',
      'booking.status',
      'booking.createdAt',
      'booking.updatedAt',
    ]);

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.bookingRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        dob: true,
        email: true,
        type: true,
        subType: true,
        location: true,
        phNo: true,
        bookingDate: true,
        passportAttachment: true,
        paymentProof: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    if (!existing) throw new NotFoundException('British Counsil not found');

    return existing;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const existing = await this.findOne(id);

    if (dto.passportAttachment && dto.passportAttachment !== existing.passportAttachment) {
      await this.minioService.deleteFile(existing.passportAttachment);
      const passportAttachment = await this.minioService.moveFileToPermanent(dto.passportAttachment, this._imagePrefix);
      dto.passportAttachment = passportAttachment;
    }

    if (dto.paymentProof && dto.paymentProof !== existing.paymentProof) {
      await this.minioService.deleteFile(existing.paymentProof);
      const paymentProof = await this.minioService.moveFileToPermanent(dto.paymentProof, this._imagePrefix);
      dto.paymentProof = paymentProof;
    }

    Object.assign(existing, dto);

    await this.bookingRepository.save(existing);

    return { message: 'Updated successfully' }
  }

  async remove(id: string) {
    await this.bookingRepository.delete({ id });

    return { message: 'Deleted successfully' }
  }
}
