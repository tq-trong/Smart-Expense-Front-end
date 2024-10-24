<template>
  <body class="hold-transition login-page" style="background-color: cadetblue">
    <center>
      <fieldset>
        <legend style="margin-top: 7%">
          <img
            src="@/assets/logo-Smart-Expense.png"
            alt="logo"
            class="logoImage"
          />
        </legend>
      </fieldset>
    </center>
    <div class="login-box">
      <div class="card">
        <div class="card-body login-card-body">
          <p class="login-box-msg">
            <a
              href="#"
              :class="{ active: isLoginTab }"
              @click="isLoginTab = true"
              >Log in</a
            >
            |
            <a
              href="#"
              :class="{ active: !isLoginTab }"
              @click="isLoginTab = false"
              >Sign Up</a
            >
          </p>

          <!-- Form Login -->
          <form v-if="isLoginTab" id="loginForm" @submit.prevent="login">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                v-model="username"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-user"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="password"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="icheck-primary">
                  <input
                    type="checkbox"
                    name="remember_me"
                    value=""
                    id="remember_me"
                    v-model="rememberMe"
                  />
                  <label for="remember_me"> Remember me </label>
                </div>
              </div>
              <div class="col-6">
                <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Logging in..." : "Log in" }}
                </button>
              </div>
            </div>
          </form>

          <!-- Form Sign Up -->
          <form v-else id="registerForm" @submit.prevent="register">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                v-model="registerUsername"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-user"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="registerPassword"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm Password"
                v-model="confirmPassword"
                required
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  :disabled="isLoading || !passwordsMatch"
                >
                  {{ isLoading ? "Signing up..." : "Sign Up" }}
                </button>
              </div>
            </div>
            <p v-if="!passwordsMatch" class="text-danger">
              Passwords do not match!
            </p>
          </form>
        </div>
      </div>
    </div>
  </body>
</template>
<script>
import axios from "axios";
import NotificationComponent from "@/components/NotificationComponent";
const notification = new NotificationComponent();

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      isLoading: false,
      isLoginTab: true, // Để kiểm soát tab đăng nhập/đăng ký

      // Thông tin đăng ký
      registerUsername: "",
      registerPassword: "",
      confirmPassword: "",
    };
  },
  computed: {
    passwordsMatch() {
      return this.registerPassword === this.confirmPassword;
    },
  },
  methods: {
    async login() {
      this.isLoading = true;

      try {
        const response = await axios.post("auth/log-in", {
          username: this.username,
          password: this.password,
        });

        if (this.rememberMe) {
          localStorage.setItem("token", response.data.result.token);
        } else {
          sessionStorage.setItem("token", response.data.result.token);
        }

        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.result.token;
        this.$router.push("/dashboard");
      } catch (error) {
        notification.toastError(error.response.data.message);
      } finally {
        this.isLoading = false;
      }
    },

    async register() {
      if (!this.passwordsMatch) {
        notification.toastError("Passwords do not match!");
        return;
      }

      this.isLoading = true;

      try {
        await axios.post("users/register", {
          username: this.registerUsername,
          password: this.registerPassword,
        });

        notification.toastSuccess("Registration successful!");
        this.isLoginTab = true; // Chuyển sang tab đăng nhập sau khi đăng ký
      } catch (error) {
        notification.toastError(error.response.data.message);
        console.log(error.response.data);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
