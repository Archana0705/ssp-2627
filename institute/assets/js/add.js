// sidebar
$(document).ready(function() {
    $('.toggle-sidebar-btn').click(function() {
        $('body').toggleClass('toggle-sidebar');
    });
});





// document.addEventListener('DOMContentLoaded', () => {
//     const selectElement = document.getElementById('fee');
//     const feesTableBody = document.getElementById('feesTableBody');
//     const subtotalElement = document.getElementById('subtotal');

//     function updateSubtotal() {
//       let subtotal = 0;
//       feesTableBody.querySelectorAll('input[type="text"]').forEach(input => {
//         subtotal += parseFloat(input.value) || 0;
//       });
//       subtotalElement.textContent = '₹' + subtotal.toFixed(2);
//     }

//     selectElement.addEventListener('change', (event) => {
//         const selectedOption = event.target.value;
//         const selectedOptionText = event.target.options[event.target.selectedIndex].text;

//         // Create table row
//         const tr = document.createElement('tr');

//         // Create dropdown cell
//         const tdDropdown = document.createElement('td');
//         tdDropdown.textContent = selectedOptionText;
//         tr.appendChild(tdDropdown);

//         // Create input cell
//         const tdInput = document.createElement('td');
//         const inputBox = document.createElement('input');
//         inputBox.type = 'text';
//         inputBox.placeholder = "₹0.00";
//         inputBox.classList.add('form-control');
//         tdInput.appendChild(inputBox);
//         tr.appendChild(tdInput);

//         // Event listener to handle input value and update subtotal
//         inputBox.addEventListener('input', (e) => {
//             let value = e.target.value.replace(/[^\d.]/g, ''); // Remove non-digit and non-decimal characters
//             inputBox.value = value;
//             updateSubtotal();
//         });

//         // Create checkbox cell
//         const tdCheckbox = document.createElement('td');
//         const checkboxContainer = document.createElement('div');
//         checkboxContainer.classList.add('form-check');
//         const checkbox = document.createElement('input');
//         checkbox.type = 'checkbox';
//         checkbox.classList.add('form-check-input');
//         checkbox.id = `checkbox-${selectedOption}`;
//         const checkboxLabel = document.createElement('label');
//         checkboxLabel.classList.add('form-check-label');
//         checkboxLabel.htmlFor = `checkbox-${selectedOption}`;
//         checkboxLabel.textContent = 'Refund Applicable';
//         checkboxContainer.appendChild(checkbox);
//         checkboxContainer.appendChild(checkboxLabel);
//         tdCheckbox.appendChild(checkboxContainer);
//         tr.appendChild(tdCheckbox);

//         // Create action cell with close button
//         const tdAction = document.createElement('td');
//         const closeButton = document.createElement('button');
//         closeButton.textContent = 'x';
//         closeButton.classList.add('close-button', 'btn', 'btn-danger');
//         closeButton.addEventListener('click', () => {
//             feesTableBody.removeChild(tr);
//             updateSubtotal();

//             // Add the option back to the select
//             const option = document.createElement('option');
//             option.value = selectedOption;
//             option.textContent = selectedOptionText;
//             selectElement.appendChild(option);
//         });
//         tdAction.appendChild(closeButton);
//         tr.appendChild(tdAction);

//         // Add row to the table body
//         feesTableBody.appendChild(tr);

//         // Remove the selected option from the select
//         selectElement.removeChild(event.target.options[event.target.selectedIndex]);

//         // Reset the select to default value
//         selectElement.value = "";
        
//         // Update the subtotal
//         updateSubtotal();
//     });
//   });