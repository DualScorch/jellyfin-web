import globalize from '../../../scripts/globalize';
import Dashboard from '../../../scripts/clientUtils';
import loading from '../../../components/loading/loading';

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
    return true;
};

    export default function (view) {
        function onSubmit(e) {
            e.preventDefault();
            if (!validate(view)) {
                return false;
            }

            const email = view.querySelector('#email').value;
            const info = view.querySelector('#info').value;

            loading.show();
            fetch('https://utils.jellyfin.nu/api/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    info: info
                })
            }).then(() => {
                loading.hide();
                Dashboard.alert({
                    message: 'You will be contacted soon. <br/><br/> Press button below to continue.',
                    title: 'Request Sent',
                    callback: function () {
                        Dashboard.navigate('login.html');
                    }
                });
            });
            return false;
        }

        view.querySelector('form').addEventListener('submit', onSubmit);
    }

/* eslint-enable indent */
