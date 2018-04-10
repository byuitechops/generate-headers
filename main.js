/*eslint-env node, es6*/

/* Include this line only if you are going to use Canvas API */
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

var allModules = [];

module.exports = (course, stepCallback) => {

    /****************************************************
    * buildHeader()
    * 
    * @param headerName - str
    * @param position - int
    * 
    * Parameters: headerName str, position int
    * Purpose: This function receives the name
    * of the text header to create and builds one
    * inside the instructor module
    ****************************************************/
    function buildHeader(headerName, position, moduleId, buildHeaderCallback) {
        canvas.post(`/api/v1/courses/${course.info.canvasOU}/modules/${moduleId}/items`, {
            'module_item': {
                'title': headerName,
                'type': 'SubHeader',
                'position': position,
            }
        }, (postErr, results) => {
            if (postErr) {
                buildHeaderCallback(postErr);
                return;
            }

            buildHeaderCallback(null);
        });
    }

    /****************************************************
    * retrieveModuleIds()
    * 
    * Parameters: headerName str, position int
    * Purpose: This function receives the name
    * of the text header to create and builds one
    * inside the instructor module
    ****************************************************/
    function retrieveModuleIds(retrieveModuleIdsCallback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/modules`, (getErr, modules) => {
            if (getErr) {
                retrieveModuleIdsCallback(getErr);
                return;
            }

            asyncLib.eachSeries(modules, (module, eachSeriesCallback) => {
                allModules.push(module);
            });

            console.log(`Modules: ${JSON.stringify(allModules)}`);

            retrieveModuleIdsCallback(null, modules);
        });
    }

    function beginProcess(beginProcessCallback) {
        var functions = [
            retrieveModuleIds,
        ];

        asyncLib.waterfall(functions, (waterfallErr) => {
            if (waterfallErr) {
                beginProcessCallback(waterfallErr);
                return;
            }

            beginProcessCallback(null);
        });
    }

    /********************************************** 
     *                  START HERE                *
     **********************************************/
    beginProcess((beginProcessErr) => {
        if (beginProcessErr) {
            course.error(beginProcessErr);
            stepCallback(null, course);
        }

        course.message('Successfully completed generate-headers child module.');
        stepCallback(null, course);
    });
};
