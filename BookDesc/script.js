const addButton = document.getElementById("add");
const popupOverlay = document.getElementById("popup-overlay");
const popupBox = document.getElementById("popup-box");
const addBookBtn = document.getElementById("add-book");
const closePopupBtn = document.getElementById("delete-book"); 
const bookContainer = document.querySelector(".book-container");

addButton.addEventListener("click", () => {
    popupOverlay.style.display = "block";
    popupBox.style.display = "block";
});

closePopupBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";
});

addBookBtn.addEventListener("click", () => {
    const name = document.getElementById('book-name').value;
    const author = document.getElementById('book-author').value;

    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <h1>${name}</h1>
        <p>${author}</p>
        <button class="delete-btn">Delete</button>
    `;

  
    bookContainer.appendChild(card);

    document.getElementById('book-name').value = "";
    document.getElementById('book-author').value = "";
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";

 
    card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
    });
});
