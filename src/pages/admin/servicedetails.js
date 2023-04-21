import Head from "next/head";
import SearchVendor from "@/components/search-vendor";
import Payments from "@/components/payments";
import AdminLayout from "@/components/layout-admin";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isTokenValid } from "@/utils/JWTVerifier";
import { useRouter } from "next/router";

export default function CustomerDetails () {

    const router = useRouter();
    const [tokenExists, setTokenExists] = useState(false);


    let isReady = router.isReady;
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
        setLoading(false);
        }, 1000);
    }, []);
    useEffect(() => {
        const jwtToken = localStorage.getItem("token")
        if(jwtToken === undefined || !isTokenValid(jwtToken))
          router.push("/admin");
        else
          setTokenExists(true);
    }, []);
    if(loading && isReady)
  return (<div className='z-50 h-screen w-screen overflow-hidden'>
  <Image src="/loader.gif" width={1920} height={1080}/>
  </div>);
    return (
        <>
            <Head>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/logo.png" />
            <title>Madrasda | Service Details</title>
            </Head>

            <AdminLayout>
                <main className="body-font overflow-y-scroll font-algeria
                                md:ml-32">
                <div className="px-5 my-10 mx-auto">
                <h1 className="text-3xl text-primary md:ml-20 md:mt-10">SERVICE DETAILS</h1>
                <div className='flex mt-4 md:ml-20 lg:mr-44'>
                    <div className="container mt-8 bg-[#D9D9D9] rounded-lg">
                        <div className=" ml-8 mb-2 mr-20 mt-4 ">
                            <h1 className="text-xl md:text-2xl font-medium text-black mb-6">Ship Rocket</h1>
                            <div className="flex mb-2">
                                <h2 className="text-lg font-medium w-2/3 md:w-96 text-black flex items-center">Services</h2>
                                <input type="text" className="bg-[#D9D9D9] text-gray text-lg w-5/6 md:w-96 p-2.5" value="Shipping, Invoices" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Payment</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="Rs.20/500gms" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Credentials</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="sales.iclothing@gmail.com" disabled readonly/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex mt-4 md:ml-20 lg:mr-44'>
                    <div className="container mt-8 bg-[#D9D9D9] rounded-lg">
                        <div className=" ml-8 mb-2 mr-20 mt-4 ">
                            <h1 className="text-xl md:text-2xl font-medium text-black mb-6">Razor Pay</h1>
                            <div className="flex mb-2">
                                <h2 className="text-lg font-medium w-2/3 md:w-96 text-black flex items-center">Services</h2>
                                <input type="text" className="bg-[#D9D9D9] text-gray text-lg w-5/6 md:w-96 p-2.5" value="Payment" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Credentials</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="sales.iclothing@gmail.com" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Key ID</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="rzp_test_ZGOoepGBbA5Y9P" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Secret Key</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="RzE1JEOSepBhh8g5LHXDqzsF" disabled readonly/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex mt-4 md:ml-20 lg:mr-44'>
                    <div className="container mt-8 bg-[#D9D9D9] rounded-lg">
                        <div className=" ml-8 mb-2 mr-20 mt-4 ">
                            <h1 className="text-xl md:text-2xl font-medium text-black mb-6">Google Cloud Platform</h1>
                            <div className="flex mb-2">
                                <h2 className="text-lg font-medium w-2/3 md:w-96 text-black flex items-center">Services</h2>
                                <input type="text" className="bg-[#D9D9D9] text-gray text-lg w-5/6 md:w-96 p-2.5" value="Deployment" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Payment</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="" disabled readonly/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex mt-4 md:ml-20 lg:mr-44'>
                    <div className="container mt-8 bg-[#D9D9D9] rounded-lg">
                        <div className=" ml-8 mb-2 mr-20 mt-4 ">
                            <h1 className="text-xl md:text-2xl font-medium text-black mb-6">Twillio</h1>
                            <div className="flex mb-2">
                                <h2 className="text-lg font-medium w-2/3 md:w-96 text-black flex items-center">Services</h2>
                                <input type="text" className="bg-[#D9D9D9] text-gray text-lg w-5/6 md:w-96 p-2.5" value="OTP SMS verification" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Service SID</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="VAcc0dd61369d2d89083085064ccb6ceb3" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Account SID</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="AC9af313760163b43c9a9a67ee9ca9bd03" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Auth Token</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="87436573660467c86096f5f9f51700ea" disabled readonly/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex mt-4 md:ml-20 lg:mr-44'>
                    <div className="container mt-8 bg-[#D9D9D9] rounded-lg">
                        <div className=" ml-8 mb-2 mr-20 mt-4 ">
                            <h1 className="text-xl md:text-2xl font-medium text-black mb-6">Firebase</h1>
                            <div className="flex mb-2">
                                <h2 className="text-lg font-medium w-2/3 md:w-96 text-black flex items-center">Services</h2>
                                <input type="text" className="bg-[#D9D9D9] text-gray text-lg w-5/6 md:w-96 p-2.5" value="Store Images" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">API Key</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="AIzaSyDTe4Rdgq9W_oMXOQERHuSu5gV_S1pWU9o" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Auth Domain</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="madrasda-59f3e.firebaseapp.com" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Project IS</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="madrasda-59f3e" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Storage Bucket</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="madrasda-59f3e.appspot.com" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">Message Sender ID</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="206873668873" disabled readonly/>
                            </div>
                            <div className="flex mb-2">
                                <h2 for="last_name" className="w-2/3 md:w-96 text-lg font-medium text-black flex items-center">APP ID</h2>
                                <input type="text" className="bg-[#D9D9D9]  text-gray text-lg w-5/6 md:w-96 p-2.5" value="1:206873668873:web:0e1836f928f560514d77d8" disabled readonly/>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </main>
            </AdminLayout>
        </>
    )
}