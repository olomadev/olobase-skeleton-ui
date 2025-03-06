import { defineStore } from "pinia";
import * as methods from "../providers/data/actions"
import useStore from "@/store"

const resource = defineStore('resource', {
  state: () => {
    return {
      i18n: null,
      provider: null,
      resource: null,
      sort: null,
      item: null,
      row: null,
      formItem: null,
      dialogItem: null
    }
  },
  getters: {
    getItem() {
      return this.item;
    },
    getFormItem() {
      return this.formItem;
    },
    getRow() {
      return this.row;
    },
    getSort() {
      return this.sort;
    },
    getDialogItem() {
      return this.dialogItem;
    },
  },
  actions: {
    init(params) {
      this.i18n = params.i18n;
      this.provider = params.provider;
      this.resource = params.resource;
    },
    setSort(item) {
      this.sort = item
    },
    setItem(item) {
      this.item = item
    },
    setFormItem(item) {
      this.formItem = item
    },
    removeItem() {
      this.item = null
    },
    setRow(row) {
      this.row = row
    },
    removeRow() {
      this.row = null
    },
    setDialogItem(item) {
      this.dialogItem = item;
    },
    setResource(name) {
      const parts = name.includes("_") ? name.split("_") : [null, name];
      const moduleName = parts[0];
      const resourceName = parts[1];
      this.resource = { module: moduleName, name: resourceName };
    },
    removeDialogItem() {
      this.dialogItem = null;
    },
    async getList(params) {
      const store = useStore();
      const api = store.getModule("api");
      const auth = store.getModule("auth");
      const messages = store.getModule("messages");
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["getList"]) {
          throw new Error(`Data provider action getList not implemented`);
        }
        api.setLoading(true, { root: true });
        let response = await this.provider.getList(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        if (response 
          && response["data"] 
          && response["data"]["data"]) {
          this.item = response.data.data;
        }
        api.setLoading(false, { root: true});
        return Promise.resolve(response)
      } catch (e) {
        api.setLoading(false, { root: true });
        auth.checkError(e, { root: true });
        messages.show({ type: "error", message: e.message }, { root: true });
        return Promise.reject(e);
      }
    },
    async getOne(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["getOne"]) {
          throw new Error(`Data provider action getOne not implemented`);
        }
        let response = await this.provider.getOne(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async getListAll(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["getListAll"]) {
          throw new Error(`Data provider action getListAll not implemented`);
        }
        let response = await this.provider.getListAll(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        // store.showSuccess({ action, params }); // Apply success message on writes operations
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async getMany(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["getMany"]) {
          throw new Error(`Data provider action getMany not implemented`);
        }
        let response = await this.provider.getMany(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, {
          root: true,
        });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async create(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["create"]) {
          throw new Error(`Data provider action create not implemented`);
        }
        let response = await this.provider.create(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async update(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["update"]) {
          throw new Error(`Data provider action update not implemented`);
        }
        let response = await this.provider.update(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async updateRow(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["updateRow"]) {
          throw new Error(`Data provider action updateRow not implemented`);
        }
        let response = await this.provider.updateRow(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async updateMany(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["updateMany"]) {
          throw new Error(`Data provider action updateMany not implemented`);
        }
        let response = await this.provider.updateMany(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async delete(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["delete"]) {
          throw new Error(`Data provider action delete not implemented`);
        }
        let response = await this.provider.delete(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        this.item = null; // remove current item if action "delete"
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async deleteMany(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["deleteMany"]) {
          throw new Error(`Data provider action deleteMany not implemented`);
        }
        let response = await this.provider.deleteMany(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        this.item = null; // remove current item if action "delete"
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async copy(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["copy"]) {
          throw new Error(`Data provider action copy not implemented`);
        }
        let response = await this.provider.copy(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async copyMany(params) {
      const store = useStore();
      try {
        if (!this.provider) {
          throw new Error("No data provider defined");
        }
        if (!this.provider["copyMany"]) {
          throw new Error(`Data provider action copyMany not implemented`);
        }
        let response = await this.provider.copyMany(this.resource.module, this.resource.name, {
          locale: this.locale,
          ...params,
        });
        return Promise.resolve(response)
      } catch (e) {
        store.getModule("messages").show({ type: "error", message: e.message }, { root: true });
        store.getModule("auth").checkError(e, { root: true });
        return Promise.reject(e);
      }
    },
    async refresh() {
      const store = useStore();
      /**
       * Refresh current resource and update item state
       */
      // let { data } = await this.provider.getList(this.resource.name, {
      //   locale: this.locale,
      //   id: (this.item && this.item['id']) ? this.item.id : null,
      // });
      // this.item = data;
      store.getModule("api").setRefresh(true);
    },
    showSuccess({ action, params }) {
      const store = useStore();
      let messages = {
        create: () =>
          i18n.global.t("va.messages.created", {
            resource: getName(1),
          }),
        update: () =>
          i18n.global.t("va.messages.updated", {
            resource: this.resource.getName(1),
            id: params.id,
          }),
        updateRow: () =>
          i18n.global.t("va.messages.updated", {
            resource: this.resource.getName(1),
            id: params.id,
          }),
        updateMany: () =>
          i18n.global.t("va.messages.updated_many", {
            resource: this.resource.getName(params.ids.length).toLowerCase(),
            count: params.ids.length,
          }),
        delete: () =>
          i18n.global.t("va.messages.deleted", {
            resource: this.resource.getName(1),
            id: params.id,
          }),
        deleteMany: () =>
          i18n.global.t("va.messages.deleted_many", {
            resource: this.resource.getName(params.ids.length).toLowerCase(),
            count: params.ids.length,
          }),
        copy: () =>
          i18n.global.t("va.messages.copied", {
            resource: this.resource.getName(1),
            id: params.id,
          }),
        copyMany: () =>
          i18n.global.t("va.messages.copied_many", {
            resource: this.resource.getName(params.ids.length).toLowerCase(),
            count: params.ids.length,
          }),
        moveNode: () =>
          i18n.global.t("va.messages.moved", {
            resource: this.resource.getName(1),
            id: params.id,
          }),
      };
      if (messages[action]) {
        store.getModule("messages").show({ type: "success", message: messages[action]() }, {
          root: true,
        });
      }
    },
    showError(message) {
      store.getModule("messages").show({ type: "error", message: message }, {
        root: true,
      });
    },

  }
});

export default resource;