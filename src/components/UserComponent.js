import { jwtDecode } from "jwt-decode";

export default class User {
    getUserFromToken() {
        var decoded = null;
        const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      if (token) {
        decoded = jwtDecode(token); // Giải mã token
      }
      return decoded;
    }
}
