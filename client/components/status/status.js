define(['knockout', 'jquery', 'lodash'], function (ko, $, _) {
  'use strict';

  var AppStatusViewModel = function AppStatusViewModel() {

    var viewModel = {
      revision: ko.observable(),
      buildTime: ko.observable(),
      buildNumber: ko.observable(),
      startupTime: ko.observable(),
      statusChecks: ko.observableArray(),
      serverDependencies: ko.observableArray(),
      clientDependencies: ko.observableArray(),
      config: ko.observableArray()
    };

    $.ajax('/api/status')
      .then(function (responseData) {
        _.forEach(responseData, function (value, prop) {
          if (viewModel[prop] instanceof Function) {
            viewModel[prop](value);
          }
        });
      });

    return viewModel;
  };

  return AppStatusViewModel;
});