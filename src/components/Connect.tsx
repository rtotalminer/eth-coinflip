// src/components/Connect.tsx

import { useContext, useRef, useSyncExternalStore } from "react";
import { Store, UserStore } from "../data/store";
//import { todosStore } from "../data/todoStore";

const Connect = () => {

    const buttonStyle = {
        margin: "10px",
    };


    
    return (
        <>            
            <button onClick={() => {
                UserStore.setState({
                    accounts: ["0x001"],
                });
            }}>Connect Component</button> 
        </>
    );
};

export default Connect;