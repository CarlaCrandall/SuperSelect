var superSelect = angular.module( 'superSelect', [] );

superSelect.directive( 'superSelect', function( ){
    return {
            
            restrict: 'A',
            templateUrl: 'src/superSelect.html',
            scope: {
                selectData: '=',
                selectModel: '=',
                selectLabel: '@',
                selectDisabled: '='
            },
            controller: [ '$scope', '$element', '$timeout', '$window', 
            
                function( $scope, $element, $timeout, $window ) {

                $scope.fakeModel = '';
                $scope.realData = {};

                $scope.status = {
                    isOpen: false,
                    currentVal: null
                }

                var KeyCodes = {
                        BACKSPACE : 8,
                        TABKEY : 9,
                        RETURNKEY : 13,
                        ESCAPE : 27,
                        SPACEBAR : 32,
                        LEFTARROW : 37,
                        UPARROW : 38,
                        RIGHTARROW : 39,
                        DOWNARROW : 40,
                    },
                    menuContainer = angular.element( document.querySelector( '#superSelect_dropdownHolder' ) );

                
                $scope.selectOption = function( val ) {

                    $scope.selectModel = val;
                }

                $scope.populateSelect = function( focus ) {

                    $scope.realData = $scope.selectData;
                }

                $scope.onKeyup = function( $event ) {

                    if( !$scope.status.isOpen ) {

                        $timeout( function () { 
                            $element.find( 'button' )[0].focus();
                        } );
                    }
                }

                $scope.onKeydown = function( $event ) {

                    var e = $event,
                        $target = e.target,
                        nextTab;
                    
                    switch ( e.keyCode ) {

                            case KeyCodes.TABKEY:
                                
                                if( $scope.status.isOpen ) {
                                
                                    $event.preventDefault();
                                    return;
                                }
                                break;

                            //Make sure the spacebar doesn't activate the select
                            case KeyCodes.SPACEBAR: 
                                break;

                            case KeyCodes.ESCAPE:

                                $timeout( function () {
                                    $element.find( 'button' )[0].focus();
                                }, 100);

                                break;

                            case KeyCodes.UPARROW:

                                if( !$scope.status.isOpen ) {
                                
                                    $scope.status.isOpen = true;
                                    $scope.status.currentVal = $scope.selectModel;
                                
                                } else {
                                
                                    nextTab = - 1;
                                }
                                break;

                            case KeyCodes.RETURNKEY: 

                                if( $scope.status.isOpen ) {
                                
                                    $timeout( function () {
                                        $element.find( 'button' )[0].focus();
                                    }, 100);
                                }
                                break;

                            case KeyCodes.DOWNARROW:
                                
                                if( !$scope.status.isOpen ) {
                                
                                    $scope.status.isOpen = true;
                                    $scope.status.currentVal = $scope.selectModel;

                                } else {                          
                                
                                    nextTab = 1;
                                }
                                break;

                            default: 

                                if( !$scope.status.isOpen ) {

                                    $element[0].querySelector( '.realSelect' ).focus();

                                }
                                else {

                                    $element[0].querySelector( '.fakeSelect' ).focus();
                                }
                                
                                break; 
                    }

                    setFocus( nextTab );
                }

                $scope.onOpen = function() {
                    $scope.status.currentVal = $scope.selectModel;
                    $scope.fakeModel = $scope.selectModel;
                    
                    
                    $timeout(function () {
                        
                        var dropdownContainer = angular.element($element[0].querySelector( '.dropdown-container' ));


                        if( !$scope.status.isOpen ) {

                            var menu = menuContainer.children();
                            dropdownContainer.append( menu );
                        }
                        else {

                            var menu = angular.element($element[0].querySelectorAll( '.dropdown-menu' ));

                            var boundingRect = menu[0].getBoundingClientRect();

                            var isUp = isNearBottom( boundingRect );

                            if( isUp ) {

                                dropdownContainer.addClass( 'dropup' );

                                $timeout( function () { 
                                    setMenuPosition( menu[ 0 ] );
                                    dropdownContainer.removeClass( 'dropup' );
                                });
                            }
                            else {

                                setMenuPosition( menu[ 0 ] );
                            }
                            
                            
                            
                        }
                    });
                }


                menuContainer.on( 'keydown', $scope.onKeydown );

                isNearBottom = function ( boundingRect ) {

                    var windowHeight = $window.innerHeight,
                        scrollTop = document.body.scrollTop;

                    if( boundingRect.bottom > windowHeight + scrollTop ) {
                        return true;
                    }

                    return false;
                }

                var setMenuPosition = function ( menu ) {
                    var boundingRect = menu.getBoundingClientRect();
                    menuContainer.append( menu );
                    menuContainer.css({
                        'top' : boundingRect.top + 'px',
                        'left' : boundingRect.left + 'px'
                    })

                   setFocus( 0 );
                }


                var setFocus = function( nextTab ) {

                    $timeout( function () {

                        var currentOption = $element[0].querySelector( '.fakeSelect option[value="' + $scope.status.currentVal + '"]' ),
                            next = null;

                        if( nextTab > 0 ) {

                            next = currentOption.nextSibling;
                        } 
                        else if( nextTab < 0 ) {

                            next = currentOption.previousSibling;
                        } 
                        else {

                            next = currentOption;//$element[0].querySelector( '.fakeSelect option[value="' + $element[0].querySelector( '.fakeSelect' ).value + '"]' );;
                        }

                        if( next ) {

                            $scope.fakeModel = $scope.status.currentVal = next.value;

                            var dropdownContainer = $element[0].querySelector( '.dropdown-container' ),
                                optString = '[data-option="' + $scope.status.currentVal + '"] a',
                                menuOption = menuContainer[0].querySelector( optString ) || dropdownContainer.querySelector( optString );

                            if ( menuOption ) {

                                menuOption.focus();    
                            }
                            
                        }
                        
                    });

                }

                
            } ],

            compile : function ( element, attrs ) {

                if( !!attrs.selectLabel ) {

                    angular.element( element[0].querySelector( '.dropdown-menu' ) ).attr( 'aria-labelledby', attrs.selectLabel ); 
                }
            }
    }
})