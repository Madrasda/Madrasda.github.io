import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import axios from "axios";
import { useRouter } from 'next/router';
import { isTokenValid } from '@/utils/JWTVerifier';
import {Button} from '@mui/material'
import { useRef } from 'react';
export default function Vendorlogin() {
    const mail = useRef();
    const password = useRef();
    const router = useRouter();
    let isReady = router.isReady;
    const vendorlogin = (e) => {
        e.preventDefault();
        axios.post('https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/auth/loginVendor',
            {
                email: mail.current.value,
                password: password.current.value
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                router.push("/vendor/dashboard");
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token && isTokenValid(token))
            router.push("/vendor/dashboard");
    }, [])

    const showLogin = () => {
        var login_element = document.getElementById("login");
        login_element.classList.remove("hidden");

        var signup_element = document.getElementById("signup");
        signup_element.classList.add("hidden");

        var login_button_element = document.getElementById("login_button");
        login_button_element.classList.add("bg-primary");

        var signup_button_element = document.getElementById("signup_button");
        signup_button_element.classList.remove("bg-primary");
    }

    const showSignup = () => {
        var signup_element = document.getElementById("signup");
        signup_element.classList.remove("hidden");

        var login_element = document.getElementById("login");
        login_element.classList.add("hidden");

        var signup_button_element = document.getElementById("signup_button");
        signup_button_element.classList.add("bg-primary");

        var login_button_element = document.getElementById("login_button");
        login_button_element.classList.remove("bg-primary");

    }
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
    setLoading(false);
      }, 1000);
  }, []);
  if(loading && isReady)
    return (<div className='z-50 h-screen w-screen overflow-hidden'>
    <Image src="/loader.gif" width={1920} height={1080} className="object-cover object-center w-full h-full"/>
    </div>);
    return (
        <>
            <Head>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" />
                <title>Madrasda | Login</title>
            </Head>
            <div className="bg-center bg-fixed bg-no-repeat bg-cover flex bg-[url(https://cdn.discordapp.com/attachments/812329575953858620/1078262102269104199/Login.png)] min-w-screen min-h-screen w-full h-full">

                <div className='w-full h-fit bg-cover bg-center flex justify-around bg-transparent max-w-md mx-auto mt-10 backdrop-blur-md bg-black/60 rounded-3xl drop-shadow-2xl py-8'>

                    <div className='flex flex-col'>
                        <div className='flex w-full justify-around transition-all ease-in-out duration-300'>
                            <button className='text-base text-white font-medium mt-2 mb-12 text-center bg-primary w-1/2 h-1/2 rounded-2xl flex justify-center items-center'
                                onClick={showLogin} id="login_button">
                                LOGIN
                            </button>
                            <button className='text-base text-white font-medium mt-2 mb-12 text-center w-1/2 h-1/2 rounded-2xl flex justify-center items-center'
                                onClick={showSignup} id="signup_button">
                                SIGN UP
                            </button>
                        </div>

                        <div className='flex flex-col px-16 w-full' id="login">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-24">
                                    <img src="/logo.png" alt="LOGO" />
                                </div>
                            </div>
                            <form onSubmit={vendorlogin}>
                                <div>
                                    <label htmlFor='email' className='text-white'>Username</label>
                                    <input
                                        type='email'
                                        className={'w-full p-2 text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='username'
                                        placeholder='example@example.com'
                                        ref={mail}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='password' className='text-white'>Password</label>
                                    <input
                                        type='password'
                                        className={'w-full p-2 text-primary rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='password'
                                        placeholder='**********'
                                        ref={password}
                                    />
                                </div>


                                <div className='flex justify-center items-center mt-6'>
                                        <Button
                                            variant={"contained"}
                                            sx={{
                                                backgroundColor: '#A5153F', // sets the background color to primary
                                                color: 'white', // sets the text color to white
                                                '&:hover': {
                                                    backgroundColor: '#c51a4c', // sets the background color on hover to accent
                                                },
                                            }}
                                            type={"submit"}
                                            onClick={vendorlogin}
                                        >
                                            Login
                                        </Button>
                                </div>
                            </form>
                            <div className="w-100 underline text-white text-sm text-center mt-3">
                                <Link href="/login">
                                    Go Back
                                </Link>
                            </div>
                            <br />
                        </div>

                        <div className='hidden flex-col px-10 w-full' id="signup">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-24">
                                    <img src="/logo.png" alt="LOGO" />
                                </div>
                            </div>
                            <form>
                                <div className='flex justify-center items-center py-4'>
                                    {/* <Dropdown>
                                <Dropdown.Button flat css={{
                                    background: '#F7F7F7',
                                    fontFamily: 'Algeria Sans',
                                    fontWeight: '$bold',
                                    color: '#1A1A1C',
                                }}
                                >Select Vendor</Dropdown.Button>
                                <Dropdown.Menu aria-label="Static Actions" css={{
                                    fontFamily:'Algeria Sans',
                                    background: '#F7F7F7',
                                }}>
                                    <Dropdown.Item key="production house" id="production-house">
                                        <Link href="#">Production House</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item key="influencer">
                                        <Link href="#">Influencer</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item key="youtuber">
                                        <Link href="#">Youtuber</Link>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                                </div>
                                <div>
                                    <label htmlFor='email' className='text-white'>E-mail</label>
                                    <input
                                        type='text'
                                        className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='company-url'
                                        placeholder='example@example.com'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='vendor-name' className='text-white'>Vendor Display Name</label>
                                    <input
                                        type='text'
                                        className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='vendor-display-name'
                                        placeholder='Example Vendor'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='company-name' className='text-white'>Company Name</label>
                                    <input
                                        type='text'
                                        className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='company-name'
                                        placeholder='Example Company Name'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='company-url' className='text-white'>Company URL</label>
                                    <input
                                        type='text'
                                        className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='company-url'
                                        placeholder='https://exampledomain.com'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='gst-in' className='text-white'>GST IN</label>
                                    <input
                                        type='text'
                                        className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                        id='gst-in'
                                        placeholder='12345678'
                                    />
                                </div>
                                {/* <div>
                            <label htmlFor='password' className='text-white'>Password</label>
                            <input
                                type='password'
                                className={'w-full p-2 text-bg rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4'}
                                id='company-url'
                                placeholder='********'
                            />
                        </div> */}
                                <div className='flex justify-center items-center mt-6'>
                                    <Link href="/vendor">
                                        <button className={`bg-[#A5153F] cursor-pointer py-2 px-5 text-white rounded focus:outline-none `}>
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
