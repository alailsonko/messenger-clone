import { UsersEntity, USER_OPERATIONS } from './../users.entity';

describe('UsersEntity', () => {
  let usersEntity: UsersEntity;

  beforeEach(() => {
    usersEntity = new UsersEntity();
  });

  it('should have getters and setters working correctly', () => {
    // Arrange
    usersEntity.id = '550e8400-e29b-41d4-a716-446655440000';
    usersEntity.username = 'new_username';
    usersEntity.password = 'new_password';
    usersEntity.email = 'new_email@example.com';
    usersEntity.createdAt = new Date('2022-02-01');
    usersEntity.updatedAt = new Date('2022-02-02');
    usersEntity.lastLogin = new Date('2022-02-03');

    // Act & Assert
    expect(usersEntity.id).toEqual('550e8400-e29b-41d4-a716-446655440000');
    expect(usersEntity.username).toEqual('new_username');
    expect(usersEntity.password).toEqual('new_password');
    expect(usersEntity.email).toEqual('new_email@example.com');
    expect(usersEntity.createdAt).toEqual(new Date('2022-02-01'));
    expect(usersEntity.updatedAt).toEqual(new Date('2022-02-02'));
    expect(usersEntity.lastLogin).toEqual(new Date('2022-02-03'));
  });

  it('should validate user for CREATE operation', async () => {
    // Arrange
    const partialUser = {
      username: 'john_doe',
      password: 'password123',
      email: 'john@example.com',
    };

    // Act
    const errors = await usersEntity.validate(
      partialUser,
      USER_OPERATIONS.CREATE,
    );

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should validate user for UPDATE operation', async () => {
    // Arrange
    const partialUser = {
      email: 'new_email@example.com',
    };

    // Act
    const errors = await usersEntity.validate(
      partialUser,
      USER_OPERATIONS.UPDATE,
    );

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should validate user for READ operation', async () => {
    // Arrange
    const partialUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'john_doe',
      password: 'password123',
      email: 'john@example.com',
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-02'),
      lastLogin: new Date('2022-01-03'),
    };

    // Act
    const errors = await usersEntity.validate(
      partialUser,
      USER_OPERATIONS.READ,
    );

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should convert plain object to UsersEntity instance', () => {
    // Arrange
    const plainUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'john_doe',
      password: 'password123',
      email: 'john@example.com',
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2022-01-02'),
      lastLogin: new Date('2022-01-03'),
    };

    // Act
    const convertedEntity = usersEntity.plainToClass(plainUser);

    // Assert
    expect(convertedEntity).toBeInstanceOf(UsersEntity);
    expect(convertedEntity.id).toEqual('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should convert UsersEntity instance to plain object', () => {
    usersEntity.id = '550e8400-e29b-41d4-a716-446655440000';
    usersEntity.username = 'john_doe';
    usersEntity.password = 'password123';
    usersEntity.email = 'john@example.com';
    usersEntity.createdAt = new Date('2022-02-01');
    usersEntity.updatedAt = new Date('2022-02-02');
    usersEntity.lastLogin = new Date('2022-02-03');
    // Act
    const plainObject = usersEntity.toObject();

    // Assert
    expect(plainObject).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'john_doe',
      password: 'password123',
      email: 'john@example.com',
      createdAt: new Date('2022-02-01'),
      updatedAt: new Date('2022-02-02'),
      lastLogin: new Date('2022-02-03'),
    });
  });
});
