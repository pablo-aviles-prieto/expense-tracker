import { z } from "zod";

type ParseZodErrorProps = {
  error: z.ZodError;
};

export const parseZodErrors = ({ error }: ParseZodErrorProps) => {
  return error.errors.map((err) => err.message).join(", ");
};
