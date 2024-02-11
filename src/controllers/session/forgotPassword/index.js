import globalize from '../../../scripts/globalize';
import Dashboard from '../../../scripts/clientUtils';

/* eslint-disable indent */

    function processForgotPasswordResult(result) {
        if (result.Action == 'ContactAdmin') {
            return void Dashboard.alert({
                message: globalize.translate('MessageContactAdminToResetPassword'),
                title: globalize.translate('ButtonForgotPassword')
            });
        }

        if (result.Action == 'InNetworkRequired') {
            return void Dashboard.alert({
                message: globalize.translate('MessageForgotPasswordInNetworkRequired'),
                title: globalize.translate('ButtonForgotPassword')
            });
        }

        if (result.Action == 'PinCode') {
            let msg = "Check your email for reset link";
            msg += '<br/>';
            msg += '<br/>';
            msg += "Press button below to continue.";
            return void Dashboard.alert({
                message: msg,
                title: globalize.translate('ButtonForgotPassword'),
                callback: function () {
                    Dashboard.navigate('login.html');
                }
            });
        }
    }

    export default function (view) {
        function onSubmit(e) {
            ApiClient.ajax({
                type: 'POST',
                url: ApiClient.getUrl('Users/ForgotPassword'),
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    EnteredUsername: view.querySelector('#txtName').value
                })
            }).then(processForgotPasswordResult);
            e.preventDefault();
            return false;
        }

        view.querySelector('form').addEventListener('submit', onSubmit);
    }

/* eslint-enable indent */
