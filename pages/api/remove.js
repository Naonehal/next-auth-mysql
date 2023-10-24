import db from '../../app/models/user';  // Adjust path accordingly
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});

const User = db(sequelize);

export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { username } = req.body;

  try {
    await User.destroy({ where: { username } });
    return res.status(200).json({ message: 'User removed successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove user.', error: error.message });
  }
};
