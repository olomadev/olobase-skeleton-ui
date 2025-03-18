<template>
 <div :class="class">
  <form @submit.prevent="save">
    <v-data-table-server
      v-if="visible"
      :density="density"
      :width="width"
      :height="height"
      :items-per-page-text="$t('va.datatable.items_per_page_text')"
      :headers="getHeaders"
      :items="getItems"
      :modelValue="listState.selected"
      :items-length="listState.total ? listState.total : 0"
      :show-select="!disableSelect"
      :select-strategy="selectStrategy"
      :disable-sort="disableSort"
      :loading="listState.loading"
      :loading-text="$t('va.datatable.loading_text')"
      :multi-sort="multiSort"
      :expanded="expanded"
      :expand-on-click="expandOnClick"
      :show-expand="showExpand"
      :items-per-page="listState.options.itemsPerPage"
      :group-by="groupBy"
      :items-per-page-options="getItemsPerPageOptionsValue"
      :options.sync="listState.options"
      :sort-by.sync="listState.options.sortBy"
      @click:row="onRowClick"
      @update:modelValue="(v) => (listState.selected = v)"
      @update:options="updateOptions($event)"
      @update:items-per-page="updateItemsPerPage($event)"
    >
      <template v-slot:[`group.header`]="{ isOpen, toggle, groupBy, group, isMobile }">
        <td class="text-start" :colspan="isMobile ? undefined : headers.length">
          <v-btn class="ma-0" icon small @click="toggle">
            <v-icon>{{ isOpen ? '$minus' : '$plus' }}</v-icon>
          </v-btn>
          {{ headers.find(header => header.value === groupBy[0]).text }}: {{ group }}
        </td>
      </template>
      
      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
      </template>

      <template
        v-for="field in getFields"
        v-slot:[`item.${field.source}`]="{ item, value }"
      >
        <template v-if="item._new || item.id === editRowId">
          <template v-if="field.type == 'select'">
            <div>
              <component
                :key="getKey(field)"
                :is="`va-select-input`"
                :source="field.source"
                :resource="listState.resource"
                :item="item"
                v-model="form[field.source]"
                :filter="getFieldFilters(field)"
                v-bind="field.attributes"
                :label="field.label"
                variant="outlined"
                :error-messages="getErrorMessages(field.source)"
                clearable
                class="mt-6"
                @click.stop
              ></component>
            </div>
          </template>
          <template v-else>
            <div>
              <component
                :key="getKey(field)"
                :is="`va-${field.input || field.type || 'text'}-input`"
                :source="field.source"
                :resource="listState.resource"
                :item="item"
                :filter="getFieldFilters(field)"
                v-model="form[field.source]"
                variant="outlined"
                :label="(field.type == 'boolean') ? ' ' : field.label"
                :options="getOptions(field)"
                v-bind="field.attributes"
                :error-messages="getErrorMessages(field.source)"
                :class="(field.type == 'boolean') ? '' : 'mt-6'"
                @click.stop
              ></component>
           </div>
          </template>
        </template>
        <template v-else>
          <div v-if="field.link">
            <router-link 
              :key="field.source"
              :to="{
                name: `${listState.resource}_${field.link}`,
                params: { id: item.id },
              }"
            >
              <component
                v-if="field.type"
                :key="field.source"
                :is="`va-${field.type}-field`"
                :source="field.source"
                :resource="listState.resource"
                variant="outlined"
                :item="item"
                :options="getOptions(field)"
                v-bind="field.attributes"
                v-slot="props"
              >
                <slot
                  :name="`field.${field.source}`"
                  :item="props.item || item"
                  v-bind="props"
                ></slot>
              </component>
              <slot
                v-else
                :name="`field.${field.source}`"
                v-bind="{ item, value }"
              >
                {{ value }}
              </slot>
            </router-link>
          </div>
          <div v-else-if="field.type">
            <component
              :key="field.source"
              :is="`va-${field.type}-field`"
              :source="field.sourceLabel ? field.sourceLabel : field.source"
              :resource="listState.resource"
              :item="item"
              variant="outlined"
              :options="getOptions(field)"
              v-bind="field.attributes"
              v-slot="props"
            >
              <slot
                :name="`field.${field.source}`"
                :item="props.item || item"
                v-bind="props"
              ></slot>
            </component>
          </div>
          <div v-else>
            <slot :name="`field.${field.source}`" v-bind="{ item, value }">
              {{ item[field.source] }}
            </slot>
          </div>
        </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="item-actions">
          <!-- @slot Full cell template which contains all row actions. -->
          <slot name="cell.actions" v-bind="{ item }">
            <template v-if="item._new || item.id === editRowId">
              <v-tooltip bottom>
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="text"
                    color="primary"
                    icon
                    v-bind="props"
                    :loading="saving"
                    type="submit"
                    @click.stop
                  >
                   <v-icon style="font-size: 1.5rem !important;">mdi-floppy</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("va.actions.save") }}</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="text"
                    color="red"
                    icon
                    v-bind="props"
                    @click.stop="cancelRowForm"
                  >
                    <v-icon style="font-size: 1.5rem !important;">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("va.actions.cancel") }}</span>
              </v-tooltip>
            </template>
            <template v-else>
              <!-- @slot Use it for additional custom row actions with components based on VaActionButton. -->
              <slot name="row.actions" v-bind="{ item }"></slot>

              <va-row-show-button
                v-if="rowShow"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => onAction('show', item)"
              ></va-row-show-button>

              <va-show-button
                v-if="!disableShow"
                :disable-redirect="disableShowRedirect"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => onAction('show', item)"
              ></va-show-button>

              <va-row-create-button
                v-if="rowCreate"
                :disable-redirect="true"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => createRowForm(null, 'new', item.index)"
              ></va-row-create-button>

              <va-row-save-dialog-button
                v-if="rowSaveDialog"
                :disable-redirect="true"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => onAction('rowSaveDialog', item)"
              ></va-row-save-dialog-button>

              <va-row-clone-button
                v-if="rowClone"
                :disable-redirect="disableCreateRedirect"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => createRowForm(item, 'new', item.index)"
              ></va-row-clone-button>

              <va-clone-button
                v-if="!disableClone"
                :disable-redirect="disableCreateRedirect"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => onAction('create', item)"
              ></va-clone-button>

              <va-edit-button
                v-if="!disableEdit"
                :disable-redirect="disableEditRedirect"
                :resource="listState.resource"
                :item="item"
                icon
                @click="(item) => onAction('edit', item, false)"
              ></va-edit-button>

              <!--
                Triggered on successful deletetion of ressource item.
                @event deleted
              -->
              <va-delete-button
                v-if="!disableDelete"
                :redirect="enableDeleteRedirect"
                :resource="listState.resource"
                :item="item"
                icon
                @deleted="$emit('deleted', item)"
              ></va-delete-button>
            </template>
          </slot>
        </div>
      </template>
      <template v-slot:no-data>
        <div style="font-size: 12px;color: #7a7a7a; padding-top: 20px; padding-bottom: 20px">
          {{ $t("datatable.no_data_available") }}
        </div>
      </template>
    </v-data-table-server>

    <template>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          :width="rowSaveDialogWidth"
          :height="rowSaveDialogHeight"
        >
          <v-card>
            <v-card-title class="mt-2 ml-1">
              <span class="h2">{{ $t("titles." + resource) }}</span>
            </v-card-title>
            <v-card-text>
              <component
                :is="getRowSaveComponentName"
                :item="item"
              ></component>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="text"
                @click="dialog = false"
              >
                {{ $t("va.actions.close") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </form>
</div>
</template>

<script>
import { size, upperFirst } from '@/helpers/lodash';
import Resource from "../../../mixins/resource"
import Search from "../../../mixins/search"
import Utils from "../../../mixins/utils"
import { useDisplay } from 'vuetify'
import eventBus from "@/helpers/eventbus";
import { useVuelidate } from "@vuelidate/core";
import config from "@/_config";
import useResource from "../../../store/resource";
/**
 * Data table component, you will need data iterator as `VaList` in order to make it usable.
 * This component allows you to template all fields columns.
 */
export default {
  mixins: [Resource, Search, Utils],
  inject: {
    listState: { 
      default: {} 
    },
    validations: {
      default: {}
    },
    errors: {
      default: {}
    },
  },
  emits: ['save', 'saved'],
  provide() {
    return {
      admin: this.$admin
    };
  },
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp, mdAndUp } = useDisplay();
    return { v$: useVuelidate(), lgAndUp, mdAndUp }
  },
  validations() {
    return this.validations
  },
  props: {
    class: {
      type: String,
      default() {
        return "va-data-table"
      },
    },
    /**
     * Choose density
     */
    density: {
      type: String,
      default: "compact",
    },
    /**
     * Use the width prop to set the width of the table.
     */
    width: [String, Number],
    /**
     * Use the heigth prop to set the heigth of the table.
     */
    height: [String, Number],
    /**
     * Make each row clickable. Use predefined function as edit or show
     */
    rowClick: {
      type: [String, Boolean],
      default: null,
      validator: (v) => ["show", "edit"].includes(v),
    },
    /**
     * Allow new item row.
     */
    rowCreate: Boolean,
    /**
     * Allow click-edit row.
     */
    rowEdit: Boolean,
    /**
     * Allow editable row.
     */
    rowSaveDialog: Boolean,
    /**
     * Dialog width
     */
    rowSaveDialogWidth: {
      type: [Number, String],
      default: () => {
        return 1024
      },
    },
    /**
     * Dialog height
     */
    rowSaveDialogHeight: {
      type: [Number, String],
      default: () => {
        return 600
      },
    },
    /**
     * Allow clonable row.
     */
    rowClone: Boolean,
    /**
     * Allow showable row
     */
    rowShow: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    /**
     * Enable row expand mode.
     * Use it for quick detail view.
     */
    showExpand: Boolean,
    /**
     * Expanded items
     */
    expanded: {
      type: Array,
      default: [],
    },
    /**
     * Only one row can expanded at once
     */
    expandOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * Group by array
     */
    groupBy: {
      type: Array
    },
    /**
     * Control visibility
     */
    visible: {
      type: Boolean,
      default: true
    }, 
    /**
     * Disable select feature.
     */
    disableSelect: Boolean,
    /**
     * Select strategy 'single' | 'page' | 'all'
     */
    selectStrategy: {
      type: String,
      default: "page",
    }, 
    /**
     * Disable sorting.
     */
    disableSort: Boolean,
    /**
     * Disable show action row.
     */
    disableShow: Boolean,
    /**
     * Disable show action row.
     */
    disableEdit: Boolean,
    /**
     * Disable clone action row.
     */
    disableClone: Boolean,
    /**
     * Disable delete action row.
     */
    disableDelete: Boolean,
    /**
     * Disable create redirection. Will force clone button to show.
     */
    disableCreateRedirect: Boolean,
    /**
     * Disable show redirection. Will force show button to show.
     */
    disableShowRedirect: Boolean,
    /**
     * Disable edit redirection. Will force edit button to show.
     */
    disableEditRedirect: Boolean,
    /**
     * Enable delete redirection.
     */
    enableDeleteRedirect: Boolean,
    /**
     * Disable select feature.
     */
    disableGenerateUid: Boolean,
    /**
     * Enable multi sort feature, enabled by default.
     */
    multiSort: {
      type: Boolean,
      default: true,
    },
    /**
     * Additional form object data to merge with row-create form.
     */
    createData: {
      type: Object,
      default: () => {},
    },
    /**
     * Additional form object data to merge with row-edit form.
     */
    updateData: {
      type: Object,
      default: () => {},
    },
    /**
     * List of available selections of items per page.
     */
    itemsPerPageOptions: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      item: null,
      dialog: false,
      selected: [],
      saving: false,
      editRowId: null,
      rowIndex: null,
      form: null,
      exceptionErrors: {},
    };
  },
  async mounted() {
    let Self = this
    eventBus.on('last-dialog', function (dialog, action = null) {
      Self.dialog = dialog
      if (action == 'create') {
        Self.item = null // empty the item to create new record
      }
    });
    eventBus.on('action', function (action) {
      if (action == 'rowCreate') {
        Self.createRowForm(null, 'new', 0);
      }
    });
  },
  computed: {
    getHeaders: {
      get() {
        return this.$store.getModule("api").getHeaders;
      }
    },
    getFields: {
      get() {
        return this.$store.getModule("api").getFields;
      }
    },
    getItems() {
      if (this.form && !this.editRowId && this.rowIndex != null) {
        let index = this.rowIndex;
        if (this.rowIndex > 1) {
          ++index;
        }
        //
        // add new empty record to below the selected index
        // adds to above if index == 0
        // 
        this.listState.items.splice(index, 0, { index: index, _new: true, id: null });
        // return [{ _new: true, id: null, moduleName: null }, ...this.listState.items]
        return this.listState.items;
      }
      if (this.listState["items"] && this.listState.items.length > 0) { // add index numbers
        return this.listState.items.map((items, index) => ({
          ...items,
          index: index
        }))  
      }
      return this.listState.items;
    },
    getRowSaveComponentName() {
      return this.resource + "RowSave"
    },
    getItemsPerPageOptionsValue() {
      if (Array.isArray(this.itemsPerPageOptions) 
        && this.itemsPerPageOptions.length == 0
        ) {
        return config.list.itemsPerPageOptions;
      }
      return this.itemsPerPageOptions;
    }
  },
  watch: {
    multiSort: {
      handler(val) {
        this.listState.options.multiSort = val;
      },
      immediate: true,
    },
    "selected"(val) {
      this.$emit("selected", val);
    },
  },
  methods: {
    getDefaultAlign(field) {
      if (["number"].includes(field.type)) {
        return "right";
      }
      return "left";
    },
    onRowClick(event, item) {
      if (typeof item.item._new !== 'undefined') { // don't create new row two or times
        return
      }
      event = null
      if (!this.rowEdit) {
        return
      }
      if (item && typeof item.item !== 'undefined') {
        this.createForm(item.item);  
      }
      return
    },
    async onAction(action, item = null, disableRowEdit = null) {
      if (action === "edit" && this.rowEdit && disableRowEdit == null) {
        this.createForm(item);
        return;
      }
      if (action === "create" && this.rowCreate) {
        this.createForm(item, "new");
        return;
      }
      /**
       * Save dialog
       */
      if (action == "rowSaveDialog") {
        this.item = item
        this.dialog = true
        return
      }
      if (!this[`disable${upperFirst(action)}Redirect`]) {
        return;
      }
      let hasItem = action !== "create";

      let title = this.$admin
        .getResource(this.listState.resource)
        .getTitle(action, hasItem ? item : null);
      let id = hasItem ? item.id : null;

      const resource = useResource();
      resource.setResource(this.listState.resource);
      /**
       * Get freshed item
       */
      let { data } = await resource.getOne({id: item.id});
      resource.setItem(data)
      /**
       * Triggered on action on specific row.
       * This event will return a freshed item Object from your API.
       */
      this.$emit("item-action", { action, title, id, item: data });
    },
    createForm(item = null, action = null) {
      if (action == "new") {
        this.editRowId = null
      } else {
        this.editRowId = item ? item.id : null;  
      }
      this.form = this.getFields
        .map((f) => f.source)
        .reduce((o, source) => {
          return {
            ...o,
            [source]: item ? item[source] : null,
          };
        }, {});
      this.exceptionErrors = {};
    },
    createRowForm(item = null, action = null, index = null) {
      if (this.rowIndex != null) {  // prevent add multiple blank rows
        return
      }
      if (action == "new") {
        this.editRowId = null
        this.rowIndex = index
      } else {
        this.editRowId = item ? item.id : null;
      }
      this.form = this.getFields
        .map((f) => f.source)
        .reduce((o, source) => {
          return {
            ...o,
            [source]: item ? item[source] : null,
          };
        }, {});
      this.exceptionErrors = {};
    },
    cancelRowForm() {
      this.v$.$reset();
      if (this.rowIndex == null) { // edit
        this.editRowId = null;
        this.form = null;
        this.exceptionErrors = {};  
      } else {  // create
        this.listState.reload()
        this.rowIndex = null
        // this.form = null  // do not set it to null
      }
    },
    getErrorMessages(source) {
      let errorFunc = source + 'Errors'
      if (typeof this.errors[errorFunc] !== "undefined") {
        return this.errors[errorFunc](this.v$)
      }
    },
    updateOptions(event) {
      this.listState.options = event
      this.listState.reload()
    },
    updateItemsPerPage(page) {
      this.listState.options.itemsPerPage = page
      this.listState.reload()
    },
    updateDialogModel(val) {
      this.$emit("update:modelValue", val)
    },
    generateSelectItem(val){
      if (Array.isArray(val)) {
        return val[0]
      }
      return val
    },
    async save() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        return false;
      }
      this.saving = true;
      const emitData = {
        response: null,
        form: {...this.form, ...{ id: this.editRowId}},
      };
      this.$emit("save", emitData);
      const resource = useResource();
      resource.setResource(this.listState.resource);
      try {
        if (this.editRowId) { // update
          emitData.response = await resource.update({
              id: this.editRowId,
              data: { ...this.form, ...this.updateData },
          });
        } else { // create
          let newCreateData = {}
          newCreateData.id = this.generateUid();
          Object.assign(newCreateData, this.createData)
          emitData.response = await resource.create({
            data: { ...this.form, ...newCreateData },
          });
        }
        this.v$.$reset() // clear the validation error messages
        this.saving = false;
        this.cancelRowForm(); // close form
        this.editRowId = null;
        this.exceptionErrors = {};
        this.listState.reload()
      } catch (e) {
        if (e.errors) {
          this.exceptionErrors = e.errors;
        }
      } finally {
        this.saving = false;
        this.$emit("saved", emitData);
      }
    },
    getFieldFilters(field) {
      let filters = field.filters
      if (filters) {
        let filterObject = {}
        if (size(filters) > 0) {
          for (var k in filters) {
            if (this.form[filters[k]] && this.form[filters[k]]['id']) {
              filterObject[filters[k]] = this.form[filters[k]].id;
            } else {
              filterObject[filters[k]] = this.form[filters[k]];
            }
          }
        }
        return filterObject;
      }
      return {};
    },   
    getKey(field) {
      let key = "null";
      if (field['source']) {
        key = field.source;
      }
      if (field && field["key"]) {
        if (Array.isArray(field.key)) { // array key support
          let ids = []
          let keys = field.key;
          for (let i = 0; i < keys.length; i++) {
            if (this.form[keys[i]] 
              && this.form[keys[i]]['id']) {
              ids.push(this.form[keys[i]].id); 
            } else {
              ids.push(this.form[keys[i]]);
            }
          }
          key = ids.join() + '-' + String(index);
        } else if (this.form[field.key]) {
          if (this.form[field.key]['id']) {
            key = this.form[field.key].id;  
          } else {
            key = this.form[field.key]; 
          }
        }
      }
      return key;
    },
    getOptions(field) {
      if (field && Object.prototype.hasOwnProperty.call(field, "options")) {
        return field.options;
      }
      return
    },
  },
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none;
}

.v-data-table tbody tr.v-data-table__expanded__content td {
  padding: 1.5rem;
}

.v-data-table.clickable-rows tr {
  cursor: pointer;
}

.v-data-table .item-actions {
  white-space: nowrap;
}
</style>