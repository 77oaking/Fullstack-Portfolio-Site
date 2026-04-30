/**
 * Loads typed config from process.env. Validation lives in env.validation.ts.
 */
export default () => ({
  port: parseInt(process.env.PORT ?? '4001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  productionBuild: process.env.PRODUCTION_BUILD === 'true',
  corsOrigins: process.env.CORS_ORIGINS ?? '',
  mongoUri: process.env.MONGO_URI,
  jwt: {
    adminSecret: process.env.JWT_SECRET_ADMIN as string,
    adminExpiresIn: parseInt(process.env.JWT_EXPIRES_ADMIN ?? '604800', 10),
  },
  seed: {
    adminUsername: process.env.ADMIN_USERNAME ?? 'admin',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'change-me-immediately',
    adminName: process.env.ADMIN_NAME ?? 'Site Owner',
  },
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    forwardTo: process.env.CONTACT_FORWARD_TO,
  },
});
