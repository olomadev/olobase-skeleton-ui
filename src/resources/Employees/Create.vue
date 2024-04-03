<template>
  <div>  
    <va-create-layout :title="title">
      <employees-form :item="item"></employees-form>
    </va-create-layout>
  
    <v-tabs
      class="mt-3"
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">Create</v-tab>
      <v-tab value="2">Form</v-tab>
      <v-tab value="3">Handler</v-tab>
      <v-tab value="4">Model</v-tab>
    </v-tabs>

     <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-js">{{ create }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="2">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-js">{{ form }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="3">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ handler }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="4">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ model }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

    </v-window>
  </div>
</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["title", "item"],
  mixins: [Clipboard],
  inheritAttrs: false, // https://stackoverflow.com/questions/72246939/extraneous-non-props-attributes-title-were-passed-to-component-but-could-not-b
  created() {
    this.create = `<template>
    <va-create-layout :title="title">
      <employees-form :item="item"></employees-form>
    </va-create-layout>
</template>`;
    this.form = `<template>
  <va-form 
    :id="id" 
    :item="item" 
    v-model="model"
  >
    <v-row no-gutters>
      <v-col sm="3" class="mr-3">
        <va-text-input
          source="name"
          :error-messages="nameErrors"
        ></va-text-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-text-input
          source="surname"
          :error-messages="surnameErrors"
        ></va-text-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-text-input
          source="employeeNumber"
        ></va-text-input>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col sm="3" class="mr-3">
        <va-date-input
          source="employmentStartDate"
          :error-messages="employmentStartDateErrors"
        ></va-date-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-date-input
          source="employmentEndDate"
        ></va-date-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-select-input
          source="companyId"
          reference="companies"
          :error-messages="companyIdErrors"
        ></va-select-input>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col sm="3" class="mr-3">
        <va-select-input
          source="departmentId"
          :key="model.companyId"
          :filter="{ companyId: model.companyId }"
          v-model="model.departmentId"
          reference="departments"
        ></va-select-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-select-input
          source="jobTitleId"
          reference="jobtitles"
        ></va-select-input>
      </v-col>
      <v-col sm="3" class="mr-3">
        <va-select-input
          source="gradeId"
          reference="employee-grades"
        ></va-select-input>
      </v-col>
      <v-col sm="3" class="mr-3">
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col lg="8" md="12" sm="12">
        <va-array-table-input
          source="employeeChildren"
          :title="$t('resources.employees.fields.employeeChildren')"
          primary-key="childId"
          :headers="headers"
          :fields="fields"
        >
          <template v-slot:[\`edit\`]="{ field }">
            <template v-if="field.source == 'childName'">
              <va-text-input
                :key="field.source"
                v-model="form.childName"
                variant="outlined"
                :error-messages="childNameErrors"
                clearable
              >
              </va-text-input>
            </template>
            <template v-if="field.source == 'childBirthdate'">
              <va-date-input
                :key="field.source"
                v-model="form.childBirthdate"
                variant="outlined"
                :error-messages="childBirthdateErrors"
              >
              </va-date-input>
            </template>
          </template>
        </va-array-table-input>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col sm="3" class="mr-3">
        <va-file-field 
          source="files" 
          :item="model" 
          action-type="download"
          table-name="employeeFiles"
        ></va-file-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col sm="3" class="mr-3">
        <va-file-input
          source="files"
          table-name="employeeFiles"
        ></va-file-input>
      </v-col>
    </v-row>
    <va-save-button></va-save-button>
  </va-form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import Utils from "olobase-admin/src/mixins/utils";
import Resource from "olobase-admin/src/mixins/resource";
import { provide } from 'vue'

export default {
  props: ["id", "item"],
  mixins: [Utils, Resource],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      model: {
        id: null,
        name: null,
        surname: null,
        companyId: null,
        departmentId: null,
        jobTitleId: null,
        employeeNumber: null,
        gradeId: null,
        employmentStartDate: null,
        employmentEndDate: null,
        employeeChildren: null,
        files: [],
      },
      headers: [
        { key: "childName" },
        { key: "childBirthdate" },
        { key: "actions" },
      ],
      fields: [
        {
          source: "childName",
          type: "text",
        },
        {
          source: "childBirthdate",
          type: "date",
        },
      ]
    };
  },
  validations() {
    return {
      model: {
        name: {
          required
        },
        surname: {
          required
        },
        companyId: {
          id: {
            required
          }
        },
        employmentStartDate: {
          required
        }
      },
      form: {
        childName: {
          required,
        },
        childBirthdate: {
          required,
        }
      }
    }
  },
  created() {
    this.model.id = this.generateId(this);
  },
  computed: {
    form: {
      get() {
        return this.$store.getters[\`${this.resource}/getRow\`];
      },
      set(val) {
        this.$store.commit(\`${this.resource}/setRow\`, val);
      } 
    },
    nameErrors() {
      const errors = [];
      const field = "name";
      if (!this.v$['model'][field].$dirty) return errors;
      this.v$['model'][field].required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    surnameErrors() {
      const errors = [];
      const field = "surname";
      if (!this.v$['model'][field].$dirty) return errors;
      this.v$['model'][field].required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    companyIdErrors() {
      const errors = [];
      const field = "companyId";
      if (!this.v$['model'][field].id.$dirty) return errors;
      this.v$['model'][field].id.required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    employmentStartDateErrors() {
      const errors = [];
      const field = "employmentStartDate";
      if (!this.v$['model'][field].$dirty) return errors;
      this.v$['model'][field].required.$invalid && errors.push(this.$t("v.text.required"));
      return errors;
    },
    childNameErrors() {
      const errors = [];
      const field = "childName";
      if (!this.v$["form"][field].$dirty) return errors;
      this.v$["form"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    childBirthdateErrors() {
      const errors = [];
      const field = "childBirthdate";
      if (!this.v$["form"][field].$dirty) return errors;
      this.v$["form"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
  },
}
<\/script>`;
    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Employees;

use App\\Model\\EmployeeModel;
use App\\Schema\\Employees\\EmployeeSave;
use App\\Filter\\Employees\\SaveFilter;
use Olobase\\Mezzio\\DataManagerInterface;
use Olobase\\Mezzio\\Error\\ErrorWrapperInterface as Error;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class CreateHandler implements RequestHandlerInterface
{
    public function __construct(
        private EmployeeModel $employeeModel,
        private DataManagerInterface $dataManager,
        private SaveFilter $filter,
        private Error $error,
    ) 
    {
        $this->employeeModel = $employeeModel;
        $this->dataManager = $dataManager;
        $this->error = $error;
        $this->filter = $filter;
    }
    
    /**
     * @OA\\Post(
     *   path="/employees/create",
     *   tags={"Employees"},
     *   summary="Create a new employee",
     *   operationId="employees_create",
     *
     *   @OA\\RequestBody(
     *     description="Create new employee",
     *     @OA\\JsonContent(ref="#/components/schemas/EmployeeSave"),
     *   ),
     *   @OA\\Response(
     *     response=200,
     *     description="Successful operation",
     *   ),
     *   @OA\\Response(
     *      response=400,
     *      description="Bad request, returns to validation errors"
     *   )
     *)
     **/
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $this->filter->setInputData($request->getParsedBody());
        $data = array();
        $response = array();
        if ($this->filter->isValid()) {
            $this->dataManager->setInputFilter($this->filter);
            $data = $this->dataManager->getSaveData(EmployeeSave::class, 'employees');
            $this->employeeModel->create($data);
        } else {
            return new JsonResponse($this->error->getMessages($this->filter), 400);
        }
        return new JsonResponse($response);     
    }
}`;
    this.model = `<?php
declare(strict_types=1);

namespace App\\Model;

use Exception;
use Oloma\\Php\\ColumnFiltersInterface;
use Laminas\\Db\\Sql\\Sql;
use Laminas\\Db\\Sql\\Expression;
use Laminas\\Paginator\\Paginator;
use Laminas\\Paginator\\Adapter\\DbSelect;
use Laminas\\Db\\Adapter\\AdapterInterface;
use Laminas\\Db\\TableGateway\\TableGatewayInterface;

class EmployeeModel
{
    private $conn;
    private $adapter;
    private $employees;
    private $employeeChildren;
    private $columnFilters;
    private $concatFunction;

    public function __construct(
        TableGatewayInterface $employees,
        TableGatewayInterface $employeeChildren,
        ColumnFiltersInterface $columnFilters
    ) {
        $this->adapter = $employees->getAdapter();
        $this->employees = $employees;
        $this->employeeChildren = $employeeChildren;
        $this->conn = $this->adapter->getDriver()->getConnection();
        $this->columnFilters = $columnFilters;
    }

    public function findAllBySearch(array $get)
    {
        $platform = $this->adapter->getPlatform();
        $concat = "CONCAT_WS(' ', ";
            $concat.= " NULLIF( e.name , '' ) ,";
            $concat.= " NULLIF( e.surname , '' ) ";
        $concat.= ")";
        $concatFunction = $platform->quoteIdentifierInFragment($concat, 
            ['(',')','CONCAT_WS','\\'',',','IFNULL','-']
        );
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'employeeId',
            'name' => new Expression($concatFunction),
        ]);
        $select->from(['e' => 'employees']);

        // autocompleter search query
        //
        if (! empty($get['q']) && strlen($get['q']) > 2) {
            $nest = $select->where->nest();
            $exp = explode(" ", $get['q']);
            foreach ($exp as $str) {
                $nest = $nest->or->nest();
                    $nest->or->like('name', '%'.$str.'%');
                    $nest->or->like('surname', '%'.$str.'%');
                $nest = $nest->unnest();
            }
            $nest->unnest();
        }
        // filter by employeeNumber
        // 
        if (! empty($get['employeeNumber'])) {
            $select->where(['e.employeeNumber' => $get['employeeNumber']]);
        }
        if (! empty($get['id'])) {
            if (is_array($get['id'])) {
                $values = array();
                foreach ($get['id'] as $val) {
                    if (!empty($val['id'])) {
                        $values[] = $val['id'];
                    }
                }
                $select->where(['e.employeeId' => $values]);
            } else {
                $select->where(['e.employeeId' => $get['id']]);    
            }
        }
        $select->limit(100); // default limit for auto completer

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        return $results;
    }

    public function findOneById(string $employeeId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'employeeId',
                'name',
                'surname',
                'employeeNumber',
                'employmentStartDate',
                'employmentEndDate',
                'createdAt'
            ]
        );
        $select->from(['e' => 'employees']);
        $select->join(['c' => 'companies'], 'c.companyId = e.companyId', 
            [
                'companyId' => new Expression("JSON_OBJECT('id', c.companyId, 'name', c.companyShortName)"),
            ],
        $select::JOIN_LEFT);
        $select->join(['j' => 'jobTitles'], 'j.jobTitleId = e.jobTitleId', 
            [
                'jobTitleId' => new Expression("JSON_OBJECT('id', j.jobTitleId, 'name', j.jobTitleName)"),
            ],
        $select::JOIN_LEFT);
        $select->join(['eg' => 'employeeGrades'], 'eg.gradeId = e.gradeId', 
            [
                'gradeId' => new Expression("JSON_OBJECT('id', eg.gradeId, 'name', eg.gradeName)"),
            ],
        $select::JOIN_LEFT);
        $select->where(['e.employeeId' => $employeeId]);

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $row = $resultSet->current();
        $statement->getResource()->closeCursor();

        // children
        // 
        $sql    = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'childId',
                'childName',
                'childBirthdate',
            ]
        );
        $select->from('employeeChildren');
        $select->where(['employeeId' => $employeeId]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $employeeChildren = iterator_to_array($resultSet);
        $statement->getResource()->closeCursor();

        $row['employeeChildren'] = $employeeChildren;
        return $row;
    }

    public function findAll()
    {
        $platform = $this->adapter->getPlatform();
        $child = "JSON_ARRAYAGG(";
        $child.= "JSON_OBJECT(";
        $child.= "'childId' , ec.childId , ";
        $child.= "'childName' , ec.childName , ";
        $child.= "'childBirthdate' , ec.childBirthdate  ";
        $child.= "))";
        $this->childrenFunction = $platform->quoteIdentifierInFragment(
            "(SELECT $child FROM employeeChildren ec WHERE ec.employeeId = e.employeeId)",
            [
                '(',
                ')',
                'childId',
                'childName',
                'childBirthdate',
                'SELECT',
                'FROM',
                'AS',
                'as',
                'ec',
                'e',
                ',',
                '[',
                ']',
                'JSON_ARRAYAGG',
                'JSON_OBJECT',
                'WHERE',
                ';',
                'CONCAT',
                'id',
                'name',
                '"',
                '\\'',
                '\\"', '=', '?', 'JOIN', 'ON', 'AND', 'LEFT', ','
            ]
        );
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'employeeId',
            'employeeNumber',
            'name',
            'surname',
            'employmentStartDate',
            'employmentEndDate',
            'employeeChildren' => new Expression($this->childrenFunction),
            'createdAt',
        ]);
        $select->from(['e' => 'employees']);
        $select->join(['c' => 'companies'], 'c.companyId = e.companyId', 
            [
                'companyId' => new Expression("JSON_OBJECT('id', c.companyId, 'name', c.companyShortName)"),
            ],
        $select::JOIN_LEFT);
        $select->join(['j' => 'jobTitles'], 'j.jobTitleId = e.jobTitleId', 
            [
                'jobTitleId' => new Expression("JSON_OBJECT('id', j.jobTitleId, 'name', j.jobTitleName)"),
            ],
        $select::JOIN_LEFT);
        $select->join(['g' => 'employeeGrades'], 'g.gradeId = e.gradeId', 
            [
                'gradeId' => new Expression("JSON_OBJECT('id', g.gradeId, 'name', g.gradeName)"),
            ],
        $select::JOIN_LEFT);

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;

        return $select;
    }

    public function findAllByPaging(array $get)
    {
        $select = $this->findAll();
        $this->columnFilters->clear();
        $this->columnFilters->setAlias('companyId', 'c.companyId');
        $this->columnFilters->setAlias('jobTitleId', 'j.jobTitleId');
        $this->columnFilters->setAlias('gradeId', 'g.gradeId');
        $this->columnFilters->setColumns([
            'companyId',
            'employeeNumber',
            'name',
            'surname',
            'companyId',
            'jobTitleId',
            'gradeId'
        ]);
        $this->columnFilters->setLikeColumns(
            [
                'employeeNumber',
                'name',
                'surname',
            ]
        );
        $this->columnFilters->setWhereColumns(
            [
                'companyId',
                'jobTitleId',
                'gradeId',
                'departmentId',
            ]
        );
        $this->columnFilters->setData($get);
        $this->columnFilters->setSelect($select);

        if ($this->columnFilters->searchDataIsNotEmpty()) {
            $nest = $select->where->nest();
            foreach ($this->columnFilters->getSearchData() as $col => $words) {
                $nest = $nest->or->nest();
                foreach ($words as $str) {
                    $nest->or->like(new Expression($col), '%'.$str.'%');
                }
                $nest = $nest->unnest();
            }
            $nest->unnest();
        }
        if ($this->columnFilters->likeDataIsNotEmpty()) {
            foreach ($this->columnFilters->getLikeData() as $column => $value) {
                if (is_array($value)) {
                    $nest = $select->where->nest();
                    foreach ($value as $val) {
                        $nest->or->like(new Expression($column), '%'.$val.'%');
                    }
                    $nest->unnest();
                } else {
                    $select->where->like(new Expression($column), '%'.$value.'%');
                }
            }   
        }
        if ($this->columnFilters->whereDataIsNotEmpty()) {
            foreach ($this->columnFilters->getWhereData() as $column => $value) {
                if (is_array($value)) {
                    $nest = $select->where->nest();
                    foreach ($value as $val) {
                        $nest->or->equalTo(new Expression($column), $val);
                    }
                    $nest->unnest();
                } else {
                    $select->where->equalTo(new Expression($column), $value);
                }
            }
        }
        if ($this->columnFilters->orderDataIsNotEmpty()) {
            $select->order($this->columnFilters->getOrderData());
        }
        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $paginatorAdapter = new DbSelect(
            $select,
            $this->adapter
        );
        $paginator = new Paginator($paginatorAdapter);
        return $paginator;
    }

    public function create(array $data)
    {
        $employeeId = $data['id'];
        try {
            $this->conn->beginTransaction();
            $data['employees']['employeeId'] = $employeeId;
            $data['employees']['createdAt'] = date('Y-m-d H:i:s');
            $this->employees->insert($data['employees']);

            if (! empty($data['employeeChildren'])) {
                foreach ($data['employeeChildren'] as $val) {
                    $val['employeeId'] = $employeeId;
                    $this->employeeChildren->insert($val);
                }
            }
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function update(array $data)
    {
        $employeeId = $data['id'];
        try {
            $this->conn->beginTransaction();
            $this->employees->update($data['employees'], ['employeeId' => $employeeId]);

            // delete children
            $this->employeeChildren->delete(['employeeId' => $employeeId]);
            if (! empty($data['employeeChildren'])) {
                foreach ($data['employeeChildren'] as $val) {
                    $val['employeeId'] = $employeeId;
                    $this->employeeChildren->insert($val);
                }
            }
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function delete(string $employeeId)
    {
        try {
            $this->conn->beginTransaction();
            $this->employees->delete(['employeeId' => $employeeId]);
            $this->employeeChildren->delete(['employeeId' => $employeeId]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function getAdapter() : AdapterInterface
    {
        return $this->adapter;
    }
}`;
  },
  data() {
    return {
      tab: null,
      create: null,
      form: null,
      handler: null,
      model: null,
    }
  },
  watch: {
    tab(value) {
      if (value > 0) {
        Prism.highlightAll(); // highlight code
      }  
    }
  }
};
</script>

