var superSelect = angular.module( 'superSelect', [ 'ui.bootstrap'] );

superSelect.directive( 'superSelect', function( ){
    return {
            
            restrict: 'A',
            template: 
            '<div is-open="status.isOpen" ' + 
            '        ng-keydown="onKeydown( $event )"  ' + 
            '        class="super-select btn-group dropdown-container" ' + 
            '        dropdown ' + 
            '        on-toggle="onOpen()">' + 
            '    <span class="button-span" dropdown-toggle' + 
            '                ng-class="{ disabled : selectDisabled }">' + 
            '        <button type="button" ' + 
            '                class="btn btn-primary dropdown-toggle" ' + 
            '                ng-disabled="selectDisabled"' + 
            '                ng-focus="populateSelect(true)"' + 
            '                ng-bind="dictionary[selectModel]">' + 
            '        </button>' + 
            '        <span class="caret"></span>' + 
            '    </span>' + 
            '    <select class="realSelect"' + 
            '            ng-keyup="onKeyup( $event )"' + 
            '            ng-focus="onSelectFocus()" ' + 
            '            ng-model="selectModel" ' + 
            '            ng-options="item.val as item.label for item in realData">' + 
            '    </select>' + 
            '    <select ng-if="status.isOpen"' + 
            '            class="fakeSelect"' + 
            '            ng-model="fakeModel"' + 
            '            ng-options="item.val as item.label for item in sanitizedData">' + 
            '    </select>' + 
            '    <ul class="dropdown-menu" role="menu" ng-if="status.isOpen">' + 
            '        <li class="search-option" ' + 
            '            ng-repeat="item in sanitizedData" ' + 
            '            ng-attr-data-option="{{item.val}}"' + 
            '            ng-attr-data-index="{{$index}}"  ' + 
            '            ng-click="selectOption(item.val)">' + 
            '            <a href="#" ng-bind="item.label"></a>' + 
            '        </li>' + 
            '    </ul>' + 
            '</div>',
            scope: {
                selectData: '=',
                selectModel: '=',
                selectLabel: '@',
                selectDisabled: '='
            },
            controller: [ '$scope', '$element', '$timeout', '$window', 
            
                function( $scope, $element, $timeout, $window ) {

                var selectHeight = 30,
                    isScrollable = false,
                    lockedScrollTop = 0;

                $scope.fakeModel = '';
                $scope.realData = [];

                $scope.sanitizedData = [];

                $scope.status = {
                    isOpen: false,
                    currentVal: null
                }

                $scope.dictionary = {};

                // Converts key value object into an array and updates the label dictionary if needed
                $scope.$watch( 'selectData', function(){

                    var i, len, keys;

                    if( angular.isObject( $scope.selectData ) && !angular.isArray( $scope.selectData ) ) {


                        $scope.sanitizedData = [];

                        keys =  Object.keys( $scope.selectData );

                        for( i = 0; i < keys.length; ++i ) {

                            $scope.sanitizedData.push( { val: keys[ i ], label: $scope.selectData[ keys[ i ] ] } );
                        }
                    } else {

                        angular.copy( $scope.selectData, $scope.sanitizedData );
                    }

                    $scope.dictionary = {};

                    for( i = 0, len = $scope.sanitizedData.length; i < len; ++i ) {

                        $scope.dictionary[ $scope.sanitizedData[ i ].val ] = $scope.sanitizedData[ i ].label;
                    }

                    if( $scope.realData.length ) {

                        $scope.realData = $scope.sanitizedData;
                    }

                });

                var KeyCodes = {
                        BACKSPACE : 8,
                        TABKEY : 9,
                        SHIFT: 16,
                        RETURNKEY : 13,
                        ESCAPE : 27,
                        SPACEBAR : 32,
                        LEFTARROW : 37,
                        UPARROW : 38,
                        RIGHTARROW : 39,
                        DOWNARROW : 40,
                    },
                    menuContainer = angular.element( document.querySelector( '#superSelect_dropdownHolder' ) ),
                    keyChange = false,
                    keyTimeout = null
                    keyTimeoutLength = 1000;

                
                $scope.selectOption = function( val ) {

                    $scope.selectModel = val;
                }

                $scope.populateSelect = function( focus ) {

                    $scope.realData = $scope.sanitizedData;
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
                        nextTab,
                        runFocus = false;

                    switch ( e.keyCode ) {

                            case KeyCodes.TABKEY:
                                
                                if( $scope.status.isOpen ) {
                                
                                    $event.preventDefault();
                                    
                                }
                                break;
                            case KeyCodes.SHIFT:
                                break;
                            //Make sure the spacebar doesn't activate the select
                            case KeyCodes.SPACEBAR: 

                                if( $scope.status.isOpen ) {
                                    if( !keyChange ) {

                                        $scope.status.isOpen = false;
                                        $scope.selectModel = $scope.status.currentVal;
                                        $timeout( function () {
                                            $element.find( 'button' )[0].focus();
                                        }, 100);
                                    
                                    } else {

                                        resetKeyChangeTimeout();
                                    }
                                }

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

                                runFocus = true;
                                break;

                            case KeyCodes.RETURNKEY: 

                                if( $scope.status.isOpen ) {
                                
                                    $scope.status.isOpen = false;
                                    $scope.selectModel = $scope.status.currentVal;
                                        
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

                                runFocus = true;
                                break;

                            default: 

                                if( !$scope.status.isOpen ) {

                                    $element[0].querySelector( '.realSelect' ).focus();
                                }
                                else {

                                    resetKeyChangeTimeout();

                                    $element[0].querySelector( '.fakeSelect' ).focus();

                                    runFocus = true;
                                }
                                
                                break; 
                    }

                    if( runFocus ) {

                        setFocus( nextTab );
                    }
                }

                $scope.onOpen = function() {
                    $scope.status.currentVal = $scope.selectModel;
                    $scope.fakeModel = $scope.selectModel;

                    keyChange = false;

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

                            var dropInfo = calculateDropInfo( boundingRect );

                            if( isUp ) {

                                dropdownContainer.addClass( 'dropup' );

                                $timeout( function () { 
                                    setMenuPosition( menu[ 0 ], dropInfo );
                                    dropdownContainer.removeClass( 'dropup' );
                                });
                            }
                            else {

                                setMenuPosition( menu[ 0 ], dropInfo );
                            }
                            
                            
                            
                        }
                    });
                }


                menuContainer.on( 'keydown', $scope.onKeydown );

                var manageScrolling = function( event) {
                    
                    if( isScrollable ) {

                        event.stopPropagation();
                        event.stopImmediatePropagation();

                        // TODO:Wheel amount needs to be normalized
                        // http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
                        menuContainer.find( 'ul' )[ 0 ].scrollTop -= event.wheelDeltaY*0.2;
                     
                        return false;   
                        
                    }
                }

                if( !menuContainer.attr( 'hasScroll') ) {
                    menuContainer.attr( 'hasScroll', true );
                    menuContainer[0].onwheel = manageScrolling ;
                }
                

                var resetKeyChangeTimeout = function() {

                    keyChange = true;

                    if( keyTimeout !== null ) {

                        clearTimeout( keyTimeout );
                    }

                    keyTimeout = setTimeout( function(){
                        
                        keyChange = false;
                        keyTimeout = null;

                    }, keyTimeoutLength );
                }

                var calculateDropInfo = function( boundingRect ) {

                    var windowHeight = $window.innerHeight,
                        scrollTop = document.body.scrollTop,
                        windowWidth = $window.innerWidth,
                        scrollLeft = document.body.scrollLeft,
                        dropInfo = {
                            openUp: false,
                            showScroll: false,
                            fromRight: false,
                            renderHeight: false
                        },
                        topDifference = boundingRect.top - scrollTop - selectHeight,
                        bottomDifference = windowHeight - topDifference - selectHeight,
                        renderHeight = bottomDifference;

                    if( boundingRect.bottom > windowHeight + scrollTop && topDifference > bottomDifference ) {

                        renderHeight = topDifference; 
                        dropInfo.openUp = true;
                    }

                    if( windowWidth - boundingRect.right  ){
                        
                        dropInfo.fromRight = true;
                    }
                    if( boundingRect.height > renderHeight ) {

                        dropInfo.showScroll = true;
                        dropInfo.renderHeight = renderHeight; 
                    }

                    return dropInfo;
                }

                var isNearBottom = function ( boundingRect ) {

                    var windowHeight = $window.innerHeight,
                        scrollTop = document.body.scrollTop;

                    if( boundingRect.bottom > windowHeight + scrollTop ) {
                        // return true;
                    }

                    return false;
                }

                var setMenuPosition = function ( menu, dropInfo ) {
                    var boundingRect = menu.getBoundingClientRect();


                    menuContainer.append( menu );
                    menuContainer.css( {

                            'top' : boundingRect.top + 'px',
                            'left' : dropInfo.fromRight? '' : boundingRect.left + 'px',
                            'right' : dropInfo.fromRight ? '0' : ''
                        } );

                    menuContainer.find( 'ul' ).css({
                        'overflow' : dropInfo.showScroll? 'scroll' : '',
                        'height' : dropInfo.showScroll? dropInfo.renderHeight + 'px' : ''
                    })

                    isScrollable = dropInfo.showScroll;
                    lockedScrollTop = document.body.scrollTop;

                    setFocus( 0 );
                }


                var setFocus = function( nextTab ) {

                    $timeout( function () {


                        // Grab the current dropdown li and get it's index value, 
                        // then find the current select with the matching index value
                        var dropdownContainer = $element[0].querySelector( '.dropdown-container' ),
                            optString = '[data-option="' + $scope.status.currentVal + '"]',
                            menuOption = menuContainer[0].querySelector( optString ) || dropdownContainer.querySelector( optString  ),
                            currentOption = $element[0].querySelector( '.fakeSelect option[value="' + menuOption.getAttribute('data-index') + '"]' ),
                            next = null;

                        // if tabing through find the next sibling
                        if( nextTab > 0 ) {

                            next = currentOption.nextSibling;
                        } 
                        else if( nextTab < 0 ) {

                            next = currentOption.previousSibling;
                        } 
                        else {

                            // otherwise make sure we are getting the correct current
                            //  option which may be different if the fake select is open
                            if( $element[0].querySelector( '.fakeSelect' ) ) {

                                next = $element[0].querySelector( '.fakeSelect option[value="' + $element[0].querySelector( '.fakeSelect' ).value + '"]' );

                            } else {

                                next = currentOption;    
                            }
                        }

                        if( next ) {

                            // since all we have is the index value, find the li with the matching index to get it's model value
                            optString = '[data-index="' + next.value + '"]';
                            menuOption = angular.element( menuContainer[0].querySelector( optString ) || dropdownContainer.querySelector( optString ) );

                            // Use the newly focused element as our current value
                            $scope.fakeModel = $scope.status.currentVal = menuOption.attr( 'data-option' );

                            // find the relevent anchor and focus on it.
                            menuOption[0].querySelector( 'a' ).focus();    
                            
                        }
                        
                    });

                }

                
            } ],

            compile : function ( element, attrs ) {

                if( document && 
                    document.getElementById && 
                    !document.getElementById( 'superSelect_dropdownHolder') ) {

                    var dropdownHolder = document.createElement( 'div' );
                    dropdownHolder.setAttribute( 'id', 'superSelect_dropdownHolder' );

                    document.body.appendChild( dropdownHolder );

                }

                if( !!attrs.selectLabel ) {

                    angular.element( element[0].querySelector( '.dropdown-menu' ) ).attr( 'aria-labelledby', attrs.selectLabel ); 
                }
            }
    }
})