const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');


dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    handleDrop(e.dataTransfer.files);
});

dropArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleDrop(e.target.files);
});

function handleDrop(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
        if (file.size > maxSize) {
            alert(`${file.name} exceeds the maximum allowed file size.`);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Send the file to the server
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(message => {
                // Display the download link to the uploader
                showConfirmation(message);
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while uploading the file.');
            });
    }
}

let confirmationDiv = null; // Declare the confirmationDiv outside the function

function showConfirmation(message) {
    if (confirmationDiv) {
        document.body.removeChild(confirmationDiv); // Remove previous confirmation if exists
    }

    confirmationDiv = document.createElement('div');
    confirmationDiv.classList.add('confirmation');

    const confirmationContent = document.createElement('div');
    confirmationContent.classList.add('confirmation-content');
    confirmationContent.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(confirmationDiv);
        confirmationDiv = null; // Reset the confirmationDiv
    });

    confirmationContent.appendChild(closeButton);
    confirmationDiv.appendChild(confirmationContent);
    document.body.appendChild(confirmationDiv);
}