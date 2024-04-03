<template>
  <div>
    <va-list 
      :fields="fields"
      :filters="filters"
      >
        <va-data-table-server 
          disable-show
          :disable-actions="false"
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
import Clipboard from "olobase-admin/src/mixins/clipboard";

export default {
  props: ["resource"],
  mixins: [Clipboard],
  inheritAttrs: false,
  created() {
    this.template = `\<template\>
<div>
  <va-list 
    :fields="fields"
    :filters="filters"
    >
      <va-data-table-server 
        disable-show
        :disable-actions="false"
      >
      </va-data-table-server>
  </va-list>
</div>
\</template\>`;

    this.script = `\<script\>
export default {
  props: ["resource"],
  data() {
    return {
      filters: [],
      fields: [
        {
          source: "roleName",
          sortable: true,
        },
        {
          source: "roleKey",
          sortable: true,
        },
        {
          source: "roleLevel",          
          sortable: true,
        },
      ],
    };
  }
};
\</script\>`;

  this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Roles;

use App\\Model\\RoleModel;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(RoleModel $roleModel)
    {
        $this->roleModel = $roleModel;
    }

    /**
     * @OA\\Get(
     *   path="/roles/findAllByPaging",
     *   tags={"Roles"},
     *   summary="Find all roles by pagination",
     *   operationId="roles_findAllByPaging",
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
     *     @OA\\JsonContent(ref="#/components/schemas/RolesFindAllByPaging"),
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
        $paginator = $this->roleModel->findAllByPaging($get);

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

class RoleModel
{
    private $conn;
    private $roles;
    private $rolePermissions;
    private $cache;
    private $adapter;
    private $columnFilters;

    /**
     * Constructor
     * 
     * @param TableGatewayInterface $roles object
     * @param TableGatewayInterface $rolePermissions object
     * @param StorageInterface $cache object
     * @param ColumnFilters object
     */
    public function __construct(
        TableGatewayInterface $roles,
        TableGatewayInterface $rolePermissions,
        StorageInterface $cache,
        ColumnFiltersInterface $columnFilters
    )
    {
        $this->roles = $roles;
        $this->rolePermissions = $rolePermissions;
        $this->cache = $cache;
        $this->adapter = $roles->getAdapter();
        $this->columnFilters = $columnFilters;
        $this->conn = $this->adapter->getDriver()->getConnection();
    }

    public function findAllBySelect()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'roleId',
            'roleKey',
            'roleName',
            'roleLevel',
        ]);
        $select->from(['r' => 'roles']);
        return $select;
    }

    public function findAllByPaging(array $get)
    {
        $select = $this->findAllBySelect();
        $this->columnFilters->clear();
        $this->columnFilters->setColumns([
            'roleKey',
            'roleName',
            'roleLevel',
        ]);
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

    public function findOneById(string $roleId)
    {
        $platform = $this->adapter->getPlatform();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'roleId',
            'roleKey',
            'roleName',
            'roleLevel',
        ]);
        $select->from(['r' => 'roles']);
        $select->where(['r.roleId' => $roleId]);

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $row = $resultSet->current();
        $statement->getResource()->closeCursor();

        // role permissions
        // 
        $sql    = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'permId',
                'route',
                'action',
                'resource',
                'moduleName',
                'method',
            ]
        );
        $select->from(['p' => 'permissions']);
        $select->join(['rp' => 'rolePermissions'], 'p.permId = rp.permId',
            [],
        $select::JOIN_LEFT);
        $select->where(['rp.roleId' => $roleId]);
         
        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $rolePermissions = iterator_to_array($resultSet);
        $statement->getResource()->closeCursor();

        $row['rolePermissions'] = $rolePermissions;
        return $row;
    }
}`;
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
      handler: null,
      model: null,
      filters: [],
      fields: [
        {
          source: "roleName",
          sortable: true,
        },
        {
          source: "roleKey",
          sortable: true,
        },
        {
          source: "roleLevel",
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
