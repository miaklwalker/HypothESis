/**
 * @class Expect
 * @description Allows the user to pass a value to test and value to verify it against
 * @argument received
 * @example Expect(someFunction).toBe(someValue)
 * @property received - The value received ;
 * @property isObject - When expect is created it checks if received is a object;
 * @property _not - A private property that is only directly set with .not it negates any matchers and makes them return true when they fail;
 * @property result - A object with two properties Message and Pass property;
 */

class Expect {
    constructor(received){
        this.received = received;
        this._not = false;
        this.result = {
            message:'',
            result:''
        }
    }
    pass(expected,received = this.received){
        console.log('passed')
    }
    fail(expected,received = this.received){
        console.log('failed')
    }
    verify(test,expected,received=this.received){
        return test ? this.pass(expected,received) : this.fail(expected,received);
    }
    /**
     * @name any
     * @description When passed a object constructor , will check if recieved value was created with that constructor
     * @example 
     * let foo = 6
     * let any_test = new Expect(foo).any(Number);
     * let any_test_2 = new Expect(foo).any(String); 
     * @param {Constructor} expected 
     */
    any(expected){
        this.verify(typeof this.received === typeof expected(),expected); 
    }
    /**
     * @name anything
     * @description Passes when recieved is anything besides Null or Undefined.
     * @example 
     * let anything_test = new Expect(6).anything(); passes
     * let anything_test_2 = new Expect(null).anything(); fails
     */
    anything(){
        let notNullOrUndefined = (this.received !== undefined && this.received !== null);
        this.verify(notNullOrUndefined,'We expected the received value to not be null or undefined')
    }
    arrayContaining(expected){
        let expectedIsArray = Array.isArray(expected);
        let recievedIsArray = Array.isArray(this.received);
        if(expectedIsArray&&recievedIsArray){
            let containsAll = expected.map(member=>this.received.includes(member)).includes(false);
            this.verify(containsAll,expected)
        }else if(recievedIsArray){
            this.verify(this.received.includes(expected),expected)
        }else{
            this.verify(false,`Array Containing expects to receive a Array`)
        }
    }
 }

/*
*********************
* Test Verification *
*********************
*/
 let foo = 6
 let any_test = new Expect(foo).any(Number);
 let bar = 'S'
 let any_test_2 = new Expect(bar).any(String);

 let anything_test = new Expect(6).anything();
 let anything_test_2 = new Expect(null).anything();
