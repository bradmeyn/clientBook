const inputContainer = document.getElementById('input-container')
const inputBox = document.getElementById('input-box');

const dropdown = document.getElementById('dropdown');

document.addEventListener("click", event => {
  dropdown.classList.remove('dropdown--active');
});

//focus on input when item clicked
inputContainer.addEventListener('click', e => {
    
    inputBox.focus();
  });


  const getClients = async query => {
    let res = await fetch('/clients/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify({
        'query': query
      })
    });
    return await res.json();
  }

  const displayClients = clients => {
    dropdown.innerHTML = '';
    dropdown.classList.add('dropdown--active');
   if(clients.length){
    clients.forEach(client => {
      const li = document.createElement('li');
      dropdown.appendChild(li);
      li.classList.add('dropdown__item');
  
      li.innerHTML = `
        <a class="dropdown__link" href="/clients/${client._id}">
          <span class="client-name">
            ${client.fullName}
          </span>
          <span class="client-number">
            (${client.clientId})
          </span>
        </a>
      `
    });
   } else {
    const li = document.createElement('li');
    dropdown.appendChild(li);
    li.classList.add('dropdown__item');

    li.innerHTML = `
      <span class="dropdown__link">
          <span class="client-name">
            No client found
          </span>
      </span>
    `
   }
  }

const searchClients = async e => {
  const clients = await getClients(e.target.value);
  console.log(clients);
  displayClients(clients);
}

inputBox.addEventListener('input', searchClients);

var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')



var myModal = new bootstrap.Modal(document.getElementById('myModal'), options);
myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})