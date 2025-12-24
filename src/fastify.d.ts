import 'fastify';
import { type AuthUser } from './common/types';

declare module 'fastify' {
    interface FastifyRequest {
        user?: AuthUser;
        accountId?: string;
    }
}