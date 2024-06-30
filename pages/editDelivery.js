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
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [request, setRequest] = useState("");
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
        const response = await axios.get("http://localhost:8080/delivery", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });

        if (isMounted) { // Check if component is still mounted
          setRecipient(response.data.recipient);
          setAddress(response.data.address);
          setPhoneNumber(response.data.phoneNumber);
          setRequest(response.data.request);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          window.location.href = "/login";
        }
      }
    };

    fetchDeliveryDetails();

    return () => {
      isMounted = false; // Cleanup function to prevent setting state if component unmounts
    };
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
        `http://localhost:8080/delivery`,
        { recipient, address, phoneNumber, request },
        { headers: { Authorization: `Bearer ${loginInfo.accessToken}` } }
      );

      if (response.status === 200) {
        router.push("/mypage");
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
        배송지 수정
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleEditDelivery}>
        <TextField
          label="Recipient"
          variant="outlined"
          margin="normal"
          fullWidth
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <TextField
          label="Address"
          variant="outlined"
          margin="normal"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          margin="normal"
          fullWidth
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <TextField
          label="Request"
          variant="outlined"
          margin="normal"
          fullWidth
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Delivery"}
        </Button>
      </Box>
    </Container>
  );
};

export default EditDelivery;
