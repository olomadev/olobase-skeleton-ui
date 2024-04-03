<template>
  <va-edit-layout :title="title">
    <roles-form :id="id" :item="item"></roles-form>
  </va-edit-layout>

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
</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard";

export default {
  props: ["id", "title", "item"],
  mixins: [Clipboard],
  inheritAttrs: false,
  data() {
    return {
      tab: null,
      template: null,
      script: null,
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
  },
  created() {
    this.template = `\<template\>
  <v-card flat>
    <v-card-text>
      <va-form 
        :id="id" 
        :item="item" 
        v-model="model"
      >
        <v-row no-gutters>
          <v-col sm="3">
            <va-text-input
              source="roleKey"
              :error-messages="roleKeyErrors"
            ></va-text-input>

            <va-text-input
              source="roleName"
              :error-messages="roleNameErrors"
            ></va-text-input>

            <va-text-input
              source="roleLevel"
              :error-messages="roleLevelErrors"
            ></va-text-input>
          </v-col>
        </v-row>
        <h2 class="h2 mb-4">
          {{ $t("menu.permissions") }}
        </h2>
        <v-row>  
          <v-col cols="6">
            <va-check-list-input
              source="rolePermissions"
              :headers="headers"
              :fields="fields"
              primary-key="permId"
              items-per-page="25"
              :group-header="$t('resources.roles.fields.moduleName')"
              group-by="moduleName"
              init-url="/permissions/findAll"
            >
            </va-check-list-input>
          </v-col>
        </v-row>
        <va-save-button></va-save-button>
      </va-form>
    </v-card-text>
  </v-card>
</template>`;

    this.script = `<script>
import { useVuelidate } from "@vuelidate/core";
import { required, maxLength, numeric } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue'

export default {
  props: ["id", "item"],
  mixins: [utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  data() {
    return {
      rolePermissions: [],
      model: {
        id: null,
        roleKey: null,
        roleName: null,
        roleLevel: null,
        rolePermissions: null,
      },
      fields: [
        { source: "moduleName", label: this.$t("roles.resource") },
        { source: "action", label: this.$t("roles.action") },
        { source: "route", label: this.$t("roles.route") },
        { source: "method", label: this.$t("roles.method") },
      ],
    };
  },
  validations: {
    model: {
      roleKey: {
        required,
        maxLength: maxLength(60),
      },
      roleName: {
        required,
        maxLength: maxLength(100),
      },
      roleLevel: {
        required,
        numeric,
        maxLength: maxLength(2),
      },
    },
  },
  computed: {
    headers() {
      return [
        {
          title: this.$t("permissions.moduleName"),
          key: "moduleName",
          sortable: false,
        },
        {
          title: this.$t("permissions.action"),
          key: "action",
          sortable: false,
        },
        {
          title: this.$t("permissions.route"),
          key: "route",
          sortable: false,
        },
        {
          title: this.$t("permissions.method"),
          key: "method",
          sortable: false,
        },
      ];
    },
    roleKeyErrors() {
      const errors = [];
      const field = "roleKey";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "60" }));
      return errors;
    },
    roleNameErrors() {
      const errors = [];
      const field = "roleName";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "100" }));
      return errors;
    },
    roleLevelErrors() {
      const errors = [];
      const field = "roleLevel";
      if (!this.v$["model"][field].$dirty) return errors;
      this.v$["model"][field].required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$["model"][field].numeric.$invalid &&
        errors.push(this.$t("v.number.numeric"));
      this.v$["model"][field].maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "2" }));
      return errors;
    },
  },
  created() {
    this.model.id = this.generateId(this);
  }
}
\</script\>`;

    this.handler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Roles;

use App\\Model\\RoleModel;
use App\\Schema\\Roles\\RoleSave;
use App\\Filter\\Roles\\SaveFilter;
use Oloma\\Php\\DataManagerInterface;
use Oloma\\Php\\Error\\ErrorWrapperInterface as Error;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class UpdateHandler implements RequestHandlerInterface
{
    public function __construct(
        private RoleModel $roleModel,
        private DataManagerInterface $dataManager,
        private SaveFilter $filter,
        private Error $error,
    ) 
    {
        $this->roleModel = $roleModel;
        $this->dataManager = $dataManager;
        $this->error = $error;
        $this->filter = $filter;
    }
    
    /**
     * @OA\\Put(
     *   path="/roles/update/{roleId}",
     *   tags={"Roles"},
     *   summary="Update role",
     *   operationId="roles_update",
     *
     *   @OA\\Parameter(
     *       name="roleId",
     *       in="path",
     *       required=true,
     *       @OA\\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\\RequestBody(
     *     description="Update role",
     *     @OA\\JsonContent(ref="#/components/schemas/RoleSave"),
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
        $roleId = $request->getAttribute("roleId");
        $post = $request->getParsedBody();
        $post['id'] = $roleId;

        $this->filter->setInputData($post);
        $data = array();
        $response = array();
        if ($this->filter->isValid()) {
            $this->dataManager->setInputFilter($this->filter);
            $data = $this->dataManager->getSaveData(RoleSave::class, 'roles');
            $this->roleModel->update($data);
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

    public function create(array $data)
    {
        try {
            $this->conn->beginTransaction();
            $roleId = $data['roleId'];
            $data['roles']['roleId'] = $data['roleId'];
            $this->roles->insert($data['roles']);

            $this->rolePermissions->delete(['roleId' => $roleId]);
            if (! empty($data['rolePermissions'])) {
                foreach ($data['rolePermissions'] as $val) {
                    $val['roleId'] = $roleId;
                    $this->rolePermissions->insert($val);
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
        try {
            $this->conn->beginTransaction();
            $roleId = $data['roleId'];
            $this->roles->update($data['roles'], ['roleId' => $roleId]);
            $this->rolePermissions->delete(['roleId' => $roleId]);
            if (! empty($data['rolePermissions'])) {
                foreach ($data['rolePermissions'] as $val) {
                    $val['roleId'] = $roleId;
                    $this->rolePermissions->insert($val);
                }
            }
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

}`;

  }
};
</script>
