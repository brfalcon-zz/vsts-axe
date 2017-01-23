function GruntConfiguration(grunt) {
    this.gruntObj = grunt;
}

GruntConfiguration.prototype.getConfig = function () {
    var urlfile;
    var urls;

    var options = {};
    var config = {};

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