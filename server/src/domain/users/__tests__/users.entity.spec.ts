import { USER_OPERATIONS, UsersEntity } from '../users.entity';

describe('UserEntity', () => {
  it('should update a valid user entity', async () => {
    const validationErrorsOne = await UsersEntity.validate(
      {
        username: 'john_doe',
        password: 'password123',
        email: 'john@example.com',
      },
      USER_OPERATIONS.UPDATE,
    );
    const validationErrorsTwo = await UsersEntity.validate(
      {
        username: 'john_doe',
      },
      USER_OPERATIONS.UPDATE,
    );
    const validationErrorsThree = await UsersEntity.validate(
      {
        password: 'password123',
      },
      USER_OPERATIONS.UPDATE,
    );
    const validationErrorsFourth = await UsersEntity.validate(
      {
        email: 'john@example.com',
      },
      USER_OPERATIONS.UPDATE,
    );

    expect(validationErrorsOne).toHaveLength(0);
    expect(validationErrorsTwo).toHaveLength(0);
    expect(validationErrorsThree).toHaveLength(0);
    expect(validationErrorsFourth).toHaveLength(0);
  });

  it('should create a valid user entity', async () => {
    const validationErrors = await UsersEntity.validate(
      {
        username: 'john_doe',
        password: 'password123',
        email: 'john@example.com',
      },
      USER_OPERATIONS.CREATE,
    );

    expect(validationErrors).toHaveLength(0);
  });

  it('should detect validation errors for an invalid user entity', async () => {
    const invalidUser = new UsersEntity(
      '550e8400-e29b-41d4-a716-446655440000',
      '', // Empty username (invalid)
      'pass', // Password length less than 6 (invalid)
      'invalid-email', // Invalid email format (invalid)
      new Date(),
      new Date(),
      null,
    );

    const validationErrors = await UsersEntity.validate(
      invalidUser,
      USER_OPERATIONS.READ,
    );

    expect(validationErrors).not.toHaveLength(0);
  });

  it('should convert the entity to a plain object', () => {
    const user = new UsersEntity(
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
