import Head from "next/head";
import VendorLayout from "@/components/layout-vendor";
import LineGraph from "@/components/linegraph";
import Image from "next/image";
import WithdrawModal from "@/components/withdraw-modal";
import Link from "next/link";
import axios from 'axios';
import { useState,useRef, useEffect } from "react";
import cookieCutter from 'cookie-cutter'

export default function Dashboard () {
    const [token, setToken] = useState();
    
    const [vendorDetails,setvendordetails]=useState({});
    
   
      
    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            setToken(sessionStorage.getItem('token'));
            console.log(token);

            const mail=sessionStorage.getItem('mail');
            console.log(mail);
            axios
            .get('http://localhost:8080/api/vendor/vendorDetails?email='+mail)
            .then((vendorGetResponse)=>{
                sessionStorage.setItem("id",vendorGetResponse.data.vendor.id);
                // console.log(vendorGetResponse.data)
                setvendordetails(vendorGetResponse.data);
            })
            .catch((vendorErr)=>{
                // console.log(vendorErr);
            })
          }
          else {
            window.location.href = '/admin';
          }
        
      },[]);
   
    console.log(vendorDetails.salesAnalysis)
    return (
        <>
            <Head>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/logo.png" />
            <title>Madrasda | Dashboard</title>
            </Head>

            <VendorLayout>
                <main className="body-font font-algeria overflow-hidden
                                md:ml-36">
                <div className="px-5 my-10 mx-auto">
                <h1 className="text-3xl text-primary
                               md:ml-20 md:mt-10">DASHBOARD</h1>

                <section className="text-gray-600 body-font">
                    <div className="container px-5 py-14 mx-auto">
                        <div className="flex flex-nowrap -m-4 text-center">
                            <div className="p-4 w-1/2
                                            lg:w-1/3">
                                <h1 className="title-font font-bold text-xl">Total Products</h1>
                                {/* <h2 className="title-font font-bold text-3xl text-primary">{vendorDetails.salesAnalysis.totalProducts}</h2> */}
                                <p className="leading-relaxed text-xs">40% more than previous 28 days</p>
                            </div>
                            <div className="p-4 w-1/2
                                            lg:w-1/3">
                                <h1 className="title-font font-bold text-xl">Total Orders</h1>
                                {/* <h2 className="title-font font-bold text-3xl text-primary">{vendorDetails.salesAnalysis.totalOrders}</h2> */}
                                <p className="leading-relaxed text-xs">460% more than previous 28 days</p>
                            </div>
                            <div className="p-4 w-full
                                            lg:w-1/3">
                                <h1 className="title-font font-bold text-xl">Total Profit Earned</h1>
                                {/* <h2 className="title-font font-bold  text-3xl text-primary">₹{vendorDetails.salesAnalysis.totalProfit}</h2> */}
                                <p className="leading-relaxed text-xs">460% more than previous 28 days</p>
                                <div className="justify-center ml-40 mt-4">
                                <WithdrawModal/>
                                </div>
                                {/* <button type="submit" className="text-white bg-primary font-medium rounded-full text-sm px-4 py-2 text-center mt-4" >Withdraw</button> */}
                            </div>
                        </div>
                    </div>  
                </section>

                <div className='md:ml-20 flex justify-center items-center'>
                    {/* <LineGraph dataset={vendorDetails.salesAnalysis.monthlySales} /> */}
                </div>

                <div className="flex flex-col justify-center items-center -mt-[140%]
                                md:-mt-[75%] md:ml-20
                                lg:-mt-80">
                    <h1 className="text-primary text-4xl font-semibold">WOAH!</h1>
                    <div className="flex text-lg justify-center items-center w-full
                                    lg:w-1/3">
                        <h2 className="p-1">We have sold</h2>
                        <h3 className="text-primary p-1 font-semibold text-2xl">10</h3>
                        <h2 className="p-1">products today!</h2>
                    </div>
                </div>

                <div className="bg-[url('/templates-bg.png')] bg-no-repeat bg-cover mt-4
                                md:ml-20 md:mt-20">
                    <div className="flex justify-between items-center px-5 pt-10 md:pl-10">
                        <h1 className="text-xl text-white font-semibold
                                    md:text-3xl">YOUR TEMPLATES</h1>
                        <Link href="/vendor/designgallery">
                        <Image src="/add-template-icon.png" width={90} height={90} className="cursor-pointer" />
                        </Link>
                    </div>
                    <div className="flex justify-around items-center py-10 flex-wrap">
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                    </div>
                    <div className="flex justify-around items-center py-10 flex-wrap">
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                        <Image className="w-1/3 p-2 lg:w-1/5 md:p-none" src="/your-templates.png" width={200} height={233.33} />
                    </div>
                </div>

                <div className="bg-[url('/templates-bg.png')] bg-no-repeat bg-cover mt-20 
                                md:ml-20">
                    <h1 className="pl-5 pt-10 text-xl text-white font-semibold
                                   md:pl-10 md:text-3xl">TOP SELLERS THIS WEEK</h1>
                    <div className="flex py-10 justify-around flex-wrap">
                        <div className="flex flex-col items-center pt-16 w-1/3 p-2">
                            <Image src="/your-templates.png" width={200} height={233.33} className="object-contain"/>
                            <div className="py-4 px-5 z-1 -mt-4 w-fit border-4 border-primary rounded-full bg-white text-xl text-primary font-semibold italic">#2</div>
                        </div>
                        <div className="flex flex-col items-center pb-26 w-1/3 p-2">
                            <Image src="/your-templates.png" width={200} height={233.33} className="object-contain"/>
                            <div className="py-4 px-5 z-1 -mt-4 w-fit border-4 border-primary rounded-full bg-white text-xl text-primary font-semibold italic">#1</div>
                        </div>
                        <div className="flex flex-col items-center pt-32 w-1/3 p-2">
                            <Image src="/your-templates.png" width={200} height={233.33} className="object-contain"/>
                            <div className="py-4 px-5 z-1 -mt-4 w-fit border-4 border-primary rounded-full bg-white text-xl text-primary font-semibold italic">#3</div>
                        </div>
                    </div>
                </div>

                </div>
                </main>
            </VendorLayout>
        </>
    )
}