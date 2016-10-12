module.exports = function(grunt) {
//	var a = 'http://www.tjsp.jus.br/Egov/Conciliacao/Default.aspx?f=2,http://www.tjsp.jus.br/EGov/Segmento/Administracao/Default.aspx?f=3'.split(',')
	var a = grunt.option('u').split(',')
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

    },
	
	 IE: {
      options: {
		  browser: "ie"
				},
      urls: ['http://www.tjsp.jus.br/Egov/Conciliacao/Default.aspx?f=2', 'http://www.tjsp.jus.br/EGov/Segmento/Administracao/Default.aspx?f=3'],
	  dest: "output.json",
      junitDest: "output.xml"

    }
	,
	
	 Custom: {
      options: {
		  browser: grunt.option('browser')
				},
      urls: a,
	  dest: "output.json",
      junitDest: "output.xml"

    }
  },
});

grunt.loadNpmTasks('grunt-axe-webdriver');
grunt.registerTask('default', ['axe-webdriver']);

};