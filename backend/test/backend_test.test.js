const supertest = require('supertest');
const http = require('http');
const db = require('./db');
const app = require('../src/app');

let server;
let request;


const loginAndGetToken = async (email, password) => {
  const response = await request
    .post('/v0/login')
    .send({email, password});
  return response.body.accessToken;
};

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

describe('Authentication', () => {
  const testUser = {
    email: 'molly@books.com',
    password: 'mollymember',
  };

  test('POST /v0/login - Successful login', async () => {
    const response = await request
      .post('/v0/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  test('POST /v0/login - Invalid credentials Username', async () => {
    await request
      .post('/v0/login')
      .send({email: 'wrong@example.com', password: 'mollymember'})
      .expect(401);
  });
  test('POST /v0/login - Invalid credentials', async () => {
    await request
      .post('/v0/login')
      .send({email: 'molly@books.com', password: 'wrongpassword'})
      .expect(401);
  });
});

describe('Workspaces', () => {
  let validToken;

  beforeAll(async () => {
    validToken = await loginAndGetToken('molly@books.com', 'mollymember');
  });

  test('GET /v0/workspaces - Get workspaces (authenticated)', async () => {
    const response = await request
      .get('/v0/workspaces')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((workspace) => {
      expect(workspace).toHaveProperty('id');
    });
  });

  test('GET /v0/workspaces - Unauthorized access', async () => {
    await request
      .get('/v0/workspaces')
      .expect(401);
  });

  test('GET /v0/workspaces - Invalid token', async () => {
    await request
      .get('/v0/workspaces')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(500);
  });
});

describe('Channels', () => {
  let validToken;
  let workspaceId;

  beforeAll(async () => {
    validToken = await loginAndGetToken('molly@books.com', 'mollymember');
    // Get a valid workspaceId
    const workspacesResponse = await request
      .get('/v0/workspaces')
      .set('Authorization', `Bearer ${validToken}`);
    workspaceId = workspacesResponse.body[0].id;
  });

  test('GET /v0/channels - Get channels (authenticated)', async () => {
    const response = await request
      .get('/v0/channels')
      .query({workspaceId})
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(Array.isArray(response.body.channels)).toBeTruthy();
    response.body.channels.forEach((channel) => {
      expect(channel).toHaveProperty('channel_id');
      expect(channel).toHaveProperty('channel_name');
      expect(channel).toHaveProperty('channel_data');
    });
  });

  test('GET /v0/channels - Unauthorized access', async () => {
    await request
      .get('/v0/channels')
      .query({workspaceId})
      .expect(401);
  });

  test('GET /v0/channels - Missing workspaceId', async () => {
    await request
      .get('/v0/channels')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(400);
  });
});

describe('Channel Messages', () => {
  let validToken;
  let channelId;

  beforeAll(async () => {
    validToken = await loginAndGetToken('molly@books.com', 'mollymember');
    // Get a valid channelId
    const workspacesResponse = await request
      .get('/v0/workspaces')
      .set('Authorization', `Bearer ${validToken}`);
    const workspaceId = workspacesResponse.body[0].id;

    console.log('workspaceID test', workspaceId);
    const channelsResponse = await request
      .get('/v0/channels')
      .query({workspaceId})
      .set('Authorization', `Bearer ${validToken}`);
    channelId = channelsResponse.body.channels[0].channel_id;
  });

  test('POST /v0/messages - Successfully Sent Message', async () => {
    const messageContent = 'Test message ' + Date.now();
    await request
      .post('/v0/messages')
      .set('Authorization', `Bearer ${validToken}`)
      .send({channelId, content: messageContent})
      .expect(201);
  });

  test('POST /v0/messages - Invalid channel', async () => {
    await request
      .post('/v0/messages')
      .set('Authorization', `Bearer ${validToken}`)
      .send({channelId: 'ivalid challe', content: 'Invalid channel message'})
      .expect(400);
  });

  test('POST /v0/messages - Invalid channel with valid UUID', async () => {
    await request
      .post('/v0/messages')
      .set('Authorization', `Bearer ${validToken}`)
      .send({channelId: '71a08843-7d04-4777-9c91-3009c5d7062c',
        content: 'Invalid channel message'})
      .expect(404);
  });
});

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});
