<template>
  <v-card variant="flat" :border="border" :loading="listState.loading">
    <v-card-text>
      <v-row :class="class">
        <v-col sm="4" v-if="!hideTitle">
          <h1 class="h1">
            {{ getTitle }}
          </h1>
        </v-col>
        <v-col sm="8" class="text-right">
          <div class="d-flex justify-end">
            <v-btn 
              v-if="!disableFilters && !getDisableSettingsValue"
              variant="text"
              :icon="!lgAndUp"
              @click="toggleSettingsPanel"
              color="primary"
              exact
            >
              <v-icon size="small">mdi-cog</v-icon>
              <span v-if="lgAndUp" class="ml-2">
                {{ $t("va.datatable.settings") }}
              </span>
            </v-btn>

            <va-create-button
              v-if="!disableCreate"
              :disable-redirect="disableCreateRedirect"
              :resource="resource"
              @click="onAction('create')"
            ></va-create-button>

            <va-row-create-button
              v-if="rowCreate"
              :disable-redirect="true"
              :resource="resource"
              @click="onAction('rowCreate')"
            ></va-row-create-button>

            <va-create-dialog-button
              v-if="enableSaveDialog"
              :disable-redirect="true"
              :resource="resource"
              @click="onAction('rowSaveDialog')"
            ></va-create-dialog-button>

             <!-- @slot Put here some global action with components based on VaActionButton. -->
            <slot name="actions"></slot>  
          </div>
        </v-col>
      </v-row>

      <div v-if="!disableFilters && getFilters.length != 0">
        <form-filter
          v-if="!getHideHeaderValue"
          :filters="getFilters"
          v-model="currentFilter"
          class="mb-3"
        >
          <template 
            v-for="filter in getFilters"
            v-slot:[filter.source]="props"
          >
            <slot :name="`filter.${filter.source}`" v-bind="props"></slot>
          </template>
        </form-filter>
      </div>
      
      <div v-if="!disableFilters && toggleSettings" id="toggleSettings" class="mb-3">
        <v-row class="pt-3 pl-0 pb-3 pr-0">
          <v-col class="pb-0 pt-0" cols="12">
            <div class="align-center">
              <v-row>
                <v-col cols="12">
                  <v-table class="table-settings" density="compact">
                    <thead>
                      <tr>
                        <th style="border: none"></th>
                        <template v-for="item in selectItems">
                          <th style="color:#a5a5a5" >{{ item.title }}</th>
                        </template>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="!disableVisibility">
                        <td width="20%">{{ $t('va.datatable.visible') }}</td>
                        <template v-for="item in selectItems">
                          <td>
                            <v-switch
                              density="compact"
                              :key="settingsKey"
                              v-model="visibilities[item.key]"
                              @change="updateVisibility(item.key, visibilities[item.key])"
                              color="primary"
                              hide-details
                            ></v-switch>
                          </td>
                        </template>
                      </tr>
                      <tr>
                        <td>{{ $t('va.datatable.filterable') }}</td>
                        <template v-for="item in selectItems">
                          <td>
                            <v-switch 
                              density="compact"
                              v-if="item.key !== 'actions'"
                              :key="settingsKey"
                              v-model="filterabilities[item.key]"
                              @change="updateFilterability(item.key, filterabilities[item.key])"
                              color="primary"
                              hide-details
                            ></v-switch>
                          </td>
                        </template>
                      </tr>
                      <tr v-if="!disablePositioning">
                        <td>{{ $t('va.datatable.positioning') }}</td>
                        <td :colspan="selectItems.length" style="border-bottom: none">
                          <div class="table-draggable">
                            <v-table v-if="selectItems.length > 0" density="compact" class="mt-6 mb-6" width="%100">
                              <draggable v-model="selectedHeaders" tag="tr" :item-key="key => key">
                                <template #item="item">
                                  <th style="cursor:pointer;padding:4px;" scope="col">
                                    {{ item.element.title }}
                                    <span class="circle">{{ item.index + 1 }}</span>
                                  </th>
                                </template>
                              </draggable>
                            </v-table>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td :colspan="selectItems.length" class="pt-2 pb-2">
                          <v-btn
                            class="mt-1 mb-1"
                            color="primary"
                            variant="tonal"
                            type="button"
                            :icon="!lgAndUp"
                            @click="saveSettings"
                          >
                            <v-icon size="small">mdi-content-save</v-icon>
                            <span v-if="lgAndUp" class="ml-2 pb-0 mb-0">{{
                              $t("va.datatable.save_settings")
                            }}</span>
                          </v-btn>
                          <v-btn
                            class="ml-2 mt-1 mb-1"
                            color="secondary"
                            variant="flat"
                            type="button"
                            :icon="!lgAndUp"
                            @click="restoreSettings"
                          >
                            <v-icon size="small">mdi-restore</v-icon>
                            <span v-if="lgAndUp" class="ml-2 pb-0 mb-0">{{
                              $t("va.datatable.restore_defaults")
                            }}</span>
                          </v-btn>
                          <v-btn
                            class="ml-2 mt-1 mb-1"
                            color="secondary"
                            variant="flat"
                            type="button"
                            :icon="!lgAndUp"
                            @click="toggleSettingsPanel"
                          >
                            <v-icon size="small">mdi-close</v-icon>
                            <span v-if="lgAndUp" class="ml-2 pb-0 mb-0">{{
                              $t("va.datatable.close_settings")
                            }}</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
      
      <v-toolbar 
        height="45"
        color="blue lighten-5" 
        v-if="listState.selected.length"
      >
        {{ $t("va.datatable.selected_items", listState.selected.length) }}
        <v-spacer></v-spacer>
        <div>
          <va-bulk-delete-button v-if="!hideBulkDelete" :value="listState.selected" @refresh="$emit('refresh', 1)"></va-bulk-delete-button>
          <va-bulk-copy-button v-if="!hideBulkCopy" :value="listState.selected" @refresh="$emit('refresh', 1)"></va-bulk-copy-button>

          <!-- @slot Full template which contains all bulk actions. -->
          <slot name="bulk.actions" v-bind="{ selected: listState.selected }" />
        </div>
      </v-toolbar>

      <!-- default slot -->
      <slot></slot>

    </v-card-text>
  </v-card>
</template>

<script>
import { useDisplay } from 'vuetify'
import { isEmpty } from '@/helpers/lodash';
import Resource from "../../../mixins/resource";
import eventBus from "@/helpers/eventbus";
import Search from "../../../mixins/search";
import FormFilter from "../../internal/FormFilter.vue";
import config from "@/_config";
import Draggable from 'vue3-draggable-next'
import useResource from "../../../store/resource";
/**
 * List data iterator component, perfect for list CRUD page as well as any resource browsing standalone component.
 * Allow resource paginating and filtering. Use current query string context for initial state by default.
 * The list layout on default slot is fully customizable and can be used for separate `VaDataTable` component.
 */
export default {
  mixins: [Resource, Search],
  emits: ['listState', 'update:options', 'update:filter', 'action'],
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp, mdAndUp } = useDisplay()
    return { useResource: useResource(), lgAndUp, mdAndUp }
  },
  components: {
    FormFilter,
    Draggable
  },
  provide() {
    return {
      listState: this.listState,
    };
  },
  props: {
    /**
     * Layout class
     */
    class: {
      type: String,
      default() {
        return "mb-0"
      },
    },
    border: {
      type: Boolean,
      default: false
    },
    /**
     * Grid title
     */
    title: {
      type: String,
      default() {
        return null
      },
    },
    /**
     * Exposed filters, editable through advanced filter form, update URL query string if not disabled.
     * Sent to your data provider inside `filter` params.
     * Use specific `alwaysOn` property for each filter you want to be visible and not removable.
     * Valid properties are `source`, `type`, `label`, `alwaysOn`, `attributes`.
     */
    filters: {
      type: Array,
      default: () => [],
    },
    /**
     * List of columns for each property of resource data.
     * Each column can be a simple string or a full object with advanced field properties.
     * Valid properties are `source`, `type`, `label`, `sortable`, `align`, `link`, `attributes`.
     */
    fields: {
      type: Array,
      default: () => [],
    },
    /**
     * Hide head tag title
     */
    hideTitle: Boolean,
    /**
     * Hide all header toolbar, so neither filters nor any create or export actions.
     */
    hideHeader: {
      type: Boolean,
      default: null
    },
    /**
     * Hide bulk delete button
     */
    hideBulkDelete: Boolean,
    /**
     * Hide bulk copy button
     */
    hideBulkCopy: Boolean,
    /**
     * Disable ajax fetch
     */
    disableFetch: {
      type: Boolean,
      default: null,
    },
    /**
     * Disable filters globally
     */
    disableFilters: {
      type: Boolean,
      default: null,
    },
    /**
     * Disable settings button
     */
    disableSettings: {
      type: Boolean,
      default: null,
    },
    /**
     * Editable create 
     */
    rowCreate: {
      type: Boolean,
      default: false,
    },
    /**
     * Force disabling of create button, shown by default if create resource action available.
     */
    disableCreate: Boolean,
    /**
     * Disable create redirection. Will force create button to show.
     */
    disableCreateRedirect: Boolean,
    /**
     * Disable real time update of URL query string on any browsing action as pagination, sorting, filtering, etc.
     */
    disableQueryString: Boolean,
    /**
     * Add a default query strings for every list operation
     */
    defaultQueryString: {
      type: Object,
      default: null,
    },
    /**
     * Disable actions column.
     */
    disableActions: Boolean,
    /**
     * Disable the global search.
     */
    disableGlobalSearch: {
      type: Boolean,
      default() {
        return null;
      },
    },
    disableItemsPerPage: {
      type: Boolean,
      default() {
        return null;
      },
    },
    /**
     * Key parameter of the global search query.
     */
    globalSearchQuery: {
      type: String,
      default: "q",
    },
    /**
     * Disable settings panel positioning row
     */
    disablePositioning: Boolean,
    /**
     * Disable settings panel visibility row
     */
    disableVisibility: Boolean,
    /**
     * Force enabling of create save dialog button
     */
    enableSaveDialog: Boolean,
    /**
     * Sets number of items per page
     */
    itemsPerPage: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      api: null,
      loaded: false,
      headers: [],
      toggleSettings: false,
      currentFilter: {},
      visibilities: {},
      filterabilities: {},
      selectItems: [],
      selectedHeaders: null,
      settingsKey: 0,
      sortData: {},
      listState: {
        resource: this.resource,
        items: [],
        loading: false,
        total: 0,
        selected: [],
        options: {},
        reload: () => {
          this.fetchData();
          this.updateQuery();
        },
      },
    };
  },
  async created() {
    this.api = this.$store.getModule('api');
    this.headers = this.getHeadersMap()
    this.selectItems = this.headers.filter((f) => f.key !== "data-table-group");
    this.fillSettings();
    this.$store.getModule("api").setFields(this.getFields().filter((f) => f.source !== "data-table-group"));
  },
  async mounted() {
    await this.initFiltersFromQuery();
    this.loaded = true;
    if (! this.disableFetch) {
      this.fetchData();
    }
  },
  computed: {
    getTitle() {
      const parts = this.resource.includes("_") ? this.resource.split("_") : [null, this.resource];
      const module = parts[0];
      const resourceName = parts[1];
      let key = module 
        ? `${module}.${resourceName}.title` 
        : `${resourceName}.${resourceName}.title` ;
      return (this.title) ? this.title : this.$t(key);
    },
    getHideHeaderValue() {
      if (this.hideHeader == null) {
        return config.list.hideHeader;
      }
      return this.hideHeader;
    },
    getDisableSettingsValue() {
      if (this.disableSettings == null) {
        return config.list.disableSettings;
      }
      return this.disableSettings;
    },
    getCurrentFilter() {
      /**
       * Get clean filter, do not take empty value but booleans
       */
      let currentFilter = Object.keys(this.currentFilter).reduce((o, key) => {
        let value = this.currentFilter[key];
        return {
          ...o,
          ...((!isEmpty(value) || 
            typeof value === "number" ||
            typeof value === "boolean") && {
            [key]: value,
          }),
        };
      }, {})
      return currentFilter;
    },
    getFilters() {
      let filters = []
      /**
       * Add global search filter
       */
      if (!this.getDisableGlobalSearchValue()) {
        filters = [
          {
            source: this.globalSearchQuery,
            enabled: this.getDisableGlobalSearchValue() ? false : true,
            label: this.$t("va.datatable.search"),
            attributes: { appendInnerIcon: "mdi-magnify" },
          },
        ];
      }
      let Self = this;
      let selectedFilters = {}
      for (let i = 0; i < this.selectedHeaders.length; i++) {
        selectedFilters[this.selectedHeaders[i].key] = this.selectedHeaders[i].filterable;
        if (this.selectedHeaders[i].type == 'date' && this.selectedHeaders[i].filterable) {
            selectedFilters[this.selectedHeaders[i].key + 'Start'] = true;
            selectedFilters[this.selectedHeaders[i].key + 'End'] = true;
        }
      }
      let mappedFilters = [...filters, ...this.filters]
        .map((f) => {
          return typeof f === "string"
            ? {
                source: f,
              }
            : f;
        })
        .map((f) => {
          return {
            ...f,
            type: f.type || "text",
            enabled: (f.source in selectedFilters) ? selectedFilters[f.source] : (f.enabled || false),
            key: f.key ? f.key : "",
            col: (f.col || 2),
            label:
              f.label ||
              this.$admin.getSourceLabel(this.resource, f.labelKey || f.source),
          };
      });
      return mappedFilters
    },
  },
  watch: {
    filter: {
      handler(newVal) {
        this.currentFilter = newVal || {};
      },
      immediate: true,
      deep: true,
    },
    "api.refresh"(newVal) {
      if (newVal) {
        this.fetchData()
      }
    },
    "listState.options"(val) {
      /**
       * Triggered on pagination change.
       */
      this.$emit("update:options", val);
    },
    currentFilter(newVal) {
      this.fetchData()
      this.updateQuery()
      /**
       * Triggered on filter change.
       */
      this.$emit("update:filter", newVal);
    },
    selectedHeaders(newVal) {
      this.$store.getModule("api").setHeaders(newVal);
    }
  },
  methods: {
    updateOptions(event) {
      this.listState.options = event
      this.listState.reload()
    },
    updateItemsPerPage(page) {
      this.listState.options.itemsPerPage = page
      this.listState.reload()
    },
    updateVisibility(key, val) {
      let Self = this
      this.headers.forEach(function(item, headerIndex) {
        if (Self.selectedHeaders.length == 0 && val == true && item.key == key) {
          item.visible = true;
          Self.selectedHeaders[0] = item;
        } else if (Self.selectedHeaders.length > 0) {
          Self.selectedHeaders.forEach(function(selectedItem, index){
            if (val == true && item.key == key) {
              item.visible = true;
              if (!Self.selectedHeaders.includes(item)) {
                Self.selectedHeaders.push(item);
              }
            }
            if (selectedItem.key == key && val == false) {
              Self.selectedHeaders.splice(index, 1)
            }
          });
        }
      })
    },
    updateFilterability(key, val) {
      let Self = this
      if (Self.selectedHeaders.length > 0) {
        Self.selectedHeaders.forEach(function(selectedItem, index) {
          if (selectedItem.key == key) {
            selectedItem.filterable = val;
            Self.selectedHeaders[index] = selectedItem;
          }
        });
      }
    },
    getHeadersMap() {
      let fields = this.getFields().map((field) => {
        let obj = {
          title: field.label,
          key: (field.source == "data-table-group") ? "data-table-group" : field.source,
          type: field.type,
          width: typeof field.width == 'undefined' ? 'auto' : field.width,
          visible: typeof field.visible == 'undefined' ? true : field.visible,
          filterable: typeof field.filterable == 'undefined' ? true : field.filterable,
          sortable: field.sortable,
          align: field.align || this.getDefaultAlign(field),
        }
        if (typeof field.groupable !== 'undefined') {
           obj["groupable"] = field.groupable
        }
        return obj
      })
      if (!this.disableActions) {
        fields.push({
          title: this.$t('va.datatable.actions'),
          key: "actions",
          visible: true,
          sortable: false,
        })
      }
      return fields;
    },
    getFields() {
      return this.fields
        .map((f) => {
          return typeof f === "string" ? { source: f, } : f;
        })
        .map((f) => {
          return {
            ...f,
            type: f.type,
            label:
              f.label ||
              this.$admin.getSourceLabel(
                this.listState.resource,
                f.labelKey || f.source
              ),
          };
        });
    },
    getDefaultAlign(field) {
      if (["number"].includes(field.type)) {
        return "right";
      }
      return "left";
    },
    getSelectedHeaders() {
      let fields = this.getHeadersMap()
      let columns = {}
      let validatedFields = []
      fields.forEach(function(val) {
        columns[val.key] = val
      })
      let userColumns = localStorage.getItem('col_' + this.resource)
      if (userColumns) {
        let colArray = JSON.parse(userColumns)
        if (Array.isArray(colArray) && colArray.length > 0) {
          colArray.forEach(function(val) {
            if (val.key in columns) {
              if (val.visible) {
                validatedFields.push(val);
              }
            }
          });
        } else {
          validatedFields = fields
        }
      } else {
        validatedFields = fields
      }
      return validatedFields
    },
    getItemsPerPageValue() {
      if (this.itemsPerPage == null) {
        return config.list.itemsPerPage;
      }
      return this.itemsPerPage;
    },
    getDisableItemsPerPageValue() {
      if (this.disableItemsPerPage == null) {
        return config.list.disableItemsPerPage;
      }
      return this.disableItemsPerPage;
    },
    getDisableGlobalSearchValue() {
      if (this.disableGlobalSearch == null) {
        return config.list.disableGlobalSearch;
      }
      return this.disableGlobalSearch;
    },
    fillSettings() {
      let Self = this;
      this.selectedHeaders = this.getSelectedHeaders();
      this.$store.getModule("api").setHeaders(this.selectedHeaders);
      this.headers.forEach(function(item){
        for (let i = 0; i < Self.selectedHeaders.length; i++) {
          if (Self.selectedHeaders[i].key == item.key) {
            Self.visibilities[item.key] = Self.selectedHeaders[i].visible;
            Self.filterabilities[item.key] = Self.selectedHeaders[i].filterable;
          }
        }
      });
    },
    saveSettings() {
      localStorage.setItem('col_' + this.resource, JSON.stringify(this.selectedHeaders));
      this.$store.getModule("messages").show({ type: 'info', message: this.$t("va.messages.datatable_settings_saved") });
    },
    restoreSettings() {
      localStorage.removeItem('col_' + this.resource);
      this.selectedHeaders = this.getSelectedHeaders();
      this.$store.getModule("api").setHeaders(this.selectedHeaders);
      this.fillSettings();
      ++this.settingsKey;
      this.$store.getModule("messages").show({ type: 'info', message: this.$t("va.messages.datatable_settings_reset"), });
    },
    async initFiltersFromQuery() {
      let options = {
        page: 1,
        itemsPerPage: this.getItemsPerPageValue(),
        sortBy: this.sortBy
      }
      if (this.disableQueryString) {
        this.listState.options = options
        return
      }
      /**
       * Apply current route query into options
       */
      const { perPage, page, sortBy, sortDesc, filter } = this.$route.query
      if (page) {
        options.page = parseInt(page, 10)
      }
      if (perPage) {
        options.itemsPerPage = parseInt(perPage, 10)
      }
      let newSortBy = []
      let newSortDesc = []
      let sortByParts = []
      let sortDescParts = []
      if (sortBy) {
        sortByParts = sortBy.split(",")
        sortDescParts = sortDesc.split(",").map((bool) => bool === "true")
        sortByParts.forEach(function(val, index) {
          newSortBy.push({ key: val, order: (sortDescParts[index] == true) ? 'desc': 'asc' })
        })
        options.sortBy = newSortBy
      }
      this.listState.options = options
      /**
       * Enable active filters from query
       */
      if (filter) {
        this.currentFilter = JSON.parse(filter)
      }
    },
    updateQuery() {
      if (this.disableQueryString || isEmpty(this.listState.options)) {
        return
      }
      /**
       * Update query router
       */
      let { itemsPerPage, page, sortBy } = this.listState.options
      let query = {
        page,
        ...(!this.getDisableItemsPerPageValue() && { perPage: itemsPerPage }),
      }
      let newSortBy = []
      let newSortDesc = []
      sortBy.forEach(function(arr) {
          newSortBy.push(arr.key)
          newSortDesc.push(arr.order == 'asc' ? false : true)
      })
      if (!isEmpty(newSortBy)) {
        query.sortBy = newSortBy.join(",");
      }
      if (!isEmpty(newSortDesc)) {
        query.sortDesc = newSortDesc.join(",");
      }
      if (!isEmpty(this.getCurrentFilter)) {
        query.filter = JSON.stringify(this.getCurrentFilter);
      }
      this.$router.push({ query }).catch(() => {});
    },
    async fetchData() {
      if (!this.loaded || isEmpty(this.listState.options)) {
        return;
      }
      this.listState.loading = 'primary';
      //
      // !!! sortDesc deprecated in vuetify 3.0
      //
      let newSortBy = [];
      let newSortDesc = [];
      const { sortBy, page, itemsPerPage } = this.listState.options;
      let Self = this;
      sortBy.forEach(function (arr) {
        newSortBy.push(arr.key);
        newSortDesc.push(arr.order == 'asc' ? false : true);
        Self.sortData[arr.key] = arr.order;
      });

      let params = {
        fields: this.getFieldsQuery(this.resource, this.fields),
        include: isEmpty(this.include)
          ? this.currentResource.include
          : this.include,
        sort: (newSortBy || []).map((by, index) => {
          return { by, desc: newSortDesc[index] };
        }),
        defaultQueryString: this.defaultQueryString,
        filter: this.getCurrentFilter,
      };

      if (!this.disablePagination) {
        params.pagination = {
          page,
          ...(!this.getDisableItemsPerPageValue() && { perPage: itemsPerPage }),
        };
      }
      /**
       * Load paginated and sorted data list
       */
      this.useResource.setResource(this.resource);

      let response = null;
      try {
        response = await this.useResource.getList(params);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        console.error('Url not found:',  error.config.baseURL + "/" + error.config.url);
        this.listState.loading = false;
        return;
      }
      if (response && response["data"]) {
        let data = response.data.data;
        let total = response.data.totalItems;
        /**
         * Update state without cloning
         */
        let newState = {
          items: data,
          total,
          selected: [],
          options: this.listState.options,
        };
        for (let key in newState) {
          this.listState[key] = newState[key];
        }
        this.listState.loading = false;
        this.$emit('listState', this.listState);
      }
    },
    getFieldsQuery(resource, sources, fields = {}) {
      sources.forEach((s) => {
        /**
         * Dot notation support
         */
        let lastIndex = s.source.lastIndexOf(".");
        if (lastIndex === -1) {
          /**
           * This is simple field
           * Add simple field to main resource
           */
          let f = fields[resource] || [];
          fields[resource] = [...f, s.source];
          return;
        }
        /**
         * This is field of relation
         * Recursively for nested relation
         */
        let relation = s.source.substr(0, lastIndex);
        let f = fields[relation] || [];
        fields[relation] = [...f, s.source.substr(lastIndex + 1)];
      })
      return fields
    },
    toggleSettingsPanel() {
      this.toggleSettings = this.toggleSettings ? false : true;
    },
    onAction(action) {
      if (action == 'rowSaveDialog') {
        eventBus.emit("last-dialog", true);  // open save dialog window
      }
      /**
       * Allows you to use global action in every where with eventBus object
       */
      eventBus.emit("action", action);
      /**
       * Allows you to use global action event for custom action on your side.
       */
      this.$emit("action", {
        action,
        title: this.currentResource.getTitle("create"),
      });
    },

  }, // end methods

}; // end script
</script>