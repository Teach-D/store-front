import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import { useRouter } from "next/router";

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

const Cart = () => {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  const getCart = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    try {
      const response = await axios.get("http://localhost:8080/cartItems", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      console.log(response.data)
      setCartItems(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <Container className={classes.container}>
      <Grid container spacing={3} className={classes.gridContainer}>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <Card className={classes.productCard}>
                <CardMedia
                  className={classes.media}
                  image={item.product.imageUrl}
                  title={item.product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.product.price}원 x {item.quantity}개
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    총합: {item.product.price * item.quantity}원
                  </Typography>
                </CardContent>
                <Link href={`/product/${item.product.id}`} passHref>
                  <Button>자세히 보기</Button>
                </Link>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ marginTop: "16px" }}
                >
                  제거
                </Button>

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
      </Grid>
      <Link href={`/products`} passHref>
        <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
          쇼핑 계속하기
        </Button>
      </Link>

      <Link href={`/orderForm`} passHref>
        <Button variant="contained" color="primary" style={{ marginTop: "16px" }}>
          주문하기
        </Button>
      </Link>
    </Container>
  );
};

export default Cart;
