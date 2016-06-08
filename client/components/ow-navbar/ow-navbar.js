'use strict';
// Usage:
// 
// <ow-navbar params="activePage$: activePage$"></ow-navbar>
// <ow-navbar params="activePage$: activePage$, outputHasSubNav: pageHasSubNav"></ow-navbar>
// 
// activePage$ - this is the pager.js activePage$, exposed as a root-level observable.
// outputHasSubNav - (optional, boolean) output observable, set true when the selected page has a subnav/children.
// 
define(["jquery", "lodash", "knockout"], function ($, _, ko) {
  return function (params) {
    if (!params.activePage$) {
      throw new Error('Missing "activePage$" param.');
    }

    // Returns the top-level active page.
    var navActivePrimaryPage = ko.computed(function() {
      var primaryPage = params.activePage$();
      while (primaryPage.parentPage && primaryPage.parentPage.getId()) {
        primaryPage = primaryPage.parentPage;
      }
      return primaryPage;
    });

    // Returns true if the primary nav has children.
    var navActivePrimaryHasChildren = ko.computed(function() {
      return navActivePrimaryPage().children().length;
    });

    // Events
    ko.computed(function() {
      if (!_.isUndefined(params.outputHasSubNav)) {
        params.outputHasSubNav(navActivePrimaryHasChildren());
      }
    });

    return {
      navActivePrimaryPage: navActivePrimaryPage,
      navActivePrimaryHasChildren: navActivePrimaryHasChildren
    };
  };
});