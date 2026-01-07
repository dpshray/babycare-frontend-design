import { z } from "zod"

export const productReviewSchema = z.object({
    review: z.string(),
    rating: z.number().min(0).max(5),
})

export type ProductReview = z.infer<typeof productReviewSchema>

