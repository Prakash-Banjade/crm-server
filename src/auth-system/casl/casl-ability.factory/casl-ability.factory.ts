import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Application } from "src/application-system/applications/entities/application.entity";
import { Organization } from "src/auth-system/organizations/entities/organization.entity";
import { User } from "src/auth-system/users/entities/user.entity";
import { Action, AuthUser, Role } from "src/common/types";
import { Student } from "src/students/entities/student.entity";

export type Subjects = InferSubjects<typeof User | Role>
    | InferSubjects<typeof Organization>
    | InferSubjects<typeof Application>
    | InferSubjects<typeof Student>

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    defineAbility(user: AuthUser) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        if (user.role === Role.SUPER_ADMIN) {
            /** Role Permissions */
            can(Action.MANAGE, Role.SUPER_ADMIN)
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.COUNSELOR)
            can(Action.MANAGE, Role.BDE)

            /** Organization Permissions */
            can(Action.MANAGE, Organization)

            /** Student Permissions */
            cannot(Action.CREATE, Student)
            can(Action.READ, Student)
            can(Action.UPDATE, Student)
            can(Action.DELETE, Student)

            /** Application Permissions */
            cannot(Action.CREATE, Application)
            can(Action.READ, Application)
            can(Action.UPDATE, Application)
            can(Action.DELETE, Application)
        }
        if (user.role === Role.ADMIN) {
            /** Role Permissions */
            can(Action.MANAGE, Role.ADMIN)
            can(Action.MANAGE, Role.COUNSELOR)

            /** Student Permissions */
            can(Action.MANAGE, Student)

            /** Application Permissions */
            can(Action.CREATE, Application)
            can(Action.READ, Application)
            can(Action.UPDATE, Application)
        }
        if (user.role === Role.COUNSELOR) {
            /** Role Permissions */
            can(Action.MANAGE, Role.COUNSELOR)

            /** Student Permissions */
            can(Action.MANAGE, Student)
            cannot(Action.DELETE, Student)

            /** Application Permissions */
            can(Action.CREATE, Application)
            can(Action.READ, Application)
            can(Action.UPDATE, Application)
        }
        if (user.role === Role.BDE) {
            /** Role Permissions */
            can(Action.MANAGE, Role.BDE)

            /** Organization Permissions */
            can(Action.CREATE, Organization)
            can(Action.UPDATE, Organization)
            can(Action.READ, Organization)
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}