import cron from "node-cron";
import Post from "../models/post.model.js";

// Schedule a job to run every 6 hours
cron.schedule("0 */6 * * *", async () => {
    try {
        const currentDate = new Date();

        // Find all live posts where the expiration time has passed
        const expiredPosts = await Post.updateMany(
            { expirationTime: { $lt: currentDate }, status: "Live" }, // Match live posts past expiration
            { $set: { status: "Expired" } } // Update status to expired
        );

        if (expiredPosts.modifiedCount > 0) {
            console.log(`${expiredPosts.modifiedCount} posts marked as expired.`);
        }
    } catch (error) {
        console.error("Error updating expired posts:", error);
    }
});
