import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; // 추가된 코드
import { useRouter } from "next/router";

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";

const MyPage = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({})

  useEffect(() => {
    const fetchUserInfo = async () => {
      const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

      if (!loginInfo || !loginInfo.accessToken) {
        console.log("aa")
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/members/info", {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        });
        console.log(response.data.result)
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

        setDeliveryInfo(response.data.result);
        console.log(response)
        console.log(response.data)
        console.log(deliveryInfo)
      } catch (error) {
        console.error(error);
        window.location.href = "/login";
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const handleDeleteProduct = async () => {

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");

      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/delivery`,
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
    } finally {
    }
  };

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
      <h1>MyPage</h1>
      <p>MyPage 페이지입니다.</p>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">이름: {userInfo.name}</Typography>
        <Typography variant="h5">이메일: {userInfo.email}</Typography>
      </Box>

      <h2>배송정보</h2>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">받으시는 분: {deliveryInfo?.recipient ?? ""}</Typography>
        <Typography variant="h5">주소: {deliveryInfo?.address ?? ""}</Typography>
        <Typography variant="h5">전화번호: {deliveryInfo?.phoneNumber ?? ""}</Typography>
        <Typography variant="h5">요청사항: {deliveryInfo?.request ?? ""}</Typography>
      </Box>

      <Link href={`/addDelivery`} passHref>
        <Button>배송정보 저장</Button>
      </Link>
      <Link href={`/editDelivery`} passHref>
        <Button>배송정보 수정</Button>
      </Link>
      <button onClick={() => handleDeleteProduct()} >
        삭제
      </button>
    </Container>
  );
};

export default MyPage;
