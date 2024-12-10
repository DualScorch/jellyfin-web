import globalize from 'lib/globalize';
import loading from '../../../components/loading/loading';
import Dashboard from 'utils/dashboard';



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
        e.preventDefault();
        return false;
    }

    view.querySelector('form').addEventListener('submit', onSubmit);
    view.querySelector('.btnForgotUser').addEventListener('click', function (e) {
        e.preventDefault();
        Dashboard.navigate('forgotuser.html');
    });
}

