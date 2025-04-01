import config from "@/_config";
import i18nConfig from "@/modules/i18n/src/_config";

/**
 * Utility functions 
 */
export default {
  methods: {
    generateInt(maxInt = null) {
      const min = 999;
      const max = (maxInt) ? maxInt : 9223372036854775807;  // php max integer constant value
      // Use Math.floor to round down to the nearest whole number
      // Use Math.random() to generate a random decimal between 0 (inclusive) and 1 (exclusive)
      // Multiply by the range (max - min + 1) to cover the entire range
      // Add the minimum value to shift the range to [min, max]
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateUid(uppercase = false) {
      if (config.form.disableGenerateUid) {
        return this.generateInt();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        let uuid = v.toString(16);
        return (uppercase) ? uuid.toUpperCase() : uuid;
      });
    },
    generateId(object) {
      if (config.form.disableGenerateUid) {
        return object.$route.name.slice(-6) == "create" ? this.generateInt() : object.id;
      }
      return object.$route.name.slice(-6) == "create" ? this.generateUid() : object.id;
    },
    generateKey(keyValue, index = 0) {
      if (Array.isArray(keyValue)) {
        let ids = [];
        for (let i = 0; i < keyValue.length; i++) {
          ids.push(keyValue[i].id);
        }
        return ids.join() + "-" + String(index);
      }
      return keyValue + "-" + String(index);
    },
    validateForm(object, form) {
      const fields = Object.keys(object.v$[form]);
      let invalid = false;
      fields.forEach(function(val){
        if (val.charAt(0) != "$") {  // reserved variables
          object.v$[form][val].$touch();
          if (object.v$[form][val].$invalid) {
            invalid = true
          }  
        }        
      });
      return invalid;
    },
    dateAddMonth(date, numberOfMonth) {
      var currentDate = new Date(date);
      var newDate = currentDate.setMonth(currentDate.getMonth() + numberOfMonth);
      return new Date(newDate).toJSON().slice(0, 10);
    },
    dayDiff(firstDate, secondDate = null) {
      let date1 = new Date(firstDate);
      let date2 = new Date();
      if (secondDate) {
        date2 = new Date(secondDate);
      }
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    monthDiff(firstDate, secondDate) {
      firstDate = new Date(firstDate);
      secondDate = new Date(secondDate);
      var totalMonth = Math.max(
        (secondDate.getFullYear() - secondDate.getFullYear()) * 12 +
          secondDate.getMonth() -
          firstDate.getMonth(),
        0
      );
      totalMonth = totalMonth + 1;
      return totalMonth;
    },
    arrayRange(start, stop, step = 1) {
      return Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);
    },
    arrayGroupBy(xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    generatePassword(size) {
      // let characters = "a-z,A-Z,0-9,#"
      let characters = "a-z,0-9,$";
      let charactersArray = characters.split(",");
      let CharacterSet = "";
      let password = "";
      if (charactersArray.indexOf("a-z") >= 0) {
        CharacterSet += "abcdefghijklmnpqrstuvwxyz";
      }
      // if (charactersArray.indexOf('A-Z') >= 0) {
      //     CharacterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      // }
      if (charactersArray.indexOf("0-9") >= 0) {
        CharacterSet += "123456789";
      }
      if (charactersArray.indexOf("$") >= 0) {
        CharacterSet += "#@_-?";
      }
      for (let i = 0; i < size; i++) {
        password += CharacterSet.charAt(
          Math.floor(Math.random() * CharacterSet.length)
        );
      }
      return password;
    },
    getQueryParam(name, url = window.location.href) {
      name = name.replace(/[[]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    formatDateForDisplay(val, locale) {
      if (!val) {
        return
      }
      const dateFormat = i18nConfig[locale].dateFormat;
      const seperatorArray = dateFormat.match(/(\.)|(-)|(\/)|(\\)/);
      let s = "-"; // default seperator
      if (Array.isArray(seperatorArray)) {
        s = seperatorArray[0];
      }
      const date = new Date(val);
      let month = 1 + date.getMonth();
      if (month < 10) {
        month = `0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      let year = date.getFullYear();
      switch (dateFormat) {
        case 'd' + s + 'm' + s + 'Y':
          return `${day}${s}${month}${s}${year}`;
          break;
        case 'm' + s + 'd' + s + 'Y':
          return `${month}${s}${day}${s}${year}`;
          break;
        case 'Y' + s + 'm' + s + 'd':
          return `${year}${s}${month}${s}${day}`;
          break;
        case 'Y' + s + 'd' + s + 'm':
          return `${year}${s}${day}${s}${month}`;
          break;
        default:
          return `${day}${s}${month}${s}${year}`;
      }
    }
  } 
};