import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();

    const cookieValue = request.cookies?.[data];

    // unsign the cookie if signed
    if (cookieValue) {
        const { valid, value } = request.unsignCookie(cookieValue);
        if (valid) return value;
    }

    return data ? cookieValue : request.cookies;
});

export const enum CookieKey {
    ORGANIZATION_ID = 'organizationId',
    BRANCH_ID = 'organizationId',
    ACADEMIC_YEAR_ID = 'academicYearId',
}

export type TCookie = {
    organizationId?: string;
    academicYearId?: string;
};