const jwt = require('jsonwebtoken');
const db = require('./db');

exports.login = async (req, res) => {
  const {email, password} = req.body;
  //  const user = db.selectUser(email,password);
  const result = await db.selectUser(email, password);
  // goes down here
  console.log('eteAuth', result);
  if (result) {
    const accessToken = jwt.sign(
      {id: result.id, email: result.email},
      process.env.SECRET,
      {expiresIn: '30m', algorithm: 'HS256'},
    );
    res.status(200).json({
      name: result.name,
      accessToken: accessToken,
    });
  } else {
    console.log('how do I get here');
    res.status(401).send('Invalid credentials');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const parts = authHeader.split(' ');
  const token = parts[1];
  const decoded = jwt.verify(token, process.env.SECRET);
  req.user = {
    id: decoded.id,
    email: decoded.email,
  };
  next();
};
