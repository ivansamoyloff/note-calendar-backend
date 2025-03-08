import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
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
    },
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

      const result = await usersService.createUser(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });

      expect(result).toEqual(mockUser);
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
      const result = await usersService.getUserByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        usersService.getUserByEmail('notfound@example.com'),
      ).rejects.toThrow('User not found');
    });
  });
});
