/*******************************************************************************

    Varanida - a browser extension to block requests.
    Copyright (C) 2018 Varanida

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

    Home: https://github.com/Varanida/varanida-extension/
*/

/******************************************************************************/

(function() {

'use strict';

/******************************************************************************/

var messaging = vAPI.messaging;
var password = undefined;
var privkey = undefined;
var userDataStore = undefined;
var walletInfoStore = undefined;
var walletIsUnlocked = false;

/******************************************************************************/

var calculateNewCompletionLevel = function() {
  if (userDataStore &&
      userDataStore.level1 &&
      userDataStore.level1.userBirthdate &&
      userDataStore.level1.userCity &&
      userDataStore.level1.userGender &&
      userDataStore.level1.userMotherTongue &&
      userDataStore.level1.userEducationLevel &&
      userDataStore.level1.userRelationshipStatus &&
      userDataStore.level1.userHasKids &&
      userDataStore.level1.userWorkStatus &&
      userDataStore.level1.userIndustry) {
      if (userDataStore.level2 &&
            userDataStore.level2.userShareLocation &&
            userDataStore.level2.userSharePreferences) {
            if (userDataStore.level3 &&
                userDataStore.level3.userShareSession &&
                userDataStore.level3.userShareBrowsingHistory) {
                return 3;
            } else {
                return 2;
            }
      } else {
          return 1;
      }
  } else {
      return 0;
  }
};

/******************************************************************************/

var displayCompletionLevel = function(level) {

    uDom.nodeFromSelector('.currentLevel').style.setProperty("display", "none");
    if (level === 3) {
        uDom.nodeFromId('currentLevel3').style.setProperty("display", "block");
    } else if (level === 2) {
        uDom.nodeFromId('currentLevel2').style.setProperty("display", "block");
    } else if (level === 1){
        uDom.nodeFromId('currentLevel1').style.setProperty("display", "block");
    } else {
        uDom.nodeFromId('currentLevel0').style.setProperty("display", "block");
    }
    uDom.nodeFromId('profileLevel3Checked').style.setProperty("display", level > 2 ? "block" : "none");
    uDom.nodeFromId('profileLevel2Checked').style.setProperty("display", level > 1 ? "block" : "none");
    uDom.nodeFromId('profileLevel1Checked').style.setProperty("display", level > 0 ? "block" : "none");

};
/******************************************************************************/

var browseLevels = function(ev) {
    uDom('.m-wizard__step').removeClass("m-wizard__step--current");
    uDom(this).addClass("m-wizard__step--current");
    uDom('.m-wizard__form-step').removeClass("m-wizard__form-step--current");
    let level = this.getAttribute("data-level");
    uDom('#m_wizard_form_step_'+level).addClass("m-wizard__form-step--current");
};
/******************************************************************************/

var changeUserProfile = function(level, name, value) {
  if (!userDataStore) {
    userDataStore = {};
  }
  if (!userDataStore['level'+level]) {
    userDataStore['level'+level] = {};
  }
  userDataStore['level'+level][name] = value;

  //Display level
  displayCompletionLevel(calculateNewCompletionLevel());
};

/******************************************************************************/

var onInputChanged = function(ev) {
    var input = ev.target;
    var level = this.getAttribute('data-setting-level');
    var name = this.getAttribute('data-setting-name');
    var type = this.getAttribute('data-setting-type');
    var value = input.value;
    if(type === "checkbox"){
        value = uDom(this).prop('checked');
    }
    if ( value !== input.value ) {
        input.value = value;
    }
    changeUserProfile(level, name, value);
};

/******************************************************************************/

var onPreventDefault = function(ev) {
    ev.target.focus();
    ev.preventDefault();
};

/******************************************************************************/

var onUserDataReceived = function(data) {
  if (typeof data !== 'string') {
    userDataStore = data;
    walletIsUnlocked = true;
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
        if (data['level'+uNode.attr('data-setting-level')]) {
            uNode.val(data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')]);
        }
    });
    uDom('[data-setting-type="checkbox"]').forEach(function(uNode) {
      if (data['level'+uNode.attr('data-setting-level')]) {
          uNode.prop('checked', data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')] === true);
      }
    });
      uDom('[data-setting-type="radio"]').forEach(function(uNode) {
          if (data['level'+uNode.attr('data-setting-level')]) {
              uNode.prop('checked', data['level'+uNode.attr('data-setting-level')][uNode.attr('data-setting-name')] === uNode.attr('value'));
          }
      });
    renderPage();
    displayCompletionLevel(calculateNewCompletionLevel());
  } else {
      uDom.nodeFromId('errorUnlockWalletMessage').style.setProperty("display", "block");
      uDom.nodeFromId('errorUnlockWalletMessagePasswordEmpty').style.setProperty("display", "block");
  }
};

/******************************************************************************/

var onUnlockWallet = function() {
    password = uDom.nodeFromId("unlock-password").value;
    privkey = uDom.nodeFromId("unlock-privkey").value;
    messaging.send('dashboard', { what: 'getUserData', password: password , privKey: privkey}, onUserDataReceived);
};

/******************************************************************************/

var onLockWallet = function() {
    var onLockHandler = function() {
        password = undefined;
        privkey = undefined;
        userDataStore = undefined;
        walletIsUnlocked = false;
        renderPage();
    };
    messaging.send('dashboard', { what: 'lockWallet' }, onLockHandler);
};

/******************************************************************************/

var onProfileSave = function() {
    let newCompletionLevel = calculateNewCompletionLevel();
    messaging.send(
        'dashboard',
        {
            what: 'setUserData',
            password: password,
            newCompletionLevel: newCompletionLevel,
            data: userDataStore
        }
    );
};

/******************************************************************************/

var renderPage = function() {
  if ( !walletInfoStore || !walletInfoStore.hasWallet) {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "none");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "block");
  } else if ( !walletIsUnlocked ) {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "none");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "block");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "none");
    uDom.nodeFromId('errorUnlockWalletMessage').style.setProperty("display", "none");
    if ( walletInfoStore && walletInfoStore.onlyAddress ) {
      uDom.nodeFromId('userUnlockWalletWithPassword').style.setProperty("display", "none");
      uDom.nodeFromId('userUnlockWalletWithPrivkey').style.setProperty("display", "block");
    } else {
      uDom.nodeFromId('userUnlockWalletWithPassword').style.setProperty("display", "block");
      uDom.nodeFromId('userUnlockWalletWithPrivkey').style.setProperty("display", "none");
    }
  } else {
    uDom.nodeFromId('userProfileForm').style.setProperty("display", "block");
    uDom.nodeFromId('userUnlockWallet').style.setProperty("display", "none");
    uDom.nodeFromId('userHasNoWallet').style.setProperty("display", "none");
  }
};

/******************************************************************************/

var onReadWalletUnlocked = function(isUnlocked) {
    walletIsUnlocked = isUnlocked;
    if (isUnlocked) {
        onUnlockWallet();
    } else {
        renderPage();
    }
};

/******************************************************************************/

var onReadWalletInfo = function(walletInfo) {
  walletInfoStore = walletInfo;
  if (walletInfo) {
      messaging.send('dashboard', { what: 'isWalletUnlocked' }, onReadWalletUnlocked);
  } else {
      renderPage();
  }
};

/******************************************************************************/

uDom.onLoad(function() {
    messaging.send('dashboard', { what: 'getWalletInfo' }, onReadWalletInfo);
    uDom('#unlockWalletButton').on('click', onUnlockWallet);
    uDom('#lockWalletButton').on('click', onLockWallet);
    uDom('#profileSaveButton').on('click', onProfileSave);
    uDom('[data-setting-type="input"]').forEach(function(uNode) {
      uNode.on('change', onInputChanged).on('click', onPreventDefault);
    });
    uDom('[data-setting-type="checkbox"]').forEach(function(uNode) {
        uNode.on('click', onInputChanged);
    });
    uDom('[data-setting-type="radio"]').forEach(function(uNode) {
      uNode.on('click', onInputChanged);
    });
    uDom('.m-wizard__step').on('click', browseLevels);
});

/******************************************************************************/

})();