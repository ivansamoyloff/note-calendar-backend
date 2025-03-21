import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    $executeRaw: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      const result = await usersService.createUser(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email.trim().toLowerCase(),
          password: createUserDto.password,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);

      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        password: 'plainPassword',
      };

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = await usersService.getAllUsers();

      expect(prismaService.user.findMany).toHaveBeenCalled();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const result = await usersService.getUserById(1);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(usersService.getUserById(2)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockUser);
      const result = await usersService.getUserByEmail('test@example.com');

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: { equals: 'test@example.com', mode: 'insensitive' } },
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      const result = await usersService.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });
});
