export default {
  text: {
    required: "This field is required"
  },
  email: {
    required: "E-mail field is required",
    invalid: "Invalid e-mail address"
  },
  string: {
    required: "This field is required",
    alpha: "This field can only contains alphabetic characters",
    minLength: "This field must be a minimum of {min} characters",
    maxLength: "This field must be a maximum of {max} characters"
  },
  number: {
    required: "This field is required",
    integer: "This field must contains an integer value",
    numeric: "This field must contains a numeric value",
    decimal: "This field must contains a decimal value"
  },
  password: {
    required: "Password field is required",
    sameAs: "Password confirmation must be same as new password"
  },
  captcha: {
    invalid: "You need to pass the security verification stage"
  }
}