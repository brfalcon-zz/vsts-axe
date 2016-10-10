module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  "axe-webdriver": {
    PhantomJS: {
      options: {
		  browser: "phantomjs"
				},
      urls: ['http://www.tjsp.jus.br/Egov/Conciliacao/Default.aspx?f=2', 'http://www.tjsp.jus.br/EGov/Segmento/Administracao/Default.aspx?f=3'],
	  dest: "output.json",
      junitDest: "output.xml"

    }
  },
});

grunt.loadNpmTasks('grunt-axe-webdriver');
grunt.registerTask('default', ['axe-webdriver']);

};