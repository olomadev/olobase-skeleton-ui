/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/lodash.js
 * 
 * An Es7 clone of lodash: load text helpers from here instead of using external libraries
 */
// capitalize: "hello world" -> "Hello world"
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// camelCase: "hello world" -> "helloWorld"
function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+|_+/g, '');
}

// kebabCase: "hello world" -> "hello-world"
function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase -> camel-Case
    .replace(/[\s_]+/g, '-') // boşlukları ve alt çizgileri tire yap
    .toLowerCase();
}

// kebabToCamel: "hello-world" -> "helloWorld"
function kebabToCamel(kebabCase) {
  return kebabCase
    .split('-')  // Kebab case'i ayır
    .map((word, index) => {
      if (index === 0) {
        return word; // İlk kelimeyi olduğu gibi bırak
      }
      return word.charAt(0).toUpperCase() + word.slice(1); // Diğer kelimeleri büyük harfle başlat
    })
    .join(''); // Kelimeleri birleştir
}

// lowerCase: converts all words in the text to lowercase and separates them with spaces
function lowerCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → camel Case
    .replace(/[_\s]+/g, ' ') // convert underscores and extra spaces to single spaces
    .trim()
    .toLowerCase();
}

function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// get: Secure object access
function get(obj, path, defaultValue) {
  return path
    .split(/[\.\[\]\'\"]/)
    .filter(Boolean)
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
}

// set: Assigning a safe value to an object
function set(obj, path, value) {
  const keys = path.split(/[\.\[\]\'\"]/).filter(Boolean);
  let current = obj;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
  return obj;
}

// isEmpty: Space, array, object control
function isEmpty(value) {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// debounce: Block repeated calls within a certain period of time
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// isObject: Control for objects
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// truncate: shorten text
function truncate(str, options = {}) {
  const length = options.length || 30;
  const omission = options.omission || '...';
  if (str.length > length) {
    return str.slice(0, length) + omission;
  }
  return str;
}

// size: Gets the size of an Array, String or Object
function size(value) {
  if (Array.isArray(value) || typeof value === 'string') return value.length;
  if (isObject(value)) return Object.keys(value).length;
  return 0;
}

// remove: Deletes elements from an array
function remove(array, predicate) {
  const result = [];
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      result.push(array.splice(i, 1)[0]);
    }
  }
  return result;
}

// trimEnd: Removes trailing spaces from a string
function trimEnd(str, chars = ' ') {
  const regex = new RegExp(`[${chars}]+$`);
  return str.replace(regex, '');
}

// join: Concatenates the string with the specified delimiter
function join(array, separator = ',') {
  return array.join(separator);
}


function stringify(obj, options = {}) {
  const pairs = [];
  const { prefix, arrayFormat = "none" } = options;
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value) && arrayFormat === "repeat") {
      value.forEach(val => {
        pairs.push(`${encodeURIComponent(prefixedKey)}=${encodeURIComponent(val)}`);
      });
    } else if (value !== null && typeof value === 'object') {
      pairs.push(stringify(value, { prefix: prefixedKey, arrayFormat }));
    } else {
      pairs.push(`${encodeURIComponent(prefixedKey)}=${encodeURIComponent(value)}`);
    }
  }
  return pairs.join('&');
}

export {
  capitalize,
  camelCase,
  kebabCase,
  kebabToCamel,
  lowerCase,
  upperFirst,
  get,
  set,
  isEmpty,
  debounce,
  isObject,
  truncate,
  size,
  remove,
  trimEnd,
  join,
  stringify
};

