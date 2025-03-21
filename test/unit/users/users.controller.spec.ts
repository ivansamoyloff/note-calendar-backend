import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/users/users.controller';
import { UsersService } from '../../../src/users/users.service';
import { Prisma } from '@prisma/client';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    getAllUsers: jest.fn().mockResolvedValue([mockUser]),
    getUserById: jest.fn().mockResolvedValue(mockUser),
    getUserByEmail: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const createUserDto: Prisma.UserCreateInput = {
      email: 'test@example.com',
      password: 'plainPassword',
    };

    await expect(usersController.createUser(createUserDto)).resolves.toEqual(
      mockUser,
    );

    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should get all users', async () => {
    await expect(usersController.getAllUsers()).resolves.toEqual([mockUser]);

    expect(usersService.getAllUsers).toHaveBeenCalled();
  });

  it('should get a user by ID', async () => {
    await expect(usersController.getUserById('1')).resolves.toEqual(mockUser);

    expect(usersService.getUserById).toHaveBeenCalledWith(1);
  });

  it('should return an error if user by ID is not found', async () => {
    mockUsersService.getUserById.mockResolvedValue(null);

    await expect(usersController.getUserById('1')).rejects.toThrow(
      'User not found',
    );
  });

  it('should get a user by email', async () => {
    mockUsersService.getUserByEmail.mockResolvedValueOnce(mockUser);

    await expect(
      usersController.getUserByEmail('test@example.com'),
    ).resolves.toEqual(mockUser);

    expect(usersService.getUserByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
  });

  it('should return an error if user by email is not found', async () => {
    mockUsersService.getUserByEmail.mockResolvedValue(null);

    await expect(
      usersController.getUserByEmail('notfound@example.com'),
    ).rejects.toThrow('User not found');

    expect(usersService.getUserByEmail).toHaveBeenCalledWith(
      'notfound@example.com',
    );
  });
});
