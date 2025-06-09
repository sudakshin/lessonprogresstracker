// /api/saveProgress.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, progress } = req.body;

  if (!userId || !progress) {
    return res.status(400).json({ error: 'Missing userId or progress' });
  }

  const { error } = await supabase
    .from('lecture_progress')
    .upsert({ user_id: userId, progress });

  if (error) {
    console.error("Supabase save error:", error);
    return res.status(500).json({ error: 'Failed to save progress' });
  }

  return res.status(200).json({ success: true });
}
