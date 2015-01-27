var superSelect = angular.module( 'superSelect', [ 'ui.bootstrap'] );

superSelect.directive( 'superSelect', function( ){
    return {
            
            restrict: 'A',
            template: 
            '<div is-open="status.isOpen" ' + 
            '        ng-keydown="onKeydown( $event )"  ' + 
            '        class="super-select dropdown-container" ' + 
            '        dropdown ' + 
            '        on-toggle="onToggle()">' + 
            '    <span class="button-span" dropdown-toggle' + 
            '                ng-click="populateSelect(true)"' + 
            '                ng-class="{ disabled : selectDisabled }">' + 
            '        <button type="button" ' + 
            '                class="btn btn-primary dropdown-toggle" ' + 
            '                ng-disabled="selectDisabled"' + 
            '                ng-focus="populateSelect(true)"' + 
            '                ng-bind="dictionary[selectModel].label">' + 
            '        </button>' + 
            '        <span class="caret"></span>' + 
            '    </span>' + 
            '    <select class="realSelect" tabindex="-1"' + 
            '            ng-keyup="onKeyup( $event )"' + 
            '            ng-model="realModel" ' + 
            '            ng-options="item.label for item in realData track by item.val">' + 
            '    </select>' + 
            '    <select class="fakeSelect" tabindex="-1"' + 
            '            ng-if="status.isOpen"' + 
            '            ng-model="fakeModel"' + 
            '            ng-options="item.label for item in sanitizedData track by item.val">' + 
            '    </select>' + 
            '    <ul class="dropdown-menu" role="menu" ng-if="realData.length">' + 
            '        <li class="search-option" ' + 
            '            ng-repeat="item in sanitizedData" ' + 
            '            ng-attr-data-option="{{item.val}}"' + 
            '            ng-click="selectOption(item.val)">' + 
            '            <a href="javascript:void(0)" ng-bind="item.label"></a>' + 
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
                var menuContainer = angular.element( document.querySelector( '#superSelect_dropdownHolder' ) ),
                    KeyCodes = {
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
                    keyChange = false,
                    keyTimeout = null
                    keyTimeoutLength = 1000,
                    selectHeight = 30;

                //Create pseudo model data to be used by the select boxes
                $scope.fakeModel = null;
                $scope.realModel = null;
                $scope.realData = [];
                $scope.sanitizedData = [];
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

                        $scope.dictionary[ $scope.sanitizedData[ i ].val ] = $scope.sanitizedData[ i ];
                    }

                    if( $scope.realData.length ) {

                        $scope.realData = $scope.sanitizedData;
                    }

                    $scope.realModel = $scope.dictionary[ $scope.selectModel ];

                });

                $scope.status = {
                    isOpen: false,
                    currentVal: null
                }

                // Transfer the keypresses from 
                // the menu container to the menu list
                menuContainer.on( 'keydown', function( e ){

                    //only fire if this menu is open
                    if( $scope.status.isOpen ) {
                        $scope.onKeydown( e );
                    }
                
                });

                var manageScrolling = function( event ) {
                    
                    var o = event,
                        d = o.detail, w = o.wheelDelta,
                        n = 225, n1 = n-1;

                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    // http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
                    // Normalize delta
                    d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
                    // Quadratic scale if |d| > 1
                    d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;
                    // Delta *should* not be greater than 2...
                    delta = Math.min(Math.max(d / 2, -1), 1);


                    menuContainer.find( 'ul' )[ 0 ].scrollTop -= delta*100;
                 
                    return false;   
                    
                }

                //On wheel event needs to be added manually due to issue in chrome
                if( !menuContainer.attr( 'data-has-scroll') ) {

                    menuContainer.attr( 'data-has-scroll', true );
                    menuContainer[0].onwheel = manageScrolling ;
                
                }

                //When the user scrolls in the body hide the select if it's open
                angular.element( document.body ).on( 'mousewheel', function(){
                    
                    if( $scope.status.isOpen ) {
                        $scope.status.isOpen = false; 
                        $scope.$digest();
                    }
                });

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

                    var scrollTop = document.body.scrollTop,
                        topDifference = boundingRect.top - selectHeight,
                        bottomDifference = $window.innerHeight - topDifference - selectHeight * 1.25,
                        renderHeight = bottomDifference,
                        dropInfo = {
                            openUp: false,
                            showScroll: false,
                            fromRight: false,
                            renderHeight: false
                        };

                    //If there's more space above the select and we need more tell it to open upwards 
                    if( boundingRect.bottom > $window.innerHeight + scrollTop && topDifference > bottomDifference ) {

                        renderHeight = topDifference; 
                        dropInfo.openUp = true;
                    }

                    //If there's still not enough vertical space to render add scrollbars 
                    if( boundingRect.height > renderHeight ) {

                        dropInfo.showScroll = true;
                        dropInfo.renderHeight = renderHeight; 
                    }

                    
                    //Make sure the select options aren't flowing out of the screen
                    if( $window.innerWidth - boundingRect.right < 0  ){
                        
                        dropInfo.fromRight = true;
                    }

                    return dropInfo;
                }

                var setMenuPosition = function ( menu, dropInfo ) {
                    if( !menu ) {
                        return;
                    }
                    var boundingRect = menu.getBoundingClientRect();


                    menuContainer.append( menu );
                    menuContainer.css( {

                            'top' : boundingRect.top < 0? '0px' : boundingRect.top + 'px' ,
                            'left' : dropInfo.fromRight? '' : boundingRect.left + 'px',
                            'right' : dropInfo.fromRight ? '5px' : ''
                        } );

                    menuContainer.find( 'ul' ).css({
                        'overflow' : dropInfo.showScroll? 'scroll' : '',
                        'height' : dropInfo.showScroll? dropInfo.renderHeight + 'px' : ''
                    })

                    setFocus( 0 );
                }


                var setFocus = function( nextTab ) {

                    //Allow for a digest so data can be populated before pulling information
                    $timeout( function () {

                        // Grab the current dropdown li and get it's index value, 
                        // then find the current select with the matching index value
                        var dropdownContainer = $element[0].querySelector( '.dropdown-container' ),
                            currentOption = $element[0].querySelector( '.fakeSelect option[value="' + $scope.status.currentVal + '"]' ),
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
                            optString = '[data-option="' + next.value + '"]';
                            menuOption = angular.element( menuContainer[0].querySelector( optString ) || dropdownContainer.querySelector( optString ) );

                            // Use the newly focused element as our current value
                            $scope.fakeModel = $scope.dictionary[ menuOption.attr( 'data-option' ) ];
                            $scope.status.currentVal = menuOption.attr( 'data-option' );

                            // find the relevent anchor and focus on it.
                            menuOption[0].querySelector( 'a' ).focus();    
                            
                        }
                        
                    });

                }


                $scope.selectOption = function( val ) {

                    $scope.selectModel = val;
                    $scope.realModel = $scope.dictionary[ val ];
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
                        runFocus = false,
                        bubbleEvent = true;

                    switch ( e.keyCode ) {


                            case KeyCodes.SHIFT:
                                break;

                            case KeyCodes.ESCAPE:

                                // Reset focus to the dropdown button
                                // after the select has been closed
                                $timeout( function () {
                                    $element.find( 'button' )[0].focus();
                                });
                                break;

                            case KeyCodes.TABKEY:
                                
                                if( $scope.status.isOpen ) {
                                
                                    $event.preventDefault();
                                }
                                break;

                            case KeyCodes.SPACEBAR: 

                                if( $scope.status.isOpen ) {
                                    // if any non navigation keys are pressed we want to ignore the spacebar
                                    // otherwise treat it as an enter key
                                    if( !keyChange ) {

                                        $scope.status.isOpen = false;
                                        $scope.selectModel = $scope.status.currentVal;
                                        $scope.realModel = $scope.dictionary[ $scope.status.currentVal ];

                                        $timeout( function () {
                                            $element.find( 'button' )[0].focus();
                                        }, 100);
                                    
                                    } else {

                                        resetKeyChangeTimeout();
                                    }
                                }

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

                            case KeyCodes.UPARROW:

                                    nextTab = - 1;

                                //No break needed, uses DOWNARROW code

                            case KeyCodes.DOWNARROW:
                                
                                if( !$scope.status.isOpen ) {
                                
                                    $scope.status.currentVal = $scope.selectModel;
                                    $scope.status.isOpen = true;
                                    $scope.onToggle();

                                } else if ( nextTab !== -1 ) {                          
                                
                                    nextTab = 1;
                                }

                                bubbleEvent = false;
                                runFocus = true;
                                break;

                            default: 

                                // If the dropdown is closed we want the real select 
                                // box to handle non-navigation key presses
                                if( !$scope.status.isOpen ) {

                                    $element[0].querySelector( '.realSelect' ).focus();
                                
                                } else {

                                    resetKeyChangeTimeout();

                                    $element[0].querySelector( '.fakeSelect' ).focus();

                                    runFocus = true;
                                }
                                
                                break; 
                    }

                    if( runFocus ) {

                        setFocus( nextTab );
                    }
                    if( !bubbleEvent ) {

                        e.preventDefault();
                    }
                    return bubbleEvent;
                }

                $scope.onToggle = function() {
                    $scope.status.currentVal = $scope.selectModel;
                    $scope.fakeModel = $scope.dictionary[ $scope.selectModel ];

                    keyChange = false;

                    // Needed in order to get the correct
                    //  bounding rectangle for the dropdown
                    $timeout( function () {
                        
                        var dropdownContainer = angular.element($element[0].querySelector( '.dropdown-container' ));


                        if( !$scope.status.isOpen ) {

                            // Grab the first element, in case this 
                            // happens while another select is opening
                            var menu = menuContainer.children()[0];
                            
                            //remove possible overflow issues when calculating the bounding box
                            angular.element( menu ).css({
                                'overflow' : '',
                                'height' : ''
                            });
                            dropdownContainer.append( menu );

                        }
                        else {

                            var menu = $element[0].querySelector( '.dropdown-menu' ),
                                boundingRect = menu && menu.getBoundingClientRect() || {},
                                dropInfo = calculateDropInfo( boundingRect );

                            // add the right classes if opening up
                            if( dropInfo.openUp ) {

                                dropdownContainer.addClass( 'dropup' );    
                                setMenuPosition( menu, dropInfo );
                                dropdownContainer.removeClass( 'dropup' );
                            
                            
                            } else {

                                setMenuPosition( menu, dropInfo );
                            }
                        }
                    });
                }
            } ],

            compile : function ( element, attrs ) {

                // Make sure there's the overlay container in the body
                if( document && 
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
});