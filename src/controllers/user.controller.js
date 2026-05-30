import { getUserWithServices } from '../services/user.Service.js';

export async function getProfile(req, res) {
  try {
    const user = await getUserWithServices(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    console.error(`[USER] getProfile error:`, err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
