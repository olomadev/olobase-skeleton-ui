<template>
  <div>
    <va-list
      :filters="filters"
      :fields="fields"
      disable-create
      disable-positioning
      disable-visibility
      :items-per-page="2"
    >
      <va-data-iterator-server
        :pagination="{ 
          density: 'default',
          activeColor: 'primary',
          top: false,
          bottom: true,
          rounded: 'pill',
        }"
      >
        <template v-slot:default="{ items }">
          <v-row no-gutters class="bordered pt-1 pb-1 justify-center" v-if="$store.getModule('api').getLoading">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-row>
          <v-row no-gutters v-else>
            <v-col
              v-for="(item, i) in items"
              :key="i"
              lg="6" md="6" sm="12"
              class="mb-3"
            >
              <v-sheet border :class="(isOdd(i)) ? '' : 'mr-lg-5 mr-md-5 mr-sm-0'">
                <v-list-item
                  :title="item.raw.username"
                  :subtitle="item.raw.id"
                  lines="two"
                  density="comfortable"
                >
                  <template v-slot:title>
                    <v-row>
                      <v-col>
                        <strong class="text-h6">
                          <table border="0" style="border:none;">
                            <tbody>
                              <tr>
                                <td style="border:none;" width="35px;" align="left"><v-icon icon="mdi-account-outline" size="small" ></v-icon></td>
                                <td style="border:none;">{{ item.raw.username }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </strong>
                      </v-col>
                      <v-col align="right">
                        <va-delete-button
                          block
                          :resource="resource"
                          :item="item"
                        ></va-delete-button>
                      </v-col>
                    </v-row>
                  </template>
                </v-list-item>
                <v-table 
                  style="padding-left:10px;border:none;"
                  density="compact" 
                  class="text-caption"
                >
                  <tbody>
                    <tr align="right">
                      <th width="20%">{{ $t("authentication.failedlogins.fields.attemptedAt") }}:</th>
                      <td>{{ item.raw.attemptedAt }}</td>
                    </tr>
                    <tr align="right">
                      <th>{{ $t("authentication.failedlogins.fields.ip") }}:</th>
                      <td>{{ item.raw.ip }}</td>
                    </tr>
                    <tr align="right">
                      <th>{{ $t("authentication.failedlogins.fields.userAgent") }}:</th>
                      <td>{{ item.raw.userAgent }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>
            </v-col>
          </v-row>              
        </template>

        <template v-slot:bottom.pagination.header="{ page, pageCount }">
          <v-footer class="text-body-3 mt-6 mb-2" style="padding:0;">
            <div>{{ $t("i18n.dataiterator.displayingPage", {page, pageCount}) }}</div>
          </v-footer>
        </template>

        <template v-slot:no-data>
          <v-row no-gutters class="bordered pt-1 pb-1 justify-center" v-if="$store.getModule('api').getLoading">
            <v-progress-circular
              color="primary"
              indeterminate
            ></v-progress-circular>
          </v-row>
          <v-row no-gutters class="bordered pt-2 pb-2 justify-center" v-else>
            {{ $t("i18n.datatable.nodata")}}
          </v-row>
        </template>
        
      </va-data-iterator-server>
    </va-list>
  </div>
</template>

<script>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [
        {
          source: "username",
          type: "select",
          attributes: {
            reference: "authentication_failedLoginUsernames",
            multiple: true,  
          }
        },
        {
          source: "ip",
          type: "select",
          attributes: {
            reference: "authentication_failedLoginIps",
            multiple: true,  
          }
        },
        {
          source: "attemptedAtStart",
          type: "date",
        },
        {
          source: "attemptedAtEnd",
          type: "date",
        }
      ],
      fields: [
        {
          source: "username",
          type: "text",
          sortable: true,
          width: "10%"
        },
        {
          source: "attemptedAt",
          type: "date",
          sortable: true,
          width: "10%"
        },
        {
          source: "userAgent",
          sortable: true,
          width: "10%"
        },
        {
          source: "ip",
          sortable: true,
          width: "10%"
        },
      ],
    };
  },
  methods: {
    isOdd(number) {
      return (number & 1) === 1;
    }
  }
};
</script>
