import db from '../../app/models/user';  // Adjust path accordingly
import { Sequelize } from 'sequelize';
import withSession from "../../utils/ironSessionMiddleware";

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql'
});

const User = db(sequelize);

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  // Store user details in session
  req.session.set("user", {
    id: user.id,
    username: user.username,
    // ... any other user data you want to store
  });
  await req.session.save();

  return res.status(200).json({ message: 'Logged in successfully!' });
};

export default withSession(handler);
