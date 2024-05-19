document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login');
    const authSection = document.querySelector('.authentication');
    const loginSection = document.getElementById('loginSection');
    const postPropertyForm = document.getElementById('postPropertyForm');
    const propertyList = document.getElementById('propertyList');
    const allProperties = document.getElementById('allProperties');
    const filterInput = document.getElementById('filter');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let properties = JSON.parse(localStorage.getItem('properties')) || [];
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Show login form
    loginBtn.addEventListener('click', () => {
        loginSection.classList.remove('hidden');
        authSection.classList.add('hidden');
    });

    // Register new user
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('newfirstName').value;
        const lastName = document.getElementById('newlastName').value;
        const email = document.getElementById('newemail').value;
        const password = document.getElementById('newpassword').value;
        const role = document.getElementById('newrole').value;

        const hashedPassword = hashPassword(password);

        const user = {
            username,
            lastName,
            email,
            password: hashedPassword,
            role
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        alert('User registered successfully!');
        registerForm.reset();
    });

    // Login user
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        const hashedPassword = hashPassword(password);
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

        const foundUser = storedUsers.find(user =>
            user.username === username &&
            user.lastName === lastName &&
            user.email === email &&
            user.password === hashedPassword &&
            user.role === role
        );

        if (foundUser) {
            alert('Login successful!');
            localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
            showDashboard(foundUser.role);
        } else {
            alert('Invalid username or password.');
        }
    });

    function showDashboard(role) {
        loginSection.classList.add('hidden');
        if (role === 'seller') {
            document.getElementById('seller').classList.remove('hidden');
            document.getElementById('buyer').classList.add('hidden');
            displaySellerProperties();
        } else if (role === 'buyer') {
            document.getElementById('seller').classList.add('hidden');
            document.getElementById('buyer').classList.remove('hidden');
            displayAllProperties();
        }
    }

    postPropertyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const property = {
            id: Date.now(),
            place: postPropertyForm.place.value,
            area: postPropertyForm.area.value,
            bedrooms: postPropertyForm.bedrooms.value,
            bathrooms: postPropertyForm.bathrooms.value,
            nearby: postPropertyForm.nearby.value,
            sellerEmail: loggedInUser.email,
        };
        properties.push(property);
        localStorage.setItem('properties', JSON.stringify(properties));
        postPropertyForm.reset();
        displaySellerProperties();
    });

    filterInput.addEventListener('input', function() {
        displayAllProperties(filterInput.value);
    });

    function displaySellerProperties() {
        propertyList.innerHTML = '';
        properties.filter(prop => prop.sellerEmail === loggedInUser.email).forEach(prop => {
            const div = document.createElement('div');
            div.classList.add('property');
            div.innerHTML = `
                <p><strong>Place:</strong> ${prop.place}</p>
                <p><strong>Area:</strong> ${prop.area} sq ft</p>
                <p><strong>Bedrooms:</strong> ${prop.bedrooms}</p>
                <p><strong>Bathrooms:</strong> ${prop.bathrooms}</p>
                <p><strong>Nearby:</strong> ${prop.nearby}</p>
                <button class="edit-btn" onclick="editProperty(${prop.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProperty(${prop.id})">Delete</button>
            `;
            propertyList.appendChild(div);
        });
    }

    function displayAllProperties(filter = '') {
        allProperties.innerHTML = '';
        properties.filter(prop => {
            return prop.place.toLowerCase().includes(filter.toLowerCase()) ||
                prop.area.toLowerCase().includes(filter.toLowerCase()) ||
                prop.bedrooms.toString().includes(filter) ||
                prop.bathrooms.toString().includes(filter) ||
                prop.nearby.toLowerCase().includes(filter.toLowerCase());
        }).forEach(prop => {
            const div = document.createElement('div');
            div.classList.add('property');
            div.innerHTML = `
                <p><strong>Place:</strong> ${prop.place}</p>
                <p><strong>Area:</strong> ${prop.area} sq ft</p>
                <p><strong>Bedrooms:</strong> ${prop.bedrooms}</p>
                <p><strong>Bathrooms:</strong> ${prop.bathrooms}</p>
                <p><strong>Nearby:</strong> ${prop.nearby}</p>
            `;
            allProperties.appendChild(div);
        });
    }

    window.editProperty = function(id) {
        const property = properties.find(prop => prop.id === id);
        if (property) {
            postPropertyForm.place.value = property.place;
            postPropertyForm.area.value = property.area;
            postPropertyForm.bedrooms.value = property.bedrooms;
            postPropertyForm.bathrooms.value = property.bathrooms;
            postPropertyForm.nearby.value = property.nearby;
            properties = properties.filter(prop => prop.id !== id);
            localStorage.setItem('properties', JSON.stringify(properties));
        }
    };

    window.deleteProperty = function(id) {
        properties = properties.filter(prop => prop.id !== id);
        localStorage.setItem('properties', JSON.stringify(properties));
        displaySellerProperties();
    };

    function hashPassword(password) {
        return btoa(password);
    }

    if (loggedInUser) {
        showDashboard(loggedInUser.role);
    }
});
