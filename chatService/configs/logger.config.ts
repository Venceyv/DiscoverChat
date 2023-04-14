/*
 * @Author: 2FLing 349332929yaofu@gmail.com
 * @Date: 2023-04-13 05:33:06
 * @LastEditors: 2FLing 349332929yaofu@gmail.com
 * @LastEditTime: 2023-04-13 16:46:41
 * @FilePath: \discoveryChat\configs\logger.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {createLogger,format,transports} from 'winston';
import 'winston-daily-rotate-file';
const customFormat = format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);
const defaultOptions = {
    format: customFormat,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
};
export const globalLogger = createLogger({
    format: customFormat,
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/info-%DATE%.log",
            level: "info",
            ...defaultOptions,
        }),
        new transports.DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            level: "error",
            ...defaultOptions,
        }),
    ],
});
export const roomLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/roomLog-%DATE%.log",
            ...defaultOptions,
        }),
    ],
});
export const groupLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/groupLog-%DATE%.log",
            ...defaultOptions,
        }),
    ],
});
export const chatListLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/chatListLog-%DATE%.log",
            ...defaultOptions,
        }),
    ],
});
export const discoverLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/discover-%DATE%.log",
            ...defaultOptions,
        }),
    ],
});
export const rabbitMqLogger = createLogger({
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/rabbitMq-%DATE%.log",
            ...defaultOptions,
        }),
    ],
});