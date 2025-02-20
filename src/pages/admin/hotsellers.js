import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTokenValid, getRole } from "@/utils/JWTVerifier";
import SearchVendor from "@/components/search-vendor";
import AdminLayout from "@/components/layout-admin";
import { uuidv4 } from "@firebase/util";
import { API_URL } from "@/utils/constants";

export default function Hotsellers() {
  const [tokenExists, setTokenExists] = useState(false);
  const [products, setProducts] = useState([]);

  const router = useRouter();
  let isReady = router.isReady;
  const [loading, setLoading] = useState(false);

  const getAllProducts = async () => {
    const response = await axios.get(
      API_URL + "/api/product/hotsellers",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      }
    );
    setProducts(response.data);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("token_admin");
    
    if (jwtToken === undefined || !isTokenValid(jwtToken) || getRole(jwtToken) !== 'ROLE_ADMIN')
      router.push("/admin");
    else {
      setTokenExists(true);
      getAllProducts();
    }
  }, []);
  return (
    <>
      <Head>
      <meta name="description" content="Madrasda is India's first content creators marketplace, providing a one-stop destination for official merchandise of your favorite content creators. Discover a diverse range of products from top Indian creators Shop now and get exclusive merchandise at Madrasda."/>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo.png' />
        <title>Madrasda | Hotsellers</title>
      </Head>

      {tokenExists && (
        <AdminLayout>
          <main className='body-font overflow-hidden font-quest md:ml-32'>
            <div className='px-5 my-10 mx-auto'>
              <h1 className='text-3xl md:text-4xl text-primary md:ml-20 md:mt-10'>
                HOTSELLERS
              </h1>

              <div className='mt-4 md:ml-20'>
                <section className="text-gray-600 body-font bg-[url('/templates-area.png')] bg-no-repeat bg-cover">
                  <div className='px-5 py-52 lg:mx-32'>
                    <div className='flex flex-wrap lg:flex-nowrap justify-center'>
                      {!products && (
                        <h1 className='text-5xl font-black text-center text-white'>
                          No products to show!
                        </h1>
                      )}
                      {products &&
                        products.map((product, index) => {
                          if (index < 4) {
                            return (
                              <div
                                key={uuidv4()}
                                className='lg:w-1/4 md:w-1/2 p-4 h-96 w-full cursor-pointer bg-off-white mx-4 my-2 rounded drop-shadow-[8px_8px_10px_rgba(0,0,0,0.3)] hover:drop-shadow-[8px_8px_4px_rgba(0,0,0,0.4)] duration-300 ease-in-out'>
                                <div className='block relative h-full rounded overflow-hidden'>
                                  <Image
                                    src={product.colors[0].images[0]}
                                    alt='ecommerce'
                                    width={1080}
                                    height={1920}
                                    className='object-contain object-center w-full h-full block'
                                  />
                                </div>
                                <div className='mt-6 text-white text-center'>
                                  <h2 className='title-font text-sm font-medium'>
                                    {product.name}
                                  </h2>
                                </div>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </AdminLayout>
      )}
    </>
  );
}
