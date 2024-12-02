let users = JSON.parse(localStorage.getItem('users')) || [];
let cars = JSON.parse(localStorage.getItem('cars')) || [];
let currentUser = null;

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const messageElement = document.getElementById('login-message');

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'admin.html';
    } else {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'user.html';
        } else {
            messageElement.textContent = 'Неверный логин или пароль.';
        }
    }
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const messageElement = document.getElementById('register-message');

    if (username && password) {
        if (users.some(u => u.username === username)) {
            messageElement.textContent = 'Пользователь с таким логином уже существует.';
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            messageElement.textContent = 'Регистрация успешна. Теперь вы можете войти.';
        }
    } else {
        messageElement.textContent = 'Пожалуйста, заполните все поля.';
    }
}

function addCar() {
    const carId = document.getElementById('car-id').value;
    const owner = document.getElementById('owner').value;
    const messageElement = document.getElementById('admin-message');

    if (carId && owner) {
        if (cars.some(car => car.id === carId)) {
            messageElement.textContent = 'Автомобиль с таким ID уже существует.';
        } else {
            cars.push({ id: carId, owner: owner, violations: [] });
            localStorage.setItem('cars', JSON.stringify(cars));
            updateCarList();
            document.getElementById('car-id').value = '';
            document.getElementById('owner').value = '';
            messageElement.textContent = '';
        }
    } else {
        messageElement.textContent = 'Пожалуйста, заполните все поля.';
    }
}

function addViolation() {
    const carId = document.getElementById('car-id-violation').value;
    const date = document.getElementById('violation-date').value;
    const time = document.getElementById('violation-time').value;
    const type = document.getElementById('violation-type').value;
    const fine = parseFloat(document.getElementById('violation-fine').value);
    const messageElement = document.getElementById('violation-message');

    if (carId && date && time && type && fine) {
        const car = cars.find(c => c.id === carId);
        if (car) {
            car.violations.push({ date, time, type, fine });
            localStorage.setItem('cars', JSON.stringify(cars));
            updateCarList();
            document.getElementById('car-id-violation').value = '';
            document.getElementById('violation-date').value = '';
            document.getElementById('violation-time').value = '';
            document.getElementById('violation-type').value = '';
            document.getElementById('violation-fine').value = '';
            messageElement.textContent = '';
        } else {
            messageElement.textContent = 'Автомобиль с таким ID не найден.';
        }
    } else {
        messageElement.textContent = 'Пожалуйста, заполните все поля.';
    }
}

function payFines() {
    const carId = document.getElementById('car-id-pay').value;
    const messageElement = document.getElementById('payment-message');

    if (carId) {
        const index = cars.findIndex(c => c.id === carId);
        if (index !== -1) {
            cars.splice(index, 1);
            localStorage.setItem('cars', JSON.stringify(cars));
            updateCarList();
            document.getElementById('car-id-pay').value = '';
            messageElement.textContent = '';
        } else {
            messageElement.textContent = 'Автомобиль с таким ID не найден.';
        }
    } else {
        messageElement.textContent = 'Пожалуйста, введите ID автомобиля.';
    }
}

function updateCarList() {
    const carListItems = document.getElementById('car-list-items');
    carListItems.innerHTML = '';
    cars.forEach(car => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>ID:</strong> ${car.id}, <strong>Владелец:</strong> ${car.owner}<br>
                        <strong>Нарушения:</strong><ul>${car.violations.map(v => `<li>${v.date} ${v.time} - ${v.type} (${v.fine} руб.)</li>`).join('')}</ul>`;
        carListItems.appendChild(li);
    });
}

function loadUserCars() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userCars = cars.filter(car => car.owner === currentUser.username);
        const carListItems = document.getElementById('car-list-items');
        carListItems.innerHTML = '';
        userCars.forEach(car => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>ID:</strong> ${car.id}, <strong>Владелец:</strong> ${car.owner}<br>
                            <strong>Нарушения:</strong><ul>${car.violations.map(v => `<li>${v.date} ${v.time} - ${v.type} (${v.fine} руб.)</li>`).join('')}</ul>`;
            carListItems.appendChild(li);
        });
    }
}

// Загрузка данных при загрузке страницы
window.onload = function() {
    if (window.location.pathname.includes('admin.html')) {
        updateCarList();
    } else if (window.location.pathname.includes('user.html')) {
        loadUserCars();
    }
};
