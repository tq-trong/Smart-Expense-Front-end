<template>
  <!-- Main content -->
  <section class="content">
    <!-- Default box -->
    <div class="card">
      <div class="card-body row">
        <div class="col-3"></div>
        <div class="col-6">
          <form @submit.prevent="createInvitation">
            <div class="form-group">
              <label for="inputName">Username</label>
              <input
                type="text"
                id="inputName"
                class="form-control"
                v-model="username"
                required
              />
            </div>
            <div class="form-group d-flex justify-content-between">
              <button
                type="submit"
                class="btn btn-success"
                style="width: 110px"
                :disabled="isLoading"
              >
                {{ isLoading ? "Inviting..." : "Invite" }}
              </button>
              <router-link to="/invitations" class="btn btn-info">
                Back to List
              </router-link>
            </div>
          </form>
        </div>
        <div class="col-3"></div>
      </div>
    </div>
  </section>
  <!-- /.content -->
</template>
<script>
import axios from "axios";
import NotificationComponent from "@/components/NotificationComponent";

const notification = new NotificationComponent();

export default {
  data() {
    return {
      username: "",
      isLoading: false,
    };
  },
  methods: {
    async createInvitation() {
      this.isLoading = true;
      try {
        await axios.post("invitations", {
          invitee: this.username,
        });
        notification.toastSuccess("You have successfully sent an invitation to " + this.username + "!");
       this.$emit('invitation-updated', this.$route.query.page || 1);
      } catch (error) {
        notification.toastError(error.response.data.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>