export default {
  text: {
    required: "Bu alan gereklidir"
  },
  email: {
    required: "E-posta alanı gereklidir",
    invalid: "Geçersiz e-posta adresi"
  },
  string: {
    required: "Bu alan gereklidir",
    alpha: "Bu alan sadece alfabetik karakterler içerebilir",
    minLength: "Bu alan en az {min} karakter olmalıdır",
    maxLength: "Bu alan en fazla {max} karakter olmalıdır"
  },
  number: {
    required: "Bu alan gereklidir",
    integer: "Bu alan sadece tam sayı değeri içermelidir",
    numeric: "Bu alan sayısal bir değer içermelidir",
    decimal: "Bu alan ondalıklı bir değer içermelidir"
  },
  password: {
    required: "Şifre alanı gereklidir",
    sameAs: "Şifre onayı yeni şifre ile aynı olmalıdır"
  },
  captcha: {
    invalid: "Güvenlik doğrulama aşamasını geçmeniz gerekmektedir"
  }
}