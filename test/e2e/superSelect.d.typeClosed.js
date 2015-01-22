describe('Typing into the open dropdown', function(){

    var active = function(){ return browser.driver.switchTo().activeElement() };

    var selectContainer,
            selectButton,
            activeEle;

    beforeEach(function() {
        // This needs to be mapped to the virtual host or dev environment we're using
        browser.get('http://localhost:9999/example.html');
        
        selectContainer = element( by.id( 'superSelect_dropdownHolder' ) );
        selectButton = element(by.className('button-span'));

        //activate the element since it would normally be activated on focus
        selectButton.click();
        selectButton.click();


        browser.sleep( 200 );
    });

    it('should find the each option starting with T', function(){
        
        element( by.className( 'realSelect' ) ).sendKeys('t');

        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Test Item 0' );
        });

    });

    it('should find the option starting with E', function(){
        
        element( by.className( 'realSelect' ) ).sendKeys('eeeeee');

        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Example Test Item 2' );
        });

    });

    it('should find the option starting with o', function(){
        
        element( by.className( 'realSelect' ) ).sendKeys('oooo');

        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Other Test Item 3' );
        });

    });


    it('should find the option starting with a after finding the option starting with e', function(){
        
        element( by.className( 'realSelect' ) ).sendKeys('eeee');

        selectButton.getText().then( function( optionLabel ) {

            expect( optionLabel ).toBe( 'Example Test Item 2' );

            browser.sleep( 1000 );

            element( by.className( 'realSelect' ) ).sendKeys('aaaa');

            selectButton.getText().then( function( optionLabel ){
                
                expect( optionLabel ).toBe( 'Another Test Item 1' );
            });

        });

    });


});