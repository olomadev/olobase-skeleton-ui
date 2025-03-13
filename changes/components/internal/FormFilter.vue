<template>
  <form>
    <div id="va-list-filters">
       <v-row v-if="lgAndUp || mdAndUp" class="pt-4 pl-3 pb-8 pr-3">
        <template v-for="(item, index) in filters" :key="'filter_' + index">
          <v-col v-if="item.enabled" :cols="item.col" class="pb-0 pt-4" style="min-width:110px;">
              <div class="align-center">
                <div>
                  <slot
                    :name="item.source"
                    :source="item.source"
                    :label="item.label"
                    v-bind="item.attributes"
                    :value="modelValue[item.source]"
                  >
                    <input-filter
                      :type="item.type"
                      :key="modelValue[item.key] ? modelValue[item.key] : item.source"
                      :source="item.source"
                      :label="item.label"
                      v-bind="item.attributes"
                      :filter="getFilters(item.filters)"
                      :value="modelValue[item.source]"
                      clearable
                      @click:clear="clearAll"
                      @update:modelValue="(val) => update(item, val)"
                      :return-object="item.returnObject"
                    >
                    </input-filter>
                  </slot>
                </div>
              </div>
          </v-col>
        </template>
      </v-row>
      <v-row v-else class="pt-8 pl-3 pb-8 pr-3">
        <v-col class="pb-1 pt-1" v-for="(item, index) in filters" cols="12" :key="'filter_' + index">
          <div class="align-center">
            <div>
              <slot
                :name="item.source"
                :source="item.source"
                :label="item.label"
                v-bind="item.attributes"
                :value="modelValue[item.source]"
              >
                <input-filter
                  :type="item.type"
                  :key="modelValue[item.key] ? modelValue[item.key] : item.source"
                  :source="item.source"
                  :label="item.label"
                  v-bind="item.attributes"
                  :filter="getFilters(item.filters)"
                  :value="modelValue[item.source]"
                  v-model="modelValue[item.source]"
                  clearable
                  @click:clear="clearAll"
                  @update:modelValue="(val) => update(item, val)"
                >
                </input-filter>
              </slot>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </form>
</template>

<script>
import InputFilter from "./InputFilter"
import { size } from '@/helpers/lodash';
import { useDisplay } from 'vuetify'

export default {
  inject: {
    listState: { 
      default: { items: [] } 
    }
  },
  setup () {
    // Destructure only the keys we want to use
    const { lgAndUp, mdAndUp } = useDisplay()
    return { lgAndUp, mdAndUp }
  },
  components: {
    InputFilter,
  },
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      filterIds: {},
    };
  },
  mounted() {
    /**
     * Apply current route query into options
     */
    const { filter } = this.$route.query;
    if (filter) {
      this.filterIds = this.parseFilterQuery(filter); // initialize for route filters
    }
  },
  methods: {
    // @change="setFilter($event, field.filterId, source)"
    // :filter="getFilters(field.filters)"
    setFilter(value, filterId){
      if (filterId) {
        this.filterIds[filterId] = value
      }
      return
    },
    getFilters(filters) {
      let filterObject = {}
      if (filters) {
        if (size(this.filterIds) > 0) {
          for (var key in this.filterIds) {
              if (filters.includes(key)) {
                  filterObject[key] = Array.isArray(this.filterIds[key]) ? this.filterIds[key].join() : this.filterIds[key]
              }
          }
        }
      }
      return filterObject
    },
    clearAll() {
      // set filter ids again ...
      // 
      for (var key in this.filterIds) {
        this.filterIds[key] = this.modelValue[key]
      }
    },
    update(item, value) {
      this.setFilter(value, item.key ? item.key : item.source);
      let input = {
        ...this.modelValue,
        [item.source]: value,
      }
      //
      //  store list redirect query params we will use it for save
      //  operations which is located
      //  in form provider / this.formState.submit(redirect?querParams)
      //  
      localStorage.setItem("listQuery", JSON.stringify(this.$route.query));
      this.$emit("update:modelValue", input)
    },
    parseFilterQuery(filters){
      try {
          var data = JSON.parse(filters);
          // Handle non-exception-throwing cases:
          // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
          // but... JSON.parse(null) returns null, and typeof null === "object", 
          // so we must check for that, too. Thankfully, null is falsey, so this suffices:
          if (data && typeof data === "object") {
              return data;
          }
      }
      catch (e) { }
      return false;
    }

  },
};
</script>