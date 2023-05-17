import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useRouter} from 'next/router';
import {getRole, isTokenValid} from '@/utils/JWTVerifier';
import {Alert, Button, Input, MenuItem, Select, Snackbar} from "@mui/material";
import {UserContext} from "../../../context/context";
import ReturnRefundModal from '@/components/return&refund-modal';
import TermsConditionsModal from '@/components/terms&conditions-modal';
import PaymentStructureModal from '@/components/paymentstructure-modal';

export default function Vendorlogin() {
	const router = useRouter();
	const ctx = useContext(UserContext);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("");
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [open, setOpen] = useState(false);
	//Signup Details
	const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [infCat, setInfCat] = useState("Category");
  const [compName, setCompName] = useState("");
  const [url, setUrl] = useState("");
  const [gst, setGst] = useState("");
  let isReady = router.isReady;

  const handleClose = (event, reason) => {
    console.log(reason);
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const vendorSignup = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/auth/signupVendor",
        {
          name: name,
          email: email,
          phone: phNo,
          influencerCategory: infCat,
          companyName: compName,
          companyUrl: url,
          gstin: gst,
        }
      )
      .then(() => {
        setOpen(true);
        setMessage("Register Request Successfully Sent");
        setSeverity("success");
        setName("");
        setemail("");
        setInfCat("");
        setCompName("");
        setPhNo("");
        setUrl("");
        setGst("");
      });
  };

  const vendorlogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/auth/loginVendor",
        {
          email: mail,
          password: password,
        }
      )
      .then((response) => {
        ctx.setIsLoggedIn(true);
        localStorage.setItem("token_vendor", response.data.token);
        router.push("/vendor/dashboard");
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 409) {
          router.push("/AccountDisabled");
        } else {
          setOpen(true);
          setMessage("Please check your credentials");
          setSeverity("error");
          console.log(err);
        }
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("token_vendor");
    if (token && isTokenValid(token) && getRole(token) === "ROLE_VENDOR")
      router.push("/vendor/dashboard");
  }, []);

  const showLogin = () => {
    var login_element = document.getElementById("login");
    login_element.classList.remove("hidden");

    var signup_element = document.getElementById("signup");
    signup_element.classList.add("hidden");

    var login_button_element = document.getElementById("login_button");
    login_button_element.classList.add("bg-primary");

    var signup_button_element = document.getElementById("signup_button");
    signup_button_element.classList.remove("bg-primary");
  };

  const showSignup = () => {
    var signup_element = document.getElementById("signup");
    signup_element.classList.remove("hidden");

    var login_element = document.getElementById("login");
    login_element.classList.add("hidden");

    var signup_button_element = document.getElementById("signup_button");
    signup_button_element.classList.add("bg-primary");

    var login_button_element = document.getElementById("login_button");
    login_button_element.classList.remove("bg-primary");
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading && isReady)
    return (
      <div className='z-50 h-screen w-screen overflow-hidden'>
        <Image
          src='/loader.gif'
          width={1920}
          height={1080}
          className='object-cover object-center w-full h-full'
        />
      </div>
    );
  return (
    <>
      <Head>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo.png' />
        <title>Madrasda | Login</title>
      </Head>
      <Snackbar
        className={"mt-7"}
        open={open}
        autoHideDuration={1400}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <div className='bg-center bg-fixed bg-no-repeat bg-cover flex bg-[url(https://cdn.discordapp.com/attachments/812329575953858620/1078262102269104199/Login.png)] min-w-screen min-h-screen w-full h-full font-quest'>
        <div className='w-full h-fit bg-cover bg-center flex justify-center bg-transparent max-w-md mx-auto mt-10 backdrop-blur-md bg-black/60 rounded-3xl drop-shadow-2xl py-8 m-10'>
          <div className='flex flex-col w-2/3'>
            <div className='flex w-full transition-all ease-in-out duration-300'>
              <button
                className='text-base text-white font-medium mt-2 mb-12 text-center bg-primary w-1/2 h-1/2 rounded-2xl flex justify-center items-center'
                onClick={showLogin}
                id='login_button'>
                LOGIN
              </button>
              <button
                className='text-base text-white font-medium mt-2 mb-12 text-center w-1/2 h-1/2 rounded-2xl flex justify-center items-center'
                onClick={showSignup}
                id='signup_button'>
                SIGN UP
              </button>
            </div>

            <div className='flex flex-col w-full' id='login'>
              <div className='flex flex-wrap justify-center'>
                <div className='w-24'>
                  <img src='/logo.png' alt='LOGO' />
                </div>
              </div>
              <form onSubmit={vendorlogin} className='py-4 w-full space-y-3'>
                <div className='text-white'>
                  <Input
                    label='Username'
                    type='email'
                    InputProps={{
                      className: "text-primary",
                    }}
                    InputLabelProps={{
                      className: "text-primary",
                    }}
                    className={"w-full bg-gray px-3 py-1 rounded text-primary"}
                    color='warning'
                    id='username'
                    placeholder='example@example.com'
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type='password'
                    InputProps={{
                      className: "text-primary",
                    }}
                    InputLabelProps={{
                      className: "text-primary",
                    }}
                    variant='outlined'
                    label='Password'
                    className={"w-full bg-gray px-3 py-1 rounded text-primary"}
                    color='warning'
                    id='password'
                    placeholder='**********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className='flex justify-center items-center mt-6'>
                  <Button
                    variant={"contained"}
                    className={"w-full bg-primary"}
                    type={"submit"}
                    onClick={vendorlogin}>
                    Login
                  </Button>
                </div>
              </form>
              <div className='w-100 underline text-white text-sm text-center mt-3'>
                <Link href='/login'>Go Back</Link>
              </div>
              <br />
            </div>
            <div className='hidden flex-col w-full' id='signup'>
              <div className='flex flex-wrap justify-center'>
                <div className='w-24'>
                  <img src='/logo.png' alt='LOGO' />
                </div>
              </div>
              <div className='w-full space-y-8 justify-center items-center mt-6'>
                <h1 className='text-white text-center'>
                  Want to become a vendor? Send your details to us
                </h1>
                <form
                  onSubmit={vendorSignup}
                  className='text-primary w-full flex flex-col space-y-4'>
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    value={name}
                    required
                    placeholder='Your Name*'
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    value={email}
                    required
                    placeholder='Your Email*'
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    value={phNo}
                    required
                    placeholder='Your Phone Number*'
                    onChange={(e) => setPhNo(e.target.value)}
                  />
                  <Select
                    id='category-vendor'
                    className='bg-shadowGrey p-0'
                    inputProps={{
                      className: "text-primary text-sm",
                      "aria-label": "Category",
                    }}
                    value={infCat}
                    onChange={(e) => setInfCat(e.target.value)}>
                    <MenuItem value='Actor'>Actor</MenuItem>
                    <MenuItem value='Production House'>
                      Production House
                    </MenuItem>
                    <MenuItem value='Influencer'>Influencer</MenuItem>
                  </Select>
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    value={compName}
                    placeholder='Display name'
                    onChange={(e) => setCompName(e.target.value)}
                  />
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    required
                    value={url}
                    placeholder='Company URL/Social Media Handle*'
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Input
                    className='bg-shadowGrey mx-auto p-3 w-full'
                    color='warning'
                    inputProps={{ className: "text-primary text-sm" }}
                    type='text'
                    value={gst}
                    placeholder='GSTIN'
                    onChange={(e) => setGst(e.target.value)}
                  />
                  <div className='flex flex-col justify-center items-center'>
                    <ReturnRefundModal /> <br />
                    <TermsConditionsModal /> <br />
                    <PaymentStructureModal />
                  </div>
				  <div className='flex justify-center space-x-2 items-center'>
					<input type='radio' onChange={() => setAgree(true)} />
					<h1>I agree to the terms and condition</h1>
				  </div>
                  {agree && (
                    <Button
                      variant={"contained"}
                      className={"w-full bg-primary"}
                      type={"submit"}>
                      Request For Signup
                    </Button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
