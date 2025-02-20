import React, { useState } from "react";
import Image from "next/image";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { uuidv4 } from "@firebase/util";
import XLSX, { set_cptable } from "xlsx";
import * as cptable from "xlsx/dist/cpexcel.full.mjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { JsonToExcel } from "react-json-to-excel";
import { Edit } from "@mui/icons-material";
import { API_URL } from "@/utils/constants";

set_cptable(cptable);

export default function ProductTable({ products, setProducts, path }) {
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const closeModal = () => setVisible(false);
  const openModal = () => setVisible(true);

  const getAvailableColors = (colors) => {
    var Available = [];
    colors.forEach((item) => {
      if (Available.indexOf((i) => i.hexValue === item.hexValue) === -1)
        Available.push({
          color: item.color,
          hexValue: item.hexValue,
        });
    });
    return Available;
  };

  const togglePublishStatus = async (id, inSale) => {
    setSpinner(true);
    const response = await fetch(
      API_URL + "/api/product/togglePublishState/" +
        id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_vendor"),
        },
      }
    );
    setSpinner(false);
    if (response.status === 200) {
      setProducts((old) => [
        ...old.map((p) => {
          if (p.id === id) p.publishStatus = !p.publishStatus;
          return p;
        }),
      ]);
      setOpen(true);
      setSeverity(!inSale ? "success" : "error");
      setMessage(
        inSale ? "Product unpublished" : "Product published successfully"
      );
    } else if (response.status === 409) {
      setVisible(true);
    } else {
      setSpinner(false);
      setOpen(true);
      setMessage(response.data.message);
      setSeverity("error");
    }
  };
  const banProduct = async (id, ban) => {
    setSpinner(true);
    const response = await fetch(
      API_URL + "/api/admin/toggleProductState/" +
        id,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token_admin"),
        },
      }
    );
    if (response.status === 200) {
      setProducts((old) => [
        ...old.map((p) => {
          if (p.id === id) p.adminBan = !p.adminBan;
          return p;
        }),
      ]);
      setSpinner(false);
      setOpen(true);
      setMessage(!ban ? "Product Banned" : "Product Unbanned");
      setSeverity("success");
    }
  };

  return (
    <>
      <Snackbar
        className={"mt-7"}
        open={open}
        autoHideDuration={1800}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={spinner}
      >
        <CircularProgress className={"text-accent"} />
      </Backdrop>
      <Dialog
        open={visible}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Product Banned!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This product has been banned by the Madrasda Team for violating our
            policies. If you think this is a mistake email us at&nbsp;
            <u>support@madrasda.com</u>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="flex justify-end mr-8">
            <Button
              css={{ fontFamily: "$algeria" }}
              style={{
                background: "linear-gradient(45deg, #ffa000 30%, #ffc107 90%)",
              }}
              variant={"contained"}
              onClick={() => {
                const table = document.getElementById("tablefunda");
                const wb = XLSX.utils.table_to_book(table);
                XLSX.writeFile(wb, "Myproducts.xlsx");
              }}
            >
              <b>Export as Excel</b>
            </Button>
          </div>
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="text-black">
              <table
                className="min-w-full text-center text-sm font-medium"
                id="tablefunda"
              >
                <thead className="border-b text-m font-bold dark:border-neutral-500">
                  <tr>
                    <th scope="col" className=" px-6 py-4">
                      S.No
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Product
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Profit
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Discount
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Total Price
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Available Colours
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      {path.includes("admin") ? "Banned" : "In Sale"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    return (
                      <tr
                        key={uuidv4()}
                        className="border-b dark:border-neutral-500"
                      >
                        <td className="whitespace-nowrap px-6 py-6 font-medium">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6">
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6">
                          {item.profit}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6">
                          {item.discount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-6">
                          {item.total}
                        </td>
                        <td>
                          <div className="flex flex-wrap justify-center items-center space-x-1">
                            {getAvailableColors(item.colors)
                              .slice(0, 3)
                              .map((i) => (
                                <div
                                  key={uuidv4()}
                                  className="flex flex-col items-center"
                                >
                                  <div
                                    key={uuidv4()}
                                    style={{ backgroundColor: i.hexValue }}
                                    className={`${
                                      i.hexValue === "#fff" ||
                                      i.hexValue === "#ffffff"
                                        ? "border-shadowGrey border-[2px]"
                                        : ""
                                    }  rounded-full h-6 w-6`}
                                  ></div>
                                </div>
                              ))}
                            {item.colors.length > 3 && (
                              <div className="flex items-center">
                                <p className="mr-1">{`. . . ${
                                  item.colors.length - 3
                                }+`}</p>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-6 flex justify-center">
                          <button
                            onClick={() => {
                              if (path.includes("admin")) {
                                banProduct(item.id, item.adminBan);
                              } else {
                                togglePublishStatus(
                                  item.id,
                                  item.publishStatus
                                );
                              }
                            }}
                          >
                            {(
                              path.includes("admin")
                                ? item.adminBan
                                : item.publishStatus
                            ) ? (
                              <Button
                                className="bg-success font-bold"
                                variant="contained"
                                color="success"
                              >
                                Enabled
                              </Button>
                            ) : (
                              <Button variant="contained" color="error">
                                Disabled
                              </Button>
                            )}
                          </button>
                        </td>
                        <td>
                          <Button
                            variant={"contained"}
                            color={"info"}
                            className={" bg-info font-bold"}
                            onClick={() =>
                              router.push(`/vendor/editproduct/${item.id}`)
                            }
                          >
                            <Edit />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
