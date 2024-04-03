<template>
  <div>  
    <va-create-layout :title="title">
      <roles-form :item="item"></roles-form>
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
            <pre><code class="language-js">{{ handler }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="4">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-js">{{ model }}</code></pre>
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
  <roles-form :item="item"></roles-form>
</va-create-layout>
</template>

\<script\>
  export default {
    props: ["title", "item"],
  };
\</script\>`;
    this.form = `<template>
<va-form :id="id" :item="item" v-model="model">
  <v-row>
    <v-col sm="3">
      <va-avatar-file-input
        source="avatarImage"
      >
      </va-avatar-file-input>

      <va-text-input
        source="firstname"
        :error-messages="firstnameErrors"
      ></va-text-input>

      <va-text-input
        source="lastname"
        :error-messages="lastnameErrors"
      ></va-text-input>

      <va-text-input
        source="email"
        :error-messages="emailErrors"
      ></va-text-input>

      <va-text-input
        source="password"
        :label="$t('users.password')"
        :error-messages="passwordErrors"
      ></va-text-input>
      
      <va-select-input
        source="userRoles"
        reference="roles"
        :error-messages="userRoleErrors"
        multiple
      ></va-select-input>

      <va-boolean-input
        source="active"
        hide-details
        class="mb-2"
      ></va-boolean-input>

      <va-boolean-input 
        source="emailActivation"
        class="mb-1"
      >  
      </va-boolean-input>
    </v-col>
    </v-row>
  <va-save-button></va-save-button>
</va-form>
</template>

\<script\>
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import utils from "olobase-admin/src/mixins/utils";
import { provide } from 'vue';

export default {
  props: ["id", "item"],
  mixins: [utils],
  setup() {
    let vuelidate = useVuelidate();
    provide('v$', vuelidate)
    return { v$: vuelidate }
  },
  validations: {
    model: {
      firstname: {
        required,
        minLength: minLength(2),
      },
      lastname: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(120),
      },
      email: {
        required,
        email
      },
      userRoles: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(16),
      },
    }
  },
  data() {
    return {
      model: {
        id: null,
        firstname: null,
        lastname: null,
        email: null,
        password: null,
        active: null,
        emailActivation: null,
        userRoles: null,
        avatarImage: null, // data:image/png;base64,
      },
    };
  },
  created() {
    this.model.id = this.generateId(this);
    if (!this.id) {
      this.model.password = this.generatePassword(8);
    }
  },
  computed: {
    firstnameErrors() {
      const errors = [];
      if (!this.v$['model'].firstname.$dirty) return errors;
      this.v$['model'].firstname.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].firstname.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "2" }));
      return errors;
    },
    lastnameErrors() {
      const errors = [];
      if (!this.v$['model'].lastname.$dirty) return errors;
      this.v$['model'].lastname.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      this.v$['model'].lastname.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "2" }));
      this.v$['model'].lastname.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "120" }));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.v$['model'].email.$dirty) return errors;
      this.v$['model'].email.required.$invalid &&
        errors.push(this.$t("v.email.required"));
      this.v$["model"].email.email.$invalid && 
        errors.push(this.$t("v.email.invalid"));
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.v$["model"].password.$dirty) return errors;
      this.v$["model"].password.minLength.$invalid &&
        errors.push(this.$t("v.string.minLength", { min: "8" }));
      this.v$["model"].password.maxLength.$invalid &&
        errors.push(this.$t("v.string.maxLength", { max: "16" }));
      return errors;
    },
    userRoleErrors() {
      const errors = [];
      if (!this.v$["model"].userRoles.$dirty) return errors;
      this.v$["model"].userRoles.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
  },

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

class CreateHandler implements RequestHandlerInterface
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
     * @OA\\Post(
     *   path="/roles/create",
     *   tags={"Roles"},
     *   summary="Create a new role",
     *   operationId="roles_create",
     *
     *   @OA\\RequestBody(
     *     description="Create a new role",
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
        $this->filter->setInputData($request->getParsedBody());
        $data = array();
        $response = array();
        if ($this->filter->isValid()) {
            $this->dataManager->setInputFilter($this->filter);
            $data = $this->dataManager->getSaveData(RoleSave::class, 'roles');
            $this->roleModel->create($data);
        } else {
            return new JsonResponse($this->error->getMessages($this->filter), 400);
        }
        return new JsonResponse($response);     
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

    public function delete(string $roleId)
    {
        try {
            $this->conn->beginTransaction();
            $this->roles->delete(['roleId' => $roleId]);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
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

