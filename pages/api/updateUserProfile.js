import withSession from "../../utils/ironSessionMiddleware";
import initModel from '../../app/models/user';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
});

const User = initModel(sequelize);

const handler = async (req, res) => {
    try {
        // Get user from session
        const user = req.session.get("user");

        if (!user) {
            throw new Error("You must be logged in to update the profile.");
        }

        const userDetails = await User.findOne({ where: { id: user.id } });

        if (!userDetails) throw new Error('User not found');

        // Update user details
        userDetails.firstName = req.body.firstName;
        userDetails.lastName = req.body.lastName;

        await userDetails.save();

        return res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        return res.status(500).json({ error: error.message });
    }
}

export default withSession(handler);
