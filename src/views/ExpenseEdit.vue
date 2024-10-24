<template>
  <!-- Main content -->
  <section class="content">
    <!-- Default box -->
    <div class="card">
      <div class="card-body row">
        <div class="col-3"></div>
        <div class="col-6">
          <form @submit.prevent="editExpense">
            <div class="form-group">
              <label for="inputName">Description</label>
              <input
                type="text"
                id="inputName"
                class="form-control"
                v-model="description"
                required
              />
            </div>
            <div class="form-group">
              <label for="inputEmail">Amount</label>
              <input
                type="number"
                id="inputEmail"
                class="form-control"
                v-model="amount"
                required
              />
            </div>
            <div class="form-group">
              <label for="inputSubject">Category</label>
              <input
                type="text"
                id="inputSubject"
                class="form-control"
                v-model="category"
                required
              />
            </div>
            <div class="form-group">
              <label for="inputEmail">Expense Date</label>
              <input
                type="datetime-local"
                id="inputEmail"
                class="form-control"
                v-model="expenseDate"
              />
            </div>
            <div class="form-group d-flex justify-content-between">
              <button
                type="submit"
                class="btn btn-success"
                style="width: 110px"
                :disabled="isLoading"
              >
                {{ isLoading ? "Submiting..." : "Submit" }}
              </button>
              <router-link to="/expenses" class="btn btn-info">
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
      expenseId: "",
      description: "",
      amount: "",
      category: "",
      expenseDate: (() => {
        const now = new Date();
        // Chuyển đổi thời gian hiện tại thành múi giờ địa phương
        const localDate = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        );
        return localDate.toISOString().slice(0, 16); // Chỉ lấy phần "YYYY-MM-DDTHH:mm"
      })(),
      isLoading: false,
    };
  },
  async mounted() {
    this.expenseId = this.$route.params.id; // Giả sử bạn truyền id trong route
    await this.fetchData(this.expenseId);
  },
  methods: {
    async fetchData(id) {
      try {
        const response = await axios.get(`expenses/${id}`); // Gọi API để lấy chi tiết chi phí
        const expense = response.data.result; // Giả sử API trả về thông tin chi phí dưới dạng đối tượng
        this.description = expense.description;
        this.amount = expense.amount;
        this.category = expense.category;
        this.expenseDate = expense.expenseDate;
      } catch (error) {
        notification.toastError("Error fetching expense data");
      }
    },

    async editExpense() {
      this.isLoading = true;
      try {
        await axios.put(`expenses/${this.expenseId}`, {
          description: this.description,
          amount: this.amount,
          category: this.category,
          expenseDate: this.expenseDate,
        });
        notification.toastSuccess("You have successfully edited!");
       this.$emit('expense-updated', this.$route.query.page || 1);
      } catch (error) {
        notification.toastError(error.response.data.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>