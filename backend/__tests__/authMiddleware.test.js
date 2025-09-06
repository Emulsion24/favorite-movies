// __tests__/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('../src/middlewares/authMiddleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should call next if token is valid', () => {
      req.headers.authorization = 'Bearer validtoken';
      jwt.verify.mockReturnValue({ id: 1, role: 'user' });

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
      expect(req.user).toEqual({ id: 1, role: 'user' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('adminMiddleware', () => {
    it('should call next if token is valid and role is admin', () => {
      req.headers.authorization = 'Bearer admintoken';
      jwt.verify.mockReturnValue({ id: 1, role: 'admin' });

      adminMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('admintoken', process.env.JWT_SECRET);
      expect(req.user).toEqual({ id: 1, role: 'admin' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      req.headers.authorization = 'Bearer usertoken';
      jwt.verify.mockReturnValue({ id: 1, role: 'user' });

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if no token', () => {
      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
