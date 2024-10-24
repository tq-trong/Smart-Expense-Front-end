<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Invitations</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/dashboard">Home</router-link>
              </li>
              <li class="breadcrumb-item active">Invitations</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <router-view @invitation-updated="fetchInvitations" />
    <section class="content" v-if="$route.name == 'invitations'">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <router-link
              to="/invitations/invite"
              class="btn btn-success btn-sm"
            >
              <i class="fas fa-plus"></i> Send an Invite
            </router-link>
            <p></p>
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
                            name: 'invitations',
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
                            <th>Inviter</th>
                            <th>Invitee</th>
                            <th>Invited Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(invitation, index) in invitations"
                            :key="invitation.id"
                          >
                            <td><strong>{{ (currentPage - 1) * 10 + index + 1 + '.'}}</strong></td>
                            <td>{{ invitation.inviter.username }}</td>
                            <td>{{ invitation.invitee }}</td>
                            <td>
                              {{
                                new Date(
                                  invitation.createdDate
                                ).toLocaleString()
                              }}
                            </td>
                            <!-- if(userLogin == inviter ) 1
                                  if(userlogin == invitee && status pending) 2-->
                            <td>
                              <template
                                v-if="
                                  userLogin === invitation.invitee &&
                                  invitation.status.description === 'Pending'
                                "
                              >
                                <div class="row">
                                  <div class="col">
                                    <a
                                      class="btn btn-success btn-sm"
                                      @click.prevent="
                                        updateStatusInvitation(
                                          invitation.id,
                                          'ACCEPTED'
                                        )
                                      "
                                      style="width: 80px"
                                      :disabled="isLoading"
                                    >
                                      <i class="fas fa-check"> Accept</i>
                                    </a>
                                    |
                                    <a
                                      class="btn btn-danger btn-sm"
                                      @click.prevent="
                                        updateStatusInvitation(
                                          invitation.id,
                                          'REJECTED'
                                        )
                                      "
                                      style="width: 80px"
                                      :disabled="isLoading"
                                    >
                                      <i class="fas fa-times"> Reject</i>
                                    </a>
                                  </div>
                                </div>
                              </template>
                              <template v-else>
                                <spain
                                  :class="
                                    getBadgeClass(invitation.status.description)
                                  "
                                  >{{ invitation.status.description }}</spain
                                >
                              </template>
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
                        name: 'invitations',
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
                        name: 'invitations',
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
                        name: 'invitations',
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
import NotificationComponent from "@/components/NotificationComponent";
import UserComponent from "@/components/UserComponent";
import axios from "axios";

const notificationComponent = new NotificationComponent();
export default {
  data() {
    return {
      userLogin: '',
      invitations: [],
      totalPages: 0,
      currentPage: 1,
      searchKeyword: "",
      badge: "",
      isLoading: false,
    };
  },
  created() {
    const userComponent = new UserComponent(); // Khởi tạo trong created
    const userInfo = userComponent.getUserFromToken();
    if (userInfo) {
      this.userLogin = userInfo.sub; // Gán nếu userInfo không null
    } else {
      console.warn('No user information found in token.');
    }
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
    async fetchInvitations(page) {
      this.isLoading = true;
      try {
        const response = await axios.get("invitations", {
          params: {
            page: page,
            search: this.searchKeyword || this.$route.query.search || "",
          },
        });
        this.invitations = response.data.result;
        this.totalPages = response.data.totalPage;
        this.currentPage = response.data.page;
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    },
    async updateStatusInvitation(id, status) {
      const confirmed = await notificationComponent.alertConfirm(
        "Are you sure?"
      );
      if (confirmed) {
        try {
          await axios.put(`/invitations/${id}`, {
            status: {
              statusCode: status,
            },
          }); // Gọi API để xóa
          this.fetchInvitations(1);
          notificationComponent.toastSuccess("You are just " + status + "!");
        } catch (error) {
          notificationComponent.toastError(error.response.data.message); // Thông báo lỗi
        } finally {
          this.isLoading = false;
        }
      }
    },
    getBadgeClass(status) {
      if (status === "Pending") return "badge badge-warning";
      if (status === "Accepted") return "badge badge-success";
      return "badge badge-danger";
    },
  },
  mounted() {
    const page = parseInt(this.$route.query.page) || 1;
    this.fetchInvitations(page);
    this.currentPage = page;
  },
  watch: {
    "$route.query.page"(newPage) {
      this.fetchInvitations(parseInt(newPage) || 1);
      this.currentPage = parseInt(newPage) || 1;
    },
    "$route.query.search"(newKeyword) {
      this.searchKeyword = newKeyword || "";
      this.fetchInvitations(this.currentPage);
    },
  },
};
</script>