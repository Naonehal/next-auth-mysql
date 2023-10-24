import withSession from "../../utils/ironSessionMiddleware";
import initModel from '../../app/models/user';
import { Sequelize } from 'sequelize';

// Setting up the database connection
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

// Initialize the User model
const User = initModel(sequelize);

const handler = async (req, res) => {
    try {
        // Get user from session
        const user = req.session.get("user");

        if (!user) {
            throw new Error("You must be logged in to view the profile.");
        }

        const userDetails = await User.findOne({ where: { id: user.id } });

        if (!userDetails) throw new Error('User not found');

        return res.json(userDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default withSession(handler);
