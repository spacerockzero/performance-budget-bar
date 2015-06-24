'use strict';

window.perfBudgetBar = window.perfBudgetBar || {};

(function(){

  var budget = require('./budget.json');
  console.log('budget:', budget);
  var template = require('./template.hbs');
  console.log('template', template);

}());
