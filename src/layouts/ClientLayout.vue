<template>
  <div class="wrapper">
    <!--Header-->
    <Header />

    <!--Sidebar-->
    <Sidebar />

    <!--Main Form-->
    <router-view />

    <!--Footer-->
    <Footer />
  </div>
</template>

<script>
import Header from "../components/HeaderComponent.vue";
import Footer from "../components/FooterComponent.vue";
import Sidebar from "../components/SidebarComponent.vue";

export default {
  components: {
    Header,
    Footer,
    Sidebar,
  },
};
</script>