import { z } from "zod";

/** Shared between the contact form (client) and /api/contact (server). */
export const contactSchema = z.object({
  name: z.string().min(2, "Name (2+ chars)"),
  email: z.string().email("Valid email required"),
  message: z.string().min(20, "20+ characters"),
});

export type ContactPayload = z.infer<typeof contactSchema>;
