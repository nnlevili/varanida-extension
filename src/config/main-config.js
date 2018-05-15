'use strict';

window.µConfig = {
  urls: {
    front: "https://www.varanida.com/",
    api: "https://api.varanida.com/"
  },
  aws: {
    identityPoolId: "us-east-1:95c6c669-64ea-43ca-baf6-414758edbf1e",
    region: 'us-east-1',
    kinesis: {
      apiVersion: '2013-12-02'
    }
  },
  rewards: {
    install: 50,
    referral: 20,
    bonusPercentageForData: [0,12,24,36]
  }
};
