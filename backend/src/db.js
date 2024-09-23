const {Pool} = require('pg');
const bcrypt =require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectUser = async (email, password) => {
  const query = `
    SELECT id, user_data
    FROM user_profile
    WHERE user_data->>'email' = $1;
  `;
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const storedPassword = user.user_data.password;

  if (await bcrypt.compare(password, storedPassword)) {
    console.log('we are herev12');
    return {
      id: user.id,
      ...user.user_data,
    };
  } else {
    return null;
  }
};

exports.selectWorkspaces = async (userId) => {
  const query = `
  SELECT w.id, w.workspace_data->>'name' AS name 
  FROM workspaces w
  JOIN workspace_members wm ON w.id = wm.workspace_id
  WHERE wm.user_id = $1
`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

exports.selectChannels = async (workspaceID, userID) => {
  const query = `
  SELECT DISTINCT c.id AS channel_id, c.channel_data->>'name' AS channel_name,
  c.channel_data
  FROM channels c
  JOIN workspace_members wm ON c.workspace_id = wm.workspace_id
  WHERE wm.workspace_id = $1 AND wm.user_id = $2
  `;
  const result = await pool.query(query, [workspaceID, userID]);
  return result.rows;
};

exports.updateChannel = async (channelId, userId, content) => {
  const client = await pool.connect();
  await client.query('BEGIN');

  console.log('this is the stuff', channelId, userId, content);


  const userQuery = `
    SELECT user_data->>'name' AS name
    FROM user_profile
    WHERE id = $1
  `;
  const userResult = await client.query(userQuery, [userId]);
  console.log('HERE!', userResult.rows[0].name);
  const userName = userResult.rows[0].name;


  const getChannelQuery = `
    SELECT channel_data
    FROM channels
    WHERE id = $1
  `;
  const channelResult = await client.query(getChannelQuery, [channelId]);
  if (channelResult.rows.length === 0) return null;
  const channelData = channelResult.rows[0].channel_data;


  const newMessage = {from: userName, message: content};
  channelData.content.push(newMessage);


  const updateQuery = `
    UPDATE channels
    SET channel_data = $1
    WHERE id = $2
    RETURNING id
  `;
  const updateResult = await client.query(
    updateQuery, [channelData, channelId]);

  await client.query('COMMIT');
  client.release();
  return updateResult.rows[0];
};
