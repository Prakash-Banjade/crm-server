import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/auth-system/users/entities/user.entity";
import { Action, AuthUser, Role } from "src/common/types";

export type Subjects = InferSubjects<typeof User | Role>

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: AuthUser) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        if (user.role === Role.SUPER_ADMIN) {
            can(Action.MANAGE, Role.SUPER_ADMIN)
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.USER)
        }
        if (user.role === Role.ADMIN) {
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.USER)
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}