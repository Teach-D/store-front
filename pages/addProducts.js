import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

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

const AddProducts = () => {
  const classes = useStyles();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    if (!loginInfo || !loginInfo.accessToken) {
      console.error("Access token not found");
      return;
    }

    const selectedCategory = categories.find(cat => cat.name === categoryName);

    if (!selectedCategory) {
      console.error("Selected category not found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/products",
        {
          title,
          price,
          description,
          categoryId: selectedCategory.id,
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

  return (
    <Container maxWidth="sm" className={classes.container} component="main">
      <Typography variant="h4" component="h1" gutterBottom>
        상품등록
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleAddProduct}>
        <TextField
          label="Title"
          variant="outlined"
          margin="normal"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Price"
          variant="outlined"
          margin="normal"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          margin="normal"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          select
          label="Category"
          variant="outlined"
          margin="normal"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Image URL"
          variant="outlined"
          margin="normal"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          margin="normal"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
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
    </Container>
  );
};

export default AddProducts;
