export default  {

  build: async function(t, admin) {

    const userRole = await admin.can(["user"]);
    const adminRole = await admin.can(["admin"]);

    return [
      {
        icon: "mdi-view-dashboard-outline",
        text: t("menu.dashboard"),
        link: "/dashboard",
      },
      // { divider: true },
      {
        icon: "mdi-cards-outline",
        text: t("menu.examples"),
        children: [
          {
            icon: "circle",
            text: t("menu.companies"),
            link: "/companies",
          }, 
          {
            icon: "circle",
            text: t("menu.roles"),
            link: "/roles",
          },
          {
            icon: "circle",
            text: t("menu.permissions"),
            link: "/permissions",
          },
          {
            icon: "circle",
            text: t("menu.users"),
            link: "/users?sortBy=firstname&sortDesc=false",
          },
          {
            icon: "circle",
            text: t("menu.employees"),
            link: "/employees?sortBy=name&sortDesc=false",
          },
          {
            icon: "circle",
            text: t("menu.departments"),
            link: "/departments?sortBy=name&sortDesc=false",
          },
          {
            icon: "circle",
            text: t("menu.failedlogins"),
            link: "/failedlogins?sortBy=attemptedAt&sortDesc=false",
          },
        ],
      },  
      {
        icon: "mdi-table",
        text: t("menu.dataGrids"),
        children: [
          {
            icon: "circle",
            text: t("menu.dataTableServer"),
            link: "/roles",
          },
          {
            icon: "circle",
            text: t("menu.dataTableServerGroup"),
            link: "/permissions",
          },
          {
            icon: "circle",
            text: t("menu.dataTableServerEditable"),
            link: "/employee-grades",
          },
        ],
      },
      {
        icon: "mdi-checkbox-blank-outline",
        text: t("menu.layouts"),
        children: [
          {
            icon: "circle",
            text: t("menu.asideLayout"),
            link: "/companies",
          },
          {
            icon: "circle",
            text: t("menu.breadcrumb"),
            link: "/breadcrumb",
          },
          {
            icon: "circle",
            text: t("menu.createEditListShowLayout"),
            link: "/users?sortBy=firstname&sortDesc=false",
          },    
          {
            icon: "circle",
            text: t("menu.tabLayout"),
            link: "/tab",
          }
        ],
      },  
      {
        icon: "mdi-checkbox-marked-outline",
        text: t("menu.inputs"),
        children: [
          {
            icon: "circle",
            text: t("menu.arrayInput"),
            link: "/employees/f607656b-b468-6eaf-4607-2067eb7a10f3/edit",
          },
          {
            icon: "circle",
            text: t("menu.autoCompleteInput"),
            link: "/autocomplete",
          },
          {
            icon: "circle",
            text: t("menu.avatarInput"),
            link: "/avatars/c13e550a-60ee-48d5-bf6e-ed29310640b2/edit",
          },
          {
            icon: "circle",
            text: t("menu.booleanInput"),
            link: "/boolean",
          },
          {
            icon: "circle",
            text: t("menu.checkListInput"),
            link: "/roles/6be6178d-fe99-47b6-90d5-2a0c4d25b6dc/edit",
          },
          {
            icon: "circle",
            text: t("menu.colorPickerInput"),
            link: "/account",
          },
          {
            icon: "circle",
            text: t("menu.currencyInput"),
            link: "/currency",
          },
          {
            icon: "circle",
            text: t("menu.dateInput"),
            link: "/date",
          },
          {
            icon: "circle",
            text: t("menu.fileInput"),
            link: "/file",
          },
          {
            icon: "circle",
            text: t("menu.numberInput"),
            link: "/number",
          },
          {
            icon: "circle",
            text: t("menu.passwordInput"),
            link: "/password",
          },
          {
            icon: "circle",
            text: t("menu.radioGroupInput"),
            link: "/radio",
          },
          {
            icon: "circle",
            text: t("menu.ratingInput"),
            link: "/rating",
          },
          {
            icon: "circle",
            text: t("menu.richTextInput"),
            link: "/richtext",
          },
          {
            icon: "circle",
            text: t("menu.selectInput"),
            link: "/select",
          },
          {
            icon: "circle",
            text: t("menu.sheetInput"),
            link: "/jobtitlelists",
          },
          {
            icon: "circle",
            text: t("menu.textInput"),
            link: "/text",
          }
        ],
      },
      {
        icon: "mdi-api",
        text: t("menu.api"),
        link: "/swagger",
      },

      
    ]; // end array

  } // end func

} // end class