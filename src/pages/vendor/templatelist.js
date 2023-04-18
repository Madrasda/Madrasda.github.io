import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import SearchVendor from "@/components/search-vendor";
import VendorLayout from "@/components/layout-vendor";
import Mockup from "@/components/mockup";
import MockupModal from "@/components/mockup-modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenValid } from "@/utils/JWTVerifier"
import MockupModel from "@/components/mockupmodel";

export default function TemplateList () {
  const [products, setProducts] = useState(null);
  const [pageNo, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [mockupDetails, setMockupDetails] = useState(null);
  const [totalElements, setTotalElements] = useState(0);
  const [colors, setColors] = useState(null);
  const [sizes, setSizes] = useState(null);
  const [tokenExists, setTokenExists] = useState(false);
  const [mockups, setMockups] = useState([]);
  const router = useRouter();
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
      router.push("/vendor");
    else
      setTokenExists(true);
    getAllMockups();
    getVendorProducts();
  }, []);

  useEffect(()=>{
    getVendorProducts();
  }, [pageNo]);

  const getVendorProducts = async (id) => {
    const url = new URLSearchParams({
      pageNo: pageNo,
      pageSize : 5
    });
    const response = await axios.get("http://localhost:8080/api/templates/getTemplates?" + url , {
      headers : {
        Authorization : "Bearer " + localStorage.getItem('token') 
      }
    });
    setProducts(response.data.content);
    setPageSize(response.data.totalPages);
  }

  const getAllMockups = async () => {
    const response = await axios.get(
        "http://localhost:8080/api/mockup/getAllMockups"
    );
    setMockups(response.data.content);
  }

  const getAvailableSizes = (skuMapping) => {
        var availableSizes = []
        skuMapping.forEach(sku => {
            if(!availableSizes.includes(sku.size.size))
                availableSizes.push(sku.size.size);
        });
        return availableSizes;
  }

  const getAvailableColors = (skuMapping) => {
        var availableColors = []
        skuMapping.forEach(sku => {
            if(!availableColors.includes(sku.color.hexValue))
                availableColors.push(sku.color.hexValue);
        });
        return availableColors;
  }
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
      <title>Madrasda | Create Template</title>
    </Head>
    
    <VendorLayout>
    <section className="body-font overflow-hidden font-algeria
                        md:ml-36">
      <div className="px-5 my-10 mx-auto">
        <h1 className="text-3xl text-primary
                       md:ml-20">CREATE TEMPLATE</h1>
        <div className="flex flex-wrap justify-center">
          
        <div className="lg:w-1/4 md:w-1/2 p-4 w-full h-96 flex items-center justify-center m-5 rounded duration-200 ease-in-out">  
  
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <MockupModal
              mockups={mockups}
            />
            <p className="font-semibold font-base">Create more templates</p>
            <p className="font-light text-gray font-sm">Add them to your merch and start selling</p>
          </div>
        </div>
{/*  */}
        {   products &&
            products.map((m) => {
                return (
                    <Link href={`/vendor/uploadproduct/${m.id}`} className="lg:w-1/4 md:w-1/2 p-4 w-full h-full cursor-pointer bg-off-white m-5 rounded drop-shadow-[4px_4px_10px_rgba(0,0,0,0.2)] hover:drop-shadow-[8px_8px_4px_rgba(0,0,0,0.3)] duration-200 ease-in-out">
                      <Mockup
                        key={m.id}
                        image={m.frontDesignImage || m.backDesignImage}
                        name={m.mockup.name}
                        sizes={getAvailableSizes(m.mockup.skuMapping)}
                        colors={getAvailableColors(m.mockup.skuMapping)}
                      />
                    </Link>
                )
            })
        }
        </div>
        <div className="flex justify-center mt-32">
            <button className="bg-[#a51535] hover:bg-[#560b21] text-white font-small py-2 px-4 rounded-l" onClick={
                () => {
                    setPage(pageNo===0 ? 0 : pageNo-1)
                }
            }>
                Prev
            </button>
            <button className="bg-[#a51535] hover:bg-[#560b21] text-white font-small py-2 px-4 rounded-r" onClick={
                () => {
                    setPage(pageNo===pageSize-1 ? pageNo : pageNo+1);
                }
            }>
                Next
            </button>
        </div>
      </div>
    </section>
    </VendorLayout>
    </>
  );
}