module.exports = function (grunt) {
  'use strict';
  
  var GruntConfiguration = require('./lib/gruntConfiguration.js');
  var gruntConf = new GruntConfiguration(grunt);

  var config = gruntConf.getConfig();


  grunt.initConfig({
    "axe-webdriver": {
      PhantomJS: {
        options: config.options,
        urls: config.urls,
        dest: "output.json",
        junitDest: "output.xml",
        loginurl: config.loginurl,
	      userControlName: config.userControlName,
	      passControlName: config.passControlName,
	      user: config.user,
	      pass: config.pass,
	      titleToWait: config.titleToWait,
	      loginButtonName: config.loginButtonName
      }
    },
  });

  grunt.loadNpmTasks('grunt-axe-webdriver-private');
  grunt.registerTask('default', ['axe-webdriver']);
};