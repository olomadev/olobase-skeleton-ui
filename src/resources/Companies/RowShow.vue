<template>
  <va-show-layout
    :title="title"
    disable-card
  >
    <va-show :item="item">
      <v-row justify="center">
        <v-col>
          <v-table density="compact" class="va-show">
            <tbody>
              <tr>
                <td><b>{{ $t('resources.companies.fields.companyName') }}</b></td>
                <td>
                  <va-field class="sm-field" source="companyName"
                  ></va-field>
                </td>
              </tr>
              <tr>
                <td><b>{{ $t('resources.companies.fields.companyShortName') }}</b></td>
                <td>
                  <va-field class="sm-field" source="companyShortName"
                  ></va-field>
                </td>
              </tr>
              <tr>
                <td><b>{{ $t('resources.companies.fields.taxOffice') }}</b></td>
                <td>
                  <va-field class="sm-field" source="taxOffice"></va-field>
                </td>
              </tr>
              <tr>
                <td><b>{{ $t('resources.companies.fields.taxNumber') }}</b></td>
                <td>
                  <va-field class="sm-field" source="taxNumber"></va-field>
                </td>
              </tr>
              <tr>
                <td><b>{{ $t('resources.companies.fields.address') }}</b></td>
                <td>
                  <va-field class="sm-field" source="address"></va-field>
                </td>
              </tr>
              <tr>
                <td><b>{{ $t('resources.companies.fields.createdAt') }}</b></td>
                <td>
                  <va-field class="sm-field" source="createdAt"></va-field>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </va-show>
  </va-show-layout>
</template>

<script>
export default {
  props: ["title", "item"],
};
</script>