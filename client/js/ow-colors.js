/*
These are the default Oliver Wyman palette colours (taken from Powerpoint)
Please do not over-write these colours when skinning tools for clients.
Instead create new colour names and add them to the bottom.
You can use the client's logo and the following resources to derive colour values:
    - http://www.palettefx.com/ (image to colours)
    - http://www.colorhexa.com/ (colour variations)
*/

define(function () {

  'use strict';

  var darkSapphire = '#002C77';
  var owSapphire = '#008AB3';
  var lightSapphire = '#9DE0ED';
  var owOnyx = '#5F5F5F';
  var lightOnyx = '#BEBEBE';
  var veryLightOnyx = '#DFDFDF';
  var owTopaz = '#E29815';
  var lightTopaz = '#FFCF89';
  var owEmerald = '#41A441';
  var lightEmerald = '#BDDDA3';
  var owIolite = '#646EAC';
  var lightIolite = '#C5CAE7';
  var owCitrine = '#DD712C';
  var lightCitrine = '#FDCFAC';
  var owTurquoise = '#079B84';
  var lightTurquoise = '#A8DAC9';
  var owRuby = '#CB225B';
  var lightRuby = '#F8B8BC';

  return {
    darkSapphire: darkSapphire,
    owSapphire: owSapphire,
    lightSapphire: lightSapphire,
    owOnyx: owOnyx,
    lightOnyx: lightOnyx,
    veryLightOnyx: veryLightOnyx,
    owTopaz: owTopaz,
    lightTopaz: lightTopaz,
    owEmerald: owEmerald,
    lightEmerald: lightEmerald,
    owIolite: owIolite,
    lightIolite: lightIolite,
    owCitrine: owCitrine,
    lightCitrine: lightCitrine,
    owTurquoise: owTurquoise,
    lightTurquoise: lightTurquoise,
    owRuby: owRuby,
    lightRuby: lightRuby,

    orderedChartColors: [
      owSapphire,
      lightSapphire,
      owOnyx,
      lightOnyx,
      owTopaz,
      lightTopaz,
      owEmerald,
      lightEmerald,
      owIolite,
      lightIolite,
      owCitrine,
      lightCitrine,
      owTurquoise,
      lightTurquoise,
      owRuby,
      lightRuby
    ]
  };
});