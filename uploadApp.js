function uploadImage() {
    const formData = new FormData(document.getElementById('uploadForm'));

    fetch('http://127.0.0.1:3000/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Image uploaded successfully!');
            document.getElementById('preview').innerHTML = `<img src="${data.filePath}" alt="Uploaded Image">`;
        })
        .catch(error => console.error('Error:', error));
}

function convertToTextFile() {
    const textContent = document.getElementById('textInput').value;

    fetch('http://127.0.0.1:3000/convertToTextFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textContent }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Text file saved successfully!');
    })
    .catch(error => console.error('Error:', error));
}



// Function to list files with previews
function listFiles() {
    fetch('http://127.0.0.1:3000/listFiles')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Files:', data);
            const fileListDiv = document.getElementById('fileList');
            fileListDiv.innerHTML = ''; // Clear previous content
            data.files.forEach(file => {
                const fileExtension = file.split('.').pop().toLowerCase();
                const filePreview = document.createElement('div');

                if (fileExtension === 'txt') {
                    // Display text file preview
                    fetch(`http://127.0.0.1:3000/uploads/${file}`)
                        .then(response => response.text())
                        .then(text => {
                            const textPreview = document.createElement('p');
                            textPreview.textContent = text;
                            filePreview.appendChild(textPreview);
                            fileListDiv.appendChild(filePreview);
                        })
                        .catch(error => console.error('Error fetching text file:', error));
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                    // Display image file preview
                    const imagePreview = document.createElement('img');
                    imagePreview.src = `http://127.0.0.1:3000/uploads/${file}`;
                    imagePreview.alt = 'Image Preview';
                    imagePreview.style.width = '100px';
                    filePreview.appendChild(imagePreview);
                    fileListDiv.appendChild(filePreview);
                } else {
                    // Unsupported file type
                    const unsupportedFileMessage = document.createElement('p');
                    unsupportedFileMessage.textContent = 'Unsupported file type';
                    filePreview.appendChild(unsupportedFileMessage);
                    fileListDiv.appendChild(filePreview);
                }

                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteFile(file));
                filePreview.appendChild(deleteButton);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Function to delete a file
function deleteFile(fileName) {
    fetch('http://127.0.0.1:3000/deleteFile', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('File deleted successfully!');
        // Refresh file list after deletion
        listFiles();
    })
    .catch(error => console.error('Error:', error));
}



document.addEventListener("DOMContentLoaded", function () {
    listFiles();
 });
