require("dotenv").config();

const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-0ecb37da-fb96-40df-8fb5-90951c489399",
  subscribeKey: "sub-c-b54cebc1-4657-4375-98e4-9c6af4fccc5b",
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
