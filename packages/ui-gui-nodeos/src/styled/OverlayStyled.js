import styled from 'styled-components';

export default styled.div`   
  display: ${props => props.isLoading ? 'block' : 'none'};
  position: fixed; 
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color : rgba(0,0,0,0.5);
  z-Index: 1025;
  cursor: pointer;       
`
