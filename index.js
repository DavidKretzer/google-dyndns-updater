#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');

const { username, password, domain } = require('./config.json');
const UPDATE_TIME = 300000;

const logFileName = `dns-update-${new Date().toISOString().slice(0, 10)}.log`;
const logStream = fs.createWriteStream(logFileName, { flags: 'a' });

function logMessage(message) {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${message}`);
  logStream.write(`[${now}] ${message}\n`);
}

let lastIp = null;

const getPublicIp = async () => {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json');
    const { ip } = data;
    logMessage(`IP address obtained: ${ip}`);
    return ip;
  } catch (error) {
    logMessage(`Error obtaining IP address: ${error}`);
    return null;
  }
};

const sendUpdate = async (ip) => {
  try {
    const { data } = await axios.get(`https://${username}:${password}@domains.google.com/nic/update?hostname=${domain}&myip=${ip}`, { responseType: 'text' });
    logMessage(`Update sent to Google Domains API: ${data}`);
  } catch (error) {
    logMessage(`Error sending update to Google Domains API: ${error}`);
  }
};

const updateDNS = async () => {
  const ip = await getPublicIp();
  if (ip === null) return logMessage('No public IP address given.');
  if (ip !== lastIp) {
    lastIp = ip;
    await sendUpdate(ip);
  } else logMessage('No update sent since the IP address is the same.');
};

logMessage('Google Domains Dynamic DNS script started.');
updateDNS();
const intervalID = setInterval(updateDNS, UPDATE_TIME);

process.on('beforeExit', () => {
  clearInterval(intervalID);
});