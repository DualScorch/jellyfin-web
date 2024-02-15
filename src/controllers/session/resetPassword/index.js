import globalize from '../../../scripts/globalize';
import Dashboard from '../../../scripts/clientUtils';

/* eslint-disable indent */

    function processForgotPasswordResult(result) {
        if (result.Success) {
            let msg = 'Your password has been set to the reset PIN.';
            msg += '<br/>';
            msg += '<br/>';
            msg += 'Change your password afterwards.';
            msg += '<br/>';
            msg += '<br/>';
            msg += 'Press button below to continue.';
            return void Dashboard.alert({
                message: msg,
                title: globalize.translate('HeaderPasswordReset'),
                callback: function () {
                    window.location.href = 'index.html';
                }
            });
        }

        Dashboard.alert({
            message: globalize.translate('MessageInvalidForgotPasswordPin'),
            title: globalize.translate('HeaderPasswordReset')
        });
    }

    export default function (view) {
        function onSubmit(e) {
            ApiClient.ajax({
                type: 'POST',
                url: ApiClient.getUrl('Users/ForgotPassword/Pin'),
                dataType: 'json',
                data: JSON.stringify({
                    Pin: view.querySelector('#txtPin').value
                }),
                contentType: 'application/json'
            }).then(processForgotPasswordResult);
            e.preventDefault();
            return false;
        }

        view.querySelector('form').addEventListener('submit', onSubmit);
    }

/* eslint-enable indent */
