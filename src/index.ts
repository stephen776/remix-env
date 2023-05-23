import z, { ZodObject, type ZodType } from 'zod';

if (typeof window !== 'undefined')
  throw new Error('You must not import createEnv on the client.');

export type Options<T extends Record<string, ZodType>> = {
  env: T;
};

export function createEnv<
  T extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<T>) {
  const schema = z.object(typeof opts.env === 'object' ? opts.env : {});
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );

    throw new Error('Invalid envirmonment variables');
  }

  return parsed.data as z.infer<ZodObject<T>>;
}
