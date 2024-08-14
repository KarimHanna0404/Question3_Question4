function getCurrentDate() {
    var d = new Date();
    var s = d.getSeconds();
    var m = d.getMinutes();
    var h = d.getHours();
    var dd = d.getDate();
    var mm = d.getMonth() + 1; 
    var yyyy = d.getFullYear();
    return mm + '/' + dd + '/' + yyyy + ' ' + h + ':' + m + ':' + s;
}

function updateTime() {
    var today = getCurrentDate();
    var header = document.querySelector("#Date-Container");
    header.textContent = today;
}

setInterval(updateTime, 1000);

document.addEventListener('DOMContentLoaded', function() {
    const animalTypeSelect = document.getElementById('animal-type');
    const catBreedCheckboxes = document.querySelectorAll('.cat-breed-checkbox');
    const dogBreedCheckboxes = document.querySelectorAll('.dog-breed-checkbox');
    
    catBreedCheckboxes.forEach(checkbox => checkbox.disabled = true);
    dogBreedCheckboxes.forEach(checkbox => checkbox.disabled = true);

    animalTypeSelect.addEventListener('change', function() {
        console.log("changed");
        const selectedType = this.value;

        if (selectedType === 'cat') {
            dogBreedCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });

            catBreedCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        } else if (selectedType === 'dog') {
            catBreedCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });

            dogBreedCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
        } else {
            catBreedCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            dogBreedCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
        }
    });
});


// function isEmpty() {
//     var validate = document.querySelectorAll("#PetForm [required], #PetForm input[type='checkbox']");
//     var isAnyChecked = false;
    
//     for (var field of validate) {
//         if ((field.type === 'checkbox' && field.checked) || (field.value && field.type !== 'checkbox')) {
//             isAnyChecked = true;
//         } else if (field.type !== 'checkbox' && !field.value) {
//             alert("Please fill in all required fields.");
//             return false;
//         }
//     }
    
//     if (!isAnyChecked) {
//         alert("Please fill in all required fields.");
//         return false;
//     }
    
//     return true;
// }

// document.getElementById("Frm1")?.addEventListener("submit", function(event) {
//     if (!isEmpty()) {
//         event.preventDefault();
//     }
// });

document.getElementById("Frm2")?.addEventListener("submit", function(event) {
    if (!isEmpty()) {
        event.preventDefault();
    }
});

document.getElementById("PetForm2")?.addEventListener("submit", function(event) {
    if (!isEmpty()) {
        event.preventDefault();
    }
});

const form = document.getElementById("Account-Created");

form?.addEventListener('submit', function(event) {
    const username = form.querySelector('input[name="username"]').value;
    const password = form.querySelector('input[name="password"]').value;

    console.log(username, password);

    const usernamePattern = /^[a-zA-Z0-9]+$/; 
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/; 

    if (!usernamePattern.test(username)) {
        displayModal('Username can only contain letters and digits.');
        event.preventDefault();
        return;
    }

    if (!passwordPattern.test(password)) {
        displayModal('Password must be at least 4 characters long and include at least one letter and one digit.');
        event.preventDefault();
        return;
    }
});




function displayModal(message) {
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;

    const modal = document.getElementById('modal');
    modal.style.display = 'flex';

    const closeModal = document.getElementById('close-modal');
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });


}


