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
  backButton: {
    alignSelf: "flex-start",
  },
}));

const EditProduct = () => {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/products/${id}`);
          const product = response.data.product;
          setTitle(product.title);
          setPrice(product.price);
          setDescription(product.description);
          setCategoryId(product.category.id);
          setImageUrl(product.imageUrl);
          setQuantity(product.quantity);
        } catch (error) {
          console.error(error);
          setError("Failed to fetch product data.");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      setError("Access token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/products/${id}`,
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
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setError("");
    setLoading(true);

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      setError("Access token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/products/${id}`,
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
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container} component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        상품 수정
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleUpdateProduct}>
        <TextField
          label="Title"
          variant="outlined"
          margin="normal"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Price"
          variant="outlined"
          margin="normal"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          margin="normal"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <TextField
          label="Category ID"
          variant="outlined"
          margin="normal"
          fullWidth
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        />
        <TextField
          label="Image URL"
          variant="outlined"
          margin="normal"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <TextField
          label="Quantity"
          variant="outlined"
          margin="normal"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          required
        />
        {error && (
          <Typography color="error" variant="body2" align="center">
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
          {loading ? "Updating Product..." : "Update Product"}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          onClick={() => handleDeleteProduct(id)}
          disabled={loading}
          style={{ marginTop: "16px" }}
        >
          {loading ? "Deleting Product..." : "Delete Product"}
        </Button>
      </Box>
    </Container>
  );
};

export default EditProduct;
