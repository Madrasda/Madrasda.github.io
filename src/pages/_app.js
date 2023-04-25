import '@/styles/globals.css'
import {UserContext} from "../../context/context";
import {useEffect, useState} from "react";
import {isTokenValid} from "@/utils/JWTVerifier";
import axios from "axios";
import {createTheme} from '@nextui-org/react'
import {useRouter} from 'next/router';

const theme = createTheme({
    type: 'dark', theme: {
        fonts: {
            algeria: 'Montserrat',
        },
    },
})

function Loading() {
    const router = useRouter();
}

export default function App({Component, pageProps}) {

    const [cart, setCart] = useState({});
    const [token, setToken] = useState("");
    const [vendorList, setVendorList] = useState([]);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const jwtToken = localStorage.getItem("token")
        if (jwtToken === undefined || isTokenValid(jwtToken)) {
            setToken(jwtToken);
            axios.get("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/", {
                headers: {
                    "Authorization": "Bearer " + jwtToken
                }
            })
                .then(response => {
                    setCart(response.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        axios.get("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/admin/getVendors")
            .then(response => setVendorList(response.data))
            .catch(err => console.log(err));

    }, [isLoggedIn]);

    const decrementQty = (id, qty) => {
        setCart(oldCart => {
            let newCart = []
            for (let item of oldCart.cartItems) {
                if (item.id === id)
                    if (qty < 1) continue
                    else item.quantity = qty
                newCart.push(item);
            }
            return {...oldCart, cartItems: newCart};
        });

        axios.put("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/changeQuantity/" + id + "&&" + qty, null, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .catch(err => console.log(err));
    }
    const incrementQty = (id) => {
        let qty;
        setCart(oldCart => {
            return {
                ...oldCart, cartItems: oldCart.cartItems.map(item => {
                    if (item.id === id) {
                        qty = ++item.quantity
                    }
                    return item;
                })
            };
        })
        axios.put("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/changeQuantity/" + id + "&&" + qty, null, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .catch(err => console.log(err));
    }
    const customQuantity = (id, qty) => {
        setCart(oldCart => {
            const newCart = oldCart.cartItems.map(item => {
                if (item.id === id) {
                    if (item.quantity <= 1 && item.quantity > 65535) return;
                    item.quantity = qty;
                }
                return item;
            });
            return {...oldCart, cartItems: [...newCart]};
        })
        axios.put("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/changeQuantity/" + id + "&&" + qty, {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .catch(err => console.log(err));
    }
    const removeItem = (id) => {
        setCart(oldCart => {
            return {
                ...oldCart, cartItems: oldCart.cartItems.filter(item => item.id !== id)
            }
        })
        axios.put("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/changeQuantity/" + id + "&&0", {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .catch(err => console.log(err));
    }
    const addToCart = async (product) => {
        if (isTokenValid(token)) {
            const cartItem = {
                "id": product.id,
                "colors": product.colors,
                quantity: product.quantity
            }
            return (await axios.post("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/addToCart", cartItem, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then((response) => {
                    return axios.get("https://spring-madrasda-2f6mra4vwa-em.a.run.app/api/cart/", {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    })
                })
                .then(response => {
                    setCart(response.data)
                    return response.status;
                })
                .catch((err) => {
                    console.log(err);
                }))
        } else {
            router.push("/login")
        }

    }

    return (<>

            <Loading/>
            <UserContext.Provider value={{
                decrementQty: decrementQty,
                incrementQty: incrementQty,
                customQuantity: customQuantity,
                removeItem: removeItem,
                addToCart: addToCart,
                cart: cart,
                vendorList: vendorList,
                setIsLoggedIn: setIsLoggedIn,
                setRefresh: setRefresh,


            }}>
                <Component {...pageProps} id="page"/>
            </UserContext.Provider>
        </>

    )
}
