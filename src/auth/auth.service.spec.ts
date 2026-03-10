import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return access token for valid user', async () => {
    mockUsersService.findOne.mockResolvedValue({
      userId: 1,
      username: 'admin',
      password: 'Admin@Secure#2024',
      role: 'admin',
    });

    mockJwtService.signAsync.mockResolvedValue('mock-token');

    const result = await service.signIn('admin', 'Admin@Secure#2024');

    expect(result).toEqual({ access_token: 'mock-token', role: 'admin' });
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      username: 'admin',
      role: 'admin',
    });
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    mockUsersService.findOne.mockResolvedValue({
      userId: 1,
      username: 'admin',
      password: 'Admin@Secure#2024',
      role: 'admin',
    });

    await expect(service.signIn('admin', 'wrong-pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
