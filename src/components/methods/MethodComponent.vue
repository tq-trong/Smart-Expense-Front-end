<script>
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/smart_expense";

export default {
  methods: {
    fetchData(page, search, objectData) {
      // Hàm lấy dữ liệu về
      let url = `${API_URL}/${objectData}?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      return axios.get(url);
    },
    fetchDataId(page, searchKeyword, id, objectData) {
      // Hàm lấy dữ liệu về
      let url = `${API_URL}/${objectData}`;
      if(id)  url += `/${id}`;
       url += `?page=${page}`;
      if (searchKeyword) {
        url += `&keyword=${encodeURIComponent(searchKeyword)}`;
      }
      return axios.get(url);
    },
    fetchDataWithoutPage(objectData) {
      let url = `${API_URL}/${objectData}`;
      return axios.get(url);
    },
    formatBirthday_VN(dateString) {
      // Hàm định dạng ngày sinh
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`;
    },
    formatDateTime(dateString) {
      // Hàm định dạng ngày sinh
      if (!dateString) return "";
      const dateTime = new Date(dateString);
      const day = dateTime.getDate();
      const month = dateTime.getMonth() + 1;
      const year = dateTime.getFullYear();
      const hours = dateTime.getHours();
      const minutes = dateTime.getMinutes();
      const seconds = dateTime.getSeconds();
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds} ${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
      }-${year}`;
    },
    swalTopRight() {
      // Hàm set các props cho toast top-right
      return Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
    },
    swalCenter() {
      // Hàm set các props cho toast center
      return Swal.mixin({
        showCancelButton: true,
      });
    },
    showToastAlert(swal, icon, title) {
      // Hàm gọi toast
      return swal.fire({
        icon: icon,
        title: title,
      });
    },
    calculateDisplayedPages(currentPage, totalPages) {
      //Hàm hiển thị thanh phân trang
      const maxDisplayedPages = 5;
      const middlePage = Math.ceil(maxDisplayedPages / 2);
      let startPage = currentPage - middlePage + 1;
      if (startPage < 1) {
        startPage = 1;
      }
      let endPage = startPage + maxDisplayedPages - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }
      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    },
  },
};
</script>