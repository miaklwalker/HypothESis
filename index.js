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
        return (test && !this._not) ? this.pass(expected,received) : this.fail(expected,received);
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

    /**
     * @name arrayContaining
     * @description When passed an array, checks if the received value matches , all expected values
     * @param expected {Array | Number}
     * @example
     *  let arrayContaining_test = new Expect([1,2,3]).arrayContaining(1);
     *  let arrayContaining_test_2 = new Expect([1,2,3]).arrayContaining([1,2]);
     */
    arrayContaining(expected){
        let expectedIsArray = Array.isArray(expected);
        let receivedIsArray = Array.isArray(this.received);
        if(expectedIsArray&&receivedIsArray){
            let containsAll = !(expected.map(member=>this.received.includes(member)).includes(false));
            this.verify(containsAll,expected)
        }else if(receivedIsArray){
            this.verify(this.received.includes(expected),expected)
        }else{
            this.verify(false,`Array Containing expects to receive a Array`)
        }
    }

    /**
     * @name not
     * @description Sets the negation flag for the current test that reverses the results of a current test.
     * If the current test would fail it passes and vice versa
     * @returns {Expect}
     * @example expect(1).not.toBe(2) // This will pass
     */
    get not(){
        this._not = true;
        return this;
    }

    /**
     * @name toBe
     * @description Checks for exact equality with Onject.is(), This is best used for comparing primitive values
     * or referential values
     * @examples
     *  const add = (x,y)=> x + y;
     *  let toBe_test  = new Expect(add(1,1)).toBe(2);
     * @param expected
     */
    toBe(expected){
        let valuesMatch = Object.is(this.received,expected);
        this.verify(valuesMatch,expected);
    }
    toEqual(expected){
        let result = true;
        let compareToReceived = (objectA,objectB)=>{
            let ObjectAKeys = Object.keys(objectA);
            let ObjectBKeys = Object.keys(objectB);

        };
        compareToReceived(this.received,expected);
        this.verify(result,expected);
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
 let anything_test_2 = new Expect(null).not.anything();

 let arrayContaining_test = new Expect([1,2,3]).arrayContaining(1);
 let arrayContaining_test_2 = new Expect([1,2,3]).arrayContaining([1,2]);

 const add = (x,y)=> x + y;
 let toBe_test  = new Expect(add(1,1)).toBe(2);

 let canA = {
     flavor:'orange',
     calories:12,
 };
 let canB = {
     flavor:'orange'
 };
 let toEqual_test = new Expect(canA).toEqual(canB);
