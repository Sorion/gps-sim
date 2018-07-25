import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env.interface';

@Injectable()
export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
      const config = dotenv.parse(fs.readFileSync(filePath));
      this.envConfig = this.validateInput(config);
    }
  
    get(key: string): string {
      return this.envConfig[key];
    }
  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object 
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      MODE: Joi.string()
        .valid(['development', 'production', 'test'])
        .default('development'),
      PORT: Joi.number().default(3000),
      CORS_ENABLED: Joi.boolean().required(),
      API_AUTH_ENABLED: Joi.boolean().required(),
      ENABLE_SWAGGER_API: Joi.boolean().default(false),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  
  get isApiAuthEnabled(): boolean {
    return Boolean(this.envConfig.API_AUTH_ENABLED);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get isCorsEnabled(): boolean {
    return Boolean(this.envConfig.CORS_ENABLED);
  }

  get isSwaggerApiEnabled(): boolean {
    return Boolean(this.envConfig.ENABLE_SWAGGER_API);
  }
}