import React from 'react'

export const Alert = (props) => {
    const capitalize = (word)=>{
        if(word==='danger')
        {
            word='error'
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (<>
        {props.alert && <div style={{height: '50px',position:"fixed", top :'15px', zIndex:'999', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert" style={{height: '50px', position : 'fixed', width:'30%', alignItems: 'center', fontSize: '16px', textAlign: 'center' }}>
           <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg} 
        </div>
        </div>}
        </>
    )
}

// <Snackbar
// anchorOrigin={{ }}
// open={alert}
// onClose={handleAlert}
// TransitionComponent={Fade}
// message="Display Name Updated Successfully"
// key={Fade}
// action={
//   <IconButton aria-label="close" color="inherit" onClick={handleAlert}>
//     <CloseIcon />
//   </IconButton>
// }
// />
