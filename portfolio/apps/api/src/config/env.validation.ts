import * as Joi from 'joi';

/**
 * Validates process.env at boot. Fails fast with all errors at once
 * (abortEarly: false set in app.module.ts).
 */
export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(4001),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PRODUCTION_BUILD: Joi.string().valid('true', 'false').default('false'),
  CORS_ORIGINS: Joi.string().allow('').default(''),

  MONGO_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),

  JWT_SECRET_ADMIN: Joi.string().min(32).required(),
  JWT_EXPIRES_ADMIN: Joi.number().integer().positive().default(604800),

  ADMIN_USERNAME: Joi.string().min(3).max(40).required(),
  ADMIN_PASSWORD: Joi.string().min(8).required(),
  ADMIN_NAME: Joi.string().min(1).max(80).default('Site Owner'),

  UPLOAD_DIR: Joi.string().default('uploads'),

  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.alternatives([Joi.number().integer().positive(), Joi.valid('')]).optional(),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  SMTP_FROM: Joi.string().email().allow('').optional(),
  CONTACT_FORWARD_TO: Joi.string().email().allow('').optional(),
});
