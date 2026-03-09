import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

export interface IUser {
  id: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
            INSERT INTO users (email, password)
            VALUES ($1, $2)
            RETURNING id, email, created_at, updated_at
        `;

    const result = await pool.query(query, [email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const query = `
            SELECT id, email, password, created_at, updated_at
            FROM users
            WHERE email = $1
        `;

    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
