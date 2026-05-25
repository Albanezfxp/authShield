import { HttpException, Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

type jwtPayload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private generateAccessToken(payload: jwtPayload) {
    return jwt.sign(payload, process.env.SECRET_KEY!, {
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(payload: jwtPayload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY!, {
      expiresIn: '7d',
    });
  }

  login(user: { id: number; email: string; role: $Enums.Role }) {
    const payload = {
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
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY!);

      const userId = decoded.sub;

      if (!userId) {
        throw new HttpException('Invalid token', 403);
      }

      const user = await this.prisma.user.findUnique({
        where: { id: +userId },
      });

      if (!user || !user.refreshToken) {
        throw new HttpException('Access denied', 403);
      }

      const isValid = await compare(refresh_token, user.refreshToken);

      if (!isValid) {
        throw new HttpException('Access denied', 403);
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = this.login({
        // ✅ Não precisa await agora
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      });

      const hashedToken = await hash(tokens.refresh_token, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedToken },
      });

      return tokens;
    } catch {
      throw new HttpException('Invalid or expired token', 403);
    }
  }
}
