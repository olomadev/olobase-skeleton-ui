/**
 * @oloma.dev (c) 2023-2025
 *
 * - helpers/cookies.js
 * 
 * Cookie helper for production and dev environment
 */
import cookies from "js-cookie";
import { join } from './lodash';
import { parseDomain, ParseResultType } from "parse-domain";

class Cookies {

  constructor() {
    this.cookieKey = JSON.parse(process.env.COOKIE);
  }

  getCookieKey(key) {
    return this.cookieKey?.[key] ?? key;
  }

  get(key) {
    return cookies.get(this.getCookieKey(key));
  }

  set(key, value, overrideAttributes = {}) {
    let secure = this.getSecure();
    let defaultAttributes = { 
      expires: 1, 
      path: "/", 
      domain: this.getBaseHost(),
      secure: secure
    };
    if (secure) { // add sameSite = "none" attribute if secure connection available
      defaultAttributes['sameSite'] = 'None';  
    }
    const attributes = { ...defaultAttributes, ...overrideAttributes };
    cookies.set(this.getCookieKey(key), value, attributes);
  }

  get(key) {
    return cookies.get(this.getCookieKey(key));
  }

  remove(key) {
    cookies.remove(this.getCookieKey(key), { 
      expires: -1, 
      path: "/", 
      domain: this.getBaseHost(), 
      secure: this.getSecure()
    });
  }

  getSecure() {
    return window.location.protocol === 'https:';
  }

  getBaseHost() {
    const parseResult = parseDomain(window.location.hostname);
    if (parseResult.type === ParseResultType.Invalid) {
      alert("Invalid domain name: Your cookie set() and get() methods will not work as expected");
    }
    let baseHost = "";
    if (parseResult.type === ParseResultType.Ip) {
      baseHost = window.location.hostname;
    }
    if (parseResult.type === ParseResultType.Reserved) {
      baseHost = join(parseResult.labels, ".");
      if (parseResult.labels.length === 3) { // unset subdomain
        parseResult.labels.shift();
      }
      baseHost = join(parseResult.labels, ".");
    }
    if (parseResult.type === ParseResultType.NotListed) {
      baseHost = join(parseResult.labels, ".");
    }
    if (parseResult.type === ParseResultType.Listed) {
      const { domain, topLevelDomains } = parseResult;
      baseHost = domain + "." + join(topLevelDomains, ".");
    }
    return baseHost;
  }
}

export default new Cookies();

