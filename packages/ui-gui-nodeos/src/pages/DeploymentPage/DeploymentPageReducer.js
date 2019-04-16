import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import { errorLog } from 'helpers/error-logger';

const ENDPOINT = `http://localhost:${process.env.REACT_APP_LOCAL_SERVICE_PORT}/api/eosio/`;

const actionPrefix = `deployment/`;

const ABI_IMPORT = actionPrefix + `ABI_IMPORT`;
const CONTRACT_COMPILE = actionPrefix + `CONTRACT_COMPILE`;
const CONTRACT_DEPLOY = actionPrefix + `CONTRACT_DEPLOY`;
const FOLDER_SET = actionPrefix + `FOLDER_SET`;
const PROCESS_DONE = actionPrefix + `PROCESS_DONE`;
const PROCESS_FAIL = actionPrefix + `PROCESS_FAIL`;
const LOG_CLEAR = actionPrefix + `LOG_CLEAR`;
const OUTPUT_CLEAR = actionPrefix + `OUTPUT_CLEAR`;

export const abiImport = fileContent => ({ type: ABI_IMPORT, fileContent });
export const contractCompile = fullPath => ({ type: CONTRACT_COMPILE, fullPath });
export const contractDeploy = ( fullPath, deployer ) => ({ type: CONTRACT_DEPLOY, fullPath, deployer });
export const folderSet = path => ({ type: FOLDER_SET, path });
export const logClear = () => ({ type: LOG_CLEAR });
export const outputClear = () => ({ type: OUTPUT_CLEAR });

export const processDone = payload => ({ type: PROCESS_DONE, payload });
export const processFail = ( payload, error ) => ({ type: PROCESS_FAIL, payload, error });

const importEpic = ( action$ ) => action$.pipe(
  ofType(ABI_IMPORT),
  mergeMap(action => {
    return ajax.post(ENDPOINT+"import", action.fileContent).pipe(
      map(res => {
        let { imported, abiPath, errors } = res.response;
        return processDone({
          abiContents: action["fileContent"].content,
          imported: imported,
          abiPath: abiPath,
          errors: (errors.length > 0) ? errors.join("\n") : []
        })
      }),
      catchError(err => {
        errorLog(err);
        return of(processFail(err, err.errors))
      })
    )
  })
);

const compileEpic = ( action$ ) => action$.pipe(
  ofType(CONTRACT_COMPILE),
  mergeMap(action => {
    return ajax.post(ENDPOINT+"compile", action.fullPath).pipe(
      map(res => {
        let { compiled, wasmLocation, abi, abiContents, stdout, stderr, errors } = res.response;
        let nodeErr = [],
            nodeStd = [];

        return processDone({
          abiContents: abiContents,
          abiPath: abi,
          wasmPath: wasmLocation,
          stdoutLog: (stdout instanceof Array) ? stdout : nodeStd,
          stderrLog: (stderr instanceof Array) ? stderr : nodeErr,
          compiled: compiled,
          errors: errors,
          imported: false
        })
      }),
      catchError(err => {
        errorLog(err);
        return of(processFail(err, err.errors))
      })
    )
  })
);

const deployEpic = ( action$ ) => action$.pipe(
  ofType(CONTRACT_DEPLOY),
  mergeMap(action => {
    return ajax.post(ENDPOINT+"deploy", {...action.fullPath, ...action.deployer}).pipe(
      map(res => {
        let { compiled, wasmLocation, abi, abiContents, stdout, stderr, errors, deployed, output } = res.response;
        let actualOutput;
        let nodeErr = [];
        let nodeStd = [];

        /**
         * If compile succeeds but deployment fails, there will be no output object.
         * Therefore, if output doesn't exist, we can use the 'null' to determine
         * deployment failure at a stricter level
         */
        if (output) {
          let { processed } = output
          let { action_traces, ...intermediaryOutput } = processed;
          actualOutput = intermediaryOutput;
        }

        return processDone({
          abiContents: abiContents,
          abiPath: abi,
          wasmPath: wasmLocation,
          stdoutLog: (stdout instanceof Array) ? stdout : nodeStd,
          stderrLog: (stderr instanceof Array) ? stderr : nodeErr,
          compiled: compiled,
          deployed: deployed,
          output: (actualOutput) ? actualOutput : null,
          errors: errors
        })
      }),

      catchError(err => {
        errorLog(err);
        return of(processFail(err, err.errors))
      })
    )
  })
);

const consoleLogFormatting = ({ stdoutLog, stderrLog, errors }) => {

  if (stdoutLog && stdoutLog.length > 0) {
    console.log("=== Compiler Standard Out ===");
    stdoutLog.forEach(line => console.log(line));
  }

  if (stderrLog && stderrLog.length > 0) {
    console.log("=== Compiler Standard Error ===");
    stderrLog.forEach(line => console.log(line));
  }

  if (errors && errors.length > 0) {
    console.log("=== GUI/Tool Errors ===");
    errors.forEach(line => console.log(line));
  }

}

export const combinedEpic = combineEpics(
  importEpic,
  compileEpic,
  deployEpic
);

const dataInitState = {
  path: "",
  stdoutLog: [],
  stderrLog: [],
  wasmPath: "",
  abiPath: "",
  abiContents: "",
  output: null,
  compiled: false,
  imported: false,
  deployed: false,
  errors: []
}

const deploymentReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case CONTRACT_COMPILE:
    case CONTRACT_DEPLOY:
    case ABI_IMPORT:
      return {
        ...state,
        deployed: false,
        compiled: false,
        imported: false
      }
    case PROCESS_DONE:
      consoleLogFormatting(action.payload);
      return {
        ...state,
        ...action.payload
      };
    case LOG_CLEAR:
      return {
        ...state,
        deployed: false,
        compiled: false,
        imported: false,
        errors: [],
        stderrLog: [],
        stdoutLog: [],
        output: null
      }
    case OUTPUT_CLEAR:
      return {
        ...state,
        stdoutLog: [],
        stderrLog: [],
        errors: [],
        abiContents: null,
        output: null,
        deployed: false
      }
    case PROCESS_FAIL:
      let { message } = action.payload
      return {
        ...state,
        errors: [
          message
        ]
      }
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
    case CONTRACT_COMPILE:
    case CONTRACT_DEPLOY:
    case ABI_IMPORT:
      return true;

    case PROCESS_DONE:
    case PROCESS_FAIL:
      return false;

    default:
      return state;
  }
}

export const combinedReducer = combineReducers({
  deployContainer: deploymentReducer,
  isProcessing: isProcessingReducer
})
