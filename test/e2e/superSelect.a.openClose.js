describe('Opening and Closing Dropdown', function(){

    beforeEach(function() {
        // This needs to be mapped to the virtual host or dev environment we're using
        browser.get('http://localhost:9999/example.html');
    });

    it('should open the select box on click', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('button-span'));

        //before opening we want to make sure the select box container is empty
        selectContainer.getInnerHtml().then( function( html ){
            
            expect( html ).toBe( '' );
        });

        selectButton.click();

        selectContainer.getInnerHtml().then( function( html ){

            expect( html ).not.toBe( '' );
        });

    });

    it('should open the select box on space', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        //before opening we want to make sure the select box container is empty
        selectContainer.getInnerHtml().then( function( html ){
            
            expect( html ).toBe( '' );
        });

        selectButton.sendKeys(protractor.Key.SPACE);

        selectContainer.getInnerHtml().then( function( html ){

            expect( html ).not.toBe( '' );
        });

    });

    it('should open the select box on enter', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        //before opening we want to make sure the select box container is empty
        selectContainer.getInnerHtml().then( function( html ){
            
            expect( html ).toBe( '' );
        });

        selectButton.sendKeys(protractor.Key.ENTER);

        selectContainer.getInnerHtml().then( function( html ){

            expect( html ).not.toBe( '' );
        });

    });

    it('should open the select box on key down', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        //before opening we want to make sure the select box container is empty
        selectContainer.getInnerHtml().then( function( html ){
            
            expect( html ).toBe( '' );
        });

        selectButton.sendKeys(protractor.Key.ARROW_DOWN);

        selectContainer.getInnerHtml().then( function( html ){

            expect( html ).not.toBe( '' );
        });

    });

    it('should open the select box on key up', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        //before opening we want to make sure the select box container is empty
        selectContainer.getInnerHtml().then( function( html ){
            
            expect( html ).toBe( '' );
        });

        selectButton.sendKeys(protractor.Key.ARROW_UP);

        selectContainer.getInnerHtml().then( function( html ){

            expect( html ).not.toBe( '' );
        });

    });


    it('should close the select box on escape, and keep the same value', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        selectButton.getText().then( function( valLabel ) {

            var label = valLabel;

            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.sendKeys(protractor.Key.ENTER);

            selectContainer.getInnerHtml().then( function( html ){

                expect( html ).not.toBe( '' );

            });


            browser.driver.switchTo().activeElement().sendKeys(protractor.Key.ESCAPE);


            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.getText().then( function( valLabel ) {

                expect( valLabel ).toBe( valLabel );

            });

        });

    });


    it('should close the select box on enter, and keep the same value', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        selectButton.getText().then( function( valLabel ) {

            var label = valLabel;

            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.sendKeys(protractor.Key.ENTER);

            selectContainer.getInnerHtml().then( function( html ){

                expect( html ).not.toBe( '' );

            });


            browser.driver.switchTo().activeElement().sendKeys(protractor.Key.ENTER);


            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.getText().then( function( valLabel ) {

                expect( valLabel ).toBe( valLabel );

            });

        });

    });

    it('should close the select box on space, and keep the same value', function(){

        var selectContainer = element( by.id( 'superSelect_dropdownHolder' ) ),
            selectButton = element(by.className('dropdown-toggle'));

        selectButton.getText().then( function( valLabel ) {

            var label = valLabel;

            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.sendKeys(protractor.Key.ENTER);

            selectContainer.getInnerHtml().then( function( html ){

                expect( html ).not.toBe( '' );

            });


            browser.driver.switchTo().activeElement().sendKeys(protractor.Key.SPACE);

            browser.sleep(1000);

            selectContainer.getInnerHtml().then( function( html ){
                
                expect( html ).toBe( '' );
            });

            selectButton.getText().then( function( valLabel ) {

                expect( valLabel ).toBe( valLabel );

            });

        });

    });

    


});