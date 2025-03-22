import users from './users.js';
import views from './views.js';

export default {
  users: {
    menu: {
      label: "Kullanıcılar",
    },
    buttons: {
      editRoles: { label: "Rolleri Düzenle" }
    },
    users,
    views
  }
};
