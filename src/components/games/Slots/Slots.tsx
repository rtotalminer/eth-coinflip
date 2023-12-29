import { IMG_FOLDER } from "../../../shared/config";

export default function Slots() {
  return (<>
      <img style={{width: '512px', margin: 'auto', display: 'block', marginTop: '50px'}} src={`${IMG_FOLDER}/coming-up.gif`} ></img>
  </>)
}