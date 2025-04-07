<template>
  <va-show-layout 
    :title="title"
    :show-list="false"
    :show-edit="false"
    :show-clone="false"
    :show-delete="false"
  >
    <va-show :item="item">
      <v-row>
        <v-col lg="4" md="6" sm="12">
          <div class="va-show">
            <v-table density="compact">
              <tbody>
                <tr>
                  <td><b>{{ $t('users.users.fields.firstname') }}</b></td>
                  <td>
                    <va-field source="firstname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('users.users.fields.lastname') }}</b></td>
                  <td>
                    <va-field source="lastname"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('users.users.fields.email') }}</b></td>
                  <td>
                    <va-field source="email"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('users.users.fields.active') }}</b></td>
                  <td>
                    <va-field source="active" type="boolean"></va-field>
                  </td>
                </tr>
                <tr>
                  <td><b>{{ $t('users.users.fields.createdAt') }}</b></td>
                  <td>
                    <va-field source="createdAt" type="date"></va-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
          </div>
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
