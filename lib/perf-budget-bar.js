window.speedbar = window.speedbar || {};

(function(doc, speedbar){
  require('./style.css');
  var budget = require('./budget.json');
  var template = require('./template.js');

  speedbar.init = function(){

    this.el = document.createElement('div');
    this.el.innerHTML = template;
    document.body.appendChild(this.el);

  };

  // get current perf metrics
  // render template with them
  // validate current metrics against budget
  // inject bar onto page

  window.addEventListener('onload', speedbar.init());

}(document, window.speedbar));
