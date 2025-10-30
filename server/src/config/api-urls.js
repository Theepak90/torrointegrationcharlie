import { DELETE, GET, POST, PUT } from '@lib/data/api-types';

const BASE_API_URL =
  import.meta.env.VITE_API_URL || 'https://torroportal.online';

const DISCOVERY_API_URL = 'http://localhost:8000';

const config = {
  /* ==========================  App setup  ==================================== */

  orgPost: {
    url: `${BASE_API_URL}/api/orgSetting`,
    method: POST,
  },

  /* =============================  User session  ============================= */

  login: {
    url: `${BASE_API_URL}/api/login`,
    method: POST,
  },
  loginPut: {
    url: `${BASE_API_URL}/api/login`,
    method: PUT,
  },
  loginGet: {
    url: `${BASE_API_URL}/api/login`,
    method: GET,
  },

  notifyRead: {
    url: `${BASE_API_URL}/api/systemNotify`,
    method: POST,
  },

  batchUpload: {
    url: `${BASE_API_URL}/api/BatchProcessing`,
    method: POST,
  },

  /*
   ** disabled when using websocket to retrive notifications
  systemNotify: {
    url: `${BASE_API_URL}/api/systemNotify`,
     // url: `/stub/systemNotify.json`,
     method: GET,
   },
  */

  /* =========================== Dashboard  ============================================= */

  filterOptionGet: {
    url: `${BASE_API_URL}/api/getDashboardOptions`,
    method: GET,
  },

  requestDataGet: {
    url: `${BASE_API_URL}/api/getInputFormInfo`,
    method: POST,
  },

  /* ============================== Form management  =================================== */

  formListGet: {
    url: `${BASE_API_URL}/api/getFormList/1`,
    method: GET,
  },
  formItemGet: {
    url: `${BASE_API_URL}/api/getFormData`,
    method: POST,
  },

  formItemListGet: {
    url: `${BASE_API_URL}/api/getFormDataList`,
    method: POST,
  },

  formDataPost: {
    url: `${BASE_API_URL}/api/postFormData`,
    method: PUT,
  },

  formAddPost: {
    url: `${BASE_API_URL}/api/postFormData`,
    method: POST,
  },

  formDelete: {
    url: `${BASE_API_URL}/api/postFormData`,
    method: DELETE,
  },

  postFormRequest: {
    url: `${BASE_API_URL}/api/inputFormData`,
    method: POST,
  },
  postFormRequestList: {
    url: `${BASE_API_URL}/api/inputFormDataList`,
    method: POST,
  },
  putFormRequest: {
    url: `${BASE_API_URL}/api/inputFormData`,
    method: PUT,
  },
  deleteFormRequest: {
    url: `${BASE_API_URL}/api/inputFormData`,
    method: DELETE,
  },

  /* ========================= Request detail page  ================================ */

  postRequestStatus: {
    url: `${BASE_API_URL}/api/changeStatus`,
    method: POST,
  },

  postRequestStatusList: {
    url: `${BASE_API_URL}/api/changeStatusList`,
    method: POST,
  },

  requestDetailGet: {
    url: `${BASE_API_URL}/api/getInputFormDetails`,
    method: POST,
  },

  requestDetailListGet: {
    url: `${BASE_API_URL}/api/getInputFormDetailsList`,
    method: POST,
  },

  commentPost: {
    url: `${BASE_API_URL}/api/inputFormComment`,
    method: POST,
  },

  commentDelete: {
    url: `${BASE_API_URL}/api/inputFormComment`,
    method: DELETE,
  },

  /* =========================== Workspace management ======================================= */

  fieldTemplateGet: {
    url: `${BASE_API_URL}/api/getFieldTemplate`,
    method: GET,
  },
  workspaceGet: {
    url: `${BASE_API_URL}/api/workspaceSetting`,
    method: GET,
  },
  workspaceDetailGet: {
    url: `${BASE_API_URL}/api/workspaceInfo`,
    method: POST,
  },
  useCaseResounceGet: {
    url: `${BASE_API_URL}/api/usecaseResource`,
    method: GET,
  },
  workspacePut: {
    url: `${BASE_API_URL}/api/workspaceSetting`,
    method: PUT,
  },
  workspacePost: {
    url: `${BASE_API_URL}/api/workspaceSetting`,
    method: POST,
  },
  workspaceDelete: {
    url: `${BASE_API_URL}/api/workspaceSetting`,
    method: DELETE,
  },
  useCaseGet: {
    url: `${BASE_API_URL}/api/usecaseInfo`,
    method: GET,
  },
  useCasePost: {
    url: `${BASE_API_URL}/api/usecaseInfo`,
    method: POST,
  },

  /* =========================== Workflow manangement ============================== */

  allStageGet: {
    url: `${BASE_API_URL}/api/getAllStages`,
    method: POST,
  },

  workFlowDataGet: {
    url: `${BASE_API_URL}/api/getDetailsWorkflowDataById`,
    method: POST,
  },
  workFlowFormDataGet: {
    url: `${BASE_API_URL}/api/getBaseWorkflowListByFormId`,
    method: GET,
  },

  workFlowDataPut: {
    url: `${BASE_API_URL}/api/postWorkflowData`,
    method: PUT,
  },

  workFlowDataPost: {
    url: `${BASE_API_URL}/api/postWorkflowData`,
    method: POST,
  },

  workFlowDataDelete: {
    url: `${BASE_API_URL}/api/postWorkflowData`,
    method: DELETE,
  },

  /* ============================= GCP resource ========================================= */

  lookupResource: {
    url: `${BASE_API_URL}/api/tableSchema`,
    method: PUT,
  },

  tableSchemaGet: {
    url: `${BASE_API_URL}/api/tableSchema`,
    // url: `/stub/tableSchema.json`,
    method: POST,
  },

  hiveResoruceaGet: {
    // url: `${BASE_API_URL}/api/tableSchema`,
    url: `/stub/hiveResource.json`,
    method: GET,
  },

  policysGet: {
    url: `${BASE_API_URL}/api/getPolicyTagsList`,
    method: GET,
  },

  tableDataGet: {
    // url: `/stub/tableData.json`,
    url: `${BASE_API_URL}/api/onboardData`,
    method: POST,
  },

  governersTagGet: {
    url: `${BASE_API_URL}/api/getTagTemplateList`,
    method: GET,
  },

  /* ============================== Terminal panel ====================================== */

  ConsoleGet: {
    url: `${BASE_API_URL}/api/debug`,
    method: PUT,
  },

  /* ================================== stub torro data ====================================== */

  onBoardDataForm: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.dataOnBoardForm`,
    method: GET,
  },

  fieldDisplayConfig: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.specialRenderItem`,
    method: GET,
  },

  useCaseMemberConfig: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.ucMemberConfig`,
    method: GET,
  },

  requiredTableTag: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.requireTableTagId`,
    method: GET,
  },

  dataLineage: {
    url: `${BASE_API_URL}/api/datahub/lineage`,
    method: POST,
  },

  orgFormGet: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.orgSettingForm`,
    method: GET,
  },
  wsFormGet: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.workspaceForm`,
    // url: `/stub/workspaceForm.json`,
    method: GET,
  },
  policyFormGet: {
    url: `${BASE_API_URL}/api/torroConfig/en.form.policyForm`,
    // url: `/stub/policyForm.json`,
    method: GET,
  },

  /* ===================================== Theme config ===================================== */

  themeConfigGet: {
    // url: `/stub/themeConfigGet.json`,
    url: `${BASE_API_URL}/api/theme`,
    method: GET,
  },

  themeConfigPost: {
    // url: `/stub/themeConfigPost.json`,
    url: `${BASE_API_URL}/api/theme`,
    method: POST,
  },

  /* =========================== Data Discovery System APIs ======================================= */

  // System Status APIs
  systemStatus: {
    url: `${DISCOVERY_API_URL}/api/system/status`,
    method: GET,
  },

  systemHealth: {
    url: `${DISCOVERY_API_URL}/api/system/health`,
    method: GET,
  },

  // Connector Management APIs
  connectors: {
    url: `${DISCOVERY_API_URL}/api/connectors`,
    method: GET,
  },

  connectorConfig: {
    url: `${DISCOVERY_API_URL}/api/config`,
    method: GET,
  },

  connectorDelete: {
    url: `${DISCOVERY_API_URL}/api/connectors`,
    method: DELETE,
  },

  // Discovery APIs
  discoveryTest: {
    url: `${DISCOVERY_API_URL}/api/discovery/test`,
    method: POST,
  },

  discoveryStart: {
    url: `${DISCOVERY_API_URL}/api/discovery/scan`,
    method: POST,
  },

  discoveryScanSource: {
    url: `${DISCOVERY_API_URL}/api/discovery/scan`,
    method: POST,
  },

  discoveryStatus: {
    url: `${DISCOVERY_API_URL}/api/discovery/status`,
    method: GET,
  },

  // Assets APIs
  assetsList: {
    url: `${DISCOVERY_API_URL}/api/assets`,
    method: GET,
  },

  assetsSearch: {
    url: `${DISCOVERY_API_URL}/api/assets/search`,
    method: POST,
  },

  assetDetails: {
    url: `${DISCOVERY_API_URL}/api/assets/details`,
    method: GET,
  },

  // Data Lineage APIs
  lineageData: {
    url: `${DISCOVERY_API_URL}/api/lineage`,
    method: GET,
  },

  lineageRelationships: {
    url: `${DISCOVERY_API_URL}/api/lineage/relationships`,
    method: POST,
  },

  lineageDelete: {
    url: `${DISCOVERY_API_URL}/api/lineage/relationships`,
    method: DELETE,
  },

  // GCP Specific APIs (if needed)
  gcpConnectorAdd: {
    url: `${DISCOVERY_API_URL}/api/connectors/gcp/add`,
    method: POST,
  },

  gcpConfigTest: {
    url: `${DISCOVERY_API_URL}/api/config/gcp/test`,
    method: POST,
  },

  gcpDiscoveryTest: {
    url: `${DISCOVERY_API_URL}/api/discovery/test/gcp`,
    method: POST,
  },

  // Generic connector test APIs
  connectorConfigTest: {
    url: `${DISCOVERY_API_URL}/api/config/{connectorId}/test`,
    method: POST,
  },

  connectorDiscoveryTest: {
    url: `${DISCOVERY_API_URL}/api/discovery/test/{connectorId}`,
    method: POST,
  },
};

export default config;
