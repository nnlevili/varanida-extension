/*******************************************************************************

    Varanida - a browser extension to block requests.
    –– wallet component ––
    Silto (2018)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/Varanida/varanida-extension
*/

'use strict';

/******************************************************************************/
//(to avoid bugs with included libs)
const log = require('loglevel');
log.setDefaultLevel(5);
global.log = log;
//npm dependencies
const AWS = require('aws-sdk');
const KeyringController = require('eth-keyring-controller');
//internal dependencies
const Recorder = require("./recorder.js")

const µWallet = (function() {
    return {
        keyringController: null,
        walletSettings: {
          hasKeyring: false,
          keyringStore: null,
          keyringAddress: null,
          totalRewardCount: 0
        },
        recorder: null,
        kinesis: null,
    };
})();

/*–––––Wallet handling–––––*/

µWallet.storeUpdatesHandler = function(state) {
  if (state) {
    this.walletSettings.keyringStore = state;
    this.saveWalletSettings();
  }
}

µWallet.loadKeyringController = function(initState) {
  const self = this;
  this.keyringController = new KeyringController({
      initState: initState || self.walletSettings.keyringStore || null
  });
  this.keyringController.store.subscribe(this.storeUpdatesHandler.bind(this));
}

// not supposed to be used, here for debugging purposes
µWallet.resetWallet = function() {
  this.keyringController.store.unsubscribe(this.storeUpdatesHandler);
  return this.keyringController && this.keyringController.setLocked()
  .then(() => {
    this.keyringController = null;
    this.walletSettings.keyringAddress = null;
    this.walletSettings.hasKeyring = false;
    this.walletSettings.keyringStore = null;
    this.walletSettings.totalRewardCount = 0;
    return new Promise((resolve, reject) => {
      this.saveWalletSettings(resolve);
    });
  })
  .then(() => {
    this.loadKeyringController();
    console.log("Keyring reset!");
  })
}

µWallet.createNewWallet = function(password, callback) {
  let address = null;
  this.keyringController &&
  this.keyringController.createNewVaultAndKeychain(password)
  .then((memStore) => {
    if (memStore) {
      address = memStore.keyrings[0].accounts[0];
      this.walletSettings.keyringAddress = address;
      this.walletSettings.hasKeyring = true;
      this.saveWalletSettings();
      return this.keyringController.getKeyringForAccount(address);
    }
    return null;
  })
  .then((keyring) => {
    if (!keyring) {
      return null;
    }
    return {
      address: address,
      seed: keyring.mnemonic,
    }
  })
  .then(res => callback && callback(res));
}

µWallet.importWallet = function(password, seed, callback) {
  this.keyringController &&
  this.keyringController.createNewVaultAndRestore(password, seed)
  .then((memStore) => {
    if (memStore) {
      let address = memStore.keyrings[0].accounts[0];
      this.walletSettings.keyringAddress = address;
      this.walletSettings.hasKeyring = true;
      this.saveWalletSettings();
      return {
        seed: seed,
        address: address,
      }
    }
    return null;
  })
  .then(res => callback && callback(res))
}

µWallet.exportWalletInfo = function(password, callback) {
  const store = this.keyringController && this.keyringController.memStore.getState();
  if (!password || password === "") {
    return callback && callback(new Error("password not provided"));
  }
  if (!this.walletSettings.keyringAddress || !store) {
    return callback && callback(null);
  }
  console.log("exporting for address", this.walletSettings.keyringAddress);
  let privKeyProm;
  const self = this;
  if (store.isUnlocked) {
    privKeyProm = this.keyringController.exportAccount(this.walletSettings.keyringAddress)
  } else {
    privKeyProm = this.keyringController.submitPassword(password)
    .then(() => this.keyringController.exportAccount(this.walletSettings.keyringAddress))


    // privKeyProm =  new Promise((resolve) => {
    //   this.keyringController.once('update', () => {
    //     setTimeout(() => resolve(self.keyringController.exportAccount(self.walletSettings.keyringAddress)), 1000);
    //   });
    //   this.keyringController.submitPassword(password)
    // });
  }
  return privKeyProm
  .then(privKey => {
    console.log("exporting keyring for address", self.walletSettings.keyringAddress);
    return self.keyringController.getKeyringForAccount(self.walletSettings.keyringAddress)
    .then(keyring => {
      if (!keyring) {
        return null;
      }
      self.keyringController.setLocked();
      return {
        address: self.walletSettings.keyringAddress,
        privKey: privKey,
        seed: keyring.mnemonic
      };
    })
  })
  .then(res => callback && callback(res),(err) => callback && callback(err))

}

µWallet.loadWallet = function(password, callback) {
  const store = this.keyringController.memStore.getState();
  if (store.isUnlocked) {
    callback && callback(store);
  } else {
    return this.keyringController.submitPassword(password)
    .then(res => callback && callback(res));
  }
}

µWallet.lockWallet = function(callback) {
  const store = this.keyringController.memStore.getState();
  if (store.isUnlocked) {
    this.keyringController.setLocked()
    .then(res => callback && callback(res));
  } else {
    callback && callback(store);
  }
}

µWallet.saveWalletSettings = function(callback) {
    vAPI.storage.set(this.walletSettings, callback);
};

µWallet.saveRewardCount = function(rewardCount, callback) {
  vAPI.storage.set({totalRewardCount: rewardCount},() => {
    callback && callback(rewardCount);
  });
}

µWallet.updateRewardCount = function(callback) {
  // http://api.varanida.com/api/Ads/balance/<adress>
  /*
  {"blockedAds":X,"earnings":X}
  */
  const walletContext = this;
  if (this.walletSettings.hasKeyring && this.walletSettings.keyringAddress) {
    const xmlhttp = new XMLHttpRequest();
    const url = `${µConfig.urls.api}api/Ads/balance/${this.walletSettings.keyringAddress}`;
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200 || this.status === 304) {
          const data = JSON.parse(this.responseText);
          if (data.earnings || data.earnings === 0) {
            walletContext.walletSettings.totalRewardCount = data.earnings;
            walletContext.saveRewardCount(data.earnings);
          }
        }
        callback(walletContext.walletSettings.totalRewardCount);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  } else {
    this.walletSettings.totalRewardCount = 0;
    this.saveRewardCount(0);
    callback(0);
  }
};

/*–––––Recording handling–––––*/
µWallet.loadRecorder = function(initState) {

  // Configure Credentials to use Cognito
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: µConfig.aws.identityPoolId
  });


  AWS.config.region = µConfig.aws.region;

  // We're going to partition Amazon Kinesis records based on an identity.
  // We need to get credentials first, then attach our event listeners.
  AWS.config.credentials.get((err) => {
    // attach event listener
    if (err) {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
    }
    // create kinesis service object
    this.kinesis = new AWS.Kinesis({
        apiVersion: µConfig.aws.kinesis.apiVersion
    });
  });
  this.recorder = new Recorder(initState);
  this.recorder.subscribe(this.recorderUpdatesHandler.bind(this));
  this.recorder.start();
}

µWallet.recorderUpdatesHandler = function(updateType) {
  const pubAddress = this.walletSettings.keyringAddress;
  const partitionKey = this.kinesis.config &&
    this.kinesis.config.credentials &&
    this.kinesis.config.credentials.identityId;

  if (!pubAddress || !partitionKey) {
    console.log("key missing");
    return;
  }
  console.log("record update", updateType);
  const recordOut = this.recorder.readAll();
  const browserInfo = navigator.userAgent;
  console.log(recordOut);
  const recordData = recordOut.map((rec) => {
    /*
    the record sent to kinesis to signal ads that have been blocked.
    we provide minimal information to help detect fraud
    without giving away valuable information about the user's browsing
    the timestamp and filter (which ad filter (regular expression) triggered the request blocking)
    are the only usage relative informations,
    but we think they are not really sensitive
    and can't be used for any targeting whatsoever.
    */
    const kinesisRec = {
      publicAddress: pubAddress,
      createdOn: rec.timestamp,
      partitionKey: partitionKey,
      filter: rec.filter
    };
    return {
      Data: JSON.stringify(kinesisRec),
      PartitionKey: partitionKey
    };
  })
// upload data to Amazon Kinesis
this.kinesis.putRecords({
    Records: recordData,
    StreamName: 'Varanida-flux'
}, function(err, data) {
  if (err) {
      console.error(err);
  }
});
}

window.µWallet = µWallet;
/******************************************************************************/
