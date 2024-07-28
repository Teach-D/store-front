import React, { useState, useEffect } from "react";
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
import { makeStyles } from "@mui/styles";
import Link from "next/link"; // 추가된 코드
import axios from "axios";
import { Rotate90DegreesCcw } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 3,
  },
  productCard: {
    marginBottom: 3,
  },
  media: {
    height: 0,
    paddingTop: "150%",
  },
  gridContainer: {
    justifyContent: "center",
  },
}));

const OrderList = () => {
  const classes = useStyles();
  const router = useRouter();

  const [discounts, setDiscounts] = useState([]);

  const getCart = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    try {
      const response = await axios.get("http://localhost:8080/discount/all", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      console.log(response)

      setDiscounts(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const setMember = async (id) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/discount/${id}`,
        {},
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

  // const deleteOrder = async (id) => {

  //   const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

  //   if (!loginInfo || !loginInfo.accessToken) {
  //     console.error("Access token not found");

  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:8080/orders/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${loginInfo.accessToken}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     console.error(error);
      

  //   } finally {
  //   }
  // };

  return (
    <Container className={classes.container}>
      <Grid container spacing={3} className={classes.gridContainer}>
      <Link href="/addDiscount" passHref>
          <Button
            color="inherit"
          >
            할인 등록하기
        </Button>
        </Link>
        {(
          discounts.map((discount, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <Card className={classes.productCard}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    할인 이름: {discount.discountName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    할인 금액: {discount.discountPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    할인 만료기간: {discount.expirationDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    할인 쿠폰 양: {discount.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    할인 조건 가격: {discount.discountCondition} 이상
                  </Typography>
                  <Link href="/editDiscount" passHref>
                    <Button
                      color="inherit"
                    >
                      수정하기
                    </Button>
                  </Link> 
                  <button onClick={() => setMember(discount.id)}>
                     {discount.id} 내 할인 목록애 추가하기
                  </button>
                  {/* <button onClick={() => deleteOrder(order.id)}>
                     {order.id}
                  </button> */}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default OrderList;
