import initModel from '../../app/models/user';
import withSession from '../../utils/ironSessionMiddleware';
import { Sequelize } from 'sequelize';

// Initialize a new Sequelize instance
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

// Call the initModel function to get the User model
const User = initModel(sequelize);

const handler = async (req, res) => {
  try {
    // Get user from session
    const userFromSession = req.session.get("user");

    if (!userFromSession) {
      throw new Error('User not found in session');
    }

    // Use the User model directly
    const user = await User.findOne({ where: { id: userFromSession.id } });

    if (!user) throw new Error('User not found in database');

    await user.destroy();

    // Destroy user session after deleting the account
    req.session.unset("user");
    await req.session.save();

    return res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

// Wrap the handler with the session middleware
export default withSession(handler);
