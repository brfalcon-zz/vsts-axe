module.exports = function (grunt) {
  'use strict'
  
  var GruntConfiguration = require('./lib/gruntConfiguration.js');
  var gruntConf = new GruntConfiguration(grunt);

  var config = gruntConf.getConfig();


  if (grunt.option('urlfile')) {
    urlfile = grunt.option('urlfile');
  } 
  else { 
    urlfile = '' ;
  };


if(grunt.option('tags'))
{
  options.tags=grunt.option('tags').split(',');
}


  if (grunt.file.isFile(urlfile)) {
    var file = grunt.file.read(urlfile);
    urls = file.split('\r');

  }
  else {
    urls = grunt.option('urls').split(',');

  }
  grunt.initConfig({
    "axe-webdriver": {
      PhantomJS: {
        options: config.options,
        urls: config.urls,
        dest: "output.json",
        junitDest: "output.xml"
      }
    },
  });


  grunt.loadNpmTasks('grunt-axe-webdriver2');
  grunt.registerTask('default', ['axe-webdriver']);
};