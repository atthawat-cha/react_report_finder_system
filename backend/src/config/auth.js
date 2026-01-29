module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7
  },
  
  password: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
    preventReuse: 5 // prevent last 5 passwords
  },

  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    timeout: parseInt(process.env.SESSION_TIMEOUT) || 3600, // seconds
    name: 'report_system_session',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    twoFactorEnabled: process.env.ENABLE_2FA === 'true',
    requireEmailVerification: true
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }
  }
};