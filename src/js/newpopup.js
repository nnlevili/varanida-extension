
(function() {
var chartData = null;
var getChartRawData = function(callback) {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://api.varanida.com/api/vad/activityTodayPerHour/0x1909e4f2d28273a3411a3c341bf7bcb9393af405";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var data = JSON.parse(this.responseText);
        if (data) {
          console.log(data);
          return callback && callback(data);
        }
      }
      callback && callback(false);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

var curateChartData = function(data, callback) {
  if (!data || !Array.isArray(data)) {
    callback && callback(false);
  }
  var dateCorrespondanceObj = {};
  var dateArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var limitedTotalArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var totalArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  var currentTime = moment();
  var currentServerTime = moment().utc();
  var currentTimeShift, currentServerTimeShift;
  for (var i = 0; i < 24; i++) {
    currentTimeShift = currentTime.subtract(i?1:0,"hours").format("YYYY-MM-DD HH");
    currentServerTimeShift = currentServerTime.subtract(i?1:0,"hours").format("YYYY-MM-DD HH");
    dateArray[24 - i - 1] = currentTime.format("D MMM HH")+":00";
    dateCorrespondanceObj[currentServerTimeShift] = 24 - i - 1;
  }
  var firstTime = currentServerTime;// no need to go back further than that point
  var dataIndex;
  console.log(dateCorrespondanceObj);
  console.log(dateArray);
  for (var i = data.length - 1; i >= 0; i--) {
    /*
    {
      "hours": "2018-04-29 01",
      "total": 142,
      "limitedTotal": 142,
      "earnings": 0.355
    }
    */
    console.log("handling", data[i].hours);
    dataIndex = dateCorrespondanceObj[data[i].hours];
    if (!dataIndex && dataIndex !== 0) {
      console.log("no data index");
      continue;
    }
    limitedTotalArray[dataIndex] = data[i].limitedTotal;
    totalArray[dataIndex] = data[i].total;
  }
  console.log(limitedTotalArray);
  console.log(totalArray);
  chartData = {labels: dateArray, totals: totalArray, limitedTotals: limitedTotalArray};
  callback && callback(chartData);
}

var getChartData = function(callback) {
  getChartRawData(function(data) {curateChartData(data, callback)});
}

document.addEventListener("DOMContentLoaded", function(event) { //on document ready
  //open close dropdown (side menu)
  var dropdownToggle = document.getElementById('dropdown-toggle');
  var dropdown = document.getElementById("m_quick_sidebar");
  var dropdownClose = document.getElementById('m_quick_sidebar_close');
  var slideDropdown = function() {
    dropdown.style.right = 0;
  }
  var slideBackDropdown = function() {
    dropdown.style.right = null;
  }
  dropdownToggle.addEventListener("click",slideDropdown);
  dropdownClose.addEventListener("click",slideBackDropdown);

  //change tab
  var tabs = {
    params: document.getElementById('params-tab'),
    stats:  document.getElementById('stats-tab')
  };
  var panes = {
    params: document.getElementById('params-pane'),
    stats:  document.getElementById('stats-pane')
  };

  var openPane = function(paneName) {
    console.log(paneName);
    var activePane = document.getElementsByClassName("tab-pane active");
    var activeTab = document.getElementsByClassName("nav-link active");
    activePane[0].classList.remove("active");
    activeTab[0].classList.remove("active");
    panes[paneName].classList.add("active");
    tabs[paneName].classList.add("active");
  }
  var drawChart = function(exp) {
    if (Dashboard.drawn) {
      console.log("already drawn");
      return;
    }
    if (Dashboard.initiated) {
      if (chartData) {
        Dashboard.draw(chartData);
      }
    } else {
      var newExp = (exp || 100) * 2;
      console.log("chart not initiated");
      setTimeout(function() {drawChart(newExp)}, newExp);
    }
  }
  var openFunctions = {
    params: function() {openPane("params")},
    stats:  function() {
      openPane("stats");
      if (chartData) {
        drawChart();
      } else {
        getChartData(function() {
          drawChart();
        });
      }
    }
  };
  for (var tab in tabs) {
    if (tabs.hasOwnProperty(tab)) {
      tabs[tab].addEventListener("click",openFunctions[tab]);
    }
  }

  //initialise toggles and add toggles click events
  var toggleFunction = function(toggleElement,onckecked,onunchecked) {
    if (toggleElement.checked == true) {
      onckecked();
    } else {
      onunchecked();
    }
  }

  var toggleButtons = {
    mainOnOffToggle: document.getElementById('main-onoff-toggle'),
    noPopup: document.getElementById('no-popup'),
    noLargeMedia: document.getElementById('no-large-media'),
    noCosmeticFiltering: document.getElementById('no-cosmetic-filtering'),
    noRemoteFonts: document.getElementById('no-remote-fonts')
  };

  var toggleStates = {
    mainOnOffToggle: true,
    noPopup: false,
    noLargeMedia: false,
    noCosmeticFiltering: true,
    noRemoteFonts: false
  };

  var toggleFunctionList = {
    mainOnOffToggle: function() {
      var onchecked = function() {
        console.log("toggling on");
      };
      var onunchecked = function() {
        console.log("toggling off");
      };
      toggleFunction(toggleButtons.mainOnOffToggle,onchecked,onunchecked)
    },
    noPopup: function() {
      var onchecked = function() {
        console.log("toggling popup on");
      };
      var onunchecked = function() {
        console.log("toggling popup off");
      };
      toggleFunction(toggleButtons.noPopup,onchecked,onunchecked)
    },
    noLargeMedia: function() {
      var onchecked = function() {
        console.log("toggling large media on");
      };
      var onunchecked = function() {
        console.log("toggling large media off");
      };
      toggleFunction(toggleButtons.noLargeMedia,onchecked,onunchecked)
    },
    noCosmeticFiltering: function() {
      var onchecked = function() {
        console.log("toggling cosmetic on");
      };
      var onunchecked = function() {
        console.log("toggling cosmetic off");
      };
      toggleFunction(toggleButtons.noCosmeticFiltering,onchecked,onunchecked)
    },
    noRemoteFonts: function() {
      var onchecked = function() {
        console.log("toggling fonts on");
      };
      var onunchecked = function() {
        console.log("toggling fonts off");
      };
      toggleFunction(toggleButtons.noRemoteFonts,onchecked,onunchecked)
    }
  };
  for (var toggleButton in toggleButtons) {
    if (toggleButtons.hasOwnProperty(toggleButton)) {
      toggleButtons[toggleButton].checked = toggleStates[toggleButton];
    }
  }
  for (var toggleButton in toggleButtons) {
    if (toggleButtons.hasOwnProperty(toggleButton)) {
      toggleButtons[toggleButton].addEventListener("click",toggleFunctionList[toggleButton]);
    }
  }

  // add events on buttons
  var settingsButton = document.getElementById('settings-button');
  var loggerButton = document.getElementById("logger-button");
  var openSettings = function() {
    console.log("open settings");
  }
  var openLogger = function() {
    console.log("open logger");
  }
  settingsButton.addEventListener("click",openSettings);
  loggerButton.addEventListener("click",openLogger);

// emulation of existing ublock function no need to import

  //display wallet
  var renderWallet = function(address) {
    var walletAddress = address;
    var abscentWalletPane = document.getElementById('abscentWallet');
    var existingWalletPane = document.getElementById('existingWallet');
    var abscentWalletAddressPane = document.getElementById('abscentWalletAddress');
    var existingWalletAddressPane = document.getElementById('existingWalletAddress');
    if (walletAddress) {
      var addressInput = document.getElementById("address-field");
      addressInput.value = walletAddress;
      document.getElementById('total-reward').textContent = "322.99 VAD";
      abscentWalletPane.style.setProperty("display", "none");
      existingWalletPane.style.setProperty("display", "flex");
      abscentWalletAddressPane.style.setProperty("display", "none");
      existingWalletAddressPane.style.setProperty("display", "block");

    } else {
      abscentWalletPane.style.setProperty("display", "flex");
      existingWalletPane.style.setProperty("display", "none");
      abscentWalletAddressPane.style.setProperty("display", "block");
      existingWalletAddressPane.style.setProperty("display", "none");
    }
  }
  renderWallet("0x188782ebcEb28748fa1fcB99A7D92B758919c101");

  var showOverlay = function(overlayId, params) {
    var overlaysContainer = document.getElementById("overlays");
    var overlay = document.getElementById(overlayId);
    if (overlayId === "showSeedOverlay" && params) {
      var seedContainer = document.getElementById("seed-field");
      seedContainer.value = params.seed;
    } else if (overlayId === "infoOverlay" && params) {
      document.getElementById("info-overlay-title").textContent = params.title || vAPI.i18n('popupInfoOverlayDefaultTitle');
      document.getElementById("info-overlay-text").textContent = params.text || "";
      document.getElementById("info-validate-button-overlay").textContent = params.button || vAPI.i18n('popupInfoOverlayDefaultButton');
    } else if (overlayId === "importWalletOverlay") {
      var startOverlayPanel = document.getElementById("importMethodOverlayPanel");
      startOverlayPanel.style.setProperty("display", "block");
    }
    if (overlay) {
      overlaysContainer.style.setProperty("display", "block");
      overlay.style.setProperty("display", "block");
      return true;
    } else {
      console.log("overlay not found");
      return false;
    }
  }
  // showOverlay("showSeedOverlay",{seed:"safe rather advice asset copy entire sound cable mean boat sniff olympic"});
  // showOverlay("infoOverlay");
});
window.addEventListener("load", function(event) { //on document ready
  Dashboard.init();
});
})();
