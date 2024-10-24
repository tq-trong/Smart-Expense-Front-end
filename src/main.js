import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios'
import NotificationComponent from './components/NotificationComponent'

import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css?v=3.2.0'
import 'admin-lte/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css'
import 'admin-lte/plugins/daterangepicker/daterangepicker.css'
import 'admin-lte/plugins/select2/css/select2.min.css'


import 'admin-lte/plugins/jquery/jquery.min.js'
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js'
import 'admin-lte/dist/js/adminlte.min.js?v=3.2.0'
import 'admin-lte/plugins/chart.js/Chart.min.js'
import 'admin-lte/plugins/sweetalert2/sweetalert2.min.js'
import 'admin-lte/plugins/inputmask/jquery.inputmask.min.js'
import 'admin-lte/plugins/daterangepicker/daterangepicker.js'
import 'admin-lte/plugins/select2/js/select2.full.min.js'

const app = createApp(App).use(router);

// Cấu hình bắt lỗi toàn cục
app.config.errorHandler = (err, vm, info) => {
    console.error(`Error: ${err.toString()}\nInfo: ${info} ${vm}`);
    
    const notificationComponent = new NotificationComponent();
    notificationComponent.toastError("An unexpected error occurred. Please try again later.");
};

app.mount('#app');