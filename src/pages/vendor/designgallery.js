import Image from "next/image";
import Head from "next/head";
import VendorLayout from "@/components/layout-vendor";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/JWTVerifier"
import UploadModal from "@/components/upload-modal";

export default function DesignGallery () {
  const [tokenExists, setTokenExists] = useState(false)
  const [designs, setDesigns] = useState(null);
  const router = useRouter();
  const isReady = router.isReady;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
    setLoading(false);
      }, 1000);
  }, []);
  const getDesigns = async () => {
    const response = await axios.get(
      "https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/vendor/designs" , { 
        headers : {
          Authorization : "Bearer " + localStorage.getItem('token')
        }
      }  
    );
    setDesigns(response.data);
  }

  const handleUpload = (bool) => {
    if(bool){
      getDesigns();
    }
  }
  
  useEffect(() => {
    const jwtToken = localStorage.getItem("token")
    if(jwtToken === undefined || !isTokenValid(jwtToken))
      router.push("/vendor");
    else
      setTokenExists(true);
    if(isReady){
      getDesigns();
    }
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
      <title>Madrasda | Design Gallery</title>
    </Head>
    
    <VendorLayout>
    <section className="body-font overflow-hidden font-algeria
                        md:ml-36">
      <div className="mt-20 px-5 md:my-10 mx-auto">
        <h1 className="text-3xl text-primary
                       md:ml-20">DESIGN GALLERY</h1>
        <div className="md:ml-20 md:mt-10">
            <h1 className="text-lg my-5">Upload a new design</h1>
            <UploadModal
              upload={true}
              uploadSuccess={() => {router.reload()}}
            />
        </div>
        <div className="flex flex-wrap justify-start md:ml-20">
          { designs &&
            designs.map((d) => {
              return (
                <div className="lg:w-1/4 md:w-1/3 p-4 w-full h-full bg-off-white m-5 rounded drop-shadow-[4px_4px_10px_rgba(0,0,0,0.2)]" key={d.id}>
                  <div className="block relative h-[200px] md:h-[100px] lg:h-[200px] rounded overflow-hidden">
                    <Image src={d.imgUrl}
                    alt="ecommerce" 
                    height={1080}
                    width={1920} 
                    className="object-contain object-center w-full h-full" />
                  </div>
                </div>
              )
            })

          }          
        </div>
        <br/>
      </div>
    </section>
    </VendorLayout>
    </>
  );
}
