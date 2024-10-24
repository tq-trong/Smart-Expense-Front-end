<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Logs</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><router-link to="/dashboard">Home</router-link></li>
              <li class="breadcrumb-item active">Logs</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
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
                  <div class="col-md-3 col-sm-12">
                    <label class="mr-2">Start Date:</label>
                    <input
                      type="date"
                      v-model="startDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <label class="mr-2">End Date:</label>
                    <input
                      type="date"
                      v-model="endDate"
                      class="form-control"
                      style="width: 100%"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
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
                            name: 'logs',
                            query: {
                              page: 1,
                              user: user,
                              startDate: startDate,
                              endDate: endDate,
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
                              <th>Description</th>
                              <th>Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(log, index) in logs"
                              :key="log.id"
                            >
                              <td><strong>{{ (currentPage - 1) * 10 + index + 1 + '.'}}</strong></td>
                              <td>{{ log.user.username }}</td>
                              <td>{{ log.description }}</td>
                              <td>{{ new Date(log.createdDate).toLocaleString() }}</td>
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
                        name: 'logs',
                        query: {
                          page: currentPage < 1 ? currentPage - 1 : 1,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
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
                        name: 'logs',
                        query: {
                          page: pageNumber,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
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
                        name: 'logs',
                        query: {
                          page:
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages,
                          user: user,
                          startDate: startDate,
                          endDate: endDate,
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
import axios from "axios";

export default {
  data() {
    return {
      user: "all",
      usersFilter: [],
      logs: [],
      totalPages: 0,
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
    
    async fetchLogs(page) {
      try {
        const response = await axios.get("logs", {
          params: {
            page: page,
            username: this.user || this.$route.query.user,
            startDate: this.startDate || this.$route.query.startDate,
            endDate: this.endDate || this.$route.query.endDate,
            search: this.searchKeyword || this.$route.query.search,
          },
        });
        this.fetchUsersFilter();
        this.searchKeyword = this.$route.query.search;
        this.startDate = this.$route.query.startDate;
        this.endDate = this.$route.query.endDate;
        this.user = this.$route.query.user;

        this.logs = response.data.result;
        this.totalPages = response.data.totalPage;
        this.currentPage = response.data.page;
      } catch (error) {
        console.error("Error fetching logs:", error);
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
    
  },
  mounted() {
    const page = parseInt(this.$route.query.page) || 1;
    this.fetchUsersFilter();
    this.fetchLogs(page);
    this.currentPage = page;
  },
  watch: {
    "$route.query.page"(newPage) {
      this.fetchLogs(parseInt(newPage) || 1);
      this.currentPage = parseInt(newPage) || 1;
    },
    "$route.query.user"(username) {
      this.user = username || "all";
      this.fetchLogs(this.currentPage);
    },
    "$route.query.startDate"(startDate) {
      this.startDate = startDate || null;
      this.fetchLogs(this.currentPage);
    },
    "$route.query.endDate"(endDate) {
      this.endDate = endDate || null;
      this.fetchLogs(this.currentPage);
    },
    "$route.query.search"(newKeyword) {
      this.searchKeyword = newKeyword || "";
      this.fetchLogs(this.currentPage);
    },
  },
};
</script>