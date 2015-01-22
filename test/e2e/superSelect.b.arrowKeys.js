describe('Pressing Arrow Keys in the dropdown', function(){

    var selectContainer,
            selectButton,
            activeEle;

    beforeEach(function() {
        // This needs to be mapped to the virtual host or dev environment we're using
        browser.get('http://localhost:9999/example.html');
        
        selectContainer = element( by.id( 'superSelect_dropdownHolder' ) );
        selectButton = element(by.className('button-span'));

        selectButton.click();

        active = function(){ return browser.driver.switchTo().activeElement() };
    });

    it('should go up 1 to the the first option', function(){

        active().sendKeys(protractor.Key.ARROW_UP);
        active().sendKeys(protractor.Key.ENTER);

        //1 up from the initial starting option is 
        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Test Item 0' );
        });

    });


    it('should go up to the the first option if mashing on the up arrow', function(){
        
        for( var i = 0; i < 20; ++i) {
        
            active().sendKeys(protractor.Key.ARROW_UP);
        }
        
        active().sendKeys(protractor.Key.ENTER);


        //1 up from the initial starting option is 
        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Test Item 0' );
        });

    });



    it('should go down 1 to the the third option', function(){

        active().sendKeys(protractor.Key.ARROW_DOWN);
        active().sendKeys(protractor.Key.ENTER);

        //1 up from the initial starting option is 
        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Example Test Item 2' );
        });

    });


    it('should go down to the the last option if mashing on the down arrow', function(){
        
        for( var i = 0; i < 20; ++i) {
        
            active().sendKeys(protractor.Key.ARROW_DOWN);
        }
        
        active().sendKeys(protractor.Key.ENTER);


        //1 up from the initial starting option is 
        selectButton.getText().then( function( optionLabel ){
            
            expect( optionLabel ).toBe( 'Other Test Item 3' );
        });

    });


});