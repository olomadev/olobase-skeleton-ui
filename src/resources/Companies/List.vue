<template>
  <div>
    <va-aside-layout 
      :title="asideTitle"
    >
      <companies-form
        v-if="action !== 'show'"
        :id="id"
        :item="item"
        @saved="onSaved"
      ></companies-form>
    </va-aside-layout>
    
    <va-list 
      class="mb-0" 
      @action="onAction"
      :filters="filters"
      :fields="fields"
      :items-per-page="50"
      disable-create-redirect
    >
      <va-data-table-server
        row-show
        disable-show
        disable-create-redirect
        disable-edit-redirect
        @item-action="onAction"
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
            <pre><code class="language-js">{{ script }}</code></pre>
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

export default {
  props: ["resource"],
  created() {
    this.template = `<template>
  <div>
    <va-aside-layout 
      :title="asideTitle"
    >
      <companies-form
        v-if="action !== 'show'"
        :id="id"
        :item="item"
        @saved="onSaved"
      ></companies-form>
    </va-aside-layout>
    <va-list 
      @action="onAction"
      :filters="filters"
      :fields="fields"
      disable-create-redirect
      :items-per-page="50"
    >
      <va-data-table-server
        row-show
        disable-show
        disable-create-redirect
        disable-edit-redirect
        @item-action="onAction"
      >
      </va-data-table-server>
    </va-list>
  </div>
</template>`;

    this.script = `\<script\>
import { required } from "@vuelidate/validators";
export default {
  props: ["resource"],
  provide() {
    return {
      validations: {
        form: {
          companyName: {
            required
          },
          companyShortName: {
            required
          },
          taxOffice: {
            required
          },
          taxNumber: {
            required
          },
          address: {
            required
          },
        }
      },
      errors: {
        companyNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyName.$dirty) return errors;
          v$['form'].companyName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        companyShortNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyShortName.$dirty) return errors;
          v$['form'].companyShortName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        taxOfficeErrors: (v$) => {
          const errors = [];
          if (!v$['form'].taxOffice.$dirty) return errors;
          v$['form'].taxOffice.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        taxNumberErrors: (v$) => {
          const errors = [];
          if (!v$['form'].taxNumber.$dirty) return errors;
          v$['form'].taxNumber.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    },
  },
  data() {
    return {
      asideTitle: null,
      id: null,
      action: null,
      item: null,
      filters: [],
      fields: [
        {
          source: "companyName",
          sortable: true,
          width: "20%"
        },
        {
          source: "companyShortName",
          sortable: true,
          width: "12%"
        },
        {
          source: "taxOffice",
          sortable: true,
          width: "12%"
        },
        {
          source: "taxNumber",
          sortable: true,
          width: "12%"
        },
        {
          source: "address",
          sortable: true,
          width: "20%"
        }
      ],
    };
  },
  methods: {
    async onAction({ action, title, id, item }) {
      this.asideTitle = title;
      this.id = id;
      this.item = item;
      this.action = action;
      if (action === "create") {
        this.action = null;
      }
    },
    async onSaved() {
      this.asideTitle = null;
      this.$store.dispatch("api/refresh", "companies");
    }
  },
}
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Companies;

use App\\Model\\CompanyModel;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(CompanyModel $companyModel)
    {
        $this->companyModel = $companyModel;
    }
    
    /**
     * @OA\\Get(
     *   path="/companies/findAllByPaging",
     *   tags={"Companies"},
     *   summary="Find all companies by pagination",
     *   operationId="companies_findAllByPaging",
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
     *     @OA\\JsonContent(ref="#/components/schemas/CompanyFindAllByPageResultVM"),
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
        $paginator = $this->companyModel->findAllByPaging($get);

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
declare(strict_types=1);

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

class CompanyModel
{
    private $conn;
    private $adapter;
    private $companies;
    private $columnFilters;

    public function __construct(
        TableGatewayInterface $companies,
        ColumnFiltersInterface $columnFilters
    ) {
        $this->adapter = $companies->getAdapter();
        $this->companies = $companies;
        $this->conn = $this->adapter->getDriver()->getConnection();
        $this->columnFilters = $columnFilters;
    }

    public function findOptions(array $get)
    {
        $platform = $this->adapter->getPlatform();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'companyId',
            'name' => 'companyShortName',
        ]);
        $select->from(['c' => 'companies']);
        
        // autocompleter search query
        //
        if (! empty($get['q']) && strlen($get['q']) > 2) {
            $nest = $select->where->nest();
            $exp = explode(" ", $get['q']);
            foreach ($exp as $str) {
                $nest = $nest->or->nest();
                    $nest->or->like('companyName', '%'.$str.'%');
                    $nest->or->like('companyShortName', '%'.$str.'%');
                $nest = $nest->unnest();
            }
            $nest->unnest();
        }
        if (! empty($get['id'])) {
            $select->where(['c.companyId' => $get['id']]);
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
            'id' => 'companyId',
            'companyName',
            'companyShortName',
            'taxOffice',
            'taxNumber',
            'address',
            'createdAt'
        ]);
        $select->from(['c' => 'companies']);
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
                'id' => 'companyId',
                'companyName',
                'companyShortName',
                'taxNumber',
                'taxOffice',
                'address'
            ]
        );
        $this->columnFilters->setLikeColumns(
            [
                'companyName',
                'taxNumber',
                'taxOffice',
                'address'
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

    public function findOneById(string $companyId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'companyId',
                'companyName',
                'companyShortName',
                'taxOffice',
                'taxNumber',
                'address',
                'createdAt'
            ]
        );
        $select->from(['c' => 'companies']);
        $select->where(['c.companyId' => $companyId]);

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $row = $resultSet->current();
        $statement->getResource()->closeCursor();
        return $row;
    }
    
    public function create(array $data)
    {
        try {
            $this->conn->beginTransaction();
            $data['companies']['companyId'] = $data['companyId'];
            $data['companies']['createdAt'] = date('Y-m-d H:i:s');
            $this->companies->insert($data['companies']);
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
            $this->companies->update($data['companies'], ['companyId' => $data['companyId']]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function delete(string $companyId)
    {
        try {
            $this->conn->beginTransaction();
            $this->companies->delete(['companyId' => $companyId]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

}`;
  },
  provide() {
    return {
      validations: {
        form: {
          companyName: {
            required
          },
          companyShortName: {
            required
          },
          taxOffice: {
            required
          },
          taxNumber: {
            required
          },
          address: {
            required
          },
        }
      },
      errors: {
        companyNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyName.$dirty) return errors;
          v$['form'].companyName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        companyShortNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].companyShortName.$dirty) return errors;
          v$['form'].companyShortName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        taxOfficeErrors: (v$) => {
          const errors = [];
          if (!v$['form'].taxOffice.$dirty) return errors;
          v$['form'].taxOffice.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        taxNumberErrors: (v$) => {
          const errors = [];
          if (!v$['form'].taxNumber.$dirty) return errors;
          v$['form'].taxNumber.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
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
      asideTitle: null,
      id: null,
      action: null,
      item: null,
      filters: [],
      fields: [
        {
          source: "companyName",
          sortable: true,
          width: "20%"
        },
        {
          source: "companyShortName",
          sortable: true,
          width: "12%"
        },
        {
          source: "taxOffice",
          sortable: true,
          width: "12%"
        },
        {
          source: "taxNumber",
          sortable: true,
          width: "12%"
        },
        {
          source: "address",
          sortable: true,
          width: "20%"
        }
      ],
    };
  },
  methods: {
    async onAction({ action, title, id, item }) {
      this.asideTitle = title;
      this.id = id;
      this.item = item;
      this.action = action;
      if (action === "create") {
        this.action = null;
      }
    },
    async onSaved() {
      this.asideTitle = null;
      // this.$refs.list.fetchData();
      // this.$router.push({ name: `${this.resource.name}_list` });
      this.$store.dispatch("api/refresh", `${this.resource}`);
    },
  },
  watch: {
    tab(value) {
      if (value == 1) {
        Prism.highlightAll(); // highlight code
      }
      if (value == 2) {
        Prism.highlightAll(); // highlight code
      }      
    }
  }
};
</script>

