import { HttpException, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayloadCustom = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private getAccessSecret(): string {
    if (!process.env.SECRET_KEY) {
      throw new Error('SECRET_KEY is not defined');
    }
    return process.env.SECRET_KEY;
  }

  private getRefreshSecret(): string {
    if (!process.env.REFRESH_TOKEN_KEY) {
      throw new Error('REFRESH_TOKEN_KEY is not defined');
    }
    return process.env.REFRESH_TOKEN_KEY;
  }

  private generateAccessToken(payload: JwtPayloadCustom): string {
    return jwt.sign(payload, this.getAccessSecret(), {
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(payload: JwtPayloadCustom): string {
    return jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: '7d',
    });
  }

  login(user: { id: number; email: string; role: $Enums.Role }) {
    const payload: JwtPayloadCustom = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.generateAccessToken(payload),
      refresh_token: this.generateRefreshToken(payload),
    };
  }

  async refresh(refresh_token: string) {
    try {
      const decoded = jwt.verify(
        refresh_token,
        this.getRefreshSecret(),
      ) as JwtPayload & JwtPayloadCustom;

      if (!decoded?.sub) {
        throw new HttpException('Invalid token payload', 403);
      }

      const userId = Number(decoded.sub);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        throw new HttpException('Access denied', 403);
      }

      const isValid = await compare(refresh_token, user.refreshToken);

      if (!isValid) {
        throw new HttpException('Access denied', 403);
      }

      const tokens = this.login({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const hashedToken = await hash(tokens.refresh_token, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedToken },
      });

      return tokens;
    } catch (error) {
      // opcional: log estruturado
      console.error('Refresh token error:', error);

      throw new HttpException('Invalid or expired token', 403);
    }
  }
}
