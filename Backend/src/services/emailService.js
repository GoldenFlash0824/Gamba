import dotenv from 'dotenv'
dotenv.config()
import sgMail from '@sendgrid/mail'
import client from '@sendgrid/client'
client.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
import Brevo from '@getbrevo/brevo'
import NotificationMessage from '../enums/notification-message.js'

const welcomeEmail = async (user, email) => {
    let defaultClient = Brevo.ApiClient.instance
    let apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY
    let apiInstance = new Brevo.TransactionalEmailsApi()

    let sendSmtpEmail = new Brevo.SendSmtpEmail()

    sendSmtpEmail = {
        to: [
            {
                email: email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Welcome to Gamba Community!',

        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    color: #333;
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }

                ul {
                    list-style-type: disc;
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .cta-button:hover {
                    background-color: #0056b3;
                }

                .signature {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <p>Dear ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''}</p>
                <p>Welcome to Gamba, where health, sustainability, and community thrive! We're thrilled to have you join our vibrant family.</p>
                <p>At Gamba, we're all about fostering connections and sharing knowledge. Whether you're a mini farmer, local grower, or just passionate about sustainability, Gamba is here to support your journey.</p>
                <p>Connect with like-minded individuals, engage in meaningful conversations, and share tips. Showcase your products, whether it's fruits, vegetables, herbs, or other goods you've grown with love. Gamba provides a platform for selling, buying, giving away, and exchanging your products with other community members.</p>
                <p>Your contributions and active participation are essential to making Gamba an inclusive and inspiring space. We encourage you to share your experiences, ask questions, and lend a helping hand to fellow members.</p>
                <p>We've cultivated a friendly and supportive environment, and we kindly ask that you respect one another's ideas and perspectives.</p>
                <p>If you have any questions or need assistance, reach out to us at gamba.earth@gmail.com. We're here to help!</p>
                <p>Welcome to Gamba! We're excited to have you on board and can't wait to see the community grow.</p>
                <p>Healthy regards,<br/><b>Gamba Team</b></p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    }
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data)
            return data
        },
        function (error) {
            console.error(error)
        }
    )
}

const verificationCodeEmail = async (code, email, user) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const senderEmail = process.env.SENDER_EMAIL;

    const emailContent = `
        <html>
        <head>
            <style>
                /* Add your email styling here */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 5px;
                }
                .header {
                    text-align: center;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                }
                .signature {
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div>
                    <h3>Hi ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''},</h3>
                </div>
                <div class="header">
                    <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                    <h3>Your Gamba account verification code is:</h3>
                    <p class="code">${code}</p>
                    <p>If this email does not belong to you, please feel free to contact us at gamba.earth@gmail.com.</p>
                </div>
                <div class="signature">
                    <p>Best regards,</p>
                    <p>The Gamba Team</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const sendSmtpEmail = {
        to: [{ email: email }],
        sender: { email: senderEmail },
        subject: 'Gamba verification code',
        htmlContent: emailContent,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data:', response);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const resetPasswordEmail = async (user) => {
    const link = `${process.env.FRONTEND_URL}reset_password?id=${user.id}`;

    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail = {
        to: [
            {
                email: user.email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Password Reset Request',
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
                .container {
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    color: #333; /* Text color (black or light gray) */
                    padding: 10px 0;
                    text-align: center;
                }
                .content {
                    background-color: #fff;
                    padding: 0px 20px;
                    border-radius: 5px;
                }
                .button {
                    background-color: #346c54; /* Button background color */
                    color: #fff !important; /* Button text color (important to override default styles) */
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 0 auto; /* Center the button horizontally */
                    text-align: center; /* Center the text within the button */
                    text-transform: capitalize;
                }
                .image-top {
                    background: url(${process.env.S3_URL + 'gambaImage.png'}) no-repeat top left;
                    height: 55px; /* Adjust the height as needed */
                    margin-bottom: 1rem;
                }
                .image-key {
                    background: url(${process.env.S3_URL + 'keyImage.png'}) no-repeat left top;

                    height: 100px;
                }

                .paragraph {
                    font-size: 0.94rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="container image-top"></div> <!-- Top Image -->
                    <div class="image-key"></div>
                    <div class="content">
                        <h1 style="opacity: 0.8;">Reset Your Password</h1>
                        <p style="opacity: 0.8;"><strong>FORGOT YOUR PASSWORD?</strong><br>NO PROBLEM!</p>
                        <div style="margin: 1rem;">
                        <p class="paragraph">Hi ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''},</p>
                        <p class="paragraph">We just received a request for a new password from your account.</p>
                        <p class="paragraph">To reset your password, just click this link in the next 24 hours:</p>
                        <div >
                            <a class="button" href="${link}">Reset Password</a>
                        </div>
                        <p class="paragraph" style="margin-bottom: 1rem;">If you did not request a new password, ignore this email, and your password will remain unchanged.</p>
                        <p class="paragraph" style="margin: 0rem; font-weight:400;">Happy growing,</p>
                        <p class="paragraph" style="margin: 0rem; font-weight:400;">The Gamba Team</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const adminResetPasswordEmail = async (user) => {
    const link = ` ${process.env.ADMIN_URL ? process.env.ADMIN_URL : 'http://gambaadminpanel.s3-website.us-east-2.amazonaws.com/'}reset-password/${user.resetPasswordToken}`;
    console.log('======link', link)

    const emailContent = `
        <html>
        <head>
            <style>
                /* Add your styles here */
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="header">
                    <h1 style="opacity: 0.8;">Reset Your Password</h1>
                </div>
                <div class="content">
                    <p style="opacity: 0.8;"><strong>FORGOT YOUR PASSWORD?</strong><br>NO PROBLEM!</p>
                    <div style="margin: 1rem;">
                        <p class="paragraph">Hi,</p>
                        <p class="paragraph">We just received a request for a new password from your account.</p>
                        <p class="paragraph">To reset your password, just click this link in the next 24 hours:</p>
                        <div>
                            <a class="button" href="${link}">Reset Password</a>
                        </div>
                        <p class="paragraph" style="margin-bottom: 1rem;">If you did not request a new password, ignore this email, and your password will remain unchanged.</p>
                        <p class="paragraph" style="margin: 0rem; font-weight:400;">Happy growing,</p>
                        <p class="paragraph" style="margin: 0rem; font-weight:400;">The Gamba Team</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail = {
        to: [
            {
                email: user.email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Password Reset Request',
        htmlContent: emailContent,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const newPasswordEmail = async (email, code) => {
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Reset Password',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #007BFF;
                        color: #fff;
                        padding: 10px 0;
                        text-align: center;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .password {
                        font-size: 18px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                    <div class="header">
                        <h1>Reset Password</h1>
                    </div>
                    <div class="content">
                        <p>Your account's new password is:</p>
                        <p class="password">${code}</p>
                        <p>Use this password to login to your account.</p>
                        <p>Thank you for choosing our services.</p>
                        <p>Healthy regards,</p>
                        <p>Gamba Community Team</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
        .catch((error) => {
            console.error(error);
        });
};

const adminPasswordUpdated = async (user, code) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [
            {
                email: user.email,
            },
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Reset Password - Account Recovery!',

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                }
                strong {
                    color: #007BFF;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <h1>Password Updated Successfully</h1>
                    <p>Dear ${user?.first_name && user?.last_name
                ? user.first_name + ' ' + user.last_name
                : 'User'
            },</p>
                    <p>Your account password has been updated successfully.</p>
                    <p>Please use this password to login: <strong>${code}</strong></p>
                    <p>Thank you for being a valued member of Gamba's community.</p>
                    <p>Healthy regards,</p>
                    <p>Gamba Community Team</p>
                </div>
            </div>
        </body>
        </html>
        `,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const passwordUpdated = async (user) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [
            {
                email: user.email,
            },
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Password Updated - Account Recovery',

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <h1>Password Updated Successfully</h1>
                    <p>Dear ${user?.first_name && user?.last_name
                ? user.first_name + ' ' + user.last_name
                : 'User'
            },</p>
                    <p>It appears that you've successfully reset your password for your Gamba account. Your password has been updated successfully.</p>
                    <p>If you did not initiate this change, please contact our support center immediately.</p>
                    <p>Thank you for being a valued member of Gamba's community.</p>
                    <p>Healthy regards,</p>
                    <p>Gamba Community Team</p>
                </div>
            </div>
        </body>
        </html>
        `,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const commentPosterEmail = async (user, email) => {
    let defaultClient = Brevo.ApiClient.instance
    let apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY
    let apiInstance = new Brevo.TransactionalEmailsApi()

    let sendSmtpEmail = new Brevo.SendSmtpEmail()
    const link = `${process.env.FRONTEND_URL}community`;

    sendSmtpEmail = {
        to: [
            {
                email: email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'New Comment on Your Post',

        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    color: #333;
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }

                ul {
                    list-style-type: disc;
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .cta-button:hover {
                    background-color: #0056b3;
                }

                .signature {
                    font-weight: bold;
                }

                a {
                    text-decoration: none;
                    font-style: italic
                }

            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <p>Hi ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''}</p>
                <p>Just a quick heads up – you've got a <a href=${link}>new comment</a> on your post. Thought you'd like to know!</p>
                <p>Warm Regards,<br/><b>Gamba Team</b></p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    }
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data)
            return data
        },
        function (error) {
            console.error(error)
        }
    )
}

const postLikeEmail = async (user, email) => {
    let defaultClient = Brevo.ApiClient.instance
    let apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY
    let apiInstance = new Brevo.TransactionalEmailsApi()

    let sendSmtpEmail = new Brevo.SendSmtpEmail()
    const link = `${process.env.FRONTEND_URL}/community`;

    sendSmtpEmail = {
        to: [
            {
                email: email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: `You've Got a New Like!`,

        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    color: #333;
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }

                ul {
                    list-style-type: disc;
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .cta-button:hover {
                    background-color: #0056b3;
                }

                .signature {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <p>Hi ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''}</p>
                <p>Quick update - your post just a got a like!</p>
                <p>Thought you'd want to know.</p>
                <p>Cheers</p>
                <p><b>Gamba Team</b></p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    }
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data)
            return data
        },
        function (error) {
            console.error(error)
        }
    )
}

const replyCommentEmail = async (user, email) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    const link = `${process.env.FRONTEND_URL}community`;

    sendSmtpEmail = {
        to: [
            {
                email: email
            }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Replied on Your Comment',
        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    color: #333;
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }

                ul {
                    list-style-type: disc;
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }

                .cta-button {
                    display: inline-block;
                    background-color: #007BFF;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .cta-button:hover {
                    background-color: #0056b3;
                }

                .signature {
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width="100">
                <p>Hi ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''}</p>
                <p>You've got a <a href="${link}">reply</a> on your comment. Thought you'd like to know!</p>
                <p>Warm Regards,<br/><b>Gamba Team</b></p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    };
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data);
            return data;
        },
        function (error) {
            console.error(error);
        }
    );
};

const notificationEmail = async (email, user, message) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [{ email: email, },],
        sender: { email: process.env.SENDER_EMAIL },
        subject: message,

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <h1>${user}</h1>
                    <p>${message}</p>
                    <p>Healthy regards,</p>
                    <p>Gamba Community Team</p>
                </div>
            </div>
        </body>
        </html>
        `,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };


    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const orderSellerNotificationEmail = async (email, seller, customer, order_id, order_date, shipping_address, items, seller_address, service_charges, delivery_charges, payment_method) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let subTotal = 0;

    let formatedItems = ''
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        formatedItems = formatedItems + orderItemTemplate.replace('ITEM_IMAGE', item.image).replace('ITEM_QUANTITY', item.quantity + ' ' + item.unit)
            .replace('UNIT_PRICE', item.price.toFixed(2)).replace("TOTAL_AMOUNT", item.total.toFixed(2))
        subTotal = subTotal + item.total
    }

    const topMessage = `
        <p>Dear ${seller}</p>
        <p>We hope this email finds you well.</p>
        <p>Below is the new order details received from one of our valued customers:</p>
    `
    const bottomeMessage = `
        <br/><br/>
        <p>Please ensure that you process this order promtly and accurately. If you have any questions or need further information regarding the order, feel free to reach out to us.</p>
        <p>We appreciate that you provide excellent products to our customers.</p>
        <p>Best Regards<br/>Gamba</p>
    `
    const sendSmtpEmail = {
        to: [{ email: email, },],
        sender: { email: process.env.SENDER_EMAIL },
        subject: `${NotificationMessage.SOLD_SELLER} - ${order_id}`,

        htmlContent: orderTemplate.replace('TOP_MESSAGE', topMessage).replace('BOTTOM_MESSAGE', bottomeMessage).replace('SELLER_INFORMATION', seller + '<br/>' + seller_address).replace('ORDER_DATE', order_date)
            .replace('BUYER_INFORMATION', (customer + '<br/>' + shipping_address)).replace('ORDER_NO', order_id).replace('DELIVERY_OPTIONN', payment_method == 'cashOnDelivery' ? 'Cash On Delivery' : 'Delivery')
            .replace('ITEM_INFORMATION', formatedItems).replace('SUB_TOTAL', subTotal.toFixed(2)).replace('DELIVER_FEE', delivery_charges.toFixed(2))
            .replace('SALES_TAX', service_charges.toFixed(2)).replace('TOTAL_ORDER', (subTotal + delivery_charges + service_charges).toFixed(2)),
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const orderBuyerNotificationEmail = async (email, customer, order_id, order_date, shipping_address, items, service_charges, delivery_charges, payment_method) => {
    try {
        let defaultClient = Brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        let apiInstance = new Brevo.TransactionalEmailsApi();

        let sellerInfo = '';
        let subTotal = 0;

        let formatedItems = ''
        for (const sllerName in items) {
            const sellerProducts = items[sllerName].products;
            sellerInfo = sellerInfo + (sellerInfo == '' ? '' : '<br/><br/>') + sllerName + '<br/>' + items[sllerName].address
            for (let i = 0; i < sellerProducts.length; i++) {
                const item = sellerProducts[i];
                formatedItems = formatedItems + orderItemTemplate.replace('ITEM_IMAGE', item.image).replace('ITEM_QUANTITY', item.quantity + ' ' + item.unit)
                    .replace('UNIT_PRICE', item.price.toFixed(2)).replace("TOTAL_AMOUNT", item.total.toFixed(2))
                subTotal = subTotal + item.total
            }
        }
        const topMessage = `
        <p>Hello ${customer}</p>
        <p>Thank you for choosing Gamba! We appreciate your recent order.</p>
        <p>Below you'll find the details of your order:</p>
    `
        const bottomeMessage = `
        <br/><br/>
        <p>If you hav any questions or concerns about your order, feel free to respond to this email with any concern.</p>
        <p>We look forward to serving you again soon!</p>
        <p>With sincere gratitude,<br/>Gamba</p>
    `
        const sendSmtpEmail = {
            to: [{ email: email, },],
            sender: { email: process.env.SENDER_EMAIL },
            subject: `Thank You for ${NotificationMessage.SOLD_BUYER}!`,

            htmlContent: orderTemplate.replace('TOP_MESSAGE', topMessage).replace('BOTTOM_MESSAGE', bottomeMessage).replace('SELLER_INFORMATION', sellerInfo).replace('ORDER_DATE', order_date)
                .replace('BUYER_INFORMATION', (customer + '<br/>' + shipping_address)).replace('ORDER_NO', order_id).replace('DELIVERY_OPTIONN', payment_method == 'cashOnDelivery' ? 'Cash On Delivery' : 'Delivery')
                .replace('ITEM_INFORMATION', formatedItems).replace('SUB_TOTAL', subTotal.toFixed(2)).replace('DELIVER_FEE', delivery_charges.toFixed(2))
                .replace('SALES_TAX', service_charges.toFixed(2)).replace('TOTAL_ORDER', (subTotal + delivery_charges + service_charges).toFixed(2)),
            headers: {
                'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
            },
        };


        try {
            const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    } catch (e) { console.log(e) }
};

const connectTradeProductBuyerEmail = async (email, full_name, topic, tradeWith) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [{ email: email, },],
        sender: { email: process.env.SENDER_EMAIL },
        subject: "Your Product Trading Request with Gamba!",

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <p>Dear ${full_name},</p>
                    <p>Thank you for expressing your interest in Gamba Seller's product giveaways!</p>
                    <p>We've received your trading request, and here are the details:</p>
                    <p><b>${topic} with ${tradeWith}</b></p>
                    <p>Please note that our sellers may experience high volumes of inquiries, which might result in delays. If you don't hear back from the seller within a reasonable time frame, please don't hesitate to reach out to us directly for assistance.</p>
                    <p>In the meantime, feel free to explore our website and follow us on social media to discover more products and stay updated on our latest events.</p>
                    <p>Thank you once again for choosing Gamba for your trading needs. We're excited about the opportunity to facilitate your product exchanges!</p>
                    <p>Best Regards,<br/>Gamba Team</p>
                </div>
            </div>
        </body>
        </html>
        `,

        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const connectTradeProductSellerEmail = async (email, full_name, title, customer_name, topic, tradeWith) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [{ email: email, },],
        sender: { email: process.env.SENDER_EMAIL },
        subject: "Action Required! Giveaway Request",
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <p>Dear ${full_name},</p>
                    <p>We hope this email finds you well. You have a pending request from ${customer_name}.</p>
                    <p>${topic} in exchange for ${tradeWith}</p>
                    <p>Please promptly respond to the customer's request. In case of high volumes of inquiries, we advise informing the customer in advance to ensure a smooth process and avoid any inconvenience.</p>
                    <p>Thank you for choosing Gamba and your generous contribution.</p>
                    <p>Best Regards,<br/>Gamba Team</p>
                </div>
            </div>
        </body>
        </html>
        `,

        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// const connectTradeProductEmail = async (email, user) => {
//     let defaultClient = Brevo.ApiClient.instance;
//     let apiKey = defaultClient.authentications['api-key'];
//     apiKey.apiKey = process.env.BREVO_API_KEY;
//     let apiInstance = new Brevo.TransactionalEmailsApi();

//     const sendSmtpEmail = {
//         to: [
//             {
//                 email: email,
//             },
//         ],
//         sender: { email: process.env.SENDER_EMAIL },
//         subject: 'Trade Connection',

//         htmlContent: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                     background-color: #fff;
//                     border-radius: 5px;
//                 }
//                 .content {
//                     padding: 20px;
//                 }
//                 h1 {
//                     color: #333;
//                 }
//                 p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                     color: #666;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
//                 <div class="content">
//                     <h1>Trade Connection</h1>
//                     <p>User ${user?.full_name} wants to connect with you for trade products. Below are the details of the user:</p>
//                     <p><strong>Name:</strong> ${user?.full_name}</p>
//                     <p><strong>Email:</strong> ${user?.email}</p>
//                     <p><strong>Phone No.:</strong> ${user?.phone}</p>
//                     <p><strong>Info:</strong> ${user?.info}</p>
//                     <p>Healthy regards,</p>
//                     <p>Gamba Community Team</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `,
//         headers: {
//             'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
//         },
//     };

//     try {
//         const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log('Email sent successfully:', response);
//         return response;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };

const connectGiveAwayProductBuyerEmail = async (email, full_name, subject) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [{ email: email, },],
        sender: { email: process.env.SENDER_EMAIL },
        subject: "Your Interest in Gamba's Seller Giveaways!",

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <p>Dear ${full_name},</p>
                    <p>Thank you for expressing your interest in Gamba Seller's product giveaways!</p>
                    <p>Your request for <b>${subject}</b> have been received</p>
                    <p>Please be aware that our sellers may encounter high volumes of inquiries, potentially leading to delays in response times. If you haven't heard back from the seller within a reasonable period, please feel free to contact us directly for further assistance.</p>
                    <p>While you await a response, we encourage you to explore our website and follow us on social media to discover more products and stay updated on our latest events.</p>
                    <p>Once again, thank you for choosing Gamba. We're excited about the opportunity to potentially provide you with one of our sellers' products through our giveaways!</p>
                    <p>Best Regards,<br/>Gamba Team</p>
                </div>
            </div>
        </body>
        </html>
        `,

        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const connectGiveAwayProductSellerEmail = async (email, full_name, subject, customer_name) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [{ email: email }],
        sender: { email: process.env.SENDER_EMAIL },
        subject: 'Action Required! Giveaway Request for' + subject,

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width="100">
                <div class="content">
                    <p>Dear ${full_name},</p>
                    <p>We hope this email finds you well. You have a pending request from ${customer_name} for <b>${subject}</b>.</p>
                    <p>Please promptly respond to the customer's request. In case of high volumes of inquiries, we advise informing the customer in advance to ensure a smooth process and avoid any inconvenience.</p>
                    <p>Thank you for choosing Gamba and your generous contribution.</p>
                    <p>Healthy Regards,<br/>Gamba Team</p>
                </div>
            </div>
        </body>
        </html>
        `,

        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// const connectGiveAwayProductEmail = async (email, user) => {
//     let defaultClient = Brevo.ApiClient.instance;
//     let apiKey = defaultClient.authentications['api-key'];
//     apiKey.apiKey = process.env.BREVO_API_KEY;
//     let apiInstance = new Brevo.TransactionalEmailsApi();

//     const sendSmtpEmail = {
//         to: [
//             {
//                 email: email,
//             },
//         ],
//         sender: { email: process.env.SENDER_EMAIL },
//         subject: 'Giveaway Connection',

//         htmlContent: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                     background-color: #fff;
//                     border-radius: 5px;
//                 }
//                 .content {
//                     padding: 20px;
//                 }
//                 h1 {
//                     color: #333;
//                 }
//                 p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                     color: #666;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
//                 <div class="content">
//                     <h1>Giveaway Connection</h1>
//                     <p>User ${user?.full_name} wants to connect with you for giveaway products. Below are the details of the user:</p>
//                     <p><strong>Name:</strong> ${user?.full_name}</p>
//                     <p><strong>Email:</strong> ${user?.email}</p>
//                     <p><strong>Phone No.:</strong> ${user?.phone}</p>
//                     <p><strong>Interested:</strong> ${user?.interested}</p>
//                     <p><strong>Info:</strong> ${user?.info}</p>
//                     <p>Healthy regards,</p>
//                     <p>Gamba Community Team</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `,
//         headers: {
//             'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
//         },
//     };

//     try {
//         const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//         console.log('Email sent successfully:', response);
//         return response;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };

const contactUsEmail = async (user) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    const sendSmtpEmail = {
        to: [
            {
                email: process.env.SENDER_EMAIL,
            },
        ],
        sender: { email: user?.email },
        subject: 'Contact Us',

        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 20px;
                }
                p {
                    color: #333; /* Light gray text */
                    font-size: 16px;
                }
                strong {
                    color: #333; /* Blue color for strong text */
                }
                .contact-details {
                    background-color: #ffffff; /* White background for contact details */
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .contact-details p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <div class="content">
                    <h1>Contact Us</h1>
                    <p>User ${user?.full_name} wants to contact with you. Below are the details of the user:</p>
                    <div class="contact-details">
                        <p><strong>User Name:</strong> ${user?.full_name}</p>
                        <p><strong>Email:</strong> ${user?.email}</p>
                        <p><strong>Phone No.:</strong> ${user?.phone}</p>
                        <p><strong>Topic:</strong> ${user?.topic}</p>
                        <p><strong>Message:</strong> ${user?.message}</p>
                    </div>
                    <p>Healthy regards,</p>
                    <p>Gamba Community Team</p>
                </div>
            </div>
        </body>
        </html>
        `,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
        },
    };
    console.log('====sendSmtpEmail', sendSmtpEmail)

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const createEventEmail = async (email, user, event) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail = {
        to: [
            { email: email }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: `Configuration: Your Registration for ${event.title}`,

        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <p>Dear ${user?.first_name && user?.last_name ? user?.first_name + ' ' + user?.last_name : ''}</p>
                <p>Thanks for joining ${event?.title}.</p>
                <p>Your registration has been successfully processed, and your payment has been received. You're now officially registered for the event.</p>
                <p><b>Here are the details:</b></p>
                <p><b>Event Name: </b>${event.title}</p>
                <p>
                    <b>Date: </b>${new Date(event.start_date).getFullYear()}-${String(new Date(event.start_date).getMonth() + 1).padStart(2, '0')}-${String(new Date(event.start_date).getDate()).padStart(2, '0')}
                    <b>Time:</b> ${String(new Date(event.start_date).getHours()).padStart(2, '0')}:${String(new Date(event.start_date).getMinutes()).padStart(2, '0')}
                </p>
                <p><b>Location: </b>${event.location}</p>
                <p>If you have any questions or need further assistance, feel free to reply.</p>
                <p>We look forward to seeing you at ${event.title}!</p>
                <p>Warm regards,</p>
                <p>Gamba Team</p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    }
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data)
            return data
        },
        function (error) {
            console.error(error)
        }
    )
}

const joinedEventEmail = async (email, creator, participant) => {
    let defaultClient = Brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    let apiInstance = new Brevo.TransactionalEmailsApi();

    let sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail = {
        to: [
            { email: email }
        ],
        sender: { email: process.env.SENDER_EMAIL },
        subject: `New Participiant Joined Your Event on Gamba!`,

        htmlContent: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
                <p>Dear ${creator?.first_name && creator?.last_name ? creator?.first_name + ' ' + creator?.last_name : ''}</p>
                <p>We're excited to inform you that ${participant?.first_name && participant?.last_name ? participant?.first_name + ' ' + participant.last_name : ''} has expressed interest in your event on Gamba!</p>
                <p>Please note that this expression of interest does not confirm payment for the event. You will receive a separate email confirming payment once our customer completes the transaction.</p>
                <p>Should you have any questions or require assistance, please feel free to reply to this email.</p>
                <p>Thank you for selecting Gamba as your event host. We wish you ongoing success and eagerly anticipate the success of your event!</p>
                <p>Warm regards,</p>
                <p>Gamba Team</p>
            </div>
        </body>
        </html>`,
        headers: {
            'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
        }
    }
    return await apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
            console.log('API called successfully. Returned data: ' + data)
            return data
        },
        function (error) {
            console.error(error)
        }
    )
}

const orderItemTemplate = `
    <tr class="d-flex  justify-content-between align-items-center" style="display: flex; justify-content: space-between; align-items: center;"> 
        <td class="w-100" style=" padding: 5px; width: 100%; vertical-align: top;">
            <img src="ITEM_IMAGE" style="width: 70px;" alt="">
        </td>
        <td class="w-100" style=" padding: 5px; width: 100%; vertical-align: top;">
            <span class="fw-medium" style="font-weight: 500;">ITEM_QUANTITY</span>
        </td>
        <td class=" f-size-14 w-100" style=" padding: 5px; width: 100%; font-size: 14px !important; vertical-align: top;">
            <span class="fw-medium" style="font-weight: 500;">UNIT_PRICE</span>
        </td>
        <td class=" f-size-14" style=" padding: 5px; font-size: 14px !important; vertical-align: top;"></td>
        <td class=" f-size-14" style=" padding: 5px; font-size: 14px !important; vertical-align: top;">
            <span class="fw-medium" style="font-weight: 500;">TOTAL_AMOUNT</span>
        </td>
    </tr>`

const orderTemplate = `
<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Gamba Invoice</title>
        </head>
        <body style=" display: flex; justify-content: center; align-items: center;">
            <img src="https://imagescontent.s3.us-east-1.amazonaws.com/1716209083707.png" alt="Logo" width={100}>
            <div class="invoice-box mb-3" style=" max-width: 550px; width: 100%;  margin-bottom: 1rem; margin: auto; /* padding: 24px; */ font-size: 16px; line-height: 24px; font-family: 'inter', sans-serif; min-height: auto; height: auto; position: relative; padding-bottom: 80px;">
                TOP_MESSAGE
                <table cellpadding="0" cellspacing="0" class="mb-3" style=" width: 100%;  margin-bottom: 1rem; line-height: inherit; text-align: left;">
                    <tr class="information">
                        <td colspan="2" class="pe-0" style=" padding: 5px; padding-left: 0px !important; vertical-align: top;">
                            <table><tr class="" style=" padding-bottom: 40px !important"><img src="https://gamba.earth/images/gambaLogo.png" class="pb-3" style="padding-bottom: 1rem; width:250px;" alt=""></tr></table>
                        </td>
                    </tr>
                    <tr class="w-100 " style="width: 100%;">
                        <td class="w-50 border-light" style=" padding: 5px; border: 2px solid #E0E0E0; vertical-align: top;">
                            <table style="width: 100%; line-height: inherit; text-align: left;">
                                <tr>
                                    <td class="f-size-18 fw-semibold mb-1" style=" padding: 5px; font-size: 18px !important;vertical-align: top; font-weight: 700;">Sold by</td>
                                </tr>
                                <tr>
                                    <td class="f-size-14 fw-medium pb-3" style=" padding: 5px; font-weight: 500; font-size: 14px !important; padding-bottom: 1rem ; vertical-align: top;">SELLER_INFORMATION</td>
                                </tr>
                                <tr>
                                    <td class="f-size-11 fw-bold " style=" padding: 5px; vertical-align: top;"><strong>Date Order:</strong> <span class="fw-medium" style="font-weight: 500;"> ORDER_DATE</span></td>
                                </tr>
                            </table>
                        </td>
                        <td class="w-50 border-light border-l-none" style=" border-left: none !important; width: 50%; border: 2px solid #E0E0E0;">
                            <table style="width: 100%; line-height: inherit; text-align: left;">
                                <tr>
                                    <td class="f-size-18 fw-semibold mb-1" style=" padding: 5px; font-size: 18px !important; vertical-align: top; font-weight: 700;">Ordered by</td>
                                </tr>
                                <tr>
                                    <td class="f-size-14 fw-medium " style=" padding: 5px; font-size: 14px !important; vertical-align: top; font-weight: 500;">BUYER_INFORMATION</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <table class="mb-3" style="width: 100%; line-height: inherit; text-align: left;  margin-bottom: 1rem;">
                        <tr class="d-flex pb-3 justify-content-between align-items-center bg-fantasy px-1" style=" padding: 6px 4px; display: flex; justify-content: space-between; align-items: center;  background-color: #F2F4F1 !important;" >
                            <td class="w-100" style=" padding: 5px; width: 100%; vertical-align: top;"><strong>Order No:</strong><span class="fw-medium" style="font-weight: 500;"> ORDER_NO</span></td>
                            <td class=" w-100" style=" padding: 5px; width: 100%; vertical-align: top;"><strong>Delivery:</strong><span class="fw-medium" style="font-weight: 500;"> DELIVERY_OPTIONN</span></td>
                            <td class="fw-semibold w-100 " style=" padding: 5px; width: 100%; font-weight: 700;vertical-align: top;">Paid</td>
                        </tr>
                    </table>
                    <table class="mt-3p" style="width: 100%; line-height: inherit; text-align: left;">
                        ITEM_INFORMATION
                    </table>
                    <table class="mt-3p" style="width: 100%; line-height: inherit; text-align: left;">
                        <tr class=" pb-3  pt-3" style="display: flex; justify-content: end; align-items: end;  padding-top: 1rem !important; padding-bottom: 1rem ;">
                            <td class=""  style="width: 52%; padding: 5px; vertical-align: top;"></td>
                            <td class=""  style="width: 33%; padding: 5px; vertical-align: top;">
                                <span class="fw-medium" style="font-weight: 500;">Subtotal</span> <br>
                                <span class="fw-medium" style="font-weight: 500;">Delivery Fee</span> <br>
                                <span class="fw-medium" style="font-weight: 500;">Sales Tax</span><br>
                                <span class="fw-semibold" style="font-weight: 700;">Total Order</span>
                            </td>
                            <td class="text-end"  style="width: 15%; text-align: end; padding: 5px; vertical-align: top;"> 
                                <span class="fw-medium" style="font-weight: 500;">SUB_TOTAL</span> <br>
                                <span class="fw-medium" style="font-weight: 500;">DELIVER_FEE</span> <br>
                                <span class="fw-medium" style="font-weight: 500;">SALES_TAX</span><br>
                                <span class="fw-semibold" style="font-weight: 700;">TOTAL_ORDER</span>
                            </td>
                        </tr>
                    </table>
                </table>
                BOTTOM_MESSAGE
            </div>
        </body>
    </html>
`
export {
    adminResetPasswordEmail, verificationCodeEmail, resetPasswordEmail, newPasswordEmail, orderSellerNotificationEmail, orderBuyerNotificationEmail,
    notificationEmail, contactUsEmail, welcomeEmail, passwordUpdated, adminPasswordUpdated, connectGiveAwayProductBuyerEmail,
    connectGiveAwayProductSellerEmail, connectTradeProductBuyerEmail, connectTradeProductSellerEmail, createEventEmail, joinedEventEmail, commentPosterEmail, replyCommentEmail, postLikeEmail
}
