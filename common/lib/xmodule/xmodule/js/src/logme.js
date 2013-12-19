// Wrapper for RequireJS. It will make the standard requirejs(), require(), and
// define() functions from Require JS available inside the anonymous function.
(function (requirejs, require, define) {

define('logme', [], function () {
    var debugMode, consoleMethods;

    // debugMode can be one of the following:
    //
    //     true - All messages passed to logme() will be written to the
    //            internal browser console.
    //     false - Suppress all output to the internal browser console.
    //
    // Obviously, if anywhere there is a direct console.log() call, we can't do
    // anything about it. That's why use logme() - it will allow to turn off
    // the output of debug information with a single change to a variable.
    debugMode = true;

    // The console object provides access to the browser's debugging console.
    // The specifics of how it works vary from browser to browser, but there is
    // a de-facto set of methods that are typically provided.
    //
    // Below is a list of methods which we will make sure exists. If they are
    // not provided by the browser, we will define a no-operation function for
    // them.
    consoleMethods = [
        // General methods.
        'log',
        'debug',
        'info',
        'warn',
        'error',
        'assert',
        'clear',
        'dir',
        'dirxml',
        'trace',
        'group',
        'groupCollapsed',
        'groupEnd',
        'time',
        'timeEnd',
        'timeStamp',
        'profile',
        'profileEnd',
        'count',
        'table',

        // Firefox, Firebug specific methods.
        //
        // Note: console.exception() is an alias for console.error(); they are
        // functionally identical.
        'exception',

        // Chrome specific methods.
        //
        // https://developers.google.com/web-toolkit/speedtracer/logging-api
        'markTimeline'
    ];

    window.console = window.console || {};

    $.each(consoleMethods, function (index, methodName) {
        var method = window.console[methodName] || function () { };

        window.console[methodName] = method;
    });

    return logme;

    // function: logme
    //
    // A helper function that provides logging facilities. Sometimes, we don't
    // want to call console.log() directly. When everything is routed through
    // this function, the logging output can be easily turned off.
    //
    // logme() supports multiple parameters. Each parameter will be passed to
    // console.log() function separately.
    function logme() {
        if (!debugMode) {
            return;
        }

        window.console.log.apply(window, arguments);
    } // End-of: function logme
});

// End of wrapper for RequireJS. As you can see, we are passing
// namespaced Require JS variables to an anonymous function. Within
// it, you can use the standard requirejs(), require(), and define()
// functions as if they were in the global namespace.
}(
    RequireJS.requirejs, RequireJS.require, RequireJS.define
)); // End-of: (function (requirejs, require, define)
