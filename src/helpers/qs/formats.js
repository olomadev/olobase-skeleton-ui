'use strict';

const replace = String.prototype.replace;
const percentTwenties = /%20/g;

const Format = {
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};

const formatters = {
  RFC1738: (value) => replace.call(value, percentTwenties, '+'),
  RFC3986: (value) => String(value)
};

const defaultFormat = Format.RFC3986;

export default {
  default: defaultFormat,
  formatters,
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
