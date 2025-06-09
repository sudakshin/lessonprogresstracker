import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const { data, error } = await supabase
    .from('lecture_progress')
    .select('progress')
    .eq('user_id', userId)
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }

  return res.status(200).json({ progress: data?.progress || {} });
}
