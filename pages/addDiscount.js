import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "500px",
    height: "100%",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  backButton: {
    alignSelf: "flex-start",
  },
}));

const AddProducts = () => {
  const classes = useStyles();
  const router = useRouter();

  const [discountName, setDiscountName] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discountCondition, setDiscountCondition] = useState("");

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      return;
    }

  
    try {
      const response = await axios.post(
        "http://localhost:8080/discount",
        {
          discountName,
          discountPrice,
          expirationDate,
          quantity,
          discountCondition,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container} component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        할인 쿠폰 등록
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleAddProduct}>
        <TextField
          label="discountName"
          variant="outlined"
          margin="normal"
          fullWidth
          value={discountName}
          onChange={(e) => setDiscountName(e.target.value)}
        />
        <TextField
          label="discountPrice"
          variant="outlined"
          margin="normal"
          fullWidth
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
        />
        <TextField
          label="expirationDate"
          variant="outlined"
          margin="normal"
          fullWidth
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <TextField
          label="quantity"
          variant="outlined"
          margin="normal"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
            <TextField
          label="discountCondition"
          variant="outlined"
          margin="normal"
          fullWidth
          value={discountCondition}
          onChange={(e) => setDiscountCondition(e.target.value)}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Add discount
        </Button>
      </Box>
    </Container>
  );
};

export default AddProducts;
