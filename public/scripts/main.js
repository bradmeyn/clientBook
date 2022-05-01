document.querySelectorAll('.accordian-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    if (
      item.contains(e.target) &&
      !e.target.parentElement.classList.contains('accordian-body')
    ) {
      item.classList.toggle('accordian-item-active');
      console.log(e.target);
    }
  });
});

//input filter options

const checkboxFilters = document.querySelectorAll('.check-filter');

const params = new URLSearchParams(window.location.search);

for (const input of checkboxFilters) {
  for (const param of params.values()) {
    if (input.value === param) {
      input.checked = true;
    }
  }
}

console.log();

const statusFilters = document.querySelectorAll('.status-filter');
const statusAll = document.querySelector('#statusAll');

statusFilters.forEach((box) => {
  box.addEventListener('change', () => {
    statusAll.checked = false;
  });
});

statusAll.addEventListener('change', () => {
  statusFilters.forEach((box) => {
    box.checked = false;
  });
});

if (!params.has('status')) {
  statusAll.checked = true;
}

const typeFilters = document.querySelectorAll('.type-filter');
const typeAll = document.querySelector('#typeAll');

typeFilters.forEach((box) => {
  box.addEventListener('change', () => {
    typeAll.checked = false;
  });
});

typeAll.addEventListener('change', () => {
  typeFilters.forEach((box) => {
    box.checked = false;
  });
});

if (!params.has('type')) {
  typeAll.checked = true;
}

const minFilter = document.querySelector('#filter-min');
const maxFilter = document.querySelector('#filter-max');
if (params.has('min')) {
  minFilter.value = params.get('min');
}

if (params.has('max')) {
  maxFilter.value = params.get('max');
}
