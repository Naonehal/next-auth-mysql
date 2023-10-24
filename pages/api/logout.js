import { serialize } from 'cookie';
import withSession from "../../utils/ironSessionMiddleware";  // Ensure you have the correct path

const logout = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  // Unset the user from the session
  req.session.unset("user");
  await req.session.save();

  res.setHeader('Set-Cookie', serialize('auth', '', {
    maxAge: -1,
    path: '/'
  }));

  return res.status(200).json({ message: 'Logged out successfully!' });
};

export default withSession(logout);  // Wrap the logout function with the session middleware
