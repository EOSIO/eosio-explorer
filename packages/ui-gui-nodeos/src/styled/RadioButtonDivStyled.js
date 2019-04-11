import styled from 'styled-components';

export default styled.div`
  .radioContainer {
    display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

    /* Hide the browser's default radio button */
  .radioContainer input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

    /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #f8f9fa;
    border: solid 1px #8ba5bf;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: 30px;
  }

    /* On mouse-over, add a grey background color */
  .radioContainer:hover input ~ .checkmark {
    background-color: #fdfdfd;
  }

    /* When the radio button is checked, add a blue background */
  .radioContainer input:checked ~ .checkmark {
    background-color: #f8f9fa;
  }

    /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

    /* Show the indicator (dot/circle) when checked */
  .radioContainer input:checked ~ .checkmark:after {
    display: block;
  }

    /* Style the indicator (dot/circle) */
  .radioContainer .checkmark:after {
        top: 2px;
        left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #8ba5bf;
  }
`
