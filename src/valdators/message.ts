import { z } from "zod"

const MessageSchema = z.object({
  from: z.string().min(1, "From field is required"),
  to: z.string().min(1, "To field is required"),
  content: z.string().min(1, "Content cannot be empty"),
})

export const validateMessage = (data: unknown) => {
  return MessageSchema.safeParse(data)
}