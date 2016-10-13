module.exports = function (grunt) {
  var urlfile = grunt.option('urlfile');
  var tags = grunt.option('tags');
  var urls;


urlfile=".\\urls.txt";

if(urlfile)
{
  var file  = grunt.file.read(urlfile);
    urls = file.split('\r\n');

}
else
{
  urls = grunt.option('urls').split(',');
  
}

//var urls=a;


  // Project configuration.
  grunt.initConfig({
    "axe-webdriver": {
      PhantomJS: {
        options: {
          browser: "phantomjs",
          tags:tags
        },
        urls: urls,
        dest: "output.json",
        junitDest: "output.xml"

      }


    },
  });

  grunt.loadNpmTasks('grunt-axe-webdriver');
  grunt.registerTask('default', ['axe-webdriver']);
};