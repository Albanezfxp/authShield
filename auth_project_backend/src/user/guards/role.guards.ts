import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { role } from '@prisma/client';
import { ROLES_KEY } from 'src/types/decoratores/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega os roles necessários da metadata
    const requiredRoles = this.reflector.get<role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // Se não tem role definido, deixa passar (é pública)
    if (!requiredRoles) {
      return true;
    }

    // 2. Pega a requisição
    const request = context.switchToHttp().getRequest();
    const user = request.user; // vem do seu JWT Guard

    // 3. Verifica se o user tem algum dos roles necessários
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Você não tem permissão para acessar isso');
    }

    return true; // Deixa passar!
  }
}
