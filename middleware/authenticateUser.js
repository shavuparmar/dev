const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No token provided");
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log("Token extracted:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ error: 'Token is not valid' });
  }
};


export default authenticateUser
