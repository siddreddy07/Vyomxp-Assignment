import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { User } from '../models/index.js';

const { JWT_SECRET, JWT_EXPIRES_IN } = config;

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

async function signup({ username, password, email }) {
  const existing = await User.findOne({ where: { username } });
  if (existing) {
    const error = new Error('Username already taken');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
  });

  const token = generateToken(user);
  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

async function login({ username, password }) {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    const error = new Error('Invalid username or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid username or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

export { signup, login };
