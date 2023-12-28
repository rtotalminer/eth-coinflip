import { useState } from "react";

import { IMG_FOLDER } from "../../utils/config";

export function ChipsInfo() {

    const [chipsBalance, setChipsBalane] = useState(0);

    return (
        <>
            <li className="float-right">{chipsBalance}</li>
        </>
    )

}