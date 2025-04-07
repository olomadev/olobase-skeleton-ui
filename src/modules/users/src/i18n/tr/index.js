import users from './users.js';
import login from './login.js';

export default {
  title: "Kullanıcılar",
  menu: {
    label: "Kullanıcılar",
  },
  buttons: {
    editRoles: { label: "Rolleri Düzenle" }
  },
  users,
  login,
  logout: {
    title: "Çıkış",
    menu: {
      label: "Çıkış"
    }
  },
  forgotPassword: {
    title: "Şifremi Unuttum",
    buttons: {
      resetMyPassword: "Şifre Sıfırlama",
      backToLogin: "Girişe Dön"
    }
  },
  resetPassword: {
    title: "Şifre Sıfırlama"
  },
  myAccount: {
    title: "Hesabım",
    menu: {
      label: "Hesabım"
    },
    fields: {
      avatar: {
        set: "Resim Yükle",
        del: "Sil"
      }
    }
  },
  changePassword: {
    title: "Şifrem",
    menu: {
      label: "Şifre değiştir"
    },
    fields: {
      currentPassword: "Mevcut Şifre",
      newPassword: "Yeni Şifre",
      confirmPassword: "Şifreyi Onayla"
    }
  }
};
