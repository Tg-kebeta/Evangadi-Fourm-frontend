import React from 'react'
import {RingLoader} from 'react-spinners'
function Loader() {
  return (
    <div 
        style={{
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh", 
        }}
        >
        <RingLoader color="#1e2943" />
    </div>
  )
}

export default Loader