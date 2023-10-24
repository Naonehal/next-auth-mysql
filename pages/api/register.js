import db from '../../app/models/user';  // Adjust the path based on your directory structure
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});

const User = db(sequelize);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const user = await User.create({
      username,
      hash: password,
      firstName,
      lastName
    });

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};
