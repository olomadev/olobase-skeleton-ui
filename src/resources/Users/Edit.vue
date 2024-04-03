<template>
  <va-edit-layout :title="title">
    <users-form :id="id" :item="item"></users-form>
  </va-edit-layout>

  <v-tabs
    class="mt-3"
    v-model="tab"
    variant="outlined"
    bg-color="transparent"
    color="primary"
    align-tabs="left"
  >
    <v-tab value="1">Edit</v-tab>
    <v-tab value="2">Form</v-tab>
    <v-tab value="3">Handler</v-tab>
    <v-tab value="4">Model</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item eager value="1">
      <v-card>
        <v-card-text>
          <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
          <pre><code class="language-html">{{ edit }}</code></pre>
        </v-card-text>
      </v-card>
    </v-window-item>

    <v-window-item eager value="2">
      <v-card>
        <v-card-text>
          <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
          <pre><code class="language-javascript">{{ form }}</code></pre>
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
import Clipboard from "olobase-admin/src/mixins/clipboard"

export default {
  props: ["id", "title", "item"],
  mixins: [Clipboard],
  inheritAttrs: false, // https://stackoverflow.com/questions/72246939/extraneous-non-props-attributes-title-were-passed-to-component-but-could-not-b
  created() {
this.edit = `<template>
  <va-edit-layout :title="title">
    <users-form :id="id" :item="item"></users-form>
  </va-edit-layout>
</template>`;
    this.form = `<template>
  <va-form :id="id" :item="item" v-model="model">
    <v-row>
      <v-col sm="3">
        <va-avatar-input
          source="avatar.image"
        >
        </va-avatar-input>

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
        avatar: {
          image: null
        }
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

namespace App\\Handler\\Users;

use App\\Model\\UserModel;
use App\\Schema\\Users\\UserSave;
use App\\Filter\\Users\\SaveFilter;
use Oloma\\Php\\DataManagerInterface;
use Oloma\\Php\\Error\\ErrorWrapperInterface as Error;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class UpdateHandler implements RequestHandlerInterface
{
    public function __construct(
        private UserModel $userModel,        
        private DataManagerInterface $dataManager,
        private SaveFilter $filter,
        private Error $error,
    ) 
    {
        $this->userModel = $userModel;
        $this->dataManager = $dataManager;
        $this->error = $error;
        $this->filter = $filter;
    }

    /**
     * @OA\\Put(
     *   path="/users/update/{userId}",
     *   tags={"Users"},
     *   summary="Update user",
     *   operationId="users_update",
     *
     *   @OA\\Parameter(
     *       name="userId",
     *       in="path",
     *       required=true,
     *       @OA\\Schema(
     *           type="string",
     *       ),
     *   ),
     *   @OA\\RequestBody(
     *     description="Update user",
     *     @OA\\JsonContent(ref="#/components/schemas/UserSave"),
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
        $post = $request->getParsedBody();
        $this->filter->setInputData($post);
        $data = array();
        $response = array();
        if ($this->filter->isValid()) {
            $this->dataManager->setInputFilter($this->filter);
            $data = $this->dataManager->getSaveData(UserSave::class, 'users');
            $this->userModel->update($data);
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

    public function create(array $data)
    {
        $userId = $data['id'];
        $data['users']['userId'] = $userId;
        try {
            $this->conn->beginTransaction();
            $this->users->insert($data['users']);
            if (! empty($data['userRoles'])) {
                foreach ($data['userRoles'] as $val) {
                    $this->userRoles->insert(['userId' => $userId, 'roleId' => $val['id']]);
                }
            }
            if (! empty($data['avatarImage'])) {
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
        $userId = $data['id'];
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
            if (! empty($data['avatarImage'])) {
                $this->userAvatars->insert(['userId' => $userId, 'avatarImage' => $data['avatarImage']]);
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

}`;

  },
  data() {
    return {
      tab: null,
      form: null,
      edit: null,
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
};
</script>
