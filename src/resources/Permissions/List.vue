<template>
  <div> 
    <va-list 
      disable-create
      row-create
      :fields="fields"
      :filters="filters"
      :items-per-page="200"
    >
      <va-data-table-server
        :group-by="groupBy"
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
            <pre><code class="language-html" data-prismjs-copy="Copy the Code">{{ template }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="2">
        <v-card>
          <v-card-text>  
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-js" data-prismjs-copy="Copy the Code">{{ script }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="3">
        <v-card>
          <v-card-text>  
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php" data-prismjs-copy="Copy the Code">{{ handler }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="4">
        <v-card>
          <v-card-text>  
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php" data-prismjs-copy="Copy the Code">{{ model }}</code></pre>
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
  inject: ["admin"],
  mixins: [Clipboard],
  inheritAttrs: false,
  created() {
    this.template = `<template>
  <va-list 
    disable-create
    :fields="fields"
    :filters="filters"
    :items-per-page="50"
  >
      <va-data-table-server
        :group-by="groupBy"
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
          moduleName: {
            required
          },
          resource: {
            required
          },
          route: {
            required
          },
          action: {
            required
          },
          method: {
            required
          }
        }
      },
      errors: {
        moduleNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].moduleName.$dirty) return errors;
          v$['form'].moduleName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        resourceErrors: (v$) => {
          const errors = [];
          if (!v$['form'].resource.$dirty) return errors;
          v$['form'].resource.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        actionErrors: (v$) => {
          const errors = [];
          if (!v$['form'].action.$dirty) return errors;
          v$['form'].action.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        routeErrors: (v$) => {
          const errors = [];
          if (!v$['form'].route.$dirty) return errors;
          v$['form'].route.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        methodErrors: (v$) => {
          const errors = [];
          if (!v$['form'].method.$dirty) return errors;
          v$['form'].method.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    };
  },
  data() {
    return {
      groupBy: [{ key: 'moduleName' }],
      selected: [],
      filters: [],
      fields: [
        {
          source: "data-table-group",
          label: this.$t("va.datatable.group"),
          sortable: false,
        },
        {
          source: "moduleName",
          sortable: true,
        },
        {
          source: "resource",
          sortable: true,
        },
        {
          source: "action",
          type: "select",
          sortable: true,
        },
        {
          source: "route",
          sortable: true,
        },
        {
          source: "method",
          type: "select",
          sortable: true,
        },
      ],
    };
  }
};
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Permissions;

use App\\Model\\PermissionModel;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(PermissionModel $permissionModel)
    {
        $this->permissionModel = $permissionModel;
    }

    /**
     * @OA\\Get(
     *   path="/permissions/findAllByPaging",
     *   tags={"Permissions"},
     *   summary="Find all permissions",
     *   operationId="permissions_findAllByPaging",
     *
     *   @OA\\Parameter(
     *       name="$filters",
     *       in="query",
     *       required=false,
     *       description="Search string",
     *       @OA\\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\\Response(
     *     response=200,
     *     description="Successful operation",
     *     @OA\\JsonContent(ref="#/components/schemas/PermissionsFindAllByPaging"),
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
        $paginator = $this->permissionModel->findAllByPaging($get);

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

}
`;
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
use Oloma\\Php\\Authorization\\PermissionModelInterface;

class PermissionModel implements PermissionModelInterface
{
    private $conn;
    private $cache;
    private $adapter;
    private $permissions;
    private $columnFilters;

    public function __construct(
        TableGatewayInterface $permissions,
        StorageInterface $cache,
        ColumnFiltersInterface $columnFilters
    )
    {
        $this->cache = $cache;
        $this->permissions = $permissions;
        $this->adapter = $permissions->getAdapter();
        $this->columnFilters = $columnFilters;
        $this->conn = $this->adapter->getDriver()->getConnection();
    }

    public function findAllPermissions()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'permId',
            'moduleName',
            'resource',
            'action',
            'route',
            'method',
        ]);
        $select->from(['p' => 'permissions']);
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $permissions = iterator_to_array($resultSet);
        $statement->getResource()->closeCursor();
        return $permissions;
    }

    public function findAll()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'permId',
            // 'groupName' => 'moduleName',
            'action' => new Expression("JSON_OBJECT('id', p.action, 'name', p.action)"),
            'method' => new Expression("JSON_OBJECT('id', p.method, 'name', p.method)"),
            'moduleName',
            'resource',
            'route',
        ]);
        $select->from(['p' => 'permissions']);
        return $select;
    }

    public function findAllByPaging(array $get)
    {
        $select = $this->findAll();
        $this->columnFilters->clear();
        $this->columnFilters->setColumns([
            'moduleName',
            'resource',
            'action',
            'route',
            'method',
        ]);
        $this->columnFilters->setSelect($select);
        $this->columnFilters->setData($get);

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
        if ($this->columnFilters->orderDataIsNotEmpty()) {
            $select->order($this->columnFilters->getOrderData());
        } else {
            $select->order(['moduleName ASC', 'route ASC']);
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
            $data['permissions']['permId'] = $data['permId'];
            $this->permissions->insert($data['permissions']);
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
            $this->permissions->update($data['permissions'], ['permId' => $data['permId']]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function copy(string $permId) : array
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from(['r' => 'permissions']);
        $select->where(['permId' => $permId]);

        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $row = $resultSet->current();
        $statement->getResource()->closeCursor();

        $post = [];
        if ($row) {
            $post = [
                'id' => createGuid(), // create new id
                'moduleName' => $row['moduleName'],
                'resource' => $row['resource'],
                'action' => ['id' => $row['action']],
                'route' => $row['route'],
                'method' => ['id' => $row['method']],
            ];
        }
        return $post;
    }

    public function delete(string $permId)
    {
        try {
            $this->conn->beginTransaction();
            $this->permissions->delete(['permId' => $permId]);
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
          moduleName: {
            required
          },
          resource: {
            required
          },
          route: {
            required
          },
          action: {
            required
          },
          method: {
            required
          }
        }
      },
      errors: {
        moduleNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].moduleName.$dirty) return errors;
          v$['form'].moduleName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        resourceErrors: (v$) => {
          const errors = [];
          if (!v$['form'].resource.$dirty) return errors;
          v$['form'].resource.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        actionErrors: (v$) => {
          const errors = [];
          if (!v$['form'].action.$dirty) return errors;
          v$['form'].action.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        routeErrors: (v$) => {
          const errors = [];
          if (!v$['form'].route.$dirty) return errors;
          v$['form'].route.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
        methodErrors: (v$) => {
          const errors = [];
          if (!v$['form'].method.$dirty) return errors;
          v$['form'].method.required.$invalid &&
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
      groupBy: [{ key: 'moduleName' }],
      selected: [],
      filters: [],
      fields: [
        {
          source: "data-table-group",
          label: this.$t("va.datatable.group"),
          sortable: false,
        },
        {
          source: "moduleName",
          sortable: true,
        },
        {
          source: "resource",
          sortable: true,
        },
        {
          source: "action",
          type: "select",
          sortable: true,
        },
        {
          source: "route",
          sortable: true,
        },
        {
          source: "method",
          type: "select",
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

