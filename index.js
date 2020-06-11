const PRIMITIVE = 'PRIMITIVE';
const SET = 'SET';
const MAP = 'MAP';
const WEAKMAP = 'WEAKMAP';
const WEAKSET = 'WEAKSET';
const ARRAY = 'ARRAY';
const OBJECT = 'OBJECT';
const SYMBOL = 'SYMBOL';


/**
 * @name is
 * @description
 * @example
 * @param {*} valueA 
 */
function is (valueA){
    if(Array.isArray(valueA)){
        return ARRAY;
    }else if(valueA instanceof Set){
        return SET;
    }else if(valueA instanceof Map){
        return MAP;
    }else if( valueA instanceof WeakMap){
        return WEAKMAP;
    }else if(valueA instanceof WeakSet){
        return WEAKSET;
    }else if(valueA instanceof Symbol){
        return SYMBOL;
    }else if (typeof valueA === 'object'){
        return OBJECT;
    }else{
        return PRIMITIVE;
    }
}



/**
 * @name deepEqual
 * @description Evaluates Two Objects for deep equality, Meaning all properties and values match
 * @param {any} objectA 
 * @param {any} objectB 
 */
function deepEquals(objectA,objectB){
    const equals = (x,y) => Object.is(x,y);
    let results = []
    let isObject = ( equals(typeof objectA, 'object') && equals(typeof objectB, 'object'))
        if(isObject){
            let keysA = Object.keys(objectA);
            let keysB = Object.keys(objectB);
            if(equals(keysA.length,keysB.length)){
                let propsMatch = keysA.every(key=>keysB.includes(key));
                if(propsMatch){
                    for(let prop in objectA){
                        if(objectA.hasOwnProperty(prop)){
                            let valueA = objectA[prop];
                            let valueB = objectB[prop];
                            switch(is(valueA)){
                                case PRIMITIVE:
                                    results.push(equals(valueA,valueB))
                                    break;
                                case OBJECT:
                                    results.push(deepEquals(valueA,valueB))
                                    break;
                                case ARRAY:
                                    valueA.forEach((element,index) => {
                                        if(typeof element !== 'object'){
                                            results.push(equals(element,valueB[index]))
                                        }else{
                                            results.push(deepEquals(element,valueB[index]))
                                        }
                                    });
                                    break;
                                case SET :
                                    valueA.forEach(value=>{
                                        results.push(valueB.has(value))
                                    })
                                    break;
                                case MAP :    
                                valueA.forEach((value,key)=>{
                                    results.push(equal(valueB.get(key),value))
                                })
                                    break;
                            }
                        }
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return equals(objectA,objectB);
        }
    return results.every(result=>result);
}



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
     * @description Checks for exact equality with Object.is(), This is best used for comparing primitive values
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

        let result = deepEquals(this.received,expected)[0];

        this.verify(result,expected);
    }
 }

/*
*********************
* Test Verification *
*********************
*/
 let foo = 6;
 let any_test = new Expect(foo).any(Number);
 let bar = 'S';
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
