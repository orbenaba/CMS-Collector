import axios from "axios";
import { ServerAddress } from "../Magic/Config.magic";
/**
 * @returns True/False if the accessToken has not expired and it is valid
 */
export default async () => {
  try {
    // Sending only the cookies in the request
    const res = await axios.post(ServerAddress + "api/user/is-authenticated", {}, { withCredentials: true });
    return res.data.user;
  } catch (err) {
    return false;
  }
};
