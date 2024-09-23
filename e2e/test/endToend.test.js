
const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/assets', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'dist', 'assets')))
      .get('*', function(req, res) {
        res.sendFile('index.html',
          {root: path.join(__dirname, '..', '..', 'frontend', 'dist')});
      }),
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll(async () => {
  await backend.close();
  await frontend.close();
  setImmediate(function() {
    frontend.emit('close');
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    // Use these settings if you want to see the browser
    // headless: false,
    slowMo: 20,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  page = await browser.newPage();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  const childProcess = browser.process();
  if (childProcess) {
    await childProcess.kill(9);
  }
});


test('Login, select Workspace, select channel', async () => {
  // Wait for the login page to load
  await page.waitForSelector('text/Slack(MOCK) Sign In');

  // Fill in login credentials
  await page.type('#email', 'molly@books.com');
  await page.type('#password', 'mollymember');

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for the home page to load
  await page.waitForSelector('text/Workspaces');

  // Open the workspace dropdown
  await page.click('#workspace-select');

  // Select 'Jedi Order' workspace
  await page.click('text/Jedi Council');

  // Wait for channels to load and select 'Force Lecture' channel
  await page.waitForSelector('text/# Jedi Code');
  await page.click('text/# Jedi Code');

  // Wait for channel data to load and verify its content
  const data = await page.$eval(
    '::-p-text(Obi Wan)',
    (el) => el.textContent,
  );
  expect(data).toContain('Obi Wan');

  // Click the back arrow
  await page.click('button[aria-label="back"]');

  // Wait for the workspace view to reappear
  await page.waitForSelector('text/Workspaces');

  // Click the logout button
  await page.click('text/Logout');

  // Verify that we're back on the login page
  await page.waitForSelector('text/Slack(MOCK) Sign In');
}, 30000); // Increase timeout to 30 seconds

test('Initial View', async () => {
  const label = await page.waitForSelector(
    '::-p-text(Slack(MOCK) Sign In');
  expect(label).not.toBeNull();
});

test('login, select Workspace, select channel, send chat',
  async () => {
  // Wait for the login page to load
    await page.waitForSelector('text/Slack(MOCK) Sign In');

    // Fill in login credentials
    await page.type('#email', 'molly@books.com');
    await page.type('#password', 'mollymember');

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for the home page to load
    await page.waitForSelector('text/Workspaces');

    // Open the workspace dropdown
    await page.click('#workspace-select');

    // Select 'Jedi Council' workspace
    await page.click('text/Jedi Council');

    // Wait for channels to load and select 'Jedi Code' channel
    await page.waitForSelector('text/# Jedi Code');
    await page.click('text/# Jedi Code');

    // Wait for channel data to load and verify its content
    const data = await page.$eval(
      '::-p-text(Obi Wan)',
      (el) => el.textContent,
    );
    expect(data).toContain('Obi Wan');

    // Send a new chat message
    const testMessage = 'Hello from End to End Test!';
    const content = await page.content();
    console.log(content);

    await page.screenshot({path: 'debug-screenshot.png'});
    // Wait for the input field to be visible
    await page.waitForSelector('[data-testid="message-input"] input',
      {visible: true});

    // Type the message
    await page.type('[data-testid="message-input"] input', testMessage);
    await page.keyboard.press('Enter');

    // Wait for the message to appear
    await page.waitForSelector(`::-p-text('${testMessage}')`);

    // Click the logout button
    await page.click('text/Logout');

    // Verify that we're back on the login page
    await page.waitForSelector('text/Slack(MOCK) Sign In');
  }, 30000); // Increase timeout to 30 seconds
