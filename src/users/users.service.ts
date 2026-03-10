import { Injectable } from '@nestjs/common';

export type User = {
  userId: number,
  username: string,
  password: string
  role: 'admin' | 'normal' | 'limited'
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'admin',
      password: 'Admin@Secure#2024',
      role: 'admin',
    },
    {
      userId: 2,
      username: 'normal',
      password: 'Normal$User!Pass',
      role: 'normal',
    },
    {
      userId: 3,
      username: 'limited',
      password: 'Limited&View@Only',
      role: 'limited',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
