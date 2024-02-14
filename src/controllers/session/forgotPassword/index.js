import globalize from '../../../scripts/globalize';
import Dashboard from '../../../scripts/clientUtils';
import loading from '../../../components/loading/loading';

/* eslint-disable indent */
    export default function (view) {
        function onSubmit(e) {
            loading.show();

            const username = view.querySelector('#txtName').value;
            e.preventDefault();
            fetch('https://utils.jellyfin.nu/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            }).then(() => {
                loading.hide();
                    Dashboard.alert({
                        message: 'Check your email for reset link. <br/><br/> Press button below to continue.',
                        title: globalize.translate('ButtonForgotPassword'),
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
