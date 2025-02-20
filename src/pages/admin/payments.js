import Head from "next/head";
import AdminLayout from "@/components/layout-admin";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenValid, getRole } from "@/utils/JWTVerifier";
import PayoutConfirm from "@/components/payout-confirm";
import {uuidv4} from "@firebase/util";
import { Grow, Paper } from "@mui/material";
import { API_URL } from "@/utils/constants";

export default function CustomerDetails() {
  const router = useRouter();
  const [tokenExists, setTokenExists] = useState(false);
  const [payouts, setPayouts] = useState([]);
  let isReady = router.isReady;

  const getAllPayoutRequest = async () => {
    const response = await axios.get(
      API_URL + "/api/admin/getPayoutRequestedVendors",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      }
    );
    setPayouts(response.data);
  };

  const completePayout = async (id) => {
    const response = await axios.post(
      API_URL + "/api/admin/completePayout/" +
        id
    );
    getAllPayoutRequest();
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("token_admin");
    if (
      jwtToken === undefined ||
      !isTokenValid(jwtToken) ||
      getRole(jwtToken) !== "ROLE_ADMIN"
    )
      router.push("/admin");
    else setTokenExists(true);
    getAllPayoutRequest();
  }, []);

  return (
    <>
      <Head>
      <meta name="description" content="Madrasda is India's first content creators marketplace, providing a one-stop destination for official merchandise of your favorite content creators. Discover a diverse range of products from top Indian creators Shop now and get exclusive merchandise at Madrasda."/>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo.png' />
        <title>Madrasda | Payments</title>
      </Head>

      {tokenExists && (
        <AdminLayout>
          <main
            className='body-font overflow-hidden font-quest
                                md:ml-32'>
            <div className='px-5 py-10 md:py-0 mx-auto'>
              <h1
                className='text-3xl text-primary 
                               md:ml-20 mt-10'>
                PAYMENT REQUESTS
              </h1>
              {payouts.length === 0 && (
                <h1 className='text-xl md:ml-20 md:mt-10'>No payouts </h1>
              )}
              {payouts &&
                payouts.map((vendor, index) => {
                const delay = index * 80 + "ms";
                  return (
                     <Grow
                        key={uuidv4()}
                        in
                        timeout={600}
                     style={{transitionDelay:delay}}>
                       <Paper
                          key={uuidv4()}
                          className='flex mt-4 md:ml-20 lg:mr-20 bg-gray'>
                         <div className=' ml-8 mb-2 mr-20 mt-4 w-full'>
                           <div className='w-[150px] h-[150px] overflow-hidden rounded-full'>
                             <Image
                                src={vendor.imgUrl}
                                width={70}
                                height={70}
                                className='object-cover object-center w-full h-full'
                             />
                           </div>
                           <h1 className='text-2xl text-primary font-raj mb-6 pt-2'>
                             {vendor.name}
                           </h1>
                           <div className='flex flex-col md:flex-row justify-between w-full mb-2'>
                             <div>
                               <h2 className='mb-2 w-2/6 md:w-96 text-lg font-medium text-black flex items-center'>
                                 Payout Requested
                               </h2>
                               <h2 className='mb-2 w-2/6 md:w-96 text-lg font-medium text-black flex items-center'>
                                 ₹
                                 {Number(vendor.payoutAmount).toLocaleString(
                                    "en-IN"
                                 )}
                               </h2>
                             </div>
                             <PayoutConfirm
                                payout={(e) => {
                                  if (e) completePayout(vendor.payoutId);
                                }}
                             />
                           </div>
                         </div>
                       </Paper>
                     </Grow>
                  );
                })}
            </div>
          </main>
        </AdminLayout>
      )}
    </>
  );
}
