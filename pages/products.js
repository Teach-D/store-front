import React, { useState, useEffect } from "react";
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
import myAxios from "../utils/myaxios";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 3
  },
  productCard: {
    marginBottom: 3
  },
  media: {
    height: 0,
    paddingTop: "150%",
  },
  gridContainer: {
    justifyContent: "center",
  },
}));

const ProductList = ({
  categories,
  products,
  pageNumber,
  totalPages,
  categoryId,
}) => {
  // 수정된 코드
  const classes = useStyles();

  const [imagesLoaded, setImagesLoaded] = React.useState(false); // 추가된 코드

  React.useEffect(() => {
    const loadImages = async () => {
      await Promise.all(
        products.map(
          (product) =>
            new Promise((resolve, reject) => {
              const image = new Image();
              image.src = product.imageUrl;
              image.onload = resolve;
              image.onerror = reject;
            })
        )
      );
      setImagesLoaded(true);
    };

    loadImages();
  }, [products]);

  const AddCartItem = async (event) => {
    event.preventDefault();
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/cartItems",
        {
          title,
          price,
          description,
          categoryId,
          imageUrl,
          quantity,
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

  const emptyCardCount = 4 - (products.length % 4);

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        <Grid item>
          <Link href={`/products`} passHref>
            <Button>모두</Button>
          </Link>
        </Grid>
        {categories.map((category) => (
          <Grid item key={category.id}>
            <Link href={`/products?categoryId=${category.id}`} passHref>
              <Button>{category.name}</Button>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Link href={`/addProducts`} passHref>
            <Button>상품추가</Button>
          </Link>
          <Link href={`/addCategory`} passHref>
            <Button>카테고리추가</Button>
          </Link>

      <Grid container spacing={3} className={classes.gridContainer}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              {" "}
              {/* 한 줄에 최대 3개 표시 */}
              <Card className={classes.productCard}>
                <CardMedia
                  className={classes.media}
                  image={product.imageUrl}
                  title={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price}원
                  </Typography>
                </CardContent>
                <Box component="form" className={classes.form} onSubmit={AddCartItem}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Add Product
                </Button>
                </Box>
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
              해당 카테고리엔 상품이 없습니다.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box display="flex" justifyContent="center" marginBottom={3}>
        {/* 페이지 네비게이터 버튼 */}
        <Link
          href={`/products?page=0${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">첫페이지</Button>
        </Link>
        <Link
          href={`/products?page=${Math.max(0, pageNumber - 1)}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">이전</Button>
        </Link>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            href={`/products?page=${i}${
              categoryId ? `&categoryId=${categoryId}` : ""
            }`}
            passHref
            key={i}
          >
            <Button variant="outlined" selected={i === pageNumber}>
              {i + 1}
            </Button>
          </Link>
        ))}
        <Link
          href={`/products?page=${Math.min(totalPages - 1, pageNumber + 1)}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">다음</Button>
        </Link>
        <Link
          href={`/products?page=${totalPages - 1}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">마지막페이지</Button>
        </Link>
      </Box>
    </Container>
  );
};

// 추가된 코드
export async function getServerSideProps(context) {
  const categoryId = context.query.categoryId || 0;
  const page = context.query.page || 0;

  let categories = [];
  let products = [];
  let pageNumber = 0;
  let totalPages = 0;

  try {
    const categoryResponse = await myAxios.get("/categories");
    categories = categoryResponse.data;

    const productResponse = await myAxios.get("/products", {
      params: {
        categoryId,
        page,
      },
    });
    products = productResponse.data.content;
    pageNumber = parseInt(productResponse.data.pageable.pageNumber);
    totalPages = parseInt(productResponse.data.totalPages);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      categories,
      products,
      pageNumber,
      totalPages,
      categoryId,
    },
  };
}

export default ProductList;
