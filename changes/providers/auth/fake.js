import cookies from '@/helpers/cookies'

/**
 * Fake login for testing purpose without need of real auth server
 */
export default () => {
  params = {
    routes: {
      login: "auth/token",
      logout: "auth/logout",
      refresh: "auth/refresh",
      user: "auth/me",
    },
    getToken: (r) => r.token,
    getCredentials: ({ username, password }) => {
      return {
        username,
        password,
      };
    },
    getId: (r) => r.user.id,
    getFullname: (r) => r.user.fullname,
    getEmail: (r) => r.user.email,
    getAvatar: () => localStorage.getItem("avatar"),
    getPermissions: (r) => r.user.permissions,
    ...params,
  };

  let {
    routes,
    getCredentials,
    getId,
    getFullname,
    getEmail,
    getAvatar,
    getPermissions,
    getToken,
  } = params;

  return {
    login({ username }) {
      const user = {
          "id": "c13e550a-60ee-48d5-bf6e-ed29310640b2",
          "fullname": "Demo Admin",
          "email": "demo@example.com",
          "permissions": [
              "admin"
          ]
      },
      cookies.set("user", JSON.stringify(user));
      cookies.set("token", null);
      localStorage.setItem("avatar", null);
    },
    logout() {
      let response = null;
      cookies.remove("user")
      cookies.remove("token")
      return Promise.resolve(response);
    },
    checkAuth() {
      let user = JSON.parse(localStorage.getItem("user"));
      return user
        ? Promise.resolve({
          data: {
              avatar: null,
              token: null,
              user: user,
              cookieKey: {
                user:  cookies.getCookieKey("user"),
                token: cookies.getCookieKey("token"),
              }
          },
        })
        : Promise.reject();
    },
    checkError({ status }) {
      if (status === 401 || status === 403) {
        localStorage.removeItem("user");
        return Promise.reject();
      }
      return Promise.resolve();
    },
    getId: (u) => u.id,
    getFullname: (u) => u.fullname,
    getEmail: (u) => u.email,
    getAvatar: (u) => null,
    getPermissions: (u) => getPermissions(u),
  };
};
