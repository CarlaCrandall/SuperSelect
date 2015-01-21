'use strict';
 
describe( 'Test Super Select', function(){
    

    var $compile;
    var $scope;
    var $httpBackend;
    var $timeout;
    var template;

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('superSelect'));
    beforeEach(angular.mock.module('src/superSelect.html')); 

    // Angular strips the underscores when injecting
    beforeEach( angular.mock.inject( function ( _$compile_, _$rootScope_, _$timeout_ ) {

        var html = '<div id="superSelect_dropdownHolder"></div>';
        angular.element(document.body).append(html);

        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;

        $scope.testData = {
            'Test0' : 'Test Item 0',
            'Test1' : 'Another Test Item 1',
            'Test2' : 'Example Test Item 2',
            'Test3' : 'Other Test Item 3'
        }
        $scope.testModel = 'Test1';


        template = $compile( '<div super-select select-data="testData" select-model="testModel" ></div>')($scope);
        
        $scope.$digest();
    }));


    // tests start here
    describe( 'Super Select Directive', function() {

        it( 'should check that the pseudo-select box is showing the correct text', 
        angular.mock.inject( function() {

            var ele = angular.element( template[0].querySelectorAll( '.dropdown-toggle' ) );

            expect( ele.html().trim() ).toBe( $scope.testData[ $scope.testModel ] );

        }));

        it( 'should check that the bootstrap dropdown gets populated', 
        angular.mock.inject( function() {

            var element = angular.element( template[0].querySelectorAll( '.dropdown-toggle' ) );

            var isoScope = template.isolateScope();
            
            expect( template.find( 'ul' ).length ).toBe( 0 );

            // open the select box to allow it top populate
            isoScope.status.isOpen = true;
            isoScope.$apply();

            expect( template.find( 'ul' ).length ).toBe( 1 );

        }));

        
    });

    // describe(;)
});