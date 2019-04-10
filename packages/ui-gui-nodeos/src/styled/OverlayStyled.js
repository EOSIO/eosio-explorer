import styled from 'styled-components';


export default styled.div(props =>({
    display: props.display, 
    position: 'fixed', 
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor : "rgba(0,0,0,0.5)",
    zIndex: 999,
    cursor: "pointer"    
}));
