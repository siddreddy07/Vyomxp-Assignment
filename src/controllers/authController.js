import { signup as signupService, login as loginService } from '../services/authService.js';

export async function signup(req, res) {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await signupService({ username: username.trim().toLowerCase(), password, email });

    res.status(201).json({
      message: 'User created successfully',
      user: result.user.id,
      token: result.token,
    });
  } catch (err) {
    console.error(`[AUTH] signup error:`, err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await loginService({ username, password });

    res.json({
      message: 'Login successful',
      user: result.user,   
      token: result.token,
    });
  } catch (err) {
    console.error(`[AUTH] login error:`, err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}


