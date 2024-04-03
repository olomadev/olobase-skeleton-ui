<template>
  <div>    
    <va-list 
      :filters="filters"
      :fields="fields"
      hide-bulk-copy
      :disable-global-search="false"
      >
        <va-data-table-server              
          :disable-actions="false"
          :disable-show="false"
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
  inheritAttrs: false, // https://stackoverflow.com/questions/72246939/extraneous-non-props-attributes-title-were-passed-to-component-but-could-not-b
  created() {
    this.template = `<template>
  <va-list 
    :filters="filters"
    :fields="fields"
    :disable-global-search="false"
    hide-bulk-copy
    >
      <va-data-table-server
        :disable-actions="false"
        :disable-show="false"
      >
      </va-data-table-server>
  </va-list>
</template>`;

    this.script = `\<script\>
export default {
  props: ["resource"],
  data() {
    return {
      filters: [
        { source: "firstname", col: 2 },
        { source: "lastname" },
        { source: "email" },
        { source: "active", type: "boolean" },
      ],
      fields: [
        {
          source: "firstname",
          sortable: true,
        },
        {
          source: "lastname",
          sortable: true,
        },
        {
          source: "email",
          sortable: true,
        },
        {
          source: "active",
          sortable: true,
        },
        {
          source: "createdAt",
          sortable: true,
        },
      ],
    };
  },
}
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Users;

use App\\Model\\UserModel;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(UserModel $userModel)
    {
        $this->userModel = $userModel;
    }
    
    /**
     * @OA\\Get(
     *   path="/users/findAllByPaging",
     *   tags={"Users"},
     *   summary="Find all users by pagination",
     *   operationId="users_findAllByPaging",
     *
     *   @OA\\Parameter(
     *       name="q",
     *       in="query",
     *       required="false",
     *       description="Search string",
     *       @OA\\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_page",
     *       in="query",
     *       required="false",
     *       description="Page number",
     *       @OA\\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_perPage",
     *       in="query",
     *       required="false",
     *       description="Per page",
     *       @OA\\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\\Parameter(
     *       name="_sort",
     *       in="query",
     *       required="false",
     *       description="Order items",
     *       @OA\\Schema(
     *           type="array",
     *           @OA\\Items()
     *       ),
     *   ),
     *   @OA\\Response(
     *     response=200,
     *     description="Successful operation",
     *     @OA\\JsonContent(ref="#/components/schemas/UsersFindAllByPaging"),
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
        $paginator = $this->userModel->findAllByPaging($get);

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
use Laminas\\Cache\\Storage\\StorageInterface;
use Laminas\\Db\\Adapter\\AdapterInterface;
use Laminas\\Db\\TableGateway\\TableGatewayInterface;

class UserModel
{
    private $conn;
    private $adapter;
    private $users;
    private $userRoles;
    private $userAvatars;
    private $columnFilters;

    public function __construct(
        TableGatewayInterface $users,
        TableGatewayInterface $userRoles,
        TableGatewayInterface $userAvatars,
        ColumnFiltersInterface $columnFilters,
        StorageInterface $cache
    ) {
        $this->adapter = $users->getAdapter();
        $this->users = $users;
        $this->userRoles = $userRoles;
        $this->userAvatars = $userAvatars;
        $this->columnFilters = $columnFilters;
        $this->cache = $cache;
        $this->conn = $this->adapter->getDriver()->getConnection();
    }

    public function findAllBySelect()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'userId',
            'firstname',
            'lastname',
            'email',
            'active',
            'createdAt',
        ]);
        $select->from(['u' => 'users']);
        return $select;
    }

    public function findAllByPaging(array $get)
    {
        $select = $this->findAllBySelect();
        $this->columnFilters->clear();
        $this->columnFilters->setColumns([
            'firstname',
            'lastname',
            'email',
            'active',
        ]);
        $this->columnFilters->setLikeColumns(
            [
                'firstname',
                'lastname',
                'email',
            ]
        );
        $this->columnFilters->setWhereColumns(
            [
                'active',
            ]
        );
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
        // start date filters
        // 
        $this->columnFilters->setDateFilter('createdAt');
        // end date filters
        // 
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

    public function findOneById(string $userId)
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'userId',
                'userId',
                'firstname',
                'lastname',
                'email',
                'emailActivation',
                'active',
                'themeColor',
                'lastLogin',
                'createdAt',
            ]
        );
        $select->from(['u' => 'users']);
        $select->where(['u.userId' => $userId]);
        $select->join(['ua' => 'userAvatars'], 'ua.userId = u.userId',
            [
                'avatarImage'
            ],
        $select::JOIN_LEFT);

        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $row = $resultSet->current();
        $statement->getResource()->closeCursor();

        // user roles
        // 
        $sql    = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'roleId',
            ]
        );
        $select->from('userRoles');
        $select->join(['r' => 'roles'], 'r.roleId = userRoles.roleId',
            [
                'name' => 'roleName'
            ],
        $select::JOIN_LEFT);
        $select->where(['userId' => $userId]);
        // echo $select->getSqlString($this->adapter->getPlatform());
        // die;
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $userRoles = iterator_to_array($resultSet);

        $newUserRoles = array();
        foreach ($userRoles as $key => $val) {
            $newUserRoles[$key] = ["id" => $val['id'], "name" => $val['name']];
        }
        $row['userRoles'] = $newUserRoles;

        $statement->getResource()->closeCursor();
        return $row;
    }

    public function create(array $data)
    {
        // decode base64 image if exists
        //
        $avatarImageBlob = null;
        if (! empty($data['users']['avatarImage'])) {
            $avatarImageBlob = base64_decode($data['users']['avatarImage']);
        }
        $userId = $data['users']['userId'] = $data['userId'];
        try {
            $this->conn->beginTransaction();
            $this->users->insert($data['users']);
            if (! empty($data['userRoles'])) {
                foreach ($data['userRoles'] as $val) {
                    $this->userRoles->insert(['userId' => $userId, 'roleId' => $val['id']]);
                }
            }
            if ($avatarImageBlob) {
                $this->userAvatars->insert(['userId' => $userId, 'avatarImage' => $avatarImageBlob]);
            }
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function update(array $data)
    {
        // decode base64 image if exists
        //
        $avatarImageBlob = null;
        if (! empty($data['users']['avatarImage'])) {
            $avatarImageBlob = base64_decode($data['users']['avatarImage']);
        }
        unset($data['users']['avatarImage']); // remove it from insert array

        $userId = $data['userId'];
        try {
            $this->conn->beginTransaction();
            if (! empty($data['users']['password'])) {
                $data['users']['password'] = password_hash($data['users']['password'], PASSWORD_DEFAULT, ['cost' => 10]);
            } else {
                unset($data['users']['password']);
            }
            $data['users']['updatedAt'] = date('Y-m-d H:i:s');
            $this->users->update($data['users'], ['userId' => $userId]);
            if (! empty($data['userRoles'])) {
                $this->userRoles->delete(['userId' => $userId]);
                foreach ($data['userRoles'] as $val) {
                    $this->userRoles->insert(['userId' => $userId, 'roleId' => $val['id']]);
                }
            }
            $this->userAvatars->delete(['userId' => $userId]);
            if ($avatarImageBlob) {
                $this->userAvatars->insert(['userId' => $userId, 'avatarImage' => $avatarImageBlob]);
            }
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function delete(string $userId)
    {
        try {
            $this->conn->beginTransaction();
            $this->users->delete(['userId' => $userId]);
            $this->userRoles->delete(['userId' => $userId]);
            $this->userAvatars->delete(['userId' => $userId]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function updatePasswordById(string $userId, string $newPassword)
    {
        $password = password_hash($newPassword, PASSWORD_DEFAULT, ['cost' => 10]);
        try {
            $this->conn->beginTransaction();
            $this->users->update(['password' => $password], ['userId' => $userId]);
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
      template: null,
      script: null,
      handler: null,
      model: null,
      filters: [
        { source: "firstname", col: 2 },
        { source: "lastname" },
        { source: "email" },
        { source: "createdAt", type: "date" },
        { source: "active", type: "boolean" },
      ],
      fields: [
        {
          source: "firstname",
          sortable: true,
        },
        {
          source: "lastname",
          sortable: true,
        },
        {
          source: "email",
          sortable: true,
        },
        {
          source: "active",
          sortable: true,
        },
      ],
    };
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

