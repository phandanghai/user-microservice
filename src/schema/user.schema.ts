import { z } from 'zod';
import { UUID_REGEX, EMAIL_REGEX } from '@/zod/zod.validation.rule';

export const UserValidationSchema = z.object({
  id: z
    .string({ message: 'User ID is required' })
    .regex(UUID_REGEX, 'User Id must br UUID')
    .optional(),
  username: z
    .string({ message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .regex(EMAIL_REGEX, 'Email must be a valid email'),
  password: z
    .string({ message: 'Password is required' })
    .refine((val) => [...val].length >= 8, {
      message: 'Password must be at least 8 characters',
    })
    .refine((val) => [...val].length <= 20, {
      message: 'Password must be at most 20 characters',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /\d/.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: 'Password must contain at least one special character',
    }),
  firstName: z
    .string({ message: 'First name is required' })
    .min(3, { message: 'First name must be at least 3 characters' })
    .max(20, { message: 'First name must be at most 20 characters' }),
  lastName: z
    .string({ message: 'Last name is required' })
    .min(3, { message: 'Last name must be at least 3 characters' })
    .max(20, { message: 'Last name must be at most 20 characters' }),
  avatar: z
    .string({ message: 'Avatar is required' })
    .url({ message: 'Avatar must be a valid URL' })
    .optional(),
  lastUpdatePassword: z
    .date({ message: 'Last update password is required' })
    .optional(),
  phoneNumber: z
    .string({ message: 'Phone number is required' })
    .min(10, { message: 'Phone number must be at least 10 characters' })
    .max(15, { message: 'Phone number must be at most 15 characters' })
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z
    .string({ message: 'Address is required' })
    .min(3, { message: 'Address must be at least 3 characters' })
    .max(100, { message: 'Address must be at most 100 characters' })
    .optional()
    .nullable()
    .or(z.literal('')),

  region: z.string({ message: 'Region is required' }).optional(),
  city: z.string({ message: 'City is required' }).optional(),
  country: z.string({ message: 'Country is required' }).optional(),
  balance: z
    .union([z.number({ message: 'Balance is required' })])
    .optional()
    .default(0),

  authentication: z
    .boolean({ message: 'Authentication is required' })
    .default(false)
    .optional(),
});

export type CreateUserDto = z.infer<typeof UserValidationSchema>;
export type UpdateUserDto = Partial<z.infer<typeof UserValidationSchema>>;

// Schema for update payload validation - id is required, other fields optional
export const UpdateUserPayloadSchema = z
  .object({
    id: z
      .string({ message: 'User ID is required' })
      .regex(UUID_REGEX, 'User Id must be a valid UUID'),
  })
  .and(UserValidationSchema.partial().omit({ id: true }));

export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;

// Schema for update password validation - id and password are required
export const UpdatePasswordUserSchema = z.object({
  id: z
    .string({ message: 'User ID is required' })
    .regex(UUID_REGEX, 'User Id must br UUID'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => [...val].length <= 20, {
      message: 'Password must be at most 20 characters',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /\d/.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: 'Password must contain at least one special character',
    }),
});

export type UpdatePasswordUserDto = z.infer<typeof UpdatePasswordUserSchema>;
