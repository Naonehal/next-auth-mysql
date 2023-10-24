export default (req, res) => {
  const token = req.cookies.auth;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  // Decode the token to get user information; use JWT or other methods in real-world apps
  const [username, password] = token.split(':');

  // Here, you can also verify the username and password against the database, but we're simplifying for this example.

  return res.status(200).json({ message: 'Authenticated.', user: { username } });
};
