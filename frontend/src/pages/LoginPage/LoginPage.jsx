import './LoginPage.css';
import { useState } from 'react';
import successIcon from '../../assets/icons/success-icon.svg';
import AuthFormInput from '../../components/AuthFormInput/AuthFormInput';
import AuthFormSubmitButton from '../../components/AuthFormSubmitButton/AuthFormSubmitButton';
import AuthFormTitle from '../../components/AuthFormTitle/AuthFormTitle';
import AuthHelpLink from '../../components/AuthHelpLink/AuthHelpLink';
import AuthFormSubTitle from '../../components/AuthFormSubTitle/AuthFormSubTitile';
import AuthFormErrorsList from '../../components/AuthFormErrorsList/AuthFormErrorsList';
import AuthFormIconMessage from '../../components/AuthFormIconMessage/AuthFormIconMessage';
import AuthPagesWatchDogLogo from '../../components/AuthPagesWatchDogLogo/AuthPagesWatchDogLogo';
import ResetPasswordEnterEmail from '../../components/ResetPasswordEnterEmail/ResetPasswordEnterEmail';
import { Link, useNavigate } from "react-router-dom";
import base64 from 'base-64';
import { useUser } from './UserContext';

function LoginPage() {
    const { setUserData } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCredentialsNotValid, setIsCredentialsNotValid] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [showResetPasswordEnterEmail, setShowResetPasswordEnterEmail] = useState(false);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const token = base64.encode(email + ":" + password);
        fetch("http://localhost:3000/user/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Basic " + token,
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
            }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json) {
                    if(json.success){
                        setUserData(email);
                        localStorage.setItem('session',JSON.stringify(json.token));
                        navigate("/serverStatus");
                    }else{
                        setIsEmailSent(false);
                        setIsCredentialsNotValid(true);
                        throw new Error(json.message);
                    }
                } else {
                    alert(json);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };

    const handleCancelCLick = () => {
        setShowResetPasswordEnterEmail(false);
    };

    const handleForgotPasswordClick = () => {
        setShowResetPasswordEnterEmail(true);
        setIsCredentialsNotValid(false);
        setIsEmailSent(false);
    };

    const handleEmailSent = () => {
        setIsEmailSent(true);
        setShowResetPasswordEnterEmail(false);
    };

    return (
        <div className='login-page'>
            <AuthPagesWatchDogLogo />
            <div className='login-reset-password-enter-email-container'>
                {!showResetPasswordEnterEmail ? (
                    <div className='login-form-container'>
                        <AuthFormTitle title='Login' />
                        {isCredentialsNotValid && (
                            <div>
                                <AuthFormSubTitle subtitle='Please adjust the following:' />
                                <AuthFormErrorsList errors={['Incorrect email or password.']} />
                            </div>
                        )}
                        {isEmailSent && (
                            <AuthFormIconMessage
                                iconSrc={successIcon}
                                imgAlt='success'
                                message="We've sent you an email with a link to update your password."
                            />
                        )}
                        <AuthFormInput
                            label='Email'
                            type='email'
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <AuthFormInput
                            label='Password'
                            type='password'
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <AuthHelpLink
                            actionText='FORGOT YOUR PASSWORD?'
                            onClickActionLink={handleForgotPasswordClick}
                        />
                        <AuthFormSubmitButton text='SIGN IN' onClick={handleLoginSubmit} />
                        <AuthHelpLink inquiryText="Don't have an account? " href="/signup" actionText='CREATE ACCOUNT' />
                    </div>
                ) : (
                    <ResetPasswordEnterEmail onClickCancel={handleCancelCLick} onEmailSent={handleEmailSent} />
                )}
            </div>
        </div>
    );
}

export default LoginPage;
