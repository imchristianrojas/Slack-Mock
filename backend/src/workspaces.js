
const db = require('./db');

exports.getWorkSpaces = async (req, res) => {
  console.log('User object:', req.user);
  // if (!req.user || !req.user.id) {
  //   return res.status(401).json({message: 'User not authenticated'});
  // }
  const userId = req.user.id;
  console.log('Fetching workspaces for user ID:', userId);
  const workSpaces = await db.selectWorkspaces(userId);
  for (const workspace of workSpaces) {

  //  console.log('These are the workspace names:',workspaceNames);
  res.status(200).json(workSpaces);
};

exports.getWorkSpaceChannels = async (req, res) => {
  const userId = req.user.id;
  const workspaceId = req.query.workspaceId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!workspaceId) {
    return res.status(400).json({ message: 'Workspace ID is required' });
  }

  try {
    const channels = await db.selectChannels(workspaceId, userId);
    res.status(200).json({ channels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}};
