<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Expenses Management</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Expenses Management</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <router-view @expense-updated="fetchExpenses" />
    <section class="content" v-if="$route.name == 'expenses'">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <router-link to="/expenses/create" class="btn btn-success btn-sm">
              <i class="fas fa-plus"></i> Add new Expense
            </router-link>
            <p></p>
            <div class="card">
              <div class="card-header">
                <div class="row">
                  <div class="col-md-3 col-sm-12">
                    <label class="mr-2">User:</label>
                    <select
                      class="form-control select2"
                      style="width: 100%"
                      v-model="user"
                    >
                      <option value="all">All users</option>
                      <option
                        v-for="(user, index) in usersFilter"
                        :key="index"
                        :value="user"
                      >
                        {{ user }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2 col-sm-12">
                    <label class="mr-2">Start Date:</label>
                    <input
                      type="date"
                      v-model="startDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-2 col-sm-12">
                    <label class="mr-2">End Date:</label>
                    <input
                      type="date"
                      v-model="endDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <label class="mr-2">Category:</label>
                    <select
                      class="form-control select2"
                      style="width: 100%"
                      v-model="category"
                    >
                      <option value="all">All categories</option>
                      <option
                        v-for="(category, index) in categoryFilter"
                        :key="index"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2 col-sm-12">
                    <label class="mr-2">Search:</label>
                    <div class="input-group">
                      <input
                        v-model="searchKeyword"
                        type="text"
                        class="form-control"
                        placeholder="Search ..."
                      />
                      <div class="input-group-append">
                        <router-link
                          :to="{
                            name: 'expenses',
                            query: {
                              page: 1,
                              user: user,
                              startDate: startDate,
                              endDate: endDate,
                              category: category,
                              search: searchKeyword,
                            },
                          }"
                          class="btn btn-outline-info"
                        >
                          <i class="fas fa-search"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-body">
                <!-- /.col -->
                <div class="col-md-12">
                  <div class="card">
                    <!-- /.card-header -->
                    <div class="card-body p-0">
                      <div class="table-responsive">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th style="width: 10px">#</th>
                              <th>Username</th>
                              <th>Expense Description</th>
                              <th>Amount</th>
                              <th>Category</th>
                              <th>Expense Date</th>
                              <th style="width: 270px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(expense, index) in expenses"
                              :key="expense.id"
                            >
                              <td><strong>{{ (currentPage - 1) * 10 + index + 1 + '.'}}</strong></td>
                              <td>{{ expense.username }}</td>
                              <td>{{ expense.description }}</td>
                              <td>{{ expense.amount }}</td>
                              <td>{{ expense.category }}</td>
                              <td>
                                {{
                                  new Date(expense.expenseDate).toLocaleString()
                                }}
                              </td>
                              <td>
                                <router-link
                                  :to="{ path: '/expenses/edit/' + expense.id }"
                                  class="btn btn-warning btn-sm"
                                >
                                  <i class="fas fa-edit"> Edit</i>
                                </router-link>
                                |
                                <a
                                  class="btn btn-danger btn-sm"
                                  @click.prevent="deleteExpense(expense.id)"
                                >
                                  <i class="fas fa-trash"> Delete</i>
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <!-- /.card -->
                </div>
                <!-- /.col -->
              </div>
              <!-- Hiển thị thanh phân trang -->
              <div class="card-footer clearfix">
                <ul class="pagination pagination-sm m-0 float-right">
                  <li class="page-item">
                    <router-link
                      :to="{
                        name: 'expenses',
                        query: {
                          page: currentPage < 1 ? currentPage - 1 : 1,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
                          category: category,
                          search: searchKeyword,
                        },
                      }"
                      class="page-link"
                      :class="{ active: currentPage === 1 }"
                      >&laquo;</router-link
                    >
                  </li>
                  <li
                    v-for="pageNumber in displayedPages"
                    :key="pageNumber"
                    class="page-item"
                  >
                    <router-link
                      :to="{
                        name: 'expenses',
                        query: {
                          page: pageNumber,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
                          category: category,
                          search: searchKeyword,
                        },
                      }"
                      class="page-link"
                      :class="{ active: currentPage === pageNumber }"
                      >{{ pageNumber }}</router-link
                    >
                  </li>
                  <li class="page-item">
                    <router-link
                      :to="{
                        name: 'expenses',
                        query: {
                          page:
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
                          category: category,
                          search: searchKeyword,
                        },
                      }"
                      class="page-link"
                      :class="{ active: currentPage === totalPages }"
                      >&raquo;</router-link
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import MethodComponent from "@/components/methods/MethodComponent.vue";
import NotificationComponent from "@/components/NotificationComponent";
import axios from "axios";

const notificationComponent = new NotificationComponent();

export default {
  data() {
    return {
      user: "all",
      category: "all",
      expenses: [],
      usersFilter: [],
      categoryFilter: [],
      totalPages: 0,
      maxDisplayedPages: 0,
      currentPage: 1,
      searchKeyword: "",
      startDate: null,
      endDate: null,
    };
  },
  computed: {
    displayedPages() {
      return MethodComponent.methods.calculateDisplayedPages(
        this.currentPage,
        this.totalPages
      );
    },
  },
  methods: {
    async onExpenseAdded(page) {
      await this.fetchExpenses(page);
      this.clearParams();
    },

    clearParams() {
      this.user = "all";
      this.startDate = null;
      this.endDate = null;
      this.category = "all";
      this.searchKeyword = null;
    },
    async fetchExpenses(page) {
      try {
        const response = await axios.get("expenses", {
          params: {
            page: page,
            username: this.user || this.$route.query.user,
            startDate: this.startDate || this.$route.query.startDate,
            endDate: this.endDate || this.$route.query.endDate,
            category: this.category || this.$route.query.category,
            search: this.searchKeyword || this.$route.query.search,
          },
        });
        this.fetchUsersFilter();
        this.fetchCategoriesFilter();
        this.searchKeyword = this.$route.query.search;
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        this.category = this.$route.query.category;
        this.user = this.$route.query.user;

        this.expenses = response.data.result;
        this.totalPages = response.data.totalPage;
        this.currentPage = response.data.page;
        this.maxDisplayedPages = response.data.limitItem;
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    async deleteExpense(id) {
      const confirmed = await notificationComponent.alertConfirm(
        "Are you sure you want to delete this?"
      );
      if (confirmed) {
        try {
          await axios.delete(`/expenses/${id}`); // Gọi API để xóa
          this.fetchExpenses(1);
          notificationComponent.toastSuccess("Expense deleted successfully!");
        } catch (error) {
          notificationComponent.toastError(error.response.data.message); // Thông báo lỗi
        }
      }
    },
    async fetchUsersFilter() {
      try {
        const response = await axios.get("/users/username");
        if (!this.user || this.user === "") {
          this.user = "all";
        }
        this.usersFilter = response.data.result;
      } catch (error) {
        console.error("Error fetching users filter:", error);
      }
    },
    async fetchCategoriesFilter() {
      try {
        const response = await axios.get("/expenses/categories");
        if (!this.category || this.category === "") {
          this.category = "all";
        }
        this.categoryFilter = response.data.result;
      } catch (error) {
        console.error("Error fetching categories filter:", error);
      }
    },
  },
  mounted() {
    const page = parseInt(this.$route.query.page) || 1;
    this.fetchExpenses(page);
    this.currentPage = page;
  },
  watch: {
    "$route.query.page"(newPage) {
      this.fetchExpenses(parseInt(newPage) || 1);
      this.currentPage = parseInt(newPage) || 1;
    },
    "$route.query.user"(username) {
      this.user = username || "all";
      this.fetchExpenses(this.currentPage);
    },
    "$route.query.startDate"(startDate) {
      this.startDate = startDate || null;
      this.fetchExpenses(this.currentPage);
    },
    "$route.query.endDate"(endDate) {
      this.endDate = endDate || null;
      this.fetchExpenses(this.currentPage);
    },
    "$route.query.category"(category) {
      this.category = category || "all";
      this.fetchExpenses(this.currentPage);
    },
    "$route.query.search"(newKeyword) {
      this.searchKeyword = newKeyword || "";
      this.fetchExpenses(this.currentPage);
    },
  },
};
</script>
