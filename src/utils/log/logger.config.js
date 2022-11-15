import log4js from 'log4js';
import { config } from './config.js'

log4js.configure({
    appenders: {
        console: {type: 'console'},
        warnFile: { type: 'file', filename: './src/utils/log/warn.log'},
        errorFile: { type: 'file', filename: './src/utils/log/error.log'},
        //
        loggerConsole: { type: 'stdout', appender: 'console', level: 'info'},
        loggerWarn: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn'},
        loggerError: { type: 'logLevelFilter', appender: 'errorFile', level: 'error'},
    },
    categories: {
        default: {
            appenders: ['loggerConsole', 'loggerWarn', 'loggerError'],
            level: 'all'
        },
        production: {
            appenders: ['loggerWarn', 'loggerError'],
            level: 'all'
        }
    } 
});

let logger = null;

if (config.env == 'production') {
    logger = log4js.getLogger('production')
} else {
    logger = log4js.getLogger()
}

export {logger}

