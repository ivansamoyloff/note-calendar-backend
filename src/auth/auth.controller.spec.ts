import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register and return the token', async () => {
      const dto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      const mockToken = { access_token: 'mockAccessToken' };
      mockAuthService.register.mockResolvedValue(mockToken);

      const result = await authController.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);

      expect(result).toEqual(mockToken);
    });
  });

  describe('login', () => {
    it('should call AuthService.login and return the token', async () => {
      const loginDto = { email: 'test@example.com', password: 'plainPassword' };
      const mockToken = { access_token: 'mockAccessToken' };

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );

      expect(result).toEqual(mockToken);
    });
  });
});
