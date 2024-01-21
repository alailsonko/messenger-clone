import { UserEntity } from '../users.entity';

describe('UserEntity', () => {
  it('should create a valid user entity', async () => {
    const validUser = new UserEntity(
      '550e8400-e29b-41d4-a716-446655440000',
      'john_doe',
      'password123',
      'john@example.com',
      new Date(),
      new Date(),
      null,
    );

    const validationErrors = await validUser.validate();

    expect(validationErrors).toHaveLength(0);
  });

  it('should detect validation errors for an invalid user entity', async () => {
    const invalidUser = new UserEntity(
      '550e8400-e29b-41d4-a716-446655440000',
      '', // Empty username (invalid)
      'pass', // Password length less than 6 (invalid)
      'invalid-email', // Invalid email format (invalid)
      new Date(),
      new Date(),
      null,
    );

    const validationErrors = await invalidUser.validate();

    expect(validationErrors).not.toHaveLength(0);
  });

  it('should convert the entity to a plain object', () => {
    const user = new UserEntity(
      '550e8400-e29b-41d4-a716-446655440000',
      'john_doe',
      'password123',
      'john@example.com',
      new Date(),
      new Date(),
      null,
    );

    const userObject = user.toObject();

    expect(userObject).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'john_doe',
      password: 'password123',
      email: 'john@example.com',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      lastLogin: null,
    });
  });
});
