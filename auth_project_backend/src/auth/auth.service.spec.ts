import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service'; // Ajustado para caminho relativo caso use no backend também

describe('AuthService', () => {
  let service: AuthService;

  // Criamos um objeto simulado com as funções do Prisma que o AuthService usa
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Injeta o mock no lugar do serviço real
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // REMOVIDO: A linha que atribuía valor ao prismaService foi retirada para evitar o erro de variável não usada
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
