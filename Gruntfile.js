module.exports = function (grunt) {
  var urlfile;
  var urls;
  var options = {};

  options.browser = "phantomjs";


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
    urls = file.split('\r\n');

  }
  else {
    urls = grunt.option('urls').split(',');

  }
  grunt.initConfig({
    "axe-webdriver": {
      PhantomJS: {
        options: options,
        urls: urls,
        dest: "output.json",
        junitDest: "output.xml"

      }


    },
  });

  grunt.loadNpmTasks('grunt-axe-webdriver');
  grunt.registerTask('default', ['axe-webdriver']);
};