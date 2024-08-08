import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const MyPage = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

      if (!loginInfo || !loginInfo.accessToken) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/members/info", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });

        setUserInfo(response.data.result);
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }

      try {
        const response = await axios.get("http://localhost:8080/delivery", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
        console.log(response)
        setDeliveryInfo(response.data.result);
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }

      try {
        const response = await axios.get("http://localhost:8080/cartItems", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });

        setCartItems(response.data.result);
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }

      try {
        const response = await axios.get("http://localhost:8080/discount", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });

        setDiscounts(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);

  const AddOrder = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const url = selectedDiscount
        ? `http://localhost:8080/orders/${selectedDiscount}`
        : "http://localhost:8080/orders";

      const response = await axios.post(
        url,
        selectedDiscount ? { discountId: selectedDiscount } : {},
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>주문하기</h1>
      <Box sx={{ textAlign: "center" }}>
        <h2>주문자 정보</h2>
        <Typography variant="h5">이름: {userInfo.name}</Typography>
        <Typography variant="h5">이메일: {userInfo.email}</Typography>
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <h2>배송정보</h2>
        <Typography variant="h5">받으시는 분: {deliveryInfo ? deliveryInfo.recipient : ""}</Typography>
        <Typography variant="h5">주소: {deliveryInfo ? deliveryInfo.address : ""}</Typography>
        <Typography variant="h5">전화번호: {deliveryInfo ? deliveryInfo.phoneNumber : ""}</Typography>
        <Typography variant="h5">요청사항: {deliveryInfo ? deliveryInfo.request : ""}</Typography>
      </Box>

      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.quantity}개
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid
          item
          xs={12}
          style={{
            textAlign: "center",
            height: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="div">
            장바구니가 비어 있습니다.
          </Typography>
        </Grid>
      )}

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="discount-select-label">할인 선택</InputLabel>
        <Select
          labelId="discount-select-label"
          id="discount-select"
          value={selectedDiscount}
          onChange={(e) => setSelectedDiscount(e.target.value)}
        >
          {discounts.map((discount) => (
            <MenuItem key={discount.id} value={discount.id}>
              {discount.discountName} - {discount.discountPrice}원
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={AddOrder}>
        주문하기
      </Button>
    </Container>
  );
};

export default MyPage;
