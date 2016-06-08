define(['knockout', 'moment'], function(ko, moment) {
  'use strict';

/*
 * Formats dates using moment.
 * Usage:
 * <span data-bind="date: {value: value, format: 'ddd, hA'}"></span> --> Sun, 3PM
 *
 */
  ko.bindingHandlers.date = {
    update: function(element, valueAccessor) {
      return ko.bindingHandlers.text.update(element, function() {
        var params = ko.unwrap(valueAccessor());
        return params ? moment(ko.unwrap(params.value)).format(ko.unwrap(params.format)) : '';
      });
    }
  };
});