import { ROLES } from '@app/contracts/dtos/enums/roles.enum'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles)
