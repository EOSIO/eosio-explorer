import './DragDropCodeViewer.scss';

import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import Dropzone from 'react-dropzone';

import { ButtonPrimary } from 'styled';

import styled from 'styled-components';
import CodeViewer from '../../components/CodeViewer';

const DragDropSVG = ({className}) => 
  <svg {...{className}} width="36px" height="52px" viewBox="0 0 36 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">    
    <defs>
        <polygon id="path-1" points="0 0.0600315769 31 0.0600315769 31 47.1272385 0 47.1272385"></polygon>
    </defs>
    <g id="Final-Version" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Artboard" transform="translate(-29.000000, -27.000000)">
            <g id="Group-8" transform="translate(29.000000, 27.000000)">
                <path d="M29,41.7750086 C28.9953907,43.5538036 27.6880583,44.9949202 26.0736973,45 L4.92638085,45 C3.31201986,44.9949202 2.00460933,43.5538036 2,41.7750086 L2,12.8683854 L6.98456611,12.8683854 C9.67735523,12.8673523 11.8608519,10.4613298 11.8614769,7.49360068 L11.8614769,2 L26.0639317,2 C27.6779802,2.00507981 28.9853908,3.44628255 28.9903126,5.22507749 L28.9903126,41.7750086 L29,41.7750086 Z M10,4 L10,7.86581153 C9.99481203,9.59441011 8.59447732,10.9948118 6.86571036,11 L3,11 L10,4 Z M26.1072225,0.00043013445 L10.8812162,0.00043013445 C10.8482209,-0.00128089762 10.8151473,0.00205561491 10.7833277,0.0114662913 C10.7638127,0.0114662913 10.7344226,0.0218180353 10.7148293,0.0218180353 L10.6855176,0.0218180353 C10.6561275,0.0324264341 10.6265024,0.0324264341 10.6072225,0.0431203845 L10.5971123,0.0431203845 C10.5708572,0.0521888545 10.5445237,0.0624550469 10.5191307,0.0752022357 L10.509334,0.0752022357 C10.481198,0.0852117733 10.4549428,0.0991566847 10.4308038,0.118234692 C10.4255528,0.118234692 10.4212422,0.122597824 10.4212422,0.128586436 C10.3996112,0.145268999 10.3766477,0.159299462 10.3524303,0.171618893 C10.3430255,0.171618893 10.3430255,0.181970637 10.3329153,0.181970637 C10.3136355,0.192664587 10.2940421,0.214052488 10.2745271,0.225088645 L10.2546202,0.246048788 C10.2350269,0.267436688 10.2057152,0.288824589 10.1861218,0.31021249 L10.1766386,0.320820889 L0.214978435,11.194943 C0.214978435,11.2052947 0.205181751,11.2052947 0.205181751,11.2163309 C0.188644948,11.2349811 0.175791698,11.2567112 0.165995014,11.280409 C0.165995014,11.291103 0.15619833,11.291103 0.15619833,11.3017114 C0.141228997,11.3251525 0.127827133,11.3501336 0.117089968,11.3764835 C0.117089968,11.3822154 0.112544306,11.3871774 0.107293284,11.3871774 C0.0923239504,11.4145539 0.079470701,11.4432993 0.0681849209,11.4723013 L0.0681849209,11.4833374 C0.0598773329,11.512425 0.0503941427,11.5407426 0.0387948688,11.5688035 L0.0387948688,11.5791552 C0.0289981848,11.6068739 0.0222580661,11.6355337 0.0192015007,11.6649635 L0.0192015007,11.6969598 C0.0192015007,11.7183477 0.00948319015,11.750344 0.00948319015,11.7717319 C0.00948319015,11.8038137 0,11.8461618 0,11.8785858 L0,41.659099 C0.000626987779,44.6083194 2.19038181,46.9986312 4.89246401,47 L26.1072225,47 C28.8093047,46.9986312 30.9990595,44.6083194 31,41.659099 L31,5.34133118 C30.9990595,2.39211076 28.8093047,0.0017134085 26.1072225,0.00043013445 L26.1072225,0.00043013445 Z" id="Fill-1" fill="#C3C5C8"></path>
                <path d="M16.1297138,17.2548113 C16.1198478,17.243603 16.109411,17.2320359 16.0995451,17.2320359 C16.0893529,17.2211862 16.0689686,17.2099778 16.0584503,17.1988591 C16.0485843,17.1876507 16.0384737,17.1876507 16.0279554,17.1760837 C16.0180894,17.165234 15.9977052,17.1540256 15.987513,17.1428172 C15.9770763,17.1316088 15.956692,17.1316088 15.946826,17.1201314 C15.9366338,17.1092817 15.9162495,17.1092817 15.9057313,17.0980733 C15.8958653,17.086865 15.8752364,17.086865 15.8653704,17.0756566 C15.8449861,17.0640895 15.8347939,17.0640895 15.8144912,17.0532398 C15.8039729,17.0532398 15.7839148,17.0421211 15.7733965,17.0421211 C15.7530122,17.0421211 15.7432277,17.0309127 15.7225173,17.0309127 C15.7126513,17.0309127 15.692267,17.0197043 15.6820749,17.0197043 C15.6617721,17.0197043 15.6413878,17.0081373 15.6206774,17.0081373 L15.5905086,17.0081373 C15.5261758,16.9972876 15.4610276,16.9972876 15.3967764,17.0081373 L15.3661999,17.0081373 C15.3458157,17.0081373 15.3257575,17.0197043 15.3053732,17.0197043 C15.2949365,17.0197043 15.2748783,17.0309127 15.26436,17.0309127 C15.2440573,17.0309127 15.2341098,17.0421211 15.2134809,17.0421211 C15.2036149,17.0421211 15.1832306,17.0532398 15.1730384,17.0532398 C15.1527357,17.0640895 15.1422174,17.0640895 15.1221593,17.0756566 C15.1117225,17.086865 15.0913382,17.086865 15.0814722,17.0980733 C15.0607618,17.1092817 15.0508958,17.1092817 15.0403775,17.1201314 C15.0305115,17.1316088 15.0098826,17.1316088 15.0000166,17.1428172 C14.9843615,17.1512459 14.9704186,17.1628129 14.9589219,17.1760837 C14.9490559,17.1876507 14.9386191,17.1876507 14.9287531,17.1988591 C14.913098,17.2071981 14.8994813,17.2187652 14.8876584,17.2320359 C14.8777924,17.243603 14.8676818,17.243603 14.8571635,17.2548113 L8.36232198,23.2444804 C7.93213199,23.6433194 7.87709441,24.3500751 8.23977165,24.8227101 C8.60244888,25.2960624 9.24512469,25.3558704 9.67555929,24.9570313 L14.5008462,20.5124151 L14.5008462,36.8804173 C14.5008462,37.4985819 14.9567204,38 15.518919,38 C16.0813623,38 16.5369919,37.4985819 16.5369919,36.8804173 L16.5369919,20.5124151 L21.3628495,24.9570313 C21.7961379,25.3510283 22.437183,25.2859301 22.7979849,24.8118604 C23.1237258,24.3203056 23.0480593,23.6356081 22.624963,23.2444804 L16.1297138,17.2548113 Z" id="Fill-3" fill="#C3C5C8"></path>
                <g id="Group-7" transform="translate(5.000000, 4.000000)">
                    <mask id="mask-2" fill="white">
                        <use xlinkHref="#path-1">
                        </use>
                    </mask>
                    <g id="Clip-6"></g>
                    <path d="M26.282325,0.0600315769 C26.4681337,0.622731213 26.5701743,1.22861657 26.5703325,1.86046477 L26.5703325,2.24502331 C27.9571348,2.51416288 29.0104465,3.82455812 29.0148761,5.40315039 L29.0148761,41.7780359 L29.0246847,41.7780359 C29.0200177,43.5483077 27.6963381,44.9825191 26.0617908,44.9875746 L4.6499644,44.9875746 C3.63430492,44.9844899 2.73880016,44.4291592 2.20510432,43.5845528 L0.220296859,43.5845528 C0.146416333,43.5845528 0.0730895145,43.5818966 0,43.5783834 C0.682643409,45.6461568 2.50624262,47.1262102 4.6499644,47.1272385 L26.0617908,47.1272385 C28.788884,47.1259532 30.9990508,44.731802 31,41.7780359 L31,5.40315039 C30.9991299,2.52950067 28.9069821,0.186246982 26.282325,0.0600315769" id="Fill-5" fill="#C3C5C8" mask="url(#mask-2)"></path>
                </g>
            </g>
        </g>
    </g>
</svg>

const ImageDiv = styled.div`
  margin-bottom: 1rem;
  margin-top: 3rem;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  color: #393742;
  font-size: 14px;
  button{
    margin-top: -7px;
  }
`
const DragDropSVGStyled = styled(DragDropSVG)`
  width: 20px;
  height: 29px;
`
class DragDropCodeViewer extends Component {
  constructor() {
    super();
    this.state = { 
      value: ""
    }
  }

  componentDidMount(){
    this.setState({
      value: this.props.value
    });
  }
  
  editorDidMount(editor, monaco) {
    editor.focus();
    this.editor = editor;
    this.monaco = monaco;

    setTimeout(
      function() {
        this.editor.trigger('any', 'editor.action.formatDocument');
      }
      .bind(this),
      250
    );
  }

  async onDrop(file) {
    if(file === undefined)
      return;

    let self = this;
    let reader = new FileReader();

    // Optional props so we can set the current file name of the parent component...
    if (this.props.setCurrentFile)
      this.props.setCurrentFile(file.name);

    reader.onload = function(e) {
      let contents = e.target.result;
      self.setState({
        value: contents
      });

      self.props.onDrop && self.props.onDrop(contents);
    };

    reader.readAsText(file);
  }

  onChange(newValue) {
    this.setState({
      value: newValue
    });
    this.props.onChange && this.props.onChange(newValue);
  }
  
  render() {
    return (
      <>
        <div className={"dragDropCodeViewerContainer " + (this.state.value && this.state.value !== "" ? "hasFileData" : "")} >
          <Dropzone onDrop={([file]) => this.onDrop(file)} 
            accept={'application/json, .cpp'} 
            >
            {({getRootProps, getInputProps}) => (
              <section className="dropzone">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                    <Jumbotron>
                      {
                        this.state.value && this.state.value !== "" 
                        ? <DivFlexStyled>
                            <div className="text-center">
                              <DragDropSVGStyled />&nbsp;&nbsp;
                              <label>Drag & Drop files here or click browse to choose a file.</label>
                            </div>                           
                            <ButtonPrimary onClick={(e) => e.preventDefault()} >BROWSE</ButtonPrimary>
                          </DivFlexStyled>
                        : <div>
                            <ImageDiv className="text-center">
                              <DragDropSVG />
                            </ImageDiv>   
                            <br />                   
                            <p id="ddLabel" className="lead text-center">Drag & Drop files here or<br/> click browse to choose a file.</p>
                            <br />
                            <p className="lead text-center browseButton">
                              <ButtonPrimary onClick={(e) => e.preventDefault()} >BROWSE</ButtonPrimary>
                            </p>
                          </div>                          
                      }                 
                      
                    </Jumbotron>
                </div>
              </section>
            )}
          </Dropzone>
            <CodeViewer 
              height={this.props.height}
              width={this.props.width}
              readOnly={this.props.readOnly}
              value={this.state.value}
              language="cpp"
              onChange={(newVal) => this.onChange(newVal)} 
              editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)} />
          </div>
      </>
    );
  }
}

export default DragDropCodeViewer;
