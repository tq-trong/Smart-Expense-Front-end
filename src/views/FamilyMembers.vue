<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Family Members</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Family Members</li>
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
                  <div class="col-md-3 col-sm-12"></div>
                  <div class="col-md-3 col-sm-12"></div>
                  <div class="col-md-3 col-sm-12"></div>
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
                          name: 'family-members',
                          query: {
                            page: 1,
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
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th style="width: 10px">#</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Created Date</th>
                            <th style="width: 270px"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(user, index) in users" :key="user.id">
                            <td><strong>{{ (currentPage - 1) * 10 + index + 1 + '.'}}</strong></td>
                            <td>{{ user.username }}</td>
                            <td>{{ user.roles[0].name }}</td>
                            <td>{{ new Date(user.createdDate).toLocaleString() }}</td>
                            <!-- <td>
                              <span
                                :class="
                                  user.roles.name
                                    ? 'badge bg-danger'
                                    : 'badge bg-warning'
                                "
                              >
                                {{ admin.role ? "admin" : "usermanager" }}
                              </span>
                            </td> -->
                            <td>
                              <div class="row">
                                <div class="col">
                                  <a class="btn btn-danger btn-sm"  @click.prevent="deleteUser(user.username)">
                                    <i class="fas fa-trash"> Delete</i>
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!-- /.card-body -->
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
                        name: 'family-members',
                        query: {
                          page: currentPage < 1 ? currentPage - 1 : 1,
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
                        name: 'family-members',
                        query: { page: pageNumber, search: searchKeyword },
                      }"
                      class="page-link"
                      :class="{ active: currentPage === pageNumber }"
                      >{{ pageNumber }}</router-link
                    >
                  </li>
                  <li class="page-item">
                    <router-link
                      :to="{
                        name: 'family-members',
                        query: {
                          page:
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages,
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
import NotificationComponent from '@/components/NotificationComponent';

const notificationComponent = new NotificationComponent();

export default {
  data() {
    return {
      users: [],
      totalPages: 0,
      maxDisplayedPages: 0,
      currentPage: 1,
      searchKeyword: "",
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
    async fetchUsers(page) {
      try {
        const response = await axios.get("families", {
          params: {
            page: page,
            search: this.searchKeyword || this.$route.query.search || "",
          },
        });
        this.users = response.data.result;
        this.totalPages = response.data.totalPage;
        this.currentPage = response.data.page;
        this.maxDisplayedPages = response.data.limitItem;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async deleteUser(username) {
      const confirmed = await notificationComponent.alertConfirm(
        "Are you sure you want to delete this user from your family?"
      );
      if (confirmed) {
        try {
          await axios.delete(`/families/${username}`); // Gọi API để xóa
          this.fetchUsers(1);
          notificationComponent.toastSuccess("User deleted successfully from you family!");
        } catch (error) {
          notificationComponent.toastError(error.response.data.message); // Thông báo lỗi
        }
      }
    },
  },
  mounted() {
    const page = parseInt(this.$route.query.page) || 1;
    this.fetchUsers(page);
    this.currentPage = page;
  },
  watch: {
    "$route.query.page"(newPage) {
      this.fetchUsers(parseInt(newPage) || 1);
      this.currentPage = parseInt(newPage) || 1;
    },
    "$route.query.search"(newKeyword) {
      this.searchKeyword = newKeyword || "";
      this.fetchUsers(this.currentPage);
    },
  },
};
</script>
