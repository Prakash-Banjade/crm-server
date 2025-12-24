import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { type FastifyRequest } from 'fastify';
import { type AuthUser } from 'src/common/types';

@Injectable()
export class UtilitiesService {
    constructor(
        @Inject(REQUEST) private readonly request: FastifyRequest,
    ) { }

    getCurrentUser(): AuthUser {
        const currentUser = this.request?.user;
        if (!currentUser) throw new UnauthorizedException("Current user not found");
        return currentUser;
    }
}
