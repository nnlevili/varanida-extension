//== Class definition
var DataSlider = function() {
  var state = {
    initiated: false,
    sliderRef: null
  };

  //== Daily Activity chart.
  //** Based on noUi slider plugin - https://refreshless.com/nouislider/

  var createSlider = function(currentLevel, completionLevel) {
    state.sliderRef = uDom.nodeFromId('varanida-slider-container');
    if (state.sliderRef.length === 0) {
      return;
    }
    var authorizedRange = completionLevel || 0;
    var paddingRight = 3 - authorizedRange;
    noUiSlider.create(state.sliderRef, {
      range: {
          min: [0],
          max: [3]
      },
      step: 1,
      connect: [true, false],
      start: [currentLevel],
      padding: [0, paddingRight],
      pips: {mode:"count", values:4, density:33}
    });
    //make pips clickable
    var pips = state.sliderRef.querySelectorAll('.noUi-value');

    function clickOnPip() {
        var value = Number(this.getAttribute('data-value'));
        state.sliderRef.noUiSlider.set(value);
    }
    for ( var i = 0; i <= authorizedRange; i++ ) {
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
    }
    // add background for allowed range
    if (authorizedRange > 0) {
      var allowedRangeScale = authorizedRange/3;
      var allowedRangeElem = document.createElement('div');
      allowedRangeElem.className = 'noUi-connect noUi-allowed-range';
      allowedRangeElem.style = 'transform: translate(0%, 0px) scale('+allowedRangeScale+', 1);'
      var connects = state.sliderRef.querySelector('.noUi-connects');
      connects.appendChild(allowedRangeElem);
    }

  };
  state.init = function(currentLevel, completionLevel) {
    createSlider(currentLevel, completionLevel);
    state.initiated = true;
  };
  state.attachListener = function(listener) {
    state.sliderRef.noUiSlider.on('set', function(values, _, unencoded){
      listener(unencoded[0]);
    });
  }
  return state;
}();
