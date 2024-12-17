import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from 'src/jwt/jwt-authguard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Eğer route'da rol tanımlı değilse, herkes erişebilir.
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role); // Kullanıcının rolü belirtilen rollerle eşleşiyorsa erişim sağlanır
  }
}
