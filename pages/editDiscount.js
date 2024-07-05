import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import axios from "axios";

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
}));

const EditDelivery = () => {
  const classes = useStyles();
  const router = useRouter();

  const [discountName, setDiscountName] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discountCondition, setDiscountCondition] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // To handle the cleanup and prevent memory leaks

    const fetchDeliveryDetails = async () => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

      if (!loginInfo || !loginInfo.accessToken) {
        setError("Access token not found");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/discount", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
          setDiscountName(response.data.discountName);
          setDiscountPrice(response.data.discountPrice);
          setExpirationDate(response.data.expirationDate);
          setQuantity(response.data.quantity);
          setDiscountCondition(response.data.discountCondition);

      } catch (error) {
        console.error(error);
          window.location.href = "/discount";
      }
    };

    fetchDeliveryDetails();
  }, []);

  const handleEditDelivery = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      setError("Access token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/discount`,
        { discountName, discountPrice, expirationDate, quantity, discountCondition},
        { headers: { Authorization: `Bearer ${loginInfo.accessToken}` } }
      );

      if (response.status === 200) {
        router.push("/discount");
      } else {
        setError("Failed to update delivery");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container} component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        할인쿠폰 수정
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleEditDelivery}>
        <TextField
          label="discountName"
          variant="outlined"
          margin="normal"
          fullWidth
          value={discountName}
          onChange={(e) => setDiscountName(e.target.value)}
          required
        />
        <TextField
          label="discountPrice"
          variant="outlined"
          margin="normal"
          fullWidth
          value={discountPrice}
          onChange={(e) => setDiscountPrice(e.target.value)}
          required
        />
        <TextField
          label="expirationDate"
          variant="outlined"
          margin="normal"
          fullWidth
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
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
          수정하기
        </Button>
      </Box>
    </Container>
  );
};

export default EditDelivery;
