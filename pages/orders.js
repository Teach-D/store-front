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

  const [orders, setOrders] = useState([]);

  const getCart = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    try {
      const response = await axios.get("http://localhost:8080/orders", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      setOrders(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const deleteOrder = async (id) => {

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");

      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/orders/${id}`,
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
    <Container className={classes.container}>
      <Grid container spacing={3} className={classes.gridContainer}>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <Card className={classes.productCard}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    주문 날짜: {order.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총 상품 수량: {order.products.reduce((sum, product) => sum + product.quantity, 0)}
                  </Typography>
                  <div>
                    {order.products.map((productEntry, index) => (
                      <Box key={index} mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          {productEntry.product? (
                            `제목: ${productEntry.product.title}`
                          ) : (
                            `: ${productEntry.productTitle}` // Fallback text when title is null
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Typography variant="body2" color="text.secondary">
                          {productEntry.product ? (
                            `가격: ${productEntry.product.price}`
                          ) : (
                            `: ${productEntry.productPrice}` // Fallback text when title is null
                          )}
                        </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          주문 수량: {productEntry.quantity}
                        </Typography>
                  
                      </Box>
                    ))}
                  </div>
                  <div>총 결제 금액{order.totalPrice}</div>
                  <button onClick={() => deleteOrder(order.id)}>
                    주문취소 {order.id}
                  </button>
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
            <Typography variant="h6">주문 내역이 없습니다</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default OrderList;
