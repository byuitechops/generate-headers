/*eslint-env node, es6*/

/* Include this line only if you are going to use Canvas API */
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, stepCallback) => {

    /****************************************************
    * buildHeader()
    * 
    * @param headerName - str
    * @param position - int
    * 
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
        }, (postErr) => {
            if (postErr) {
                buildHeaderCallback(postErr);
                return;
            }

            buildHeaderCallback(null);
        });
    }

    /****************************************************
    * retrieveModule()
    * 
    * Purpose: This function simply makes an API call
    * to retrieves all of the modules. The modules return
    * as an array and is passed to the next function.
    ****************************************************/
    function retrieveModule(retrieveModuleCallback) {
        canvas.get(`/api/v1/courses/${course.info.canvasOU}/modules`, (getErr, modules) => {
            if (getErr) {
                retrieveModuleCallback(getErr);
                return;
            }

            retrieveModuleCallback(null, modules);
        });
    }

    /****************************************************
    * constructHeaders()
    * 
    * Purpose: This function goes through and calls 
    * headerFactory for each module. The headerFactory
    * does the dirty work for this function.
    ****************************************************/
    function constructHeaders(allModules, constructHeadersCallback) {
        var modules = allModules.filter(module => /(Week|Lesson|L|W)\s*(\d+(\D|$))/gi.test(module.name));

        //iterate through modules
        asyncLib.each(modules, (module, eachCallback) => {
            //headerFactory does the dirty work so just pass the module and move on
            headerFactory(module, (headerFactoryErr) => {
                if (headerFactoryErr) {
                    eachCallback(headerFactoryErr);
                    return;
                }

                eachCallback(null);
            });
        }, (eachErr) => {
            if (eachErr) {
                constructHeadersCallback(eachErr);
                return;
            }

            constructHeadersCallback(null);
        });
    }

    /****************************************************
    * headerFactory()
    * 
    * Purpose: This function takes in a module and creates
    * three headers at the bottom of the module and then
    * logs the results.
    ****************************************************/
    function headerFactory(module, headerFactoryCallback) {
        //the headers array is in reverse order since canvas reverses them if 
        //you use same position
        var headers = [
            'End of Week',
            'Middle of Week',
            'Beginning of Week',
        ];

        //iterate through headers
        asyncLib.eachSeries(headers, (header, eachSeriesCallback) => {
            //call buildHeader to create the header
            buildHeader(header, 99, module.id, (buildHeaderErr) => {
                if (buildHeaderErr) {
                    eachSeriesCallback(buildHeaderErr);
                    return;
                }

                course.log('Standard Headers', {
                    'module': module.name,
                    'header': header,
                });

                eachSeriesCallback(null);
            });
        }, (eachOfErr) => {
            if (eachOfErr) {
                headerFactoryCallback(eachOfErr);
                return;
            }

            headerFactoryCallback(null);
        });
    }

    /****************************************************
    * beginProcess()
    * 
    * Purpose: This function acts as a driver for the 
    * program.
    ****************************************************/
    function beginProcess(beginProcessCallback) {
        var functions = [
            retrieveModule,
            constructHeaders,
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
     *                 START HERE                 *
     **********************************************/
    course.settings.moduleSubHeaders = true;
    
     if (course.settings.moduleSubHeaders) {
        beginProcess((beginProcessErr) => {
            if (beginProcessErr) {
                course.error(beginProcessErr);
                stepCallback(null, course);
            }

            stepCallback(null, course);
        });
    } else {
        stepCallback(null, course);
    }
};
