import { requireAuth, requireRole } from '../auth';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('returns 401 if no authorization header', () => {
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('returns 401 if header does not start with Bearer', () => {
      mockReq.headers.authorization = 'Basic token123';
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('returns 401 if token is invalid', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('calls next and sets req.user if token is valid', () => {
      mockReq.headers.authorization = 'Bearer valid-token';
      const decoded = { id: 'u1', role: 'CUSTOMER' };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);
      
      requireAuth(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.user).toEqual(decoded);
    });
  });

  describe('requireRole', () => {
    it('returns 403 if user is not set', () => {
      const middleware = requireRole('ADMIN');
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('returns 403 if user role is not in allowed roles', () => {
      mockReq.user = { role: 'CUSTOMER' };
      const middleware = requireRole('ADMIN', 'AGENT');
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('calls next if user role is allowed', () => {
      mockReq.user = { role: 'ADMIN' };
      const middleware = requireRole('ADMIN', 'AGENT');
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
