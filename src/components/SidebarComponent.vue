<template>
  <aside class="main-sidebar elevation-4 sidebar-light-olive">
    <!-- Brand Logo -->
    <router-link to="/dashboard" class="brand-link">
      <img
        src="@/assets/logo-Smart-Expense.png"
        alt="AdminLTE Logo"
        class="brand-image img-size-50"
        style="opacity: 0.8"
      />
      <span class="brand-text fontawesome" style="font-size: 0.75em"
        ><b>SMART EXPENSE</b></span
      >
    </router-link>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="info">
          <a href="#" class="d-block">Hello, {{ user.username }}</a>
        </div>
      </div>
      <!-- SidebarSearch Form -->

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
          id="menu"
        >
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>Dashboard</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="user.role !== 'ROLE_USER'">
            <router-link to="/family-members" class="nav-link">
              <i class="nav-icon fas fa-users"></i>
              <p>Family Members</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/expenses" class="nav-link">
              <i class="nav-icon fas fa-wallet"></i>
              <p>Expense Management</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/invitations" class="nav-link">
              <i class="nav-icon fas fa-handshake"></i>
              <p>Invitations</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/logs" class="nav-link">
              <i class="nav-icon fas fa-book"></i>
              <p>Logs</p>
            </router-link>
          </li>
          <div class="user-panel mt-3 pb-3 mb-3 d-flex"></div>
          <li class="nav-item">
            <a @click.prevent="signOut" class="nav-link">
              <i class="nav-icon fas fa-sign-out-alt"> </i>
              <p>Sign Out</p>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import axios from "axios";
import UserComponent from "@/components/UserComponent";

const userComponent = new UserComponent();

export default {
  data() {
    return {
      user: {
        username: "",
        role: "",
      },
    };
  },
  created() {
    this.getUserInfoFromToken();
  },

  methods: {
    getUserInfoFromToken() {
      const userInfo = userComponent.getUserFromToken();
      this.user.username = userInfo.sub;
      this.user.role = userInfo.scope;
    },
    async signOut() {
      try {
        // Gửi yêu cầu đăng xuất tới API
        await axios.post("auth/logout");

        // Kiểm tra và xóa token khỏi localStorage nếu có
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }

        // Kiểm tra và xóa token khỏi sessionStorage nếu có
        if (sessionStorage.getItem("token")) {
          sessionStorage.removeItem("token");
        }

        // Chuyển hướng người dùng đến trang đăng nhập
        this.$router.push("/login");
      } catch (error) {
        console.error("Error during sign out:", error);
      } finally {
        // Kiểm tra và xóa token khỏi localStorage nếu có
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }

        // Kiểm tra và xóa token khỏi sessionStorage nếu có
        if (sessionStorage.getItem("token")) {
          sessionStorage.removeItem("token");
        }
        this.$router.push("/login");
      }
    },
  },
};
</script>
