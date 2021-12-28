

const firstName = document.getElementById('firstName');

function hasNumber(myString) {
  return /\d/.test(myString);
}



(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {

          if(hasNumber(firstName.value)){
            console.log('error')
            firstName.classList.add('is-invalid')
          }



          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })();

 