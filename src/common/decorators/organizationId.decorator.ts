import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { CookieKey } from './cookies.decorator';
import { Role } from '../types';

export const OrganizationId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        const user = request.user;
        // console.log(user)
        return user?.role === Role.SUPER_ADMIN ? request.cookies[CookieKey.ORGANIZATION_ID] : user?.organizationId;
    },
);