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
        loginurl: 'http://testeaccess2.azurewebsites.net/Account/Login',
	      userControlName: 'Email',
	      passControlName: 'Password',
	      user: 'a@b.c',
	      pass: 'P2ssw0rd',
	      titleToWai: 'Error - My ASP.NET Application',
	      loginButtonName: 'Login'
      }
    },
  });

  grunt.loadNpmTasks('grunt-axe-webdriver');
  grunt.registerTask('default', ['axe-webdriver']);
};