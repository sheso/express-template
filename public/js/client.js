// LOGIN FORM

const failLogin = loginForm => {
    loginForm.login.setCustomValidity('Неверный логин или пароль. Или и то, и другое');
    loginForm.login.reportValidity();
};

const networkError = form => {
    form.setCustomValidity('Сетевая ошибка. Попробуйте позже');
    form.reportValidity();
}

document.forms.loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const { method, action } = e.target;
    let response;
    try {
        response = await fetch(action, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: e.target.login.value,
                password: e.target.password.value,
            }),
        });
    } catch (error) {
        return failLogin(e.target);
    }
    
    if (response.status !== 200) {
        return failLogin(e.target);
    }
		console.log(response);
    return window.location.assign('/');
});

// Clear validation
if (document.forms.loginForm) {
    [
        document.forms.loginForm.login,
        document.forms.loginForm.password,
    ].forEach(input => input.addEventListener('input'), e => {
        e.target.setCustomValidity('');
        e.target.checkValidity();
    });
}

// SIGNUP FORM

const passwordError = signupForm => {
    signupForm.verify.setCustomValidity('Пароли не совпадают');
    signupForm.verify.reportValidity();
};

const userExistsError = signupForm => {
    signupForm.login.setCustomValidity('Такой пользователь уже существует');
    signupForm.login.reportValidity();
}

document.forms.signupForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const { name, login, password, verify, method, action } = e.target;
    if (password.value !== verify.value) {
        return passwordError(e.target);
    }
    
    let response;
    try {
        response = await fetch(action, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                login: login.value,
                password: password.value,
            }),
        });
    } catch (error) {
        return networkError(e.target);
    }

    if (response.status === 401) {
        return userExistsError(e.target);
    }
    if (response.status !== 200) {
        return networkError(e.target);
    }

    return window.location.assign('/');
});

if (document.forms.signupForm) {
    [
        document.forms.signupForm.name,
        document.forms.signupForm.login,
        document.forms.signupForm.password,
        document.forms.signupForm.verify,
    ].forEach(input => input.addEventListener('input', e => {
        e.target.setCustomValidity('');
        e.target.checkValidity();
    }));
}
