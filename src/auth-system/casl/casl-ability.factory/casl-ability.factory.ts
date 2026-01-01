import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Organization } from "src/auth-system/organizations/entities/organization.entity";
import { User } from "src/auth-system/users/entities/user.entity";
import { Action, AuthUser, Role } from "src/common/types";

export type Subjects = InferSubjects<typeof User | Role> | InferSubjects<typeof Organization>

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: AuthUser) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        if (user.role === Role.SUPER_ADMIN) {
            can(Action.MANAGE, Role.SUPER_ADMIN)
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.COUNSELOR)
            can(Action.MANAGE, Role.BDE)
            can(Action.MANAGE, Organization)
        }
        if (user.role === Role.ADMIN) {
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.COUNSELOR)
        }
        if (user.role === Role.COUNSELOR) {
            can(Action.MANAGE, Role.COUNSELOR)
        }
        if (user.role === Role.BDE) {
            can(Action.MANAGE, Role.BDE)
            can(Action.CREATE, Organization)
            can(Action.UPDATE, Organization)
            can(Action.READ, Organization)
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}