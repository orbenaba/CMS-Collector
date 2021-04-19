import axios from "axios";
import { ServerAddress } from "../Magic/Config.magic";


export default  async function getUserScans(){
    try {
        // Sending only the cookies in the request
        const res = await axios.get(ServerAddress + "api/asset/get-all-user-scans",  { withCredentials: true });
        return res.data.userScans;
    } catch (err) {
        console.log(err)
        return {};
    }
}