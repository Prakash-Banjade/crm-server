import "dotenv/config";

import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

const host = process.env.MINIO_ENDPOINT === '127.0.0.1' ? `127.0.0.1:${process.env.MINIO_PORT}` : process.env.MINIO_ENDPOINT!;
const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
const MINIO_URL = `${protocol}://${host}/${process.env.MINIO_BUCKET_PRIMARY}`;

@ValidatorConstraint({ async: false })
export class IsMinioUrlConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        if (typeof value !== 'string') return false;

        return value.startsWith(MINIO_URL);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid Minio URL`;
    }
}

export function IsMinioUrl(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsMinioUrlConstraint,
        });
    };
}

export function isMinioUrl(value: any): boolean {
    if (typeof value !== 'string') return false;

    return value.startsWith(MINIO_URL);
}