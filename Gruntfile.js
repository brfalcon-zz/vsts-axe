module.exports = function (grunt) {
  'use strict'
  
  var GruntConfiguration = require('./lib/gruntConfiguration.js');
  var gruntConf = new GruntConfiguration(grunt);

  var config = gruntConf.getConfig();

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


  grunt.loadNpmTasks('grunt-axe-webdriver');
  grunt.registerTask('default', ['axe-webdriver']);
};