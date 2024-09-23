import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import myAxios from "../utils/myaxios";
import axios from "axios";

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

const all = 0

const ProductList = ({
  categories,
  products,
  pageNumber,
  totalPages,
  categoryId,
  currentSort, // Current sort parameter
  currentOrder, // Current order parameter
}) => {
  const classes = useStyles();

  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const [sort, setSort] = useState(currentSort || "sale"); // Sort state
  const [order, setOrder] = useState(currentOrder || "asc"); // Order state

  React.useEffect(() => {
    console.log("a1")
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
    console.log(products)
    loadImages();
  }, [products]);

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleAddToCart = async (productId) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    try {
      const response = await axios.post(
        `http://localhost:8080/cartItems/${productId}`,
        {
          cartId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add product to cart.");
    }
  };

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
      <Grid item>
        <Link href={`/products?sort=0&order=0`} passHref>
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

      <Box display="flex" justifyContent="center" marginY={3}>
        <Select value={sort} onChange={handleSortChange}>
          <MenuItem value="sale">Sale</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </Select>
        <Select value={order} onChange={handleOrderChange}>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
        <Link
          href={`/products?categoryId=${categoryId}&sort=${sort}&order=${order}`}
          passHref
        >
          <Button>Sort</Button>
        </Link>
      </Box>

      <Grid container spacing={3} className={classes.gridContainer}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
              <Card className={classes.productCard}>
                <CardMedia
                  className={classes.media}
                  image={product.product.imageUrl}
                  title={product.product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.product.price}원
                  </Typography>
                </CardContent>
                <Link href={`/editProduct/${product.product.id}`} passHref>
                  <Button>수정</Button>
                </Link>
                <Link href={`/product/${product.product.id}`} passHref>
                  <Button>자세히 보기</Button>
                </Link>
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
        <Link
          href={`/products?page=0&sort=${sort}&order=${order}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">첫페이지</Button>
        </Link>
        <Link
          href={`/products?page=${Math.max(0, pageNumber - 1)}&sort=${sort}&order=${order}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">이전</Button>
        </Link>
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            href={`/products?page=${i}&sort=${sort}&order=${order}${
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
          href={`/products?page=${Math.min(totalPages - 1, pageNumber + 1)}&sort=${sort}&order=${order}${
            categoryId ? `&categoryId=${categoryId}` : ""
          }`}
          passHref
        >
          <Button variant="outlined">다음</Button>
        </Link>
        <Link
          href={`/products?page=${totalPages - 1}&sort=${sort}&order=${order}${
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

export async function getServerSideProps(context) {
  console.log("aa")
  const categoryId = context.query.categoryId || 0;
  const page = context.query.page || 0;
  const sort = context.query.sort || 0;  // Default sort to 0
  const order = context.query.order || 0; // Default order to 0

  let categories = [];
  let products = [];
  let pageNumber = 0;
  let totalPages = 0;
  console.log("aa")
  try {
    const categoryResponse = await myAxios.get("/categories");
    categories = categoryResponse.data.result;

    // Check if categoryId is 0 (all products), apply sorting and ordering accordingly
    const productResponse = await myAxios.get("/products", {
      params: {
        categoryId,  // categoryId=0도 포함하여 정렬
        page,
        sort,
        order,
      },
    });
    console.log(productResponse)
    products = productResponse.data.result.content;
    pageNumber = parseInt(productResponse.data.result.pageable.pageNumber);
    totalPages = parseInt(productResponse.data.result.totalPages);
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
      currentSort: sort,
      currentOrder: order,
    },
  };
}


export default ProductList;
