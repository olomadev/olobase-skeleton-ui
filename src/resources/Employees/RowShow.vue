<template>
  <va-show-layout
    :title="title"
    disable-card
  >
    <va-show :item="item">
      <div class="va-show">
        <v-table density="compact">
          <tbody>
            <tr>
              <td><b>{{ $t('resources.employees.fields.companyId') }}</b></td>
              <td>
                <va-field class="sm-field" source="companyId"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.employeeNumber') }}</b></td>
              <td>
                <va-field class="sm-field" source="employeeNumber"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.jobTitleId') }}</b></td>
              <td>
                <va-field class="sm-field" source="jobTitleId"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.name') }}</b></td>
              <td>
                <va-field class="sm-field" source="name"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.surname') }}</b></td>
              <td>
                <va-field class="sm-field" source="surname"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.gradeId') }}</b></td>
              <td>
                <va-field class="sm-field" source="gradeId"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.employmentStartDate') }}</b></td>
              <td>
                <va-field class="sm-field" source="employmentStartDate"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.employmentEndDate') }}</b></td>
              <td>
                <va-field class="sm-field" source="employmentEndDate"></va-field>
              </td>
            </tr>
            <tr>
              <td><b>{{ $t('resources.employees.fields.createdAt') }}</b></td>
              <td>
                <va-field class="sm-field" source="createdAt"></va-field>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </va-show>
  </va-show-layout>
</template>

<script>
export default {
  props: ["title", "item"],
};
</script>