import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Situation } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY!,
    });
  }

  validate(payload: { id: string; email: string; role: Situation }) {
    return {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
