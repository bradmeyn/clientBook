document.querySelectorAll(".accordian-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (
        item.contains(e.target) &&
        !e.target.parentElement.classList.contains("accordian-body")
      ) {
        item.classList.toggle("accordian-item-active");
        console.log(e.target);
      }
    });
  });