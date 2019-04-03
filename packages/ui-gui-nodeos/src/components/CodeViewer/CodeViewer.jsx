import './CodeViewer.scss';

import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const monacoOptions = {
  selectOnLineNumbers: true,
  acceptSuggestionOnEnter: true,
  readOnly: false,
  minimap: {
    enabled: false
  },
  renderSideBySide: false,
  lineNumbers: "on",
  overviewRulerBorder: true,
  overviewRulerLanes: 1,
  renderLineHighlight: "none",
  scrollBeyondLastLine: false,
  dragAndDrop: true,
  formatOnPaste: true
};

const monacoOptionsReadOnly = {
  selectOnLineNumbers: true,
  acceptSuggestionOnEnter: false,
  readOnly: true,
  minimap: {
    enabled: false
  },
  renderSideBySide: false,
  lineNumbers: "on",
  overviewRulerBorder: true,
  overviewRulerLanes: 1,
  renderLineHighlight: "none",
  scrollBeyondLastLine: false
};

const defaults = {
  height: 300,
  width: "100%",
  theme: "vs",
  language: "json"
}

const CodeViewer = (props) => {
  return (<>
    <div className="CodeViewer">
        <MonacoEditor
          height={ props.height || defaults.height }
          width={ props.width || defaults.width }
          language={ props.language || defaults.language }
          theme={ props.theme || defaults.theme }
          value={ props.value || "" }
          options={ props.readOnly ? monacoOptionsReadOnly : monacoOptions }
          onChange={ props.onChange }
          editorDidMount={ props.editorDidMount }
          editorWillMount={ props.editorWillMount }
        />
    </div>
  </>)
}
  

export default CodeViewer;
