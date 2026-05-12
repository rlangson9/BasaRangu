import { Hono } from "npm:hono";
import { db, authenticate } from "../utils";

export const reviewsRouter = new Hono();

reviewsRouter.post("/", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const user = await authenticate(token);
    const { jobId, targetUserId, rating, comment } = await c.req.json();
    const review = await db.reviews.create({
      job_id: jobId,
      from_user_id: user.id,
      target_user_id: targetUserId,
      rating,
      comment,
    });
    const reviews = await db.reviews.getByTargetUserId(targetUserId);
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    await db.users.update(targetUserId, {
      rating: totalRating / reviews.length,
      review_count: reviews.length,
    });
    return c.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting review:", error);
    return c.json({ error: "Failed to submit review" }, 500);
  }
});
