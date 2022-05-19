import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtEnvs = (): JwtModuleOptions => {
  return {
    secret: process.env.ACCESS_TOKEN_SECRET,
    signOptions: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      issuer: 'ALTIMIT Corp.',
    },
  };
};

export const refreshEnvs = () => {
  return {
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      issuer: 'ALTIMIT Corp.',
    } as JwtSignOptions,
  };
};
