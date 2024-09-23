const db = require('./db');

exports.send = async (req, res) => {
  const {channelId, content} = req.body;
  const userId = req.user.id;
  //  console.log('This is in send:', channelId, userId, content);
  const updatedChannel = await db.updateChannel(channelId, userId, content);
  if (updatedChannel) {
    res.status(201).json({message: 'Message sent successfully'});
  } else {
    res.status(404).json({message: 'Channel not found'});
  }
};
