import z, { ZodObject, type ZodType } from 'zod';

export type Options<T extends Record<string, ZodType>> = {
  env: T;
};

export function createEnv<
  T extends Record<string, ZodType> = NonNullable<unknown>
>(opts: Options<T>): z.infer<ZodObject<T>> {
  const schema = z.object(typeof opts.env === 'object' ? opts.env : {});

  // given the keys in our schema, get the values from process.env
  const envirmonment = Object.keys(schema.shape).map((key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return process.env[key];
  });

  const parsed = schema.safeParse(envirmonment);

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );

    throw new Error('Invalid envirmonment variables');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return parsed.data as any;
}

const test = createEnv({
  env: {
    TEST_VARIABLE: z.string()
  }
});

console.log({ test });
