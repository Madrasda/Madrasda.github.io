import Head from 'next/head';
import ClientLayout from '@/components/layout-client';
import {useRouter} from "next/router";
import React, {useContext, useEffect, useRef, useState} from 'react';
import CheckoutItem from "@/components/CheckoutItem";
import {UserContext} from "../../context/context";
import { isTokenValid, getRole } from "@/utils/JWTVerifier";
import { uuidv4 } from "@firebase/util";
import axios from "axios";
import {Backdrop, Box, Button, CircularProgress, TextField} from "@mui/material";

export default function Checkout() {
  const [subTotal, setSubtotal] = React.useState(0);
  const [shippingCharges, setShippingCharges] = useState(-1);
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState(false);
  const [client, setClient] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const email = useRef();
  const country = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const addressLine1 = useRef();
  const addressLine2 = useRef();
  const city = useRef();
  const state = useRef();
  const phone = useRef();

  const router = useRouter();
  const ctx = useContext(UserContext);
  useEffect(() => {
    if (!isTokenValid(localStorage.getItem("token")) || getRole(localStorage.getItem("token")) !== 'ROLE_CUSTOMER') {
      router.push("/login");
    } else {
      if (ctx.cart.cartItems !== undefined) {
        const sum = ctx.cart.cartItems.reduce(
            (prev, curr) => (prev += curr.quantity * (curr.product.total * (100 - curr.product.discount) / 100)),
            0
        );
        setSubtotal(sum);
      }
      else{

      }
    }
  }, [ctx.cart]);
  const handleChange = (event) => {
    const text = event.target.value;
    setPincode((oldText) => {
      setTimeout(() => {
        if (text.length === 6) {
          setError(false);
          setSpinner(true);
          axios
              .get(
                  "https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/payment/getShippingCharges/" + text,
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }
              )
              .then((response) => {
                setShippingCharges(response.data);
                setSpinner(false);
              })
              .catch((err) => console.log(err));
        } else {
          setError(true);
        }
      }, 300);
      return text;
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const transaction = {
      billingIsShipping: true,
      shippingAddress: {
        name: firstName.current.value + " " + lastName.current.value,
        addressLine1: addressLine1.current.value,
        addressLine2: addressLine2.current.value,
        city: city.current.value,
        state: state.current.value,
        postalCode: pincode,
        country: country.current.value,
        email: email.current.value,
        phone: phone.current.value,
      },
      orderItems: ctx.cart.cartItems.map((item) => {
        return {
          product: {
            id: item.product.id,
            colors: [{ sizes: [{ sku: item.product.sizeDTO.sku }] }],
          },
          quantity: item.quantity,
        };
      }),
    };
    axios
        .post("http://localhost:8080/api/payment/createOrder", transaction, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(
            (response) =>
                // console.log(response.data)
                (window.location.href = response.data)
        )
        .catch((err) => console.log(err));

  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (jwtToken && getRole(jwtToken) === "ROLE_ADMIN") router.push("/admin");
    if (jwtToken && getRole(jwtToken) === "ROLE_VENDOR") router.push("/vendor");
    if (jwtToken && isTokenValid(jwtToken)) setClient(true);
    else setClient(false);
  }, []);

  return (
     <>
       <Head>
         <meta name='description' content='Generated by create next app'/>
         <meta name='viewport' content='width=device-width, initial-scale=1'/>
         <link rel='icon' href='/logo.png'/>
         <title>Madrasda | Checkout</title>
       </Head>
       <Backdrop
          sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open={spinner}
       >
         <CircularProgress color="inherit"/>
       </Backdrop>
       <ClientLayout client={client}>
         <main>
           <div className='min-w-screen min-h-screen bg-gray-50 py-5'>
             <div className='px-5'>
               <div className='mb-2'>
                 <a
                    href='#'
                    className='focus:outline-none hover:underline text-gray text-sm'>
                   <i className='mdi mdi-arrow-left text-gray-400'></i>Back
                 </a>
               </div>
               <div className='mb-2'>
                 <h1 className='text-3xl text-primary md:ml-20 mt-10'>
                   ADD ADDRESS
                 </h1>
               </div>
               <div className='mb-5 md:ml-20 text-gray-400'>
                 <a
                    href='./index.js'
                    className='focus:outline-none hover:underline text-gray-500'>
                   Home
                 </a>{" "}
                 / <span className='text-gray-600'>Checkout</span>
               </div>
             </div>
             <hr className='h-px md:ml-20 mr-12 ml-5 my-6 bg-black border-1 dark:bg-primary'></hr>
             <div className='w-full bg-white border-gray-200 px-5 py-10 text-gray-800 pr-12'>
               <div className='w-full'>
                 <div className='-mx-3 md:ml-20 md:flex items-start'>
                   {/* CART DETAILS */}
                   <div className='px-3 md:w-5/12'>
                     {ctx.cart.cartItems &&
                        ctx.cart.cartItems.map((item) => (
                           <CheckoutItem
                              key={uuidv4()}
                              id={item.id}
                              qty={item.quantity}
                              product={item.product}
                           />
                        ))}
                     <hr className='h-px my-6 border-[#D9D9D9] border-1 '></hr>
                     <div className='mb-6 pb-6 text-lg border-b border-[#D9D9D9] text-black'>
                       <div className='w-full flex mb-3 items-center'>
                         <div className='flex-grow'>
                           <span className='text-black'>Subtotal</span>
                         </div>
                         <div className='pl-3'>
                           <span className='font-medium'>₹{subTotal}</span>
                         </div>
                       </div>
                       <div className='w-full flex items-center'>
                         <div className='flex-grow'>
                           <span className='text-black'>Shipping</span>
                         </div>
                         <div className='pl-3'>
                          <span className='font-medium'>
                            {shippingCharges === -1 ? (
                               <h4 className={"text-red"}>
                                 Enter a valid Pincode
                               </h4>
                            ) : shippingCharges === 0 ? (
                               "FREE"
                            ) : (
                               "₹" + shippingCharges
                            )}
                          </span>
                         </div>
                       </div>
                       <div className='w-full flex my-3 items-center'>
                         <div className='flex-grow'>
                           <span className='text-black'>Taxes</span>
                         </div>
                         <div className='pl-3'>
                          <span className='font-medium'>
                            ₹{(subTotal * 5) / 100}
                          </span>
                         </div>
                       </div>
                     </div>
                     <div className='mb-6 pb-6 border-b border-gray md:border-none text-gray-800 text-xl'>
                       <div className='w-full flex items-center'>
                         <div className='flex-grow'>
                           <span className='text-gray-600'>Total</span>
                           <p className='text-sm text-gray'>
                             Including all taxes
                           </p>
                         </div>
                         <div className='pl-3'>
                          <span className='font-medium text-gray text-sm'>
                            INR
                          </span>{" "}
                           <span className='font-medium text-2xl'>
                            ₹
                             {subTotal * (105.0 / 100.0) +
                                (shippingCharges === -1 ? 0 : shippingCharges)}
                          </span>
                         </div>
                       </div>
                     </div>
                   </div>
                   {/* ADDRESS FORM */}
                   <div className='px-3 md:w-7/12 lg:pr-10'>
                     <h2 className='ml-2 mb-6 title-font font-medium text-xl'>
                       Shipping Details
                     </h2>
                     <form onSubmit={handleSubmit}>
                       <div className='mb-4'>
                         <div className='mb-2 ml-2 mt-1 flex space-x-2 w-full'>
                           <TextField
                              label={"Email"}
                              required={true}
                              variant='outlined'
                              type={"email"}
                              className={'w-2/3'}
                              placeholder='example@gmail.com'
                              inputRef={email}
                           />
                           <TextField
                              label={"Phone"}
                              required={true}
                              variant={'outlined'}
                              type={'numeric'}
                              placeholder={'+91xxxxxxxxxx'}
                              className={'w-auto'}
                              inputRef={phone}
                              />
                         </div>
                       </div>
                       <div className='mb-4 ml-2 mt-1 flex flex-row space-x-2'>
                         <TextField
                            className='href w-full'
                            label='First Name'
                            required={true}
                            inputRef={firstName}
                         />
                         <TextField
                            className='href w-full'
                            label='Last Name'
                            inputRef={lastName}
                         />
                       </div>
                       <div className='mb-3 ml-2 mt-1 flex flex-row space-x-2'>
                         <TextField
                            className={`block w-full `}
                            label='Pincode'
                            error={error}
                            onChange={handleChange}
                            helperText={error && "Invalid Pincode"}
                            value={pincode}
                            inputProps={{minLength: 6, maxLength: 6}}
                            required
                         />
                         <TextField
                            className='block w-full '
                            label='State'
                            required={true}
                            inputRef={state}
                         />
                         <TextField
                            className='block w-full '
                            label='City'
                            required={true}
                            inputRef={city}
                         />
                       </div>
                       <div>
                         <div className='mb-4 ml-2 mt-1 '>
                           <TextField
                              className='w-full'
                              label='Country/Region'
                              required={true}
                              inputRef={country}
                           />
                         </div>

                         <div className='mb-4 ml-2 mt-1 '>
                           <TextField
                              className='href w-full '
                              label='Address Line 1'
                              required={true}
                              inputRef={addressLine1}
                           />
                         </div>
                         <div className='mb-6 ml-2 mt-1 '>
                           <TextField
                              className='href w-full '
                              label='Address Line 2 (Optional)'
                              inputRef={addressLine2}
                           />
                         </div>
                       </div>
                       <div className='flex justify-end'>
                         <Button
                            type='submit'
                            className={`text-white bg-primary hover:bg-accent text-white font-bold py-2 px-4 mr-2 mb-2`}>
                           Proceed to Payment
                         </Button>
                       </div>
                     </form>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </main>
       </ClientLayout>
     </>
  );
}
