<script>
export default {
  methods: {
    calculateDisplayedPages(currentPage, totalPages) {
      //Hàm hiển thị thanh phân trang
      const maxDisplayedPages = 5;
      const middlePage = Math.ceil(maxDisplayedPages / 2);
      let startPage = currentPage - middlePage + 1;
      if (startPage < 1) {
        startPage = 1;
      }
      let endPage = startPage + maxDisplayedPages - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxDisplayedPages + 1);
      }
      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    },
  },
};
</script>