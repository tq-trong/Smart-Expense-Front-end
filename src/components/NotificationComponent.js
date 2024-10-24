import Swal from "sweetalert2";

export default class NotificationComponent {
    swalTopRight() {
        // Hàm set các props cho toast top-right
        return Swal.mixin({
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
        });
    }

    swalCenter() {
        // Hàm set các props cho toast center
        return Swal.mixin({
            showCancelButton: true,
        });
    }

    showToastAlert(swal, icon, title) {
        // Hàm gọi toast
        return swal.fire({
            icon: icon,
            title: title,
        });
    }

    toastSuccess(message) {
        this.showToastAlert(this.swalTopRight(), "success", message);
    }

    toastError(message) {
        this.showToastAlert(this.swalTopRight(), "error", message);
    }

    alertConfirm(message) {
        return this.showToastAlert(this.swalCenter(), "warning", message).then((result) => {
            return result.isConfirmed; // true nếu người dùng chọn "Yes", false nếu chọn "No"
        });
    }
}
