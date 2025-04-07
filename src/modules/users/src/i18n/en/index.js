import users from './users.js';
import login from './login.js';

export default {
  title: "Users",
  menu: {
    label: "Users",
  },
  buttons: {
    editRoles: { label: "Edit Roles" }
  },        
  users,
  login,
  logout: {
    title: "Logout",
    menu: {
      label: "Logout"
    }
  },
  forgotPassword: {
    title: "Forgot Password",
    buttons: {
      resetMyPassword: "Reset Password",
      backToLogin: "Back to Login"
    }
  },
  resetPassword: {
    title: "Reset Password"
  },
  myAccount: {
    title: "My Account",
    menu: {
      label: "My Account"
    },
    fields: {
      avatar: {
        set: "Set Avatar",
        del: "Delete"
      }
    }
  },
  changePassword: {
    title: "My Password",
    menu: {
      label: "Change Password"
    },
    fields: {
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password"
    }
  }
};
