define([
  'components',
  'bindings',
  'jquery',
  'knockout',
  'pager',
  'bootstrap', // must be placed after pager
  'bootstrap-datepicker',
  'select2',
  'jreject'
], function(components, bindings, $, ko, pager) {
  
  $(document).ready(function() {

    // show a warning for old browsers (<= IE 9)
    // for more options, see http://jreject.turnwheel.com/
    // Note that since we're using jquery 2, this modal will not run for IE <= 8. For those ancient versions, there's a conditional comment in layouts/main.hbs
    $.reject({
      reject: {
        msie: 9
      },
      imagePath: './bower_components/jreject/images/'
    });

    // VIEWMODEL //
    var viewModel = { 
      pageHasSubNav: ko.observable(false)  // this lives in the top-level page view-model so it can be used in a data-bind 
                                           // on the body element to trigger descendant CSS selectors on other elements
    };

    // SPA ROUTING //
    // use #!/ instead of the default #
    pager.Href.hash = '#!/';
    // extend your view-model with pager.js for SPA routing and history
    pager.extendWithPage(viewModel);

    // Add observable for the current page.
    viewModel.activePage$ = pager.activePage$;

    // Register components
    components.forEach(function(component) {
      ko.components.register(component.name, {
        viewModel: component.viewModel ? { require: component.viewModel } : undefined,
        template: { require: 'text!' + component.template }
      });
    });

    // Load bindings
    require(bindings, function() {  // eslint-disable-line global-require

      // BIND/START KO //
      // apply the view-model using KnockoutJS as normal
      ko.applyBindings(viewModel);
      
      // start pager.js
      pager.start();

    });
  });
});