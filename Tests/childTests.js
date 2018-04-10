/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');

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

        //retrieve all module items for each module
        function getModuleItems(modules, getModuleItemsCallback) {

        }

        //inspect each item in each module against array
        function inspectModule(inspectModuleCallback) {
            var headers = [
                'Beginning of Week',
                'Middle of Week',
                'End of Week',
            ];

            //tap.pass if it contains all three
            //tap.fail if it does NOT contain all three
        }
    });

    // Always call the callback in your childTests with just null
    callback(null);
};