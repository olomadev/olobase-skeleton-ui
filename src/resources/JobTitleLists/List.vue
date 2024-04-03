<template>
  <div>
    <va-list 
      disable-create
      :filters="filters"
      :fields="fields"
      :items-per-page="50"
    >
 		  <va-data-table-server
        row-edit
        row-create
        disable-edit
        disable-create
        disable-clone
        disable-show
        :disable-empty-data-row-create="true"
      >
	      <template v-slot:row.actions="{ item }">
				  <v-btn
				    :item="item"
				    :label="$t('va.actions.show')"
				    :color="'blue'"
				    variant="text"
				    exact
				    @click.stop="getRoute(item)"
				  >
				  	<v-icon size="small">mdi-eye</v-icon>
				  </v-btn>
        </template>
      </va-data-table-server>
  </va-list>

	 <v-card
	    class="mx-auto mt-2"
	    variant="flat"
	  >
    	<template v-slot:title>
        {{ $t("resources.jobtitles.createNewList") }}
      </template>
	    <v-card-text>
	      <div>
	        {{ $t("resources.jobtitles.importDescription") }}
	      </div>
	    </v-card-text>
	    <v-card-actions>
		    <v-btn 
		    	color="primary"
		    	@click="downloadEmptyXls()">
					{{ $t("resources.jobtitles.downloadXls") }}
		    </v-btn>
	    </v-card-actions>
	  </v-card>


    <v-card
      variant="flat"
      class="mt-2"
    >
      <v-card-text>
        <v-row class="mt-2">
          <v-col sm="2">
            <va-select-input
              v-model="yearId"
              reference="years"
              variant="outlined"
              clearable
              :disabled="loadingStatus"
              :error-messages="yearIdErrors"
            ></va-select-input>        
          </v-col>
          <v-col sm="2">
            <va-text-input
              v-model="listName"
              variant="outlined"
              clearable
              :disabled="loadingStatus"
              :error-messages="listNameErrors"
            ></va-text-input>        
          </v-col>
          <v-col sm="8">
            <v-btn
              v-if="loadingStatus"
              color="primary"
              class="mr-2"
              style="margin-top:2px;"
              @click="cancelSaveList()"
              variant="outlined"
            >
              {{ $t("va.actions.cancel") }}
            </v-btn>
            <v-btn 
              :loading="loadingStatus"
              color="primary"
              style="margin-top:2px;"
              variant="outlined" 
              @click="saveList()">
              {{ $t("resources.jobtitles.saveList") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      variant="flat"
      class="mt-2"
      v-if="!loadingStatus"
    >
      <v-card-text>
      <h5 class="h4 mb-3">Sheet Input Component</h5>
      <va-sheet-input
        icon="mdi-file-excel"
        items-per-page="100"
        upload-url="/jobtitlelists/upload"
        preview-url="/jobtitlelists/preview"
        remove-url="/jobtitlelists/remove"
        @importedItems="onItems"
      >
      </va-sheet-input>
      </v-card-text>
    </v-card>

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
      <v-tab value="3">Upload Handler</v-tab>
      <v-tab value="4">Events Handler</v-tab>
      <v-tab value="5">Cmd</v-tab>
      <v-tab value="6">Listener</v-tab>
      <v-tab value="7">Parser</v-tab>
      <v-tab value="8">Importer</v-tab>
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
            <pre><code class="language-php">{{ uploadHandler }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="4">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ eventsHandler }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="5">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-bash">{{ cmd }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="6">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ listener }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="7">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ parser }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item eager value="8">
        <v-card>
          <v-card-text>
            <v-btn class="btn-copy">{{ $t("va.actions.copy") }}</v-btn>
            <pre><code class="language-php">{{ importer }}</code></pre>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
	</div>
</template>

<script>
import Clipboard from "olobase-admin/src/mixins/clipboard"
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { provide } from 'vue';
import { mapActions } from "vuex"

export default {
  props: [],
  mixins: [Clipboard],
  inject: ['admin'],
  created() {
    this.template = `\<template\>
<va-list 
    disable-create
    :filters="filters"
    :fields="fields"
    :items-per-page="50"
  >
    <va-data-table-server
      row-edit
      row-create
      disable-edit
      disable-create
      disable-clone
      disable-show
      :disable-empty-data-row-create="true"
    >
      <template v-slot:row.actions="{ item }">
        <v-btn
          :item="item"
          :label="$t('va.actions.show')"
          :color="'blue'"
          variant="text"
          exact
          @click.stop="getRoute(item)"
        >
          <v-icon size="small">mdi-eye</v-icon>
        </v-btn>
      </template>
    </va-data-table-server>
</va-list>

<v-card
  class="mx-auto mt-2"
  variant="outlined"
>
  <template v-slot:title>
    {{ $t("jobtitles.createNewList") }}
  </template>
  <v-card-text>
    <div>
      {{ $t("jobtitles.importDescription") }}
    </div>
  </v-card-text>
  <v-card-actions>
    <v-btn 
      color="primary"
      @click="downloadEmptyXls()">
      {{ $t("jobtitles.downloadXls") }}
    </v-btn>
  </v-card-actions>
</v-card>

<v-row class="mt-2">
  <v-col sm="2">
    <va-select-input
      :label="$t('jobtitles.yearId')"
      v-model="yearId"
      reference="years"
      variant="outlined"
      clearable
      :disabled="loadingStatus"
      :error-messages="yearIdErrors"
    ></va-select-input>        
  </v-col>
  <v-col sm="2">
    <va-text-input
      :label="$t('jobtitles.newListName')"
      v-model="listName"
      variant="outlined"
      clearable
      :disabled="loadingStatus"
      :error-messages="listNameErrors"
    ></va-text-input>        
  </v-col>
  <v-col sm="8">
    <v-btn
      v-if="loadingStatus"
      color="primary"
      class="mr-2"
      @click="cancelSaveList()"
      variant="outlined"
    >
      {{ $t("va.actions.cancel") }}
    </v-btn>
    <v-btn 
      :loading="loadingStatus"
      color="primary"
      variant="outlined" 
      @click="saveList()">
      {{ $t("jobtitles.saveList") }}
    </v-btn>
  </v-col>
</v-row>

<div class="mt-2" v-if="!loadingStatus">
  <h5 class="h4 mb-3">Sheet Input Component</h5>
  <va-sheet-input
    icon="mdi-file-excel"
    items-per-page="100"
    upload-url="/jobtitlelists/upload"
    preview-url="/jobtitlelists/preview"
    remove-url="/jobtitlelists/remove"
    @importedItems="onItems"
  >
  </va-sheet-input>
</div>
\</template\>`;

    this.script = `\<script\>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { provide } from 'vue';
import { mapActions } from "vuex"

export default {
  props: [],
  inject: ['admin'],
  setup() {
    provide('v$', useVuelidate() )
    return { v$: useVuelidate() }
  },
  provide() {
    return {
      validations: {
        form: {
          listName: {
            required
          },
        }
      },
      errors: {
        listNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].listName.$dirty) return errors;
          v$['form'].listName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    };
  },
  validations() {
    return {
      yearId: {
        required
      },   
      listName: {
        required
      }
    }
  },
  data() {
    return {
      cancel: false,
      status: false,
      loadingStatus: false,
      listId: null,
      listName: null,
      companyId: null,
      yearId: new Date().getFullYear(),
      loading: false,
      loadingList: false,
      importData: [],
      validationError: null,
      filters: [
        {
          source: "yearId",
          type: "selectfilter",
          attributes: {
            optionText: "name",
            multiple: true,
            reference: "years",
          },
          label: this.$t("jobtitles.yearId"),
        },
      ],
      fields: [
        {
          source: "yearId",
          type: "select",
          attributes: {
            reference: "years",
          },
          sortable: true,
        },
        {
          source: "listName",
          sortable: true,
        },
      ],
    }
  },
  computed: {
    yearIdErrors() {
      const errors = [];
      if (!this.v$.yearId.$dirty) return errors;
      this.v$.yearId.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    listNameErrors() {
      const errors = [];
      if (!this.v$.listName.$dirty) return errors;
      this.v$.listName.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    }
  },
  methods: {
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
    onItems(items, vError) {
      this.importData = items;
      if (items.length == 0) {
        this.validationError = null
      } else {
        this.validationError = vError
      }
    },
    getRoute(item) {
      let filter = null
      if (item.listId) {
        filter = '{ "yearId" : ["'+ item.yearId.id + '"] , "listId" : ["' + item.listId + '"] }';
      }
      this.$router.push({ name: "jobtitles_list", query: { filter: filter } });
    },
    async importStatus() {
      let Self = this;
      this.loadingStatus = true;
      try {
        //
        // get status with EventSource
        // 
        let user = await this.checkAuth();
        if (user) {
          const user = JSON.parse(userData);
          const apiUrl = import.meta.env.VITE_API_URL;
          this.source = new EventSource(apiUrl + '/stream/events?userId=' + user.id + '&route=list');
          this.source.onmessage = function(e) {
            if (e.data) {
              let data = JSON.parse(e.data);
              if (data.status == 1 || data.status == true) {
                Self.source.close(); // lets close it when the process is done !
                Self.status = false;
                Self.loadingStatus = false
                Self.importData = []; // reset import data
                Self.admin.http({ method: "DELETE", url: "/jobtitlelists/reset" }); // reset all status
                Self.$store.dispatch("api/refresh", 'jobtitlelists');
              }
            }
          };
        }
      } catch (e) {
        if (e["response"]
          && e["response"]["status"]
          && e.response.status === 400) {
          this.admin.message("error", e.response.data.data.error);
        }
      }
    },
    saveList() {
      this.cancel = false;
      this.v$.yearId.$touch();
      this.v$.listName.$touch();
      if (this.v$.listName.$invalid || this.v$.yearId.$invalid) {
        return false;
      }
      if (this.validationError) {
        this.$store.commit("messages/show", { type: 'error', message: this.$t("employees.fixErrorsMessage") });
      } else {
        if (this.importData.length == 0) {
          this.$store.commit("messages/show", { type: 'error', message: this.$t("employees.importDataMessage") });
        } else {
          // save imported data
          // 
          this.admin.http({ method: "POST", url: "/jobtitlelists/import", data: { yearId: this.yearId, listName: this.listName } });
          // check status every 1 seconds
          // 
          this.importStatus();
        }
      }
    },
    cancelSaveList() {
      this.cancel = true;
      this.loadingStatus = false;
      this.importData = []; // reset import data
      this.admin.http({ method: "DELETE", url: "/jobtitlelists/reset" }); // reset all status
      this.$store.dispatch("api/refresh", 'jobtitlelists');
    },
    downloadEmptyXls() {
      window.location.href = "/src/assets/JobTitles.xlsx"
    }
  },
}
\</script\>`;

  this.uploadHandler = `<?php
declare(strict_types=1);

namespace App\\Handler\\JobTitleLists;

use App\\Filter\\JobTitleLists\\FileUploadFilter;
use Predis\\ClientInterface as Predis;
use Oloma\\Php\\DataManagerInterface;
use Mezzio\\Authentication\\UserInterface;
use Oloma\\Php\\Error\\ErrorWrapperInterface as Error;
use Laminas\\Diactoros\\Response\\JsonResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;

class UploadHandler implements RequestHandlerInterface
{
    public function __construct(
        Predis $predis,
        FileUploadFilter $filter,
        Error $error
    )
    {
        $this->filter = $filter;
        $this->predis = $predis;
        $this->error = $error;
    }
    
     /**
     * @OA\\Post(
     *   path="/jobtitlelists/upload",
     *   tags={"JobTitle Lists"},
     *   summary="Upload excel file",
     *   operationId="jobTitleLists_upload",
     *
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
        $this->filter->setInputData($_FILES);
        if ($this->filter->isValid()) {
            $tmpFilename = createGuid();
            $user = $request->getAttribute(UserInterface::class);
            $fileKey = CACHE_TMP_FILE_KEY.$user->getId();

            // Handle Psr7 upload with Laminas Diactoros
            $request = $request->getUploadedFiles();
            $file = $request['file'];
            $code = $file->getError();

            if ($code == UPLOAD_ERR_OK) {
                // move file to temp directory
                //
                $ext = strtolower(pathinfo($file->getClientFilename(), PATHINFO_EXTENSION));
                $file->moveTo(PROJECT_ROOT."/data/tmp/".$tmpFilename.".".$ext);
                // write temp file meta data to cache
                // 
                $data = [
                    'userId'   => $user->getId(),
                    'fileId'   => $tmpFilename,
                    'fileExt'  => $ext,
                    'fileKey'  => $fileKey,
                    'fileName' => $file->getClientFilename(),
                    'fileType' => $file->getClientMediaType(),
                    'fileSize' => $file->getSize(),
                    'status'   => false,
                    'data'     => null,
                    'error'    => null,
                    'env'      => getenv('APP_ENV'),
                    'locale'   => LANG_ID,
                ];
                // send to queue
                // https://www.vultr.com/docs/implement-redis-queue-and-worker-with-php-on-ubuntu-20-04/
                // 
                $this->predis->rpush("jobtitlelist_parse", json_encode($data));
                $this->predis->expire("jobtitlelist_save", 300);

                return new JsonResponse([], 200); 
            } else {
                return new JsonResponse(
                    [
                        'data' => ['error' => $this->error->getUploadError($code)]
                    ],
                    400
                );
            }
        } else {
            return new JsonResponse($this->error->getMessages($this->filter), 400);
        }
        return new JsonResponse([], 200); 
    }
}`;

  this.eventsHandler = `<?php
declare(strict_types=1);

namespace App\\Handler\\Common\\Stream;

use Laminas\\Diactoros\\Response\\TextResponse;
use Psr\\Http\\Message\\ResponseInterface;
use Psr\\Http\\Message\\ServerRequestInterface;
use Psr\\Http\\Server\\RequestHandlerInterface;
use Psr\\SimpleCache\\CacheInterface as SimpleCacheInterface;

/**
 * An "EventSource" instance opens a persistent connection to an HTTP server, 
 * which sends events in text/event-stream format. 
 * The connection remains open until closed by calling EventSource.close().
 * 
 * https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
class EventsHandler implements RequestHandlerInterface
{
    public function __construct(SimpleCacheInterface $simpleCache)
    {
        $this->simpleCache = $simpleCache;
    }

    /**
     * @OA\\Get(
     *   path="/stream/events",
     *   tags={"Common"},
     *   summary="Server-Sent Events",
     *   operationId="stream_events",
     *   
     *   @OA\\Response(
     *     response=200,
     *     description="Successful operation"
     *   ),
     *)
     **/
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // Which modules use event stream
        // 
        // 1 - Job title lists
        // 2 - x ..

        $get = $request->getQueryParams();
        $error = "";
        $status = 0;
        $progress = 0;
        if (empty($get['userId'])) {
            $error = "User id cannot be empty";
        }
        if (empty($get['route'])) {
            $error = "Event route cannot be empty";
        }
        $route = trim($get['route']);
        $userId = trim($get['userId']);
        $time = date('r');
        $serverTime = time();
        $headers = [
            'Content-Type' => ['text/event-stream'],
            'Cache-Control' => ['no-cache'],
        ];
        if (empty($error)) {
            $processData = false;
            switch ($route) {
                case 'upload':
                    $processData = $this->simpleCache->get(CACHE_TMP_FILE_KEY.$userId.'_status');
                    break;
                case 'list':
                    $processData = $this->simpleCache->get(CACHE_TMP_FILE_KEY.$userId.'_status2');
                    break;
            }
            if ($processData && array_key_exists("status", $processData)) {
                $status = $processData['status'];    
            }
        }
        // debug:
        // file_put_contents(PROJECT_ROOT."/data/tmp/error-output.txt", print_r($processData, true), FILE_APPEND | LOCK_EX);

        //
        // encode data
        //
        $data = json_encode(
            [
                "status" => (int)$status,
                "error" => $error,
            ]
        );
        $text = "id: $serverTime\\n";
        $text.= "data: {$data}\\n\\n";

        return new TextResponse($text, 200, $headers);
    }
}`;

  this.cmd = `php redis-listener.php local`;
  this.listener = `<?php
## bin/redis-listener.php
#
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_time_limit(60);  // set a specific time - prevent to server crashes
ini_set('memory_limit', '1024M');

set_error_handler(function($errno, $errstr, $errfile, $errline ){
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
});
$args = $_SERVER['argv'];
putenv("APP_ENV=$args[1]"); // set environment

require dirname(__DIR__)."/vendor/autoload.php";
$container = require dirname(__DIR__).'/config/container.php';

use App\\Utils\\JobTitleListParser;
use App\\Utils\\JobTitleListImporter;
use Predis\\ClientInterface as Predis;
use Psr\\SimpleCache\\CacheInterface as SimpleCacheInterface;
try {
    $predis = $container->get(Predis::class);
    //
    // jobtitle list
    //------------------------------------------------------------
    //
    $job = $predis->lpop('jobtitlelist_parse');
    if (! empty($job)) {
        $data = json_decode($job, true);    
        $jobTitleParser = new JobTitleListParser($container);
        $jobTitleParser->parse($data);
    }
    $job = $predis->lpop('jobtitlelist_save');
    if (! empty($job)) {
        $data = json_decode($job, true);    
        $jobTitleImporter = new JobTitleListImporter($container);
        $jobTitleImporter->import($data);
    }
} catch (Exception $e) {
    if (! empty($data['fileKey'])) { // set error 
        $fileKey = $data['fileKey'];
        $simpleCache = $container->get(SimpleCacheInterface::class);
        $simpleCache->set(
            $fileKey.'_status', 
            ['status' => false, 'error' => $e->getMessage()],
            600
        );
    }
    $errorStr = $e->getMessage()." Error Line: ".$e->getLine();
    echo $errorStr.PHP_EOL;
    file_put_contents(PROJECT_ROOT."/data/tmp/error-output.txt", $errorStr, FILE_APPEND | LOCK_EX);
}`;
  this.parser = `<?php
declare(strict_types=1);

namespace App\\Utils;

use Exception;
use Shuchkin\\SimpleXLSX;
use App\\Model\\CommonModel;
use Laminas\\I18n\\Translator\\TranslatorInterface;
use Psr\\SimpleCache\\CacheInterface as SimpleCacheInterface;

class JobTitleListParser
{
    /**
     * Db table columns
     */
    const COL_COMPANY_ID = 'companyId';

    protected $translator;
    protected $commonModel;
    protected $simpleCache;

    public function __construct($container)
    {
        $this->translator = $container->get(TranslatorInterface::class);
        $this->commonModel = $container->get(CommonModel::class);
        $this->simpleCache = $container->get(SimpleCacheInterface::class);
    }

    public function parse($data)
    {
        $fileKey = "";
        //
        // Array
        // (
        //     [userId]   => "",
        //     [fileId]   => c8911b8f-dd08-5252-d42c-e06e614e7d57
        //     [fileKey]  => 'tmpFile_xxx',
        //     [fileExt]  => 'xls',
        //     [fileName] => JobTitles.xlsx
        //     [fileType] => application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        //     [fileSize] => 4978518
        //     [status]   => false, // parse operation is finished ?
        //     [data]     => null,  // parsed xls array data
        //     [error]    => null,  // has the operation an error ?
        //     [env]      => 'local',
        //     [locale]   => 'en',
        // )        
        if (! empty($data['fileName'])) {
            // set locale
            $this->translator->setLocale($data['locale']);

            $fileKey  = CACHE_TMP_FILE_KEY.$data['userId'];
            $xlsxFile = PROJECT_ROOT."/data/tmp/".$data['fileId'].".xlsx";
            if (file_exists($xlsxFile)) {
                if ($xlsx = SimpleXLSX::parse($xlsxFile)) {
                    $sheetData = $xlsx->rows();
                } else {
                    file_put_contents(
                        PROJECT_ROOT."/data/tmp/error-output.txt", 
                        SimpleXLSX::parseError()." Error Line: ".__LINE__, 
                        FILE_APPEND | LOCK_EX
                    );
                }
            }
        }
        if (! empty($sheetData)) {
            $headers = [];
            $h = 1;
            $headers[0] = [
                "title" => $this->translator->translate("no", "labels"),
                "align" => "start",
                "sortable" => true,
                "key" => "no",
            ];
            foreach ($sheetData[0] as $head => $title) {
                if (! empty($title)) {
                    $headers[$h] = [
                        "title" => $this->translator->translate($title, "labels"),
                        "align" => "start",
                        "sortable" => true,
                        "key" => $title,
                    ];
                    ++$h;
                }
            }
            $data['data'][0] = $headers;
            $headersValidationArray = $sheetData[0];
            $requiredHeaders = [
                'companyId',
                'jobTitleId'
            ];
            unset($sheetData[0]);

            // validate headers
            //
            $arrayIntersect = array_intersect($headersValidationArray, $requiredHeaders);
            if (count($arrayIntersect) != count($requiredHeaders)){
                throw new Exception(
                    $this->translator->translate(
                        "Please make sure the column headings are spelled correctly"
                    )
                );
            }
            $years = $this->commonModel->findYearIds();
            $companyShortNames = $this->commonModel->findCompanyShortNames();
            $i = 1;
            $errorFound = false;
            foreach ($sheetData as $row) {

                array_unshift($row , $i); // add row number

                foreach ($row as $k => $v) {
                    if (empty($headers[$k]['key'])) { // don't store empty keys
                        break;
                    }
                    $headerKey = $headers[$k]['key'];
                    //
                    // Put your validations here !!!
                    // 
                    switch ($headerKey) {
                        case Self::COL_COMPANY_ID:
                            if (empty($v) || ! in_array(trim($v), $companyShortNames)) {
                                $data['data'][$i][$headerKey]['errors'][] = $this->translator->translate(
                                    "No such company is defined in the database"
                                );
                                $errorFound = true;
                            }
                        break;
                    }
                    // write values
                    $data['data'][$i][$headerKey]['value'] = ($headerKey == "no") ? $i : $v;  
                }
                ++$i;
            }
            $statusData = array();
            $statusData['status'] = true;
            $statusData['error'] = null;
            $statusData['validationError'] = $errorFound;

            $this->simpleCache->set($fileKey, $data, 600);
            $this->simpleCache->set($fileKey.'_status', $statusData, 600);
            
        } // end empty sheetdata
    }
}`;
  this.importer = `<?php
declare(strict_types=1);

namespace App\\Utils;

use function createGuid;

use Exception;
use App\\Model\\CommonModel;
use Laminas\\Db\\Adapter\\AdapterInterface;
use Laminas\\Db\\ResultSet\\ResultSet;
use Laminas\\Db\\TableGateway\\TableGateway;
use Laminas\\I18n\\Translator\\TranslatorInterface;
use Psr\\SimpleCache\\CacheInterface as SimpleCacheInterface;

class JobTitleListImporter
{
    protected $conn;
    protected $simpleCache;
    protected $jobTitles;

    public function __construct($container)
    {
        $this->commonModel = $container->get(CommonModel::class);
        $this->simpleCache = $container->get(SimpleCacheInterface::class);

        $this->adapter = $container->get(AdapterInterface::class);
        $this->conn = $this->adapter->getDriver()->getConnection();
        $this->jobTitles = new TableGateway('jobTitles', $this->adapter, null, new ResultSet(ResultSet::TYPE_ARRAY));
        $this->jobTitleList = new TableGateway('jobTitleList', $this->adapter, null, new ResultSet(ResultSet::TYPE_ARRAY));
    }

    public function import($data)
    {
        $fileKey = "";
        if (! empty($data['yearId']) && ! empty($data['listName'])) {
            
            $fileKey = $data['fileKey'];
            $import = $this->simpleCache->get($fileKey);

            if (! empty($import['data'][0])) {
                unset($import['data'][0]); // remove header
                $companies = $this->commonModel->findCompanyShortNamesByKey();

                try {
                    $this->conn->beginTransaction();
                    $insertData = array();
                    $jobTitleListId = createGuid();
                    //
                    // create list data
                    // 
                    $this->jobTitleList->insert(
                        [
                            'jobTitleListId' => $jobTitleListId,
                            'yearId' => $data['yearId'],
                            'listName' => trim($data['listName']),
                        ]
                    );
                    // create job titles
                    //
                    foreach ($import['data'] as $row) {
                        $insertData['jobTitleListId'] = $jobTitleListId;
                        $insertData['companyId'] = Self::getCompanyId($row['companyId']['value'], $companies);
                        $insertData['jobTitleId'] = createGuid();
                        $insertData['jobTitleName'] = trim($row['jobTitleId']['value']);
                        $insertData['createdAt'] = date("Y-m-d H:i:s");
                        $this->jobTitles->insert($insertData);
                    }
                    $this->conn->commit();
                } catch (Exception $e) {
                    $this->conn->rollback();
                    throw $e;
                }
                $this->simpleCache->delete($fileKey);
                $this->simpleCache->delete("jobtitlelist_parse");
                $this->simpleCache->delete("jobtitlelist_save");
                //
                // set status to follow progress
                //
                $this->simpleCache->set($fileKey.'_status2', ['status' => true, 'error' => null], 600);
            }
        }               

    } // end func
    
    public static function getCompanyId($key, $companies)
    {
        if (! empty($companies[$key])) {
            return $companies[$key];
        }
        return null;
    }

} // end class`;

  },
  setup() {
    provide('v$', useVuelidate() )
    return { v$: useVuelidate() }
  },
  provide() {
    return {
      validations: {
        form: {
          listName: {
            required
          },
        }
      },
      errors: {
        listNameErrors: (v$) => {
          const errors = [];
          if (!v$['form'].listName.$dirty) return errors;
          v$['form'].listName.required.$invalid &&
            errors.push(this.$t("v.text.required"));
          return errors;
        },
      }
    };
  },
  validations() {
    return {
      yearId: {
        required
      },   
      listName: {
        required
      }
    }
  },
  data() {
    return {
      tab: null,
      template: null,
      script: null,
      uploadHandler: null,
      streamHandler: null,
      cmd: null,
      listener: null,
      parser: null,
      importer: null,
      //----------------
    	cancel: false,
      status: false,
    	loadingStatus: false,
      listId: null,
      listName: null,
      companyId: null,
      yearId: new Date().getFullYear(),
      loading: false,
      loadingList: false,
      importData: [],
      validationError: null,
      filters: [
        {
          source: "yearId",
          type: "selectfilter",
          attributes: {
            optionText: "name",
            multiple: true,
            reference: "years",
          }
        },
      ],
      fields: [
        {
          source: "yearId",
          type: "select",
          attributes: {
            reference: "years",
          },
          sortable: true,
        },
        {
          source: "listName",
          sortable: true,
        },
      ],
    }
  },
  computed: {
    yearIdErrors() {
      const errors = [];
      if (!this.v$.yearId.$dirty) return errors;
      this.v$.yearId.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    },
    listNameErrors() {
      const errors = [];
      if (!this.v$.listName.$dirty) return errors;
      this.v$.listName.required.$invalid &&
        errors.push(this.$t("v.text.required"));
      return errors;
    }
  },
  methods: {
    ...mapActions({
      checkAuth: "auth/checkAuth",
    }),
  	onItems(items, vError) {
  		this.importData = items;
  		if (items.length == 0) {
  			this.validationError = null
  		} else {
  			this.validationError = vError
  		}
  	},
    getRoute(item) {
    	let filter = null
    	if (item.listId) {
    		filter = '{ "yearId" : ["'+ item.yearId.id + '"] , "listId" : ["' + item.listId + '"] }';
    	}
			this.$router.push({ name: "jobtitles_list", query: { filter: filter } });
    },
    async importStatus() {
    	let Self = this;
      this.loadingStatus = true;
      try {
        //
        // get status with EventSource
        // 
        let user = await this.checkAuth();
        if (user) {
          const apiUrl = import.meta.env.VITE_API_URL;
          this.source = new EventSource(apiUrl + '/stream/events?userId=' + user.id + '&route=list');
          this.source.onmessage = function(e) {
            if (e.data) {
              let data = JSON.parse(e.data);
              if (data.status == 1 || data.status == true) {
                Self.source.close(); // lets close it when the process is done !
                Self.status = false;
                Self.loadingStatus = false
                Self.importData = []; // reset import data
                Self.admin.http({ method: "DELETE", url: "/jobtitlelists/reset" }); // reset all status
                Self.$store.dispatch("api/refresh", 'jobtitlelists');
              }
            }
          };
        }
      } catch (e) {
        if (e["response"]
          && e["response"]["status"]
          && e.response.status === 400) {
          this.admin.message("error", e.response.data.data.error);
        }
      }
    },
  	saveList() {
      this.cancel = false;
      this.v$.yearId.$touch();
      this.v$.listName.$touch();
      if (this.v$.listName.$invalid || this.v$.yearId.$invalid) {
        return false;
      }
      if (this.validationError) {
      	this.$store.commit("messages/show", { type: 'error', message: this.$t("employees.fixErrorsMessage") });
      } else {
      	if (this.importData.length == 0) {
      		this.$store.commit("messages/show", { type: 'error', message: this.$t("employees.importDataMessage") });
      	} else {
      		// save imported data
      		// 
      		this.admin.http({ method: "POST", url: "/jobtitlelists/import", data: { yearId: this.yearId, listName: this.listName } });
					// check status every 1 seconds
					// 
      		this.importStatus();
      	}
      }
  	},
    cancelSaveList() {
      this.cancel = true;
      this.loadingStatus = false;
      this.importData = []; // reset import data
      this.admin.http({ method: "DELETE", url: "/jobtitlelists/reset" }); // reset all status
      this.$store.dispatch("api/refresh", 'jobtitlelists'); // refresh page
    },
  	downloadEmptyXls() {
  		window.location.href = "/src/assets/JobTitles.xlsx"
  	}
  },
  watch: {
    tab(value) {
      if (value > 0) {
        window.Prism = window.Prism || {};
        Prism.manual = true;
        Prism.highlightAll(); // highlight code
      }     
    }
  },

}
</script>

