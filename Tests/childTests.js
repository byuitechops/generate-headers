/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

//https://stackoverflow.com/a/14853974
Array.prototype.equals = function (array) {
    // if array has falsy value (i.e. null/undefined), just return
    if (!array) {
        return false;
    }

    // check lengths, if lengths are different, return false since it's
    // impossible that two arrays are the same while having different lengths
    if (this.length != array.length) {
        return false;
    }

    for (var i = 0; i < this.length; i++) {
        // determine if inner arrays exist
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // call itself on the inner arrays to determine equality
            // if equality return false, break out of loop and return false
            // no need to check further
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] != array[i]) {
            return false;
        }
    }

    // after the for loop, if no conditions hit, both arrays must be equal true
    return true;
}

module.exports = (course, callback) => {
    tap.test('child-template', (test) => {

        //retrieve all modules
        function getModules(getModulesCallback) {
            /* Check if the modules have been deleted */
            canvas.getModules(course.info.canvasOU, (getModulesErr, moduleList) => {
                if (getModulesErr) {
                    getModulesCallback(getModulesErr);
                    return;
                }

                getModulesCallback(null, moduleList);
            });
        }

        //parse through the module list
        function parseModules(moduleList, parseModulesCallback) {

            //don't need to check modules that does not need the SubHeaders
            var modules = moduleList.filter(module => /(Week|Lesson|L|W)\s*(\d+(\D|$))/gi.test(module.name));

            //map a function to each element in the array asynchronously
            asyncLib.each(modules, (module, eachCallback) => {
                inspectModule(module, (err) => {
                    if (err) {
                        eachCallback(err);
                        return;
                    }

                    eachCallback(null);
                });
            }, (eachErr) => {
                if (eachErr) {
                    parseModulesCallback(eachErr);
                    return;
                }

                parseModulesCallback(null, moduleList);
            });
        }

        //inspect each item in each module against array
        function inspectModule(module, inspectModuleCallback) {
            var includedHeaders = [];
            var types = [
                'SubHeader',
            ];

            //headers we are comparing to
            var headers = [
                'Beginning of Week',
                'Middle of Week',
                'End of Week',
            ];

            //
            canvas.getModuleItems(course.info.canvasOU, module.id, (getModuleItemsErr, moduleItems) => {
                if (getModuleItemsErr) {
                    inspectModuleCallback(getModuleItemsErr);
                    return;
                }

                moduleItems.forEach((item) => {
                    if (types.includes(item.type) && headers.includes(item.title)) {
                        includedHeaders.push(item.title);
                    }
                });

                if (includedHeaders.length === 3 && headers.equals(includedHeaders)) {
                    tap.pass(`${module.name} has the correct SubHeaders.`);
                } else {
                    tap.fail(`${module.name} does NOT have the correct SubHeaders.`);
                }

                inspectModuleCallback(null);
            });
        }

        function beginTesting() {
            var functions = [
                getModules,
                parseModules,
                inspectModule,
            ];

            asyncLib.waterfall(functions, (waterfallErr) => {
                test.end();
            });
        }

        beginTesting();
    });

    callback(null);
};