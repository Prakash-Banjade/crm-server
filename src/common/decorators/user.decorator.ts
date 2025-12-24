import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { CookieKey } from './cookies.decorator';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        const organizationId = request?.user?.organizationId ?? request.cookies[CookieKey.ORGANIZATION_ID];

        const user = { ...request.user, organizationId };

        return user;
    },
);