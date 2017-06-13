function GruntConfiguration(grunt) {
    this.gruntObj = grunt;
}

GruntConfiguration.prototype.getConfig = function () {
    'use strict';

    var urlfile;
    var urls;
    var loginurl;
    var userControlName;
    var passControlName;
    var user;
    var pass;
    var titleToWait;
    var loginButtonName;

    var options = {};
    var config = {};

    config.loginurl = this.gruntObj.option('loginurl');
    config.userControlName = this.gruntObj.option('userControlName');
    config.passControlName = this.gruntObj.option('passControlName');
    config.user = this.gruntObj.option('user');
    config.pass = this.gruntObj.option('pass');
    config.titleToWait = this.gruntObj.option('titleToWait');
    config.loginButtonName = this.gruntObj.option('loginButtonName');

    options.browser = "phantomjs";

    if (this.gruntObj.option('urlfile')) {
        urlfile = this.gruntObj.option('urlfile');
    }
    else {
        urlfile = '';
    };

    if (this.gruntObj.file.isFile(urlfile)) {
        var file = this.gruntObj.file.read(urlfile);
        urls = file.split('\r\n');
    }
    else {
        urls = this.gruntObj.option('urls').split(',');
    }

    if (this.gruntObj.option('tags')) {
        options.tags = this.gruntObj.option('tags').split(',');
    }

    config.options = options;
    config.urls = urls;


    return config;
}

module.exports = GruntConfiguration;