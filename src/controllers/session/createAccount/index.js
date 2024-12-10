import loading from '../../../components/loading/loading';
import Dashboard from 'utils/dashboard';
import { appRouter } from 'components/router/appRouter';

/* eslint-disable indent */
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const validate = (view) => {
        const email = view.querySelector('#email').value;
        if (!isValidEmail(email)) {
            return void Dashboard.alert({
                message: "A valid email address should include a username, the '@' symbol, and a domain (e.g., user@example.com)",
                title: 'Invalid Email Address'
            });
        }
        const password = view.querySelector('#password').value;
        if (password.length < 5) {
            return void Dashboard.alert({
                message: 'Password must be at least 5 characters long',
                title: 'Invalid Password'
            });
        }
        const confirmPassword = view.querySelector('#confirmPassword').value;
        if (password !== confirmPassword) {
            return void Dashboard.alert({
                message: 'Passwords do not match',
                title: 'Invalid Password'
            });
        }
        return true;
    };
    export default function (view) {
        function onSubmit(e) {
            e.preventDefault();
            if (!validate(view)) {
                return false;
            }
            const email = view.querySelector('#email').value;
            const password = view.querySelector('#password').value;
            const code = view.querySelector('#code').value;
            loading.show();
            fetch('https://utils.jellyfin.nu/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    code: code
                })
            }).then(response => {
                loading.hide();
                if (response.status === 200) {
                    Dashboard.alert({
                        message: 'Before you can log in, you need to verify your email address. Please check your email for a verification link. It can take up to 10 minutes to arrive. <br><br> Check your spam folder!',
                        title: 'Success',
                        callback: () => {
                            removeCode();
                            Dashboard.navigate('login.html');
                        }
                    });
                } else {
                    response.json().then(data => {
                    Dashboard.alert({
                        message: data.error,
                        title: 'Error'
                    });
                });
                }
            });
            return false;
        }
        view.querySelector('form').addEventListener('submit', onSubmit);
        view.querySelector('.btnCancel').addEventListener('click', async function (e) {
            removeCode();
            await appRouter.goHome();
        });



        const params = new URL(document.location).searchParams;
        const code = getCodeFromHash(document.location.hash);
        if (code) {
            view.querySelector('#code').value = code;
        }



        view.querySelector('#email').addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase();
        });

        loading.hide();
        // eslint-disable-next-line compat/compat

    }

    const removeCode = () => {
        const url = new URL(document.location);
        url.searchParams.delete('code');
        window.history.replaceState({}, document.title, url);
    };
/* eslint-enable indent */


const getCodeFromHash = (hash) => {
    if (!hash.includes('?')) return null; // Ensure there's a query string in the hash

    try {
      const queryPart = hash.split('?')[1];
      const hashParams = new URLSearchParams(queryPart);
      return hashParams.get('code');
    } catch (error) {
      console.error('Error parsing hash:', error);
      return null;
    }
  };
