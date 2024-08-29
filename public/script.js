document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    document.getElementById('product-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            alert(result.message);

            // Optionally, clear the form or handle additional logic
            event.target.reset();
            renderData(); // Refresh the product list after adding a new product
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Fetch and render products
    async function fetchData() {
        try {
            const response = await fetch('http://localhost:3000/products');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function renderData() {
        const container = document.querySelector('.container');
        const data = await fetchData();

        if (!data) {
            return;
        }

        container.innerHTML = ''; // Clear previous data
        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');

            const title = document.createElement('h4');
            title.textContent = item.name;
            title.classList.add('card-title');

            const body = document.createElement('p');
            //body.textContent = item.description;
            body.classList.add('card-description');
            

            const image = document.createElement('img');
            image.src = `http://localhost:3000/uploads/${item.image}`;
            image.alt = item.name;
          
            image.classList.add('card-image');
    
            // Create a price element
        const price = document.createElement('p');
        price.textContent = `ksh. ${item.price}`;
           price.classList.add('card-price');
    
            card.appendChild(image);
            card.appendChild(title);
             //card.appendChild(body);
             card.appendChild(price );
            container.appendChild(card);
        });
    }

    renderData(); // Initial call to display products
   
    
});
