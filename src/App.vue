<template>
  <body class="hold-transition sidebar-mini layout-fixed">
    <div class="wrapper">
      <div
        class="preloader flex-column justify-content-center align-items-center"
      >
        <img
          class="animation__shake"
          src="@/assets/logo-Smart-Expense.png"
          alt="AdminLTELogo"
          height="60"
          width="60"
        />
      </div>
      <component :is="$route.meta.layout || 'div'"></component>
    </div>
  </body>
</template>


