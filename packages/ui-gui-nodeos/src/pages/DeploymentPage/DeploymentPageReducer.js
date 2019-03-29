import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics } from 'redux-observable';

const actionPrefix = `deployment/`;

const ABI_IMPORT = actionPrefix + `ABI_IMPORT`;
const CONTRACT_COMPILE = actionPrefix + `CONTRACT_COMPILE`;
const CONTRACT_DEPLOY = actionPrefix + `CONTRACT_DEPLOY`;
const FOLDER_SET = actionPrefix + `FOLDER_SET`;
const COMPILE_START = actionPrefix + `COMPILE_START`;
const DEPLOY_START = actionPrefix + `DEPLOY_START`;
const PROCESS_DONE = actionPrefix + `PROCESS_DONE`;
const PROCESS_FAIL = actionPrefix + `PROCESS_FAIL`;

export const abiImport = fileContent => ({ type: ABI_IMPORT, fileContent });
export const contractCompile = fullPath => ({ type: CONTRACT_COMPILE, fullPath });
export const contractDeploy = ( fullPath, deployer ) => ({ type: CONTRACT_DEPLOY, fullPath, deployer });
export const folderSet = path => ({ type: FOLDER_SET, path });

export const compileStart = () => ({ type: COMPILE_START });
export const deployStart = () => ({ type: DEPLOY_START });
export const processDone = payload => ({ type: PROCESS_DONE, payload });
export const processFail = payload => ({ type: PROCESS_FAIL, payload });



export const combinedEpic = combineEpics(

);

const dataInitState = {
  path: "",
  rawLog: [],
  wasmPath: "",
  abiPath: "",
  abiContents: null
}

const deploymentReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FOLDER_SET:
      return {
        ...state,
        path: action.path
      };
    default:
      return state;
  }
}

const isProcessingReducer = (state = false, action) => {
  switch (action.type) {
    case COMPILE_START:
    case DEPLOY_START:
      return true;
    
    case PROCESS_DONE:
    case PROCESS_FAIL:
      return true;
    
    default:
      return state;
  }
}

export const combinedReducer = combineReducers({
  deployContainer: deploymentReducer,
  isProcessing: isProcessingReducer
})
