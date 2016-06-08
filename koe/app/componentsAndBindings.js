var path = require('path');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');

// Given a full filename, returns the URL for this template/viewmodel resource.
function translateFilenameToUrl(filename, urlRelativePath) {
  return path.relative(urlRelativePath, filename).replace(new RegExp(_.escapeRegExp(path.sep), 'g'), '/');
}

// Searches recursively through a folder finding all html/js files for components.
// Looks for [name].html.  Looks for an optional matching [name].js in the same folder.
// @param componentsPath {string} - the path of the "components" folder.
// @param urlRelativePath {string} - the base path where URLs will be relative to.
// Returns a list of { name: ..., template: ..., viewModel: ... } matches with URLs (not filenames).
function findComponentsInFolder(componentsPath, urlRelativePath) {
  var pattern = path.join(componentsPath, '**/*.html');

  return glob.sync(pattern).map(function(filename) {
    var ext = path.extname(filename);
    var basename = path.basename(filename, ext);

    var component = {
      name: basename,
      template: translateFilenameToUrl(filename, urlRelativePath)
    };

    var viewModelFilenameWithoutExt = path.join(path.dirname(filename), basename);
    if (fs.existsSync(viewModelFilenameWithoutExt + '.js')) {
      component.viewModel = translateFilenameToUrl(viewModelFilenameWithoutExt, urlRelativePath);
    }

    return component;
  });
}

// Lists all *.js in the bindings folder in URL format.
function findBindingsInFolder(bindingsPath, urlRelativePath) {
  var pattern = path.join(bindingsPath, '**/!(*.min).js');
  return glob.sync(pattern).map(function(filename) {
    return translateFilenameToUrl(filename, urlRelativePath);
  });
}

module.exports = function (config) {

  var componentsPath = config.static.componentsDir;
  var bindingsPath = config.static.bindingsDir;
  var urlRelativePath = config.static.baseDir;

  var components = findComponentsInFolder(componentsPath, urlRelativePath);
  var bindings = findBindingsInFolder(bindingsPath, urlRelativePath);

  var componentFiles = _(components).map(function (component) {
    return [component.viewModel, 'text!' + component.template];
  }).flatten().compact().value();

  var allFiles = [].concat(componentFiles).concat(bindings);

  return {
    findComponents: function (shouldReload) {
      if (shouldReload) {
        components = findComponentsInFolder(componentsPath, urlRelativePath);
      }
      return components;
    },
    findBindings: function (shouldReload) {
      if (shouldReload) {
        bindings = findBindingsInFolder(bindingsPath, urlRelativePath);
      }
      return bindings;
    },
    allFiles: allFiles,
    componentsDir: componentsPath,
    bindingsDir: bindingsPath
  };
};
