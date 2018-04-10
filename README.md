# generate-headers
### *Package Name*: generate-headers
### *Child Type*: post import
### *Platform*: Online
### *Required*: Required

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

The main purpose of this child module is to implement three SubHeaders (Beginning of Week, Middle of Week and End of Week) into each week or lesson module. It excludes all of the Resources modules. 


## How to Install

```
npm install generate-headers
```

## Run Requirements

This child module will only execute if `course.settings.moduleSubHeaders` is true

## Options

If there are options that need to be set before the module runs, include them in a table, like this:

| Option | Values | Description |
|--------|--------|-------------|
|moduleSubHeaders| true/false | Determines whether the Module SubHeaders should be implemented in the course|

## Outputs

None as of this moment.

## Process

Describe in steps how the module accomplishes its goals.

1. It makes an Canvas API call to retrieve all of the modules in the course.
2. It will filter out all of the unnecessary modules and then iterate through each module.
3. Inside each iteration, it will create three SubHeaders at the bottom of the module.

## Log Categories

List the categories used in logging data in your module.

- module: the specific module the SubHeader is being built into
- header: the name of the SubHeader built into the module

## Requirements

In every Weekly or Lesson module (excluding all Resources modules or something similar), three SubHeaders (Beginning of Week, Middle of Week and End of Week) is to be built into the module at the bottom. Another employee will manually move the SubHeaders to the correct location in the module. This simply just creates the SubHeaders.