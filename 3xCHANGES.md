
# 3x Changes

- Added modules structure.
- Deprecated olobase admin title option.
- Deprecated layouts/Breadcrumbs.vue.
- Deprecated SheetInput.vue removed 
- Deprecated ExcelExportButton.vue removed 
- SheetInput removed from components/index.js
- Removed Breadcrumbs from layouts/index.js file.
- Added groupByArray prop to CheckListInput component.


groupByArray: {
  type: Array,
  default:() => [
    {
      key: 'module',
      order: 'asc',
    }
  ]
}

- Mixins: choices.js changes: Getting input refrerence from i18n enums changed as:  "{module}_{action}"   e.g. "authorization_methods", "common_locales".
- Added no data available translation to CheckListInput component for search operations.
- rEMOVEcomponents()

- Add SelectInput Reference format to docs. modules.resource.enums.{source}.{value}

- For Php backend add input filter "id" details to documentation input filter section. We convert "id" to "moduleId" if we have "id" field in the input filter.

  $this->add([
      'name' => 'id',
      'required' => true,
      'validators' => [
          ['name' => Uuid::class],
          [
              'name' => $this->request->getMethod() == 'POST' ? NoRecordExists::class : RecordExists::class,
              'options' => [
                  'table'   => 'modules',
                  'field'   => 'moduleId',
                  'adapter' => $this->adapter,
              ]
          ]
      ],
  ]);

  $data = $this->dataManager->getSaveData(ModuleSave::class, 'modules');
  print_r($data);
  die;

  // Array ( [modules] => Array ( [moduleName] => Users [moduleVersion] => 1.0.0 [isActive] => 1 ) [id] => 38a05004-172c-4a06-99cb-2b7808d54fe3 )


  - Added currentModule method to mixins/resource.js
  - Add resource.js API to documentation
  - va-data-table-server  @save @saved gibi emit eventları dökümentasyona yaz.
  - add store.setNavbarKey feature to ui doc (vAppBar layout).


  - add data table server validations to doc.
  - add supported translation for default validations like v.text.required

          nameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].name.$dirty) return errors;
          v$['form'].name.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },

 - Add Users/List.vue field templating example to https://olobase.oloma.dev/2.0/ui/layouts/list/data-table-server.html.

    <va-data-table-server
      :disable-actions="false"
      :disable-show="false"
      show-select
    >
      <template v-slot:[`field.userRoles`]="{ item }">
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            size="small"
            v-for="(role, index) in item.userRoles"
            :key="index"
            label
            color="primary"
          >
            <v-icon icon="mdi-label" start></v-icon>
            {{ role.name }}
          </v-chip>
        </div>
      </template>
    </va-data-table-server>

- added  disableUnsavedFormDialog prop to Form provider.

    
