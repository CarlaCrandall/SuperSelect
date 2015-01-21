module.exports = function(config){
  config.set({
    frameworks: ['jasmine' ],

    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'src/*.js',
      'test/**/*.tests.js',
      'src/*.html'
      
    ],

    autoWatch : true,

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    preprocessors: {
      'src/*.html':['ng-html2js']
    },

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};