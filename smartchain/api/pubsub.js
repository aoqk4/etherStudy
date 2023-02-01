require("dotenv").config();

const PubNub = require("pubnub");

const credentials = {
  publishKey: process.env.publishKey,
  subscribeKey: process.env.subscribeKey,
  secretKey: process.env.SECRET_KEY,
  userId: "ljs",
};

const CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK",
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);
    this.subscribeToChannels();
    this.listen();
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP),
    });
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  listen() {
    this.pubnub.addListener({
      message: (messageObject) => {
        console.log("messageObject", messageObject);
      },
    });
  }
}

module.exports = PubSub;

const pubsub = new PubSub();

setTimeout(() => {
  pubsub.publish({
    channel: CHANNELS_MAP.TEST,
    message: "foo",
  });
}, 3000);
