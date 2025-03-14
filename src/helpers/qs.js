/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/qs.js
 * 
 * An Es7 clone of qs library: Simple query stringify with nesting.
 */
import utils from './qs/utils';
import formats from './qs/formats';

const arrayPrefixGenerators = {
  brackets: (prefix) => `${prefix}[]`,
  comma: 'comma',
  indices: (prefix, key) => `${prefix}[${key}]`,
  repeat: (prefix) => prefix,
};

const isArray = Array.isArray;
const push = Array.prototype.push;

const pushToArray = (arr, valueOrArray) => {
  push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

const toISO = Date.prototype.toISOString;

const defaultFormat = formats['default'];
const defaults = {
  addQueryPrefix: false,
  allowDots: false,
  allowEmptyArrays: false,
  arrayFormat: 'indices',
  charset: 'utf-8',
  charsetSentinel: false,
  commaRoundTrip: false,
  delimiter: '&',
  encode: true,
  encodeDotInKeys: false,
  encoder: utils.encode,
  encodeValuesOnly: false,
  filter: void 0,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  indices: false,
  serializeDate: (date) => toISO.call(date),
  skipNulls: false,
  strictNullHandling: false,
};

const isNonNullishPrimitive = (v) => {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'symbol' || typeof v === 'bigint';
};
const sentinel = {};

class SideChannel {
  constructor() {
    this.store = new Map();
  }
  // Set a value in the side channel
  set(key, value) {
    this.store.set(key, value);
  }
  // Get a value from the side channel
  get(key) {
    return this.store.get(key);
  }
}

class QueryString {
    
  static stringify(object, opts) {
    const options = QueryString.normalizeStringifyOptions(opts);
    const objKeys = Object.keys(object);
    const keys = [];
    const generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    const commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;
    const sideChannel = new SideChannel();

    objKeys.forEach((key) => {
      const value = object[key];
      if (options.skipNulls && value === null) return;

      pushToArray(keys, QueryString._stringify(
        value,
        key,
        generateArrayPrefix,
        commaRoundTrip,
        options.allowEmptyArrays,
        options.strictNullHandling,
        options.skipNulls,
        options.encodeDotInKeys,
        options.encode ? options.encoder : null,
        options.filter,
        options.sort,
        options.allowDots,
        options.serializeDate,
        options.format,
        options.formatter,
        options.encodeValuesOnly,
        options.charset,
        sideChannel
      ));
    });

    let prefix = options.addQueryPrefix === true ? '?' : '';
    const joined = keys.join(options.delimiter);
    if (options.charsetSentinel) {
      prefix += options.charset === 'iso-8859-1' ? 'utf8=%26%2310003%3B&' : 'utf8=%E2%9C%93&';
    }

    return joined.length > 0 ? prefix + joined : '';
  }

  static normalizeStringifyOptions(opts) {
    if (!opts) return defaults;

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
      throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.encoder !== 'undefined' && opts.encoder !== null && typeof opts.encoder !== 'function') {
      throw new TypeError('Encoder must be a function');
    }

    if (opts.charset && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
      throw new TypeError('Charset must be either "utf-8" or "iso-8859-1"');
    }

    const format = formats['default'];
    const formatter = formats.formatters[format];

    return {
      addQueryPrefix: opts.addQueryPrefix === true ? opts.addQueryPrefix : defaults.addQueryPrefix,
      allowDots: opts.allowDots || defaults.allowDots,
      allowEmptyArrays: opts.allowEmptyArrays !== undefined ? opts.allowEmptyArrays : defaults.allowEmptyArrays,
      arrayFormat: opts.arrayFormat || defaults.arrayFormat,
      charset: opts.charset || defaults.charset,
      charsetSentinel: opts.charsetSentinel === true ? opts.charsetSentinel : defaults.charsetSentinel,
      commaRoundTrip: opts.commaRoundTrip || defaults.commaRoundTrip,
      delimiter: opts.delimiter || defaults.delimiter,
      encode: opts.encode !== undefined ? opts.encode : defaults.encode,
      encodeDotInKeys: opts.encodeDotInKeys || defaults.encodeDotInKeys,
      encoder: opts.encoder || defaults.encoder,
      encodeValuesOnly: opts.encodeValuesOnly || defaults.encodeValuesOnly,
      filter: opts.filter || defaults.filter,
      format: opts.format || defaults.format,
      formatter,
      serializeDate: opts.serializeDate || defaults.serializeDate,
      skipNulls: opts.skipNulls || defaults.skipNulls,
      sort: opts.sort || defaults.sort,
      strictNullHandling: opts.strictNullHandling || defaults.strictNullHandling,
    };
  }

  static _stringify(value, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
    let obj = value;
    let tmpSc = sideChannel;
    let step = 0;
    let findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
      const pos = tmpSc.get(value);
      step += 1;
      if (pos !== undefined) {
        if (pos === step) {
          throw new RangeError('Cyclic object value');
        } else {
          findFlag = true;
        }
      }
      if (typeof tmpSc.get(sentinel) === 'undefined') {
        step = 0;
      }
    }

    if (typeof filter === 'function') {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate(obj);
    }

    if (obj === null) {
      if (strictNullHandling) {
        return encoder ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
      }
      obj = '';
    }

    if (isNonNullishPrimitive(obj)) {
      const keyValue = encodeValuesOnly ? prefix : encoder ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
      return [`${formatter(keyValue)}=${formatter(encoder ? encoder(obj, defaults.encoder, charset, 'value', format) : String(obj))}`];
    }

    const values = [];
    if (typeof obj === 'undefined') return values;

    let objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
      obj = utils.maybeMap(obj, (value) => value instanceof Date ? serializeDate(value) : value);
      objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void 0 }];
    } else {
      const keys = Object.keys(obj);
      objKeys = sort ? keys.sort(sort) : keys;
    }

    const encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, '%2E') : String(prefix);
    const adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? `${encodedPrefix}[]` : encodedPrefix;

    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
      return `${adjustedPrefix}[]`;
    }

    objKeys.forEach((key) => {
      const value = key && key.value !== undefined ? key.value : obj[key];
      if (skipNulls && value === null) return;

      const encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, '%2E') : String(key);
      const keyPrefix = isArray(obj)
        ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix
        : `${adjustedPrefix}[${encodedKey}]`;

      sideChannel.set(value, step);
      const valueSideChannel = new SideChannel();
      valueSideChannel.set(sentinel, sideChannel);
      pushToArray(values, QueryString._stringify(
        value,
        keyPrefix,
        generateArrayPrefix,
        commaRoundTrip,
        allowEmptyArrays,
        strictNullHandling,
        skipNulls,
        encodeDotInKeys,
        generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder,
        filter,
        sort,
        allowDots,
        serializeDate,
        format,
        formatter,
        encodeValuesOnly,
        charset,
        valueSideChannel
      ));
    });

    return values;
  }
}

export default QueryString;

// example:
// 
// import qs from '@/helpers/qs';

// const obj = { user: { name: 'John', age: 30 }, active: true };
// const queryStr = qs.stringify(obj);
// console.log(queryStr);  // user[name]=John&user[age]=30&active=true