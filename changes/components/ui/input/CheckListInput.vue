<template>
  <div :class="class">
    <v-data-table
      :color="color"
      :density="density"
      :show-select="true"
      v-model="selected"
      :item-key="primaryKey"
      :headers="headers"
      :items="items"
      :group-by="groupByArray"
      :items-per-page="Number(itemsPerPage)"
      :search="search"
      :custom-filter="filterText"
    >
      <template v-for="(_, scopedSlotName) in $slots" v-slot:[scopedSlotName]="slotData">
        <slot v-if="scopedSlotName" :name="scopedSlotName" v-bind="slotData" />
      </template>
    
      <template v-slot:no-data>
        <div class="text-center py-4">
          {{ $t('va.datatable.no_data_available') }}
        </div>
      </template>

      <template v-if="!disableSearch" v-slot:top>
        <v-text-field
          v-model="search"
          :color="color"
          :variant="variant"
          clearable
          :label="$t('va.actions.q')"
        ></v-text-field>
      </template>
<!-- 
      <template v-slot:column.data-table-select>
          <th rowspan="1" style="width: 48px; min-width: 48px;">
            <div class="v-selection-control v-selection-control--inline v-selection-control--density-default v-checkbox-btn">
              <div class="v-selection-control__wrapper">
                <div class="v-selection-control__input">
                    <v-checkbox
                      class="pl-0 pt-5 pr-10"
                      v-model="selectAll"
                      @click.native.stop="toggleAllSelection"
                    ></v-checkbox>
                </div>
              </div>
            </div>
          </th>
      </template> -->
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th v-if="column.key != 'data-table-group'">
              <span v-if="column.key == 'data-table-select'">
                <v-checkbox
                  class="pl-5 pt-5 pr-5"
                  v-model="selectAll"
                  @click.native.stop="toggleAllSelection"
                ></v-checkbox>
              </span>
              <span v-else class="ml-3">{{ getTitleLabel(column) }}</span>
            </th>
          </template>
        </tr>
      </template>

      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td class="text-start" :colspan="columns.length">
            <div style="display: flex; justify: center">
              <div class="float-left">
                <v-btn
                  class="mb-0 pb-0"
                  size="xsmall"
                  variant="text"
                  @click="toggleGroup(item)"
                >
                  <v-icon size="large">{{ isGroupOpen(item) ? "$minus" : "$plus" }}</v-icon>
                  <v-checkbox
                    v-model="parentChecked[item.value]"
                    class="ml-2 mr-3 mt-0"
                    @change="toggleChildren(item.value, isGroupOpen(item))"
                    hide-details="true"
                  ></v-checkbox>
                </v-btn>
                {{ item.value }}
              </div>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr
          style="cursor: pointer"
          :class="isSelected(item) ? 'v-data-table__selected' : ''"
          @click="toggle(item, isSelected(item), item[groupBy])"
        >
          <td align="right">
            <div class="mt-1">
              <v-icon size="16" color="green" v-if="isSelected(item)"
                >mdi-check</v-icon
              >
              <div v-if="!isSelected(item)" style="width: 25px">&nbsp;</div>
            </div>
          </td>
          <td v-for="(field) in getFields" :key="field.source">
            {{ item[field.source] }}
          </td>
        </tr>
      </template>

      <!-- Disable bottom footer-->
      <template v-if="disableFooter" #bottom></template>
    </v-data-table>
  </div>
</template>

<script>
import Input from "../../../mixins/input"
import Utils from "../../../mixins/utils"
import remove from "lodash/remove";

export default {
  inject: [],
  mixins: [Input, Utils],
  props: {
    color: {
      type: String,
      default() {
        return "primary"
      },
    },
    variant: {
      type: String,
      default: "outlined",
    },
    class: {
      type: String,
      default() {
        return "va-checklist-input"
      },
    },
    disableSearch: {
      type: Boolean,
      default: false,
    },
    disableFooter: {
      type: Boolean,
      default: false,
    },
    primaryKey: {
      type: String
    },
    itemsPerPage: {
      type: [String, Number],
      default: () => 30,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    initUrl: {
      type: String,
    },
    groupBy: {
      type: String,
    },
    groupByArray: {
      type: Array,
      default:() => [
        {
          key: 'module',
          order: 'asc',
        }
      ]
    }
  },
  data() {
    return {
      selectAll: false,
      items: [],
      search: "",
      selected: [],
      groupedItems: [],
      parentChecked: [],
    }
  },
  created() {
    this.selected = this.input;
    this.initializeItems()
  },
  emits: ['selected'],
  watch: {
    selectAll(val) {
      if (val) {
        this.toggleAllParentCheckboxes(true)
      } else {
        this.toggleAllParentCheckboxes(false)
      }
    },
    selected: {
      handler(newValue) { // https://vuejs.org/guide/essentials/watchers.html#deep-watchers
        this.update(newValue);
      },
      deep: true
    }
  },
  computed: {
    getFields() {
      return this.fields
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
            // type: f.type,
            label: f.label || this.$admin.getSourceLabel(
              this.resource,
              f.labelKey || f.key || f.source
            ),
          };
        });
    },
  },
  methods: {
    toggleAllSelection() {
      this.selected = this.selectAll ? [] : this.items.slice();
    },
    getTitleLabel(column) {
      if (column.title) {
        return column.title;
      } else if (column.key) {
        return this.$admin.getSourceLabel(this.resource, column.key);  
      }
      return
    },
    filterText(value, search, item) {
      if (item && item[this.groupBy] && item[this.groupBy].toLowerCase().indexOf(search.toLowerCase()) !== -1) { // search in the group
        return true
      }    
      return ( // search in other fields
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleLowerCase().indexOf(search) !== -1
      );
    },
    isSelected(item) { 
      let Self = this
      let id = item[this.primaryKey]
      if (! Array.isArray(this.selected)) {
        return false
      }
      if (this.selected.length == 0) {
        return false
      }
      let result = false
      if (this.selected.filter(function(item) {
        if (typeof item[Self.primaryKey] === 'undefined') {
          return false
        }
        return item[Self.primaryKey] === id
      }).length > 0) {
        result = true
      }
      return result
    },
    async initializeItems() {
      let response = await this.$admin.http.get(this.initUrl)
      if (response) {
        this.items = response.data.data
        this.groupedItems = this.arrayGroupBy(this.items, this.groupBy)
        this.initializeParentCheckboxes()
        if (this.selected && this.items.length == this.selected.length) {
          this.selectAll = true
        }  
      }
    },
    initializeParentCheckboxes() {
      let selectedGroupItems = [];
      if (this.selected && this.groupBy) {
        selectedGroupItems = this.arrayGroupBy(
          this.selected,
          this.groupBy
        );
      }
      let Self = this;
      Object.keys(this.groupedItems).forEach(function (groupBy) {
        let childrenCount = Self.groupedItems[groupBy].length;
        if (
          typeof selectedGroupItems[groupBy] != "undefined" &&
          selectedGroupItems[groupBy].length == childrenCount
        ) {
          Self.parentChecked[groupBy] = true;
        }
      });
    },
    toggleAllParentCheckboxes(check) {
      let Self = this;
      Object.keys(this.groupedItems).forEach(function (groupBy) {
        Self.parentChecked[groupBy] = check;
      });
    },
    toggle(item, isSelected, group) {
      let Self = this;
      if (isSelected) { // remove item
        this.selected.forEach(function(val, index) {
          if (val[Self.primaryKey] == item[Self.primaryKey]) {
            Self.selected = remove(Self.selected, (i) => i == index);
          }
        })
      } else {
        this.selected.push(item)
      }
      let selectedChildrenCount = this.groupedItems[group].length;
      let selectedGroupCount = 0;
      this.selected.forEach(function (val) {
        if (val[Self.groupBy] == group) {
          if (isSelected) {
            --selectedGroupCount;
          } else {
            ++selectedGroupCount;
          }
        }
      });
      if (selectedGroupCount == selectedChildrenCount) {
        this.parentChecked[group] = true;
      } else {
        this.parentChecked[group] = false;
      }
      Self.$emit("selected", Self.selected)
    },
    toggleChildren(groupBy) {
      let Self = this;
      if (Array.isArray(this.selected) && this.parentChecked[groupBy]) { // mark child checkboxes
        let selectedIds = [];
        this.selected.forEach(function (val) {
          selectedIds.push(val[Self.primaryKey]);
        });
        if (typeof this.groupedItems[groupBy] != "undefined") {
          this.groupedItems[groupBy].forEach(function (gVal) {
            if (!selectedIds.includes(gVal[Self.primaryKey])) {
              Self.selected.push(gVal);
            }
          });
          // toggleParent()
        }
      } else {
        // unmark child checkboxes
        if (Array.isArray(this.selected) && typeof this.groupedItems[groupBy] != "undefined") {
          this.groupedItems[groupBy].forEach(function (gVal) {
            Self.selected = Self.selected.filter(
              function(item) {
                return item[Self.primaryKey] != gVal[Self.primaryKey]
              }
            );
          });
          // toggleParent()
        }
      }
      this.$emit("selected", this.selected)
    },


  } // end methods

}
</script>