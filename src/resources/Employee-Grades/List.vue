<template>
  <div>
    <va-list 
      disable-create
      row-create
      hide-bulk-copy
      :fields="fields"
      :items-per-page="50"
      >
      <va-data-table-server
        row-create
        row-clone
        row-edit
        disable-edit
        disable-show
        disable-clone
        disable-create-redirect
      >
      </va-data-table-server>
    </va-list>
    
    <v-tabs
      class="mt-3"
      v-model="tab"
      variant="outlined"
      bg-color="transparent"
      color="primary"
      align-tabs="left"
    >
      <v-tab value="1">Template</v-tab>
      <v-tab value="2">Script</v-tab>
      <v-tab value="3">Handler</v-tab>
      <v-tab value="4">Model</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item eager value="1">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-html">{{ template }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="2">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-javascript">{{ script }}</code></pre>
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
import { required } from "@vuelidate/validators";
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["resource"],
  mixins: [Clipboard],
  created() {
    this.template = `<template>
  <va-list 
    disable-create
    hide-bulk-copy
    :fields="fields"
    :items-per-page="50"
  >
      <va-data-table-server
        row-create
        row-clone
        row-edit
        disable-edit
        disable-show
        disable-clone
        disable-create-redirect
      >
      </va-data-table-server>
  </va-list>
</template>`;

    this.script = `\<script\>
import { required } from "@vuelidate/validators";

export default {
  props: ["resource"],
  provide() {
    return {
      validations: {
        form: {
          gradeName: {
            required
          }
        }
      },
      errors: {
        gradeNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].gradeName.$dirty) return errors;
          v$['form'].gradeName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        }
      }
    };
  },
  data() {
    return {
      fields: [
        {
          source: "gradeName",
          sortable: true,
        },
      ],
    };
  }
};
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\EmployeeGrades;

use App\\Model\\EmployeeGradeModel;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(EmployeeGradeModel $employeeGradeModel)
    {
        $this->employeeGradeModel = $employeeGradeModel;
    }

    /**
     * @OA\\Get(
     *   path="/employeegrades/findAllByPaging",
     *   tags={"Employee Grades"},
     *   summary="Find all employee grades by pagination",
     *   operationId="employeeGrades_findAllByPaging",
     *
     *   @OA\\Parameter(
     *       name="q",
     *       in="query",
     *       required=false,
     *       description="Search string",
     *       @OA\\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_page",
     *       in="query",
     *       required=false,
     *       description="Page number",
     *       @OA\\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_perPage",
     *       in="query",
     *       required=false,
     *       description="Per page",
     *       @OA\\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_sort",
     *       in="query",
     *       required=false,
     *       description="Order items",
     *       @OA\\Schema(
     *           type="array",
     *           @OA\\Items()
     *       ),
     *   ),
     *   @OA\\Response(
     *     response=200,
     *     description="Successful operation",
     *     @OA\\JsonContent(ref="#/components/schemas/EmployeeGradesFindAllByPaging"),
     *   ),
     *   @OA\\Response(
     *      response=404,
     *      description="No result found"
     *   )
     *)
     **/
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $get = $request->getQueryParams();
        $page = empty($get['_page']) ? 1 : (int)$get['_page'];
        $perPage = empty($get['_perPage']) ? 5 : (int)$get['_perPage'];

        // https://docs.laminas.dev/tutorials/pagination/
        $paginator = $this->employeeGradeModel->findAllByPaging($get);

        $page = ($page < 1) ? 1 : $page;
        $paginator->setCurrentPageNumber($page);
        $paginator->setItemCountPerPage($perPage);

        return new JsonResponse([
            'page' => $paginator->getCurrentPageNumber(),
            'perPage' => $paginator->getItemCountPerPage(),
            'totalPages' => $paginator->count(),
            'totalItems' => $paginator->getTotalItemCount(),
            'data' => paginatorJsonDecode($paginator->getCurrentItems()),
        ]);
    }

}`;
    this.model = `<?php
namespace App\\Model;

use Exception;
use Oloma\\Php\\ColumnFiltersInterface;
use Laminas\\Db\\Sql\\Sql;
use Laminas\\Db\\Sql\\Expression;
use Laminas\\Paginator\\Paginator;
use Laminas\\Paginator\\Adapter\\DbSelect;
use Laminas\\Db\\Adapter\\AdapterInterface;
use Laminas\\Cache\\Storage\\StorageInterface;
use Laminas\\Db\\TableGateway\\TableGatewayInterface;

class EmployeeGradeModel
{
    private $conn;
    private $adapter;
    private $employeeGrades;
    private $columnFilters;

    public function __construct(
        TableGatewayInterface $employeeGrades,
        ColumnFiltersInterface $columnFilters
    ) {
        $this->adapter = $employeeGrades->getAdapter();
        $this->employeeGrades = $employeeGrades;
        $this->conn = $this->adapter->getDriver()->getConnection();
        $this->columnFilters = $columnFilters;
    }

    public function findOptions(array $get)
    {
        $platform = $this->adapter->getPlatform();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'gradeId',
            'name' => 'gradeName',
        ]);
        $select->from(['g' => 'employeeGrades']);
        
        // autocompleter search query
        //
        if (! empty($get['q']) && strlen($get['q']) > 2) {
            $nest = $select->where->nest();
            $exp = explode(" ", $get['q']);
            foreach ($exp as $str) {
                $nest = $nest->or->nest();
                    $nest->or->like('gradeName', '%'.$str.'%');
                $nest = $nest->unnest();
            }
            $nest->unnest();
        }
        if (! empty($get['id'])) {
            $select->where(['g.gradeId' => $get['id']]);
        }
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        return $results;
    }

    public function findAll()
    {
        $platform = $this->adapter->getPlatform();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'gradeId',
            'gradeName',
        ]);
        $select->from(['g' => 'employeeGrades']);
        return $select;
    }

    public function findAllByPaging(array $get)
    {
        $select = $this->findAll();
        $this->columnFilters->clear();
        // $this->columnFilters->setAlias('name', $this->concatFunction);
        // $this->columnFilters->setAlias('area_code_name', 'cl.country_name');
        $this->columnFilters->setColumns(
            [
                'id' => 'gradeId',
                'gradeName',
            ]
        );
        $this->columnFilters->setLikeColumns(
            [
                'gradeName',
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
        try {
            $this->conn->beginTransaction();
            $data['employeeGrades']['clientId'] = CLIENT_ID;
            $data['employeeGrades']['gradeId'] = $data['gradeId'];
            $this->employeeGrades->insert($data['employeeGrades']);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function update(array $data)
    {
        try {
            $this->conn->beginTransaction();
            $this->employeeGrades->update($data['employeeGrades'], ['gradeId' => $data['gradeId']]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function delete(string $gradeId)
    {
        try {
            $this->conn->beginTransaction();
            $this->employeeGrades->delete(['gradeId' => $gradeId]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }
}
`;
  },
  provide() {
    return {
      validations: {
        form: {
          gradeName: {
            required
          }
        }
      },
      errors: {
        gradeNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].gradeName.$dirty) return errors;
          v$['form'].gradeName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        }
      }
    };
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
      handler: null,
      model: null,
      fields: [
        {
          source: "gradeName",
          sortable: true,
        },
      ],
    };
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