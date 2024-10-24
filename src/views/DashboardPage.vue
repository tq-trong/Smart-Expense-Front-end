<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Dashboard</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <!-- PIE CHART -->
            <div class="card">
              <div class="card-header">
                <div class="row">
                  <div class="col-md-4 col-sm-12">
                    <label class="mr-2">Start Date:</label>
                    <input
                      type="date"
                      v-model="startDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <label class="mr-2">End Date:</label>
                    <input
                      type="date"
                      v-model="endDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <label class="mr-2">User:</label>
                    <select
                      class="form-control select2"
                      style="width: 100%"
                      v-model="user"
                    >
                      <option value="">Select a User</option>
                      <option
                        v-for="(user, index) in usersFilter"
                        :key="index"
                        :value="user"
                      >
                        {{ user }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-1 col-sm-12 d-flex align-items-end">
                    <div class="input-group">
                      <div class="input-group">
                        <button
                          @click="navigateToDashboard"
                          class="btn btn-info"
                          :disabled="isLoading"
                        >
                          <i class="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-if="userLogin.role !== 'ROLE_USER'">
                <div class="col-md-6">
                  <canvas
                    id="pieChartForStatisticAllMember"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
                <div class="col-md-6">
                  <canvas
                    id="lineChartForStatisticAllMember"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12" v-if="userLogin.role !== 'ROLE_USER'">
            <!-- PIE CHART -->
            <div class="card">
              <div class="row">
                <div class="col-md-6">
                  <canvas
                    id="pieChartForStatisticAllCategory"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
                <div class="col-md-6">
                  <canvas
                    id="lineChartForStatisticAllCategory"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12" v-if="user !== '' && filter === true">
            <!-- PIE CHART -->
            <div class="card">
              <div class="row">
                <div class="col-md-6">
                  <canvas
                    id="pieChartForStatisticByUser"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
                <div class="col-md-6">
                  <canvas
                    id="lineChartForStatisticByUser"
                    style="
                      min-height: 250px;
                      height: 250px;
                      max-height: 250px;
                      max-width: 100%;
                    "
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>
<script>
import {
  Chart,
  LineController,
  LineElement,
  LinearScale,
  Title,
  CategoryScale,
  PointElement, // Đảm bảo đăng ký PointElement
  ArcElement, // Thêm ArcElement cho biểu đồ hình tròn
  Tooltip,
  Legend,
  PieController, // Đăng ký PieController cho biểu đồ hình tròn
} from "chart.js";
import axios from "axios";
import UserComponent from "@/components/UserComponent";
import NotificationComponent from "@/components/NotificationComponent";

const notificationComponent = new NotificationComponent();
const userComponent = new UserComponent();

export default {
  data() {
    return {
      userLogin: {
        username: "",
        role: "",
      },
      filter: false,
      user: "",
      usersFilter: [],
      isLoading: false,
      startDate: null,
      endDate: null,
      lineChartForStatisticAllMember: null,
      pieChartForStatisticAllMember: null,
      lineChartForStatisticAllCategory: null,
      pieChartForStatisticAllCategory: null,
      lineChartForStatisticByUser: null,
      pieChartForStatisticByUser: null,
      lineDataForStatisticAllMember: {
        labels: [],
        datasets: [],
      },
      pieDataForStatisticAllMember: {
        labels: [],
        datasets: [],
      },
      lineDataForStatisticAllCategory: {
        labels: [],
        datasets: [],
      },
      pieDataForStatisticAllCategory: {
        labels: [],
        datasets: [],
      },
      lineDataForStatisticByUser: {
        labels: [],
        datasets: [],
      },
      pieDataForStatisticByUser: {
        labels: [],
        datasets: [],
      },
    };
  },
  mounted() {
    try {
      // Đăng ký các thành phần cần thiết cho Line chart và Pie chart
      Chart.register(
        LineController,
        LineElement,
        PointElement, // Đăng ký PointElement
        LinearScale,
        Title,
        CategoryScale,
        ArcElement, // Đăng ký ArcElement cho biểu đồ hình tròn
        Tooltip,
        Legend,
        PieController // Đăng ký PieController
      );
      this.getUserInfoFromToken();
      if (this.userLogin.role !== "ROLE_USER") {
        this.fetchLineChartForStatisticAllMember(); // Gọi hàm để lấy dữ liệu từ API
        this.fetchPieChartForStatisticAllMember();
        this.fetchPieChartForStatisticAllCategory();
        this.fetchLineChartForStatisticAllCategory();
        this.fetchUsersFilter();
        if (this.user !== "") {
          this.fetchPieChartForStatisticByUser(true);
          this.fetchLineChartForStatisticByUser(true);
        }
      } else {
        this.fetchUsersFilter();
        this.fetchPieChartForStatisticByUser(false);
        this.fetchLineChartForStatisticByUser(false);
      }
    } catch(error) {
      notificationComponent.toastError("You're taking action too fast, please wait a moment!");
    }
  },
  methods: {
    getUserInfoFromToken() {
      const userInfo = userComponent.getUserFromToken();
      this.userLogin.username = userInfo.sub;
      this.userLogin.role = userInfo.scope;
    },
    navigateToDashboard() {
      this.filter = true;
      const query = {
        startDate: this.startDate,
        endDate: this.endDate,
      };

      if (this.user !== "") {
        query.user = this.user;
      }
      try {
        this.$router.push({
          name: "dashboard",
          query: query,
        });
      } catch {
        notificationComponent.toastError(
          "You're taking action too fast, please wait a moment!"
        );
      }
    },
    async fetchUsersFilter() {
      try {
        const response = await axios.get("/users/username");
        this.usersFilter = response.data.result;
      } catch (error) {
        console.error("Error fetching users filter:", error);
      }
    },
    getRandomColorRGBA() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 1)`;
    },
    getRandomColorHex() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    // Pie Char For Statistic All Member---------------------------------------------------------------------------------------------------
    async fetchPieChartForStatisticAllMember() {
      this.isLoading = true;
      try {
        const response = await axios.get(`statistic/user-expense-summary`, {
          params: {
            startDate: this.startDate || this.$route.query.startDate,
            endDate: this.endDate || this.$route.query.endDate,
          },
        });
        const data = response.data.result; // Dữ liệu trả về là một mảng người dùng
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;

        // Gán labels và datasets cho Pie Chart
        this.pieDataForStatisticAllMember.labels = data.map(
          (user) => user.username
        ); // Lấy danh sách tên người dùng

        // Tổng số tiền cho từng người dùng
        const totalAmounts = data.map((user) => user.totalAmount);

        // Tạo màu ngẫu nhiên cho từng người dùng
        const colors = data.map(() => this.getRandomColorHex());

        // Tạo dataset cho Pie Chart
        this.pieDataForStatisticAllMember.datasets = [
          {
            data: totalAmounts, // Tổng số tiền
            backgroundColor: colors, // Màu ngẫu nhiên
            borderColor: colors,
            borderWidth: 1,
          },
        ];

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createPieChartForStatisticAllMember();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },
    createPieChartForStatisticAllMember() {
      const pieChartForStatisticAllMember = document
        .getElementById("pieChartForStatisticAllMember")
        .getContext("2d");
      if (this.pieChartForStatisticAllMember) {
        this.pieChartForStatisticAllMember.destroy();
      }
      this.pieChartForStatisticAllMember = new Chart(
        pieChartForStatisticAllMember,
        {
          type: "pie",
          data: this.pieDataForStatisticAllMember,
          options: {
            maintainAspectRatio: false,
            responsive: true,
            animation: false,
          },
        }
      );
    },

    // Line Chart For Statistic All Member ------------------------------------------------------------------------------------------------
    async fetchLineChartForStatisticAllMember() {
      this.isLoading = true;
      try {
        const response = await axios.get(`statistic/user-expense-over-time`, {
          params: {
            startDate: this.startDate || this.$route.query.startDate,
            endDate: this.endDate || this.$route.query.endDate,
          },
        });
        const data = response.data.result; // Dữ liệu trả về là một mảng người dùng
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        // Lấy tất cả ngày và số tiền cho từng người dùng
        const expenses = data.flatMap((user) =>
          user.expenses.map((expense) => ({
            date: expense.date,
            amount: expense.amount,
            username: user.username, // Lưu lại tên người dùng để phân biệt
          }))
        );

        // Sắp xếp expenses theo date tăng dần
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Gán labels và datasets
        this.lineDataForStatisticAllMember.labels = [
          ...new Set(expenses.map((exp) => exp.date)),
        ]; // Lấy danh sách ngày duy nhất

        //const amountsDefault = [0, 20000, 50000, 200000, 500000, 1000000, 3000000, 5000000, 10000000];
        // Tạo datasets cho từng người dùng
        this.lineDataForStatisticAllMember.datasets = data.map((user) => {
          const amounts = this.lineDataForStatisticAllMember.labels.map(
            (date) => {
              // Lấy tổng số tiền cho từng ngày theo người dùng
              const totalAmount = expenses
                .filter(
                  (exp) => exp.username === user.username && exp.date === date
                )
                .reduce((sum, exp) => sum + exp.amount, 0);
              return totalAmount; // Nếu không có chi tiêu trong ngày thì trả về 0
            }
          );
          const randomColor = this.getRandomColorRGBA();
          return {
            label: user.username,
            data: amounts,
            backgroundColor: randomColor,
            borderColor: randomColor,
            fill: false,
          };
        });

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createLineChartForStatisticAllMember();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },

    createLineChartForStatisticAllMember() {
      const lineChartForStatisticAllMember = document
        .getElementById("lineChartForStatisticAllMember")
        .getContext("2d");
      if (this.lineChartForStatisticAllMember) {
        this.lineChartForStatisticAllMember.destroy();
      }
      this.lineChartForStatisticAllMember = new Chart(
        lineChartForStatisticAllMember,
        {
          type: "line",
          data: this.lineDataForStatisticAllMember,
          options: {
            animation: false,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          },
        }
      );
    },
    // Pie Chart For Statistic All Category ----------------------------------------------------------------------------------------------
    async fetchPieChartForStatisticAllCategory() {
      this.isLoading = true;
      try {
        const response = await axios.get(`statistic/category-expense-summary`, {
          params: {
            startDate: this.startDate || this.$route.query.startDate,
            endDate: this.endDate || this.$route.query.endDate,
          },
        });
        const data = response.data.result; // Dữ liệu trả về là một mảng người dùng
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        // Gán labels và datasets cho Pie Chart
        this.pieDataForStatisticAllCategory.labels = data.map(
          (category) => category.category
        ); // Lấy danh sách tên category

        // Tổng số tiền cho từng category
        const totalAmounts = data.map((category) => category.totalAmount);

        // Tạo màu ngẫu nhiên cho từng người dùng
        const colors = data.map(() => this.getRandomColorHex());

        // Tạo dataset cho Pie Chart
        this.pieDataForStatisticAllCategory.datasets = [
          {
            data: totalAmounts, // Tổng số tiền
            backgroundColor: colors, // Màu ngẫu nhiên
            borderColor: colors,
            borderWidth: 1,
          },
        ];

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createPieChartForStatisticAllCategory();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },
    createPieChartForStatisticAllCategory() {
      const pieChartForStatisticAllCategory = document
        .getElementById("pieChartForStatisticAllCategory")
        .getContext("2d");
      if (this.pieChartForStatisticAllCategory) {
        this.pieChartForStatisticAllCategory.destroy();
      }
      this.pieChartForStatisticAllCategory = new Chart(
        pieChartForStatisticAllCategory,
        {
          type: "pie",
          data: this.pieDataForStatisticAllCategory,
          options: {
            animation: false,
            maintainAspectRatio: false,
            responsive: true,
          },
        }
      );
    },
    // Line Chart For Statistic All Category -------------------------------------------------------------------------------------------------
    async fetchLineChartForStatisticAllCategory() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `statistic/category-expense-over-time`,
          {
            params: {
              startDate: this.startDate || this.$route.query.startDate,
              endDate: this.endDate || this.$route.query.endDate,
            },
          }
        );
        const data = response.data.result;
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        // Lấy tất cả ngày và số tiền cho từng category
        const expenses = data.flatMap((category) =>
          category.expenses.map((expense) => ({
            date: expense.date,
            amount: expense.amount,
            category: category.category, // Lưu lại tên người dùng để phân biệt
          }))
        );

        // Sắp xếp expenses theo date tăng dần
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Gán labels và datasets
        this.lineDataForStatisticAllCategory.labels = [
          ...new Set(expenses.map((exp) => exp.date)),
        ]; // Lấy danh sách ngày duy nhất

        // Tạo datasets cho từng category
        this.lineDataForStatisticAllCategory.datasets = data.map((category) => {
          const amounts = this.lineDataForStatisticAllCategory.labels.map(
            (date) => {
              // Lấy tổng số tiền cho từng ngày theo người dùng
              const totalAmount = expenses
                .filter(
                  (exp) =>
                    exp.category === category.category && exp.date === date
                )
                .reduce((sum, exp) => sum + exp.amount, 0);
              return totalAmount; // Nếu không có chi tiêu trong ngày thì trả về 0
            }
          );
          const randomColor = this.getRandomColorRGBA();
          return {
            label: category.category,
            data: amounts,
            backgroundColor: randomColor,
            borderColor: randomColor,
            fill: false,
          };
        });

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createLineChartForStatisticAllCategory();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },
    createLineChartForStatisticAllCategory() {
      const lineChartForStatisticAllCategory = document
        .getElementById("lineChartForStatisticAllCategory")
        .getContext("2d");
      if (this.lineChartForStatisticAllCategory) {
        this.lineChartForStatisticAllCategory.destroy();
      }
      this.lineChartForStatisticAllCategory = new Chart(
        lineChartForStatisticAllCategory,
        {
          type: "line",
          data: this.lineDataForStatisticAllCategory,
          options: {
            animation: false,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          },
        }
      );
    },
    // Pie Chart For Statistic By User ----------------------------------------------------------------------------------------------
    async fetchPieChartForStatisticByUser(hasFamily) {
      if (this.user === "") {
        return;
      }
      if (!hasFamily) {
        this.user = this.userLogin.username;
      }
      this.isLoading = true;
      try {
        const response = await axios.get(
          `statistic/category-expense-summary-user/${this.user}`,
          {
            params: {
              startDate: this.startDate || this.$route.query.startDate,
              endDate: this.endDate || this.$route.query.endDate,
            },
          }
        );
        const data = response.data.result; // Dữ liệu trả về là một mảng người dùng
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        this.user = this.$route.query.user;
        // Gán labels và datasets cho Pie Chart
        this.pieDataForStatisticByUser.labels = data.map(
          (category) => category.category
        ); // Lấy danh sách tên category

        // Tổng số tiền cho từng category
        const totalAmounts = data.map((category) => category.totalAmount);

        // Tạo màu ngẫu nhiên cho từng người dùng
        const colors = data.map(() => this.getRandomColorHex());

        // Tạo dataset cho Pie Chart
        this.pieDataForStatisticByUser.datasets = [
          {
            data: totalAmounts, // Tổng số tiền
            backgroundColor: colors, // Màu ngẫu nhiên
            borderColor: colors,
            borderWidth: 1,
          },
        ];

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createPieChartForStatisticByUser();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },
    createPieChartForStatisticByUser() {
      if (this.user === "") {
        return;
      }
      const pieChartForStatisticByUser = document
        .getElementById("pieChartForStatisticByUser")
        .getContext("2d");
      if (this.pieChartForStatisticByUser) {
        this.pieChartForStatisticByUser.destroy();
      }
      this.pieChartForStatisticByUser = new Chart(pieChartForStatisticByUser, {
        type: "pie",
        data: this.pieDataForStatisticByUser,
        options: {
          animation: false,
          maintainAspectRatio: false,
          responsive: true,
        },
      });
    },
    // Line Chart For Statistic By User -------------------------------------------------------------------------------------------------
    async fetchLineChartForStatisticByUser(hasFamily) {
      if (this.user === "") {
        return;
      }
      if (!hasFamily) {
        this.user = this.userLogin.username;
      }
      this.isLoading = true;
      try {
        const response = await axios.get(
          `statistic/category-expense-over-time-user/${this.user}`,
          {
            params: {
              startDate: this.startDate || this.$route.query.startDate,
              endDate: this.endDate || this.$route.query.endDate,
            },
          }
        );
        const data = response.data.result;
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        this.user = this.$route.query.user;
        // Lấy tất cả ngày và số tiền cho từng category
        const expenses = data.flatMap((category) =>
          category.expenses.map((expense) => ({
            date: expense.date,
            amount: expense.amount,
            category: category.category,
          }))
        );

        // Sắp xếp expenses theo date tăng dần
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Gán labels và datasets
        this.lineDataForStatisticByUser.labels = [
          ...new Set(expenses.map((exp) => exp.date)),
        ]; // Lấy danh sách ngày duy nhất

        // Tạo datasets cho từng category
        this.lineDataForStatisticByUser.datasets = data.map((category) => {
          const amounts = this.lineDataForStatisticByUser.labels.map((date) => {
            // Lấy tổng số tiền cho từng ngày theo người dùng
            const totalAmount = expenses
              .filter(
                (exp) => exp.category === category.category && exp.date === date
              )
              .reduce((sum, exp) => sum + exp.amount, 0);
            return totalAmount; // Nếu không có chi tiêu trong ngày thì trả về 0
          });
          const randomColor = this.getRandomColorRGBA();
          return {
            label: category.category,
            data: amounts,
            backgroundColor: randomColor,
            borderColor: randomColor,
            fill: false,
          };
        });

        // Khởi tạo biểu đồ sau khi dữ liệu đã được cập nhật
        this.$nextTick(() => {
          this.createLineChartForStatisticByUser();
        });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        this.isLoading = false;
      }
    },
    createLineChartForStatisticByUser() {
      if (this.user === "") {
        return;
      }
      const lineChartForStatisticByUser = document
        .getElementById("lineChartForStatisticByUser")
        .getContext("2d");
      if (this.lineChartForStatisticByUser) {
        this.lineChartForStatisticByUser.destroy();
      }
      this.lineChartForStatisticByUser = new Chart(
        lineChartForStatisticByUser,
        {
          type: "line",
          data: this.lineDataForStatisticByUser,
          options: {
            animation: false,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          },
        }
      );
    },
  },
  watch: {
    "$route.query.user"(username) {
      this.user = username || "";
      if (this.userLogin.role !== "ROLE_USER") {
        this.fetchLineChartForStatisticAllMember(); // Gọi hàm để lấy dữ liệu từ API
        this.fetchPieChartForStatisticAllMember();
        this.fetchPieChartForStatisticAllCategory();
        this.fetchLineChartForStatisticAllCategory();
        this.fetchUsersFilter();
        if (this.user !== "") {
          this.fetchPieChartForStatisticByUser(true);
          this.fetchLineChartForStatisticByUser(true);
        }
      } else {
        this.fetchPieChartForStatisticByUser(false);
        this.fetchLineChartForStatisticByUser(false);
      }
    },
    "$route.query.startDate"(startDate) {
      this.startDate = startDate || null;
      if (this.userLogin.role !== "ROLE_USER") {
        this.fetchLineChartForStatisticAllMember(); // Gọi hàm để lấy dữ liệu từ API
        this.fetchPieChartForStatisticAllMember();
        this.fetchPieChartForStatisticAllCategory();
        this.fetchLineChartForStatisticAllCategory();
        this.fetchUsersFilter();
        if (this.user !== "") {
          this.fetchPieChartForStatisticByUser(true);
          this.fetchLineChartForStatisticByUser(true);
        }
      } else {
        this.fetchPieChartForStatisticByUser(false);
        this.fetchLineChartForStatisticByUser(false);
      }
    },
    "$route.query.endDate"(endDate) {
      this.endDate = endDate || null;
      if (this.userLogin.role !== "ROLE_USER") {
        this.fetchLineChartForStatisticAllMember(); // Gọi hàm để lấy dữ liệu từ API
        this.fetchPieChartForStatisticAllMember();
        this.fetchPieChartForStatisticAllCategory();
        this.fetchLineChartForStatisticAllCategory();
        this.fetchUsersFilter();
        if (this.user !== "") {
          this.fetchPieChartForStatisticByUser(true);
          this.fetchLineChartForStatisticByUser(true);
        }
      } else {
        this.fetchPieChartForStatisticByUser(false);
        this.fetchLineChartForStatisticByUser(false);
      }
    },
  },
};
</script>