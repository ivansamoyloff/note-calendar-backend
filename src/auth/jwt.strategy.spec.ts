import { JwtStrategy } from './jwt.strategy';
import { Strategy } from 'passport-jwt';
import IJwtPayload from 'interfaces/jwt-payload.interface';

jest.mock('passport-jwt', () => ({
  Strategy: jest.fn(),
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn(() => 'mockedExtractor'),
  },
}));

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    process.env.SECRET_KEY = 'test-secret';
    jwtStrategy = new JwtStrategy();
  });

  afterEach(() => {
    delete process.env.SECRET_KEY;
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(jwtStrategy).toBeDefined();
    });

    it('should configure PassportStrategy correctly', () => {
      expect(Strategy).toHaveBeenCalledWith(
        expect.objectContaining({
          jwtFromRequest: 'mockedExtractor',
          ignoreExpiration: false,
          secretOrKey: 'test-secret',
        }),
        expect.any(Function),
      );
    });
  });

  describe('validate', () => {
    it('should return the user object with userId and email', () => {
      const payload: IJwtPayload = { sub: 1, email: 'test@example.com' };

      const result = jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: 1, email: 'test@example.com' });
    });
  });
});
