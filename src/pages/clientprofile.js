import ClientLayout from '@/components/layout-client';
import OrderDetailsModal from '@/components/orderdetails-modal';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect,useState } from 'react';
import { useRouter } from "next/router";
import { isTokenValid, getRole } from '@/utils/JWTVerifier';

export default function clientprofile() {

  const router = useRouter();
  let isReady = router.isReady;
  const [details, setDetails] = useState(null);
  const [designs, setDesigns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
    setLoading(false);
      }, 1000);
  }, []);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if(jwtToken && getRole(jwtToken) === "ROLE_ADMIN")
        router.push("/admin");
    if(jwtToken && getRole(jwtToken) === "ROLE_VENDOR")
        router.push("/vendor");
    if(jwtToken && isTokenValid(jwtToken))
        setClient(true);
    else
        setClient(false);
  }, [])

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
        <title>Madrasda | Profile</title>
      </Head>

      <ClientLayout client={client}>
      <section className="body-font font-algeria">
      <div className="px-5 py-24 mx-auto">
      <h1 className="text-3xl font-bold text-primary md:ml-10 md:mt-4">My Profile</h1>

      <Image src="/myvendor-vikram.png" 
                alt="ecommerce" 
                height={200}
                width={200} 
                className="object-cover ml-16 mt-4 rounded-lg" />

      <div className='mt-8 ml-16'>
      <h2 className="ml-2 title-font font-medium text-lg">Name :</h2>
        <div className="mb-2 ml-2 ">
            <input type="text" className="bg-white border-b border-[#D9D9D9] text-black text-sm  focus:ring-primary focus:border-[#D9D9D9] block w-96 p-2.5" placeholder="UserName" readOnly />
        </div>
      </div>
      <div className='mt-4 ml-16'>
      <h2 className="ml-2 title-font font-medium text-lg">Phone Number :</h2>
        <div className="mb-2 ml-2 ">
            <input type="text" className="bg-white border-b border-[#D9D9D9] text-black text-sm  focus:ring-primary cursor-default focus:border-[#D9D9D9] block w-96 p-2.5" placeholder="9999999999" readOnly/>
        </div>
      </div>

      <h1 className='font-algeria font-bold text-lg mt-10 ml-16'>Order History</h1>
      <div className="px-3 md:w-5/12 ml-16 mb-4 mt-8">
      <div className="w-full flex items-center hover:bg-off-white rounded-lg">
          <div className="overflow-hidden rounded-lg w-2/12 h-2/12 bg-[#D9D9D9] border border-gray">
          <Image src="/vikram-tee.png" alt="ecommerce" width={1080} height={1920} className="object-contain object-center w-full h-full block" />
          </div>
          <div className="flex-grow pl-3 ml-4">
              <h6 className="font-medium text-2xl text-black">Round Neck Solid Mens T-Shirt</h6>
              <p className="text-gray">Vikram Collection</p>
              <p className="text-gray">Size-L</p>
              <p className="text-gray">Qty-1</p>
          </div>
          <div className='scale-75'>
              <OrderDetailsModal/>
          </div>
      </div>
      </div>
      <div className="px-3 md:w-5/12 ml-16 mb-4 mt-8">
      <div className="w-full flex items-center hover:bg-off-white rounded-lg">
          <div className="overflow-hidden rounded-lg w-2/12 h-2/12 bg-[#D9D9D9] border border-gray">
          <Image src="/vikram-tee.png" alt="ecommerce" width={1080} height={1920} className="object-contain object-center w-full h-full block" />
          </div>
          <div className="flex-grow pl-3 ml-4">
              <h6 className="font-medium text-2xl text-black">Round Neck Solid Mens T-Shirt</h6>
              <p className="text-gray">Vikram Collection</p>
              <p className="text-gray">Size-L</p>
              <p className="text-gray">Qty-1</p>
          </div>
          <div className='scale-75'>
              <OrderDetailsModal/>
          </div>
      </div>
      </div>

      </div>
      </section>
      </ClientLayout>
    </>
  )
}

