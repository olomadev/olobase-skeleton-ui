export default {
  title: "Roles",
  menu: {
    label: "Roles",
  },
  tabs: {
    permissions: {
      label: "Permissions"
    },
    users: {
      label: "Users",
      dialog: {
        title: "Select User"
      }
    }
  },
  fields: {
    q: "Search",
    resource: "Resource",
    roleKey: "Rol Key",
    roleName: "Rol Name",
    roleLevel: "Rol Level",
    permissions: "Permissions",
    module: "Module",
    name: "Permission",
    route: "Route",
    action: "Action",
    method: "Method"
  },
  messages: {
    userAlreadyAssigned: "This user is already assigned to the current role"
  }
}