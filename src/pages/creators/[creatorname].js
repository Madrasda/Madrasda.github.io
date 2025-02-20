import { useRouter } from "next/router";
import ProductList from "@/pages/productlist";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../context/context";
import Script from "next/script";
import { NEXT_PUBLIC_CLARITY_ID, NEXT_PUBLIC_PIXEL_ID } from "@/firebaseConfig";
import { API_URL } from "@/utils/constants";


function VendorProductsPage() {
  const router = useRouter();
  const ctx = useContext(UserContext);
  const { query } = router;
  const { id } = router.query;
  // Fetch the products for the specified vendorId
  const [vendorProducts, setVendorProducts] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [title, setTitle] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const setPageData = (vendors) => {
    const vendorName = vendors.find((vendor) => slugify(vendor.companyName) === query.creatorname)
    // console.log(vendors, vendorName, router.pathname, query)
    setTitle(
      vendorName.companyName
    );
    axios
      .get(
        API_URL + "/api/product/getProductsByVendor/" +
          vendorName.id +
          "?pageNo=" +
          pageNo +
          "&pageSize=20"
      )
      .then((response) => {
        setVendorProducts(response.data);
        // console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (query && router.isReady) {
      if (ctx.vendorList.length !== 0 && ctx.vendorList !== undefined) {
        setPageData(ctx.vendorList);
      } else {
        axios
          .get(
            API_URL + "/api/admin/getVendors"
          )
          .then((response) => {
            setPageData(response.data);
            // console.log(response.data);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [id, query, pageNo]);

  return (
    <>
    <Script id="ms_clarity" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${NEXT_PUBLIC_CLARITY_ID}");`
      }} />
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-P9LL7RBT1S'
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive' dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-P9LL7RBT1S');
      `
      }} />
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-X2S6C04TDD'
        strategy='afterInteractive'
      />
      <Script id='google-analytics-2' strategy='afterInteractive' dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-X2S6C04TDD');
      `
      }} />
      <ProductList
        productsPage={vendorProducts}
        setPageNo={setPageNo}
        pageNo={pageNo}
        title={title}
      />
    </>
  );
}

export default VendorProductsPage;
