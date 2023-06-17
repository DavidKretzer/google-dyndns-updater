# google-dyndns-updater

A simple dynamic dns update program for your google domain.

## Requirements
node 18.16.0
## Config Structure
```json
{
  "domain": "someurl.tld",
  "username": "someusername",
  "password": "somepassword"
}
```
## First time setup
Setup a config.json in the same folder as the index.js and structure it like above. Run `npm i` to install necessary packages.
## How to run
Simply run the index.js using node like this: `node index.js`
