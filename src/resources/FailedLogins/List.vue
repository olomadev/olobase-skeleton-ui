<template>
  <div>
    <va-list
      :filters="filters"
      :fields="fields"
      disable-create
      disable-positioning
      disable-visibility
      :items-per-page="2"
    >
      <va-data-iterator-server
        :pagination="{ 
          density: 'default',
          activeColor: 'primary',
          top: false,
          bottom: true,
          rounded: 'pill',
        }"
      >
        <template v-slot:default="{ items }">
          <v-row no-gutters>
            <v-col
              v-for="(item, i) in items"
              :key="i"
              lg="6" md="6" sm="12"
              class="mb-3"
            >
              <v-sheet border rounded :class="(isOdd(i)) ? '' : 'mr-lg-5 mr-md-5 mr-sm-0'">
                <v-list-item
                  :title="item.raw.username"
                  :subtitle="item.raw.id"
                  lines="two"
                  density="comfortable"
                >
                  <template v-slot:title>
                    <v-row>
                      <v-col>
                        <strong class="text-h6">
                          <table>
                            <tr>
                              <td style="border: none;" width="35px;" align="left"><v-icon icon="mdi-account-outline" size="small" ></v-icon></td>
                              <td style="border:none;">{{ item.raw.username }}</td>
                            </tr>
                          </table>
                        </strong>
                      </v-col>
                      <v-col align="right">
                        <va-delete-button
                          block
                          :resource="resource"
                          :item="item.raw"
                        ></va-delete-button>
                      </v-col>
                    </v-row>
                  </template>
                </v-list-item>
                <v-table 
                  style="padding-left:10px;"
                  density="compact" 
                  class="text-caption"
                >
                  <tbody>
                    <tr align="right">
                      <th width="20%">{{ $t("resources.failedlogins.fields.attemptedAt") }}:</th>
                      <td>{{ item.raw.attemptedAt }}</td>
                    </tr>
                    <tr align="right">
                      <th>{{ $t("resources.failedlogins.fields.ip") }}:</th>
                      <td>{{ item.raw.ip }}</td>
                    </tr>
                    <tr align="right">
                      <th>{{ $t("resources.failedlogins.fields.userAgent") }}:</th>
                      <td>{{ item.raw.userAgent }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-sheet>
            </v-col>
          </v-row>              
        </template>

        <template v-slot:bottom.pagination.header="{ page, pageCount }">
          <v-footer class="text-body-3 mt-6 mb-2" style="padding:0;">
            <div>{{ $t("dataiterator.displaying_page", {page, pageCount}) }}</div>
          </v-footer>
        </template>

        <template v-slot:no-data>
          <div class="va-table">
            <v-table density="compact">
              <tbody>
                <tr>
                  <td align="center">{{ $t("va.datatable.nodata")}}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </template>
      </va-data-iterator-server>
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
export default {
  props: ["resource", "title"],
  created() {
    this.template = `<template>
<div>
  <va-list
    :filters="filters"
    :fields="fields"
    disable-create
    disable-positioning
    disable-visibility
    :items-per-page="2"
  >
    <va-data-iterator-server
      :pagination="{ 
        density: 'default',
        activeColor: 'primary',
        top: false,
        bottom: true,
        rounded: 'pill',
      }"
    >
      <template v-slot:default="{ items }">
        <v-row no-gutters>
          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            sm="6"
            xl="3"
            class="mb-3"
          >
            <v-sheet border rounded :class="(isOdd(i)) ? '' : 'mr-5'">
              <v-list-item
                :title="item.raw.username"
                :subtitle="item.raw.id"
                lines="two"
                density="comfortable"
              >
                <template v-slot:title>
                  <strong class="text-h6">
                    {{ item.raw.username }}
                  </strong>
                </template>
              </v-list-item>
              <v-table density="compact" class="text-caption">
                <tbody>
                  <tr align="right">
                    <th width="20%">{{ $t("resources.failedlogins.fields.attemptedAt") }}:</th>
                    <td>{{ item.raw.attemptedAt }}</td>
                  </tr>
                  <tr align="right">
                    <th>{{ $t("resources.failedlogins.fields.ip") }}:</th>
                    <td>{{ item.raw.ip }}</td>
                  </tr>
                  <tr align="right">
                    <th>{{ $t("resources.failedlogins.fields.userAgent") }}:</th>
                    <td>{{ item.raw.userAgent }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>              
      </template>

      <template v-slot:bottom.pagination.header="{ page, pageCount }">
        <v-footer class="text-body-3 mt-6 mb-2" style="padding:0;">
          <div>{{ $t("dataiterator.displaying_page", {page, pageCount}) }}</div>
        </v-footer>
      </template>

      <template v-slot:no-data>
        <div class="va-table">
          <v-table density="compact">
            <tbody>
              <tr>
                <td align="center">{{ $t("va.datatable.nodata")}}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </template>
    </va-data-iterator-server>
  </va-list>
</div>
</template>`;

    this.script = `\<script\>
export default {
  props: ["resource", "title"],
  data() {
    return {
      filters: [
        {
          source: "username",
          type: "select",
          attributes: {
            reference: "failedloginusernames",
            multiple: true,  
          }
        },
        {
          source: "ip",
          type: "select",
          attributes: {
            reference: "failedloginips",
            multiple: true,  
          }
        },
        {
          source: "attemptedAtStart",
          type: "date",
        },
        {
          source: "attemptedAtEnd",
          type: "date",
        }
      ],
      fields: [
        {
          source: "username",
          type: "text",
          sortable: true,
          width: "10%"
        },
        {
          source: "attemptedAt",
          type: "date",
          sortable: true,
          width: "10%"
        },
        {
          source: "userAgent",
          sortable: true,
          width: "10%"
        },
        {
          source: "ip",
          sortable: true,
          width: "10%"
        },
      ],
    };
  },
  methods: {
    isOdd(number) {
      return (number & 1) === 1;
    }
  }
};
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\FailedLogins;

use App\\Model\\FailedLoginModel;
use Laminas\\Diactoros\\Response\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\ttp\\Server\\RequestHandlerInterface;

class FindAllByPagingHandler implements RequestHandlerInterface
{
    public function __construct(FailedLoginModel $failedLoginModel)
    {
        $this->failedLoginModel = $failedLoginModel;
    }

    /**
     * @OA\Get(
     *   path="/failedlogins/findAllByPaging",
     *   tags={"Failed Logins"},
     *   summary="Find all failed logins by pagination",
     *   operationId="failedlogins_findAllByPaging",
     *
     *   @OA\Parameter(
     *       name="q",
     *       in="query",
     *       required=false,
     *       description="Search string",
     *       @OA\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\Parameter(
     *       name="_page",
     *       in="query",
     *       required=false,
     *       description="Page number",
     *       @OA\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\Parameter(
     *       name="_perPage",
     *       in="query",
     *       required=false,
     *       description="Per page",
     *       @OA\Schema(
     *           type="integer",
     *       ),
     *   ),
     *   @OA\Parameter(
     *       name="_sort",
     *       in="query",
     *       required=false,
     *       description="Order items",
     *       @OA\Schema(
     *           type="array",
     *           @OA\Items()
     *       ),
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Successful operation",
     *     @OA\JsonContent(ref="#/components/schemas/FailedLoginsFindAllByPaging"),
     *   ),
     *   @OA\Response(
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
        $paginator = $this->failedLoginModel->findAllByPaging($get);

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
use Laminas\\Db\\Sql\\Sql;
use Oloma\\Php\\ColumnFiltersInterface;
use Laminas\\Db\\Sql\\Expression;
use Laminas\\Paginator\\Paginator;
use Laminas\\Paginator\\Adapter\\DbSelect;
use Laminas\\Db\\Adapter\\AdapterInterface;
use Laminas\\Db\\TableGateway\\TableGatewayInterface;
use Psr\\SimpleCache\\CacheInterface as SimpleCacheInterface;

class FailedLoginModel
{
    private $conn;
    private $predis;
    private $adapter;
    private $message;
    private $failedLogins;
    private $columnFilters;

    public function __construct(
        TableGatewayInterface $failedLogins,
        SimpleCacheInterface $simpleCache,
        ColumnFiltersInterface $columnFilters
    ) {
        $this->adapter = $failedLogins->getAdapter();
        $this->failedLogins = $failedLogins;
        $this->simpleCache = $simpleCache;
        $this->columnFilters = $columnFilters;
        $this->conn = $this->adapter->getDriver()->getConnection();
    }

    public function checkUsername(string $username)
    {        
        $key = CACHE_ROOT_KEY.Self::class.':'.__FUNCTION__.':'.$username;
        if ($banMessage = $this->simpleCache->get($key)) {
            $this->setMessage($banMessage);
            return true;
        }
        // find number of daily failed attempts of username 
        // 
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('failedLogins');
        $select->where(
            [
                'username' => $username,
                'attemptedAt' => date("Y-m-d"),
            ]
        );
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        $numberOfDailyAttempts = count($results);
        $statement->getResource()->closeCursor();

        $this->blockUsername($key, $numberOfDailyAttempts);
    }

    public function createAttempt(array $data)
    {
        // first check username exists in the database
        // 
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->from('users');
        $select->where(
            [
                'email' => $data['username'],
            ]
        );
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        $statement->getResource()->closeCursor();

        if (count($results) > 0) { // if it's exists insert attempt data
            try {
                $this->conn->beginTransaction();
                $this->failedLogins->insert($data);
                $this->conn->commit();
            } catch (Exception $e) {
                $this->conn->rollback();
                throw $e;
            }
        }
    }

    /**
     * Delete attempt events:
     *
     * 1- When user do the successful login
     * 2- When the user clicks on the reset link in the email we send
     * 
     * @param  string $username identity
     * @return void
     */
    public function deleteAttempts(string $username)
    {
        try {
            $this->conn->beginTransaction();
            $this->failedLogins->delete(['username' => $username]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    private function blockUsername(string $key, $count = 0)
    {
        if ($count > 6) { // block user for 30 seconds
            $this->simpleCache->set($key, 'BLOCK_30_SECONDS', 30);
        }
        if ($count > 9) { // block user for 60 seconds
            $this->simpleCache->set($key, 'BLOCK_60_SECONDS', 60);
        }
        if ($count > 12) { // block user for 300 seconds
            $this->simpleCache->set($key, 'BLOCK_300_SECONDS', 300);
        }
        if ($count > 16) { // block user for 1800 seconds (30 minutes)
            $this->simpleCache->set($key, 'BLOCK_1800_SECONDS', 1800);
        }
        if ($count > 20) { // block user for 86400 seconds (1 day)
            $this->simpleCache->set($key, 'BLOCK_86400_SECONDS', 86400);
        }
    }

    public function setMessage(string $message)
    {
        $this->message = $message;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function findAll()
    {
        $platform = $this->adapter->getPlatform();
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            'id' => 'loginId',
            'username',
            'attemptedAt',
            'userAgent',
            'ip',
        ]);
        $select->from(['f' => 'failedLogins']);
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
                'id' => 'loginId',
                'username',
                'attemptedAt',
                'userAgent',
                'ip',
            ]
        );
        $this->columnFilters->setLikeColumns(
            [
                'username',
                'userAgent',
                'ip',
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
        // date filters
        // 
        $this->columnFilters->setDateFilter('attemptedAt');

        if ($this->columnFilters->orderDataIsNotEmpty()) {
            foreach ($this->columnFilters->getOrderData() as $order) {
                $select->order(new Expression($order));
            }
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

    public function findAllUsernames()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'username',
                'name' => 'username'
            ]
        );
        $select->from('failedLogins');
        $select->group(['username']);
        $select->order(['username ASC']);

        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        return $results;
    }

    public function findAllIpAdresses()
    {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns(
            [
                'id' => 'ip',
                'name' => 'ip'
            ]
        );
        $select->from('failedLogins');
        $select->group(['ip']);
        $select->order(['ip ASC']);
        
        $statement = $sql->prepareStatementForSqlObject($select);
        $resultSet = $statement->execute();
        $results = iterator_to_array($resultSet);
        return $results;
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
      //
      //----------------------
      //
      filters: [
        {
          source: "username",
          type: "select",
          attributes: {
            reference: "failedloginusernames",
            multiple: true,  
          }
        },
        {
          source: "ip",
          type: "select",
          attributes: {
            reference: "failedloginips",
            multiple: true,  
          }
        },
        {
          source: "attemptedAtStart",
          type: "date",
        },
        {
          source: "attemptedAtEnd",
          type: "date",
        }
      ],
      fields: [
        {
          source: "username",
          type: "text",
          sortable: true,
          width: "10%"
        },
        {
          source: "attemptedAt",
          type: "date",
          sortable: true,
          width: "10%"
        },
        {
          source: "userAgent",
          sortable: true,
          width: "10%"
        },
        {
          source: "ip",
          sortable: true,
          width: "10%"
        },
      ],
    };
  },
  methods: {
    isOdd(number) {
      return (number & 1) === 1;
    }
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
