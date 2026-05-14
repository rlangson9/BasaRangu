import { Hono } from "npm:hono";
import { db } from "../utils/index.ts";
import { authenticate } from "../utils/index.ts";

const feedRouter = new Hono();

// Track user interaction
feedRouter.post("/track", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    const { interactionType, targetType, targetId, metadata = {}, weight } = await c.req.json();
    
    const validTypes = ['click', 'view', 'chat', 'apply', 'bookmark', 'dismiss'];
    const validTargets = ['job', 'provider', 'runner', 'recruiter'];
    
    if (!validTypes.includes(interactionType) || !validTargets.includes(targetType) || !targetId) {
      return c.json({ success: false, error: 'Invalid parameters' }, 400);
    }

    // Track the interaction
    await db.query(
      'INSERT INTO user_interactions (user_id, interaction_type, target_type, target_id, metadata, weight) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, interactionType, targetType, targetId, JSON.stringify(metadata), weight || 1.0]
    );

    // Update category affinities if metadata has category
    if (metadata.category) {
      await db.query(
        `INSERT INTO user_category_affinities (user_id, category, affinity_score, interaction_count)
         VALUES ($1, $2, $3, 1)
         ON CONFLICT (user_id, category) 
         DO UPDATE SET 
           affinity_score = user_category_affinities.affinity_score + $3,
           interaction_count = user_category_affinities.interaction_count + 1,
           updated_at = NOW()`,
        [userId, metadata.category, weight || 1.0]
      );
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Track interaction error:', error);
    return c.json({ success: false, error: 'Failed to track interaction' }, 500);
  }
});

// Get personalized recommendations
feedRouter.get("/recommendations", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    const userRole = c.get("userRole");
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    let recommendations: any[] = [];

    if (userRole === 'user') {
      // Users see providers/runners
      recommendations = await getUserRecommendations(userId, limit, offset);
    } else if (userRole === 'provider' || userRole === 'runner') {
      // Providers/runners see jobs
      recommendations = await getJobRecommendations(userId, limit, offset);
    } else {
      return c.json({ success: false, error: 'Invalid role' }, 400);
    }

    return c.json({ success: true, recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return c.json({ success: false, error: 'Failed to get recommendations' }, 500);
  }
});

// Get trending items (fallback if no user data)
feedRouter.get("/trending", async (c) => {
  try {
    const userRole = c.req.query('role') || 'user';
    const limit = parseInt(c.req.query('limit') || '10');

    let trending: any[] = [];

    if (userRole === 'user') {
      // Trending providers/runners by rating and applications
      const result = await db.query(
        `SELECT u.*, 
          AVG(r.rating) as avg_rating,
          COUNT(DISTINCT a.id) as application_count
         FROM users u
         LEFT JOIN reviews r ON u.id = r.target_user_id
         LEFT JOIN applications a ON u.id = a.user_id
         WHERE u.verified = true 
           AND (u.active_role = 'provider' OR u.active_role = 'runner')
         GROUP BY u.id
         ORDER BY avg_rating DESC NULLS LAST, application_count DESC
         LIMIT $1`,
        [limit]
      );
      trending = result.rows;
    } else {
      // Trending jobs by views and applications
      const result = await db.query(
        `SELECT j.*, 
          COUNT(DISTINCT a.id) as application_count
         FROM jobs j
         LEFT JOIN applications a ON j.id = a.job_id
         WHERE j.status = 'open'
         GROUP BY j.id
         ORDER BY application_count DESC, j.created_at DESC
         LIMIT $1`,
        [limit]
      );
      trending = result.rows;
    }

    return c.json({ success: true, trending });
  } catch (error) {
    console.error('Get trending error:', error);
    return c.json({ success: false, error: 'Failed to get trending' }, 500);
  }
});

// Update user preferences
feedRouter.put("/preferences", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    const preferences = await c.req.json();
    
    const {
      preferred_categories,
      preferred_locations,
      price_range_min,
      price_range_max,
      urgency_preferences,
      rating_min,
      experience_level
    } = preferences;

    await db.query(
      `INSERT INTO user_preferences 
       (user_id, preferred_categories, preferred_locations, price_range_min, price_range_max, urgency_preferences, rating_min, experience_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         preferred_categories = COALESCE($2, user_preferences.preferred_categories),
         preferred_locations = COALESCE($3, user_preferences.preferred_locations),
         price_range_min = COALESCE($4, user_preferences.price_range_min),
         price_range_max = COALESCE($5, user_preferences.price_range_max),
         urgency_preferences = COALESCE($6, user_preferences.urgency_preferences),
         rating_min = COALESCE($7, user_preferences.rating_min),
         experience_level = COALESCE($8, user_preferences.experience_level),
         updated_at = NOW()`,
      [userId, preferred_categories, preferred_locations, price_range_min, price_range_max, urgency_preferences, rating_min, experience_level]
    );

    return c.json({ success: true });
  } catch (error) {
    console.error('Update preferences error:', error);
    return c.json({ success: false, error: 'Failed to update preferences' }, 500);
  }
});

// Get user preferences
feedRouter.get("/preferences", authenticate, async (c) => {
  try {
    const userId = c.get("userId");
    
    const result = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    return c.json({ success: true, preferences: result.rows[0] || null });
  } catch (error) {
    console.error('Get preferences error:', error);
    return c.json({ success: false, error: 'Failed to get preferences' }, 500);
  }
});

// Helper: Get recommendations for users (providers/runners)
async function getUserRecommendations(userId: string, limit: number, offset: number) {
  // Get user preferences and affinities
  const [prefsResult, affinitiesResult] = await Promise.all([
    db.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]),
    db.query('SELECT * FROM user_category_affinities WHERE user_id = $1 ORDER BY affinity_score DESC LIMIT 5', [userId])
  ]);

  const preferences = prefsResult.rows[0];
  const affinities = affinitiesResult.rows;

  let query = `
    SELECT 
      u.*,
      AVG(r.rating) as avg_rating,
      COUNT(DISTINCT a.id) as application_count,
      COALESCE(ua.affinity_score, 0) as category_match
    FROM users u
    LEFT JOIN reviews r ON u.id = r.target_user_id
    LEFT JOIN applications a ON u.id = a.user_id
    LEFT JOIN user_category_affinities ua ON ua.user_id = $1
    WHERE u.verified = true 
      AND (u.active_role = 'provider' OR u.active_role = 'runner')
  `;

  const params: any[] = [userId];

  // Apply preferences
  if (preferences?.rating_min) {
    params.push(preferences.rating_min);
    query += ` AND u.rating >= $${params.length}`;
  }

  if (affinities.length > 0) {
    const categories = affinities.map(a => `'${a.category}'`).join(',');
    query += ` ORDER BY 
      CASE WHEN u.experience_level = $${params.length + 1} THEN 1 ELSE 0 END DESC,
      category_match DESC,
      avg_rating DESC NULLS LAST,
      application_count DESC
      LIMIT $${params.length + 2} OFFSET $${params.length + 3}`;
    params.push(preferences?.experience_level || '', limit, offset);
  } else {
    // Fallback: recommend top rated providers
    query += ` ORDER BY avg_rating DESC NULLS LAST, application_count DESC
              LIMIT $2 OFFSET $3`;
    params.push(limit, offset);
  }

  const result = await db.query(query, params);
  return result.rows;
}

// Helper: Get recommendations for providers/runners (jobs)
async function getJobRecommendations(userId: string, limit: number, offset: number) {
  // Get user preferences and affinities
  const [prefsResult, affinitiesResult] = await Promise.all([
    db.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]),
    db.query('SELECT * FROM user_category_affinities WHERE user_id = $1 ORDER BY affinity_score DESC LIMIT 5', [userId])
  ]);

  const preferences = prefsResult.rows[0];
  const affinities = affinitiesResult.rows;

  let query = `
    SELECT 
      j.*,
      COUNT(DISTINCT a.id) as application_count,
      COALESCE(ua.affinity_score, 0) as category_match
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    LEFT JOIN user_category_affinities ua ON ua.user_id = $1
    WHERE j.status = 'open'
  `;

  const params: any[] = [userId];

  // Apply preferences
  if (preferences?.price_range_min) {
    params.push(preferences.price_range_min);
    query += ` AND j.budget >= $${params.length}`;
  }
  if (preferences?.price_range_max) {
    params.push(preferences.price_range_max);
    query += ` AND j.budget <= $${params.length}`;
  }

  if (affinities.length > 0) {
    const categories = affinities.map(a => `'${a.category}'`).join(',');
    query += ` ORDER BY 
      CASE WHEN j.category IN (${categories}) THEN 1 ELSE 0 END DESC,
      category_match DESC,
      application_count ASC, -- Jobs with fewer applications first
      j.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
  } else {
    // Fallback: recommend recent jobs with few applications
    query += ` ORDER BY application_count ASC, j.created_at DESC
              LIMIT $2 OFFSET $3`;
    params.push(limit, offset);
  }

  const result = await db.query(query, params);
  return result.rows;
}

export { feedRouter };
