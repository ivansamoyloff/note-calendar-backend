import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { UsersService } from '../../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import IUser from 'interfaces/user.interface';

const mockedDate = new Date();

const mockUser: IUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: mockedDate,
  updatedAt: mockedDate,
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService: Partial<Record<keyof UsersService, jest.Mock>> = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = new JwtService({ secret: 'test-secret' });
  jest.spyOn(mockJwtService, 'sign').mockReturnValue('mockAccessToken');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      mockUsersService.getUserByEmail!.mockResolvedValue(null);
      mockUsersService.createUser!.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      const result = await authService.register(createUserDto);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);

      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });

      expect(result).toEqual({ access_token: 'mockAccessToken' });
    });

    it('should throw an error if the user is already registered', async () => {
      mockUsersService.getUserByEmail!.mockResolvedValue(mockUser);

      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      await expect(authService.register(createUserDto)).rejects.toThrow(
        'User already registered',
      );

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });
  });

  describe('login', () => {
    it('should log in a user and return a token', async () => {
      mockUsersService.getUserByEmail!.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.login(
        'test@example.com',
        'plainPassword',
      );

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        'hashedPassword',
      );

      expect(result).toEqual({ access_token: 'mockAccessToken' });
    });

    it('should throw an error if user is not found', async () => {
      mockUsersService.getUserByEmail!.mockResolvedValue(null);

      await expect(
        authService.login('notfound@example.com', 'password'),
      ).rejects.toThrow('User not found');
    });

    it('should throw an error if password is incorrect', async () => {
      mockUsersService.getUserByEmail!.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.login('test@example.com', 'wrongPassword'),
      ).rejects.toThrow('Invalid password');
    });
  });

  describe('generateToken', () => {
    it('should return an access token', () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');
      const result = authService['generateToken'](mockUser);

      expect(result).toEqual({ access_token: 'mockAccessToken' });

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });
  });
});
