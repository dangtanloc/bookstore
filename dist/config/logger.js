"use strict";

const winston = require('winston');
const {
  createLogger,
  format,
  transports
} = winston;
const {
  combine,
  timestamp,
  printf,
  colorize
} = format;
require('winston-daily-rotate-file');

// Custom format for logs
const logFormat = printf(({
  level,
  message,
  timestamp,
  ...metadata
}) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Configure daily rotate file transport
const fileRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logsDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: combine(timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), logFormat)
});

// Create the logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), logFormat),
  transports: [
  // Console transport for development
  new transports.Console({
    format: combine(colorize(), timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }), logFormat)
  }),
  // File transport for all environments
  fileRotateTransport]
});

// Create a stream object for Morgan
logger.stream = {
  write: message => {
    logger.info(message.trim());
  }
};
logger.info(logsDir);
module.exports = logger;