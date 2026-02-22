import { z } from "zod";
import { InvalidEnvError } from "../../domain/error/invalid-env-error";

const schema = z.object({
    BASE_URL: z.string(),
    DATABASE_URL: z.string(),
    URL_WEB_SITE: z.string(),
    URL_API_ZIPCODE: z.string(),
    AUTH_URL: z.string(),
    XRAPIDAPIHOST: z.string(),
    XRAPIDAPIKEY: z.string(),
    NODE_ENV: z.enum(['dev', 'test', 'prd']),
    PORT: z.coerce.number().default(3000),
});

const _env = schema.safeParse({ ...process.env });

if (!_env.success) {
    const formattedError = (_env as typeof _env & { success: false }).error.format();
    throw new InvalidEnvError(JSON.stringify(formattedError));
}

export const env = _env.data;