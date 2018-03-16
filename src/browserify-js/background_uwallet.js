/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2014-2017 Raymond Hill

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

    Home: https://github.com/gorhill/uBlock
*/


/* global objectAssign */

'use strict';

/******************************************************************************/
const log = require('loglevel');
log.setDefaultLevel(5);
global.log = log;
const KeyringController = require('eth-keyring-controller');

const µWallet = (function() { // jshint ignore:line
    return {
        keyringController: null,
        walletSettings: {
          hasKeyring: false,
          keyringStore: null,
          keyringAddress: null,
          totalRewardCount: 0
        },
    };
})();

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

µWallet.exportPrivKey = function(password, callback) {
  const store = this.keyringController.memStore.getState();
  if (store.isUnlocked) {
    this.keyringController.exportAccount(this.walletSettings.keyringAddress)
    .then(res => callback && callback(res));
  } else {
    this.keyringController.submitPassword(password)
    .then(() => {
      return this.keyringController.exportAccount(this.walletSettings.keyringAddress)
    })
    .then(res => callback && callback(res))
  }
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
    console.log("saving wallet settings");
    console.log(this.walletSettings);
    vAPI.storage.set(this.walletSettings, callback);
};

µWallet.updateRewardCount = function(callback) {
  if (this.walletSettings.hasKeyring) {
    this.walletSettings.totalRewardCount = Math.round(Math.random() * 200000)/100;
    // this.walletSettings.totalRewardCount = 174.32;
  } else {
    this.walletSettings.totalRewardCount = 0;
  }
  //TODO integrate reward query
  vAPI.storage.set({totalRewardCount: this.walletSettings.totalRewardCount},() => {
    console.log("saved new reward", this.walletSettings.totalRewardCount);
    callback(this.walletSettings.totalRewardCount);
  });
};


window.µWallet = µWallet;
/******************************************************************************/
