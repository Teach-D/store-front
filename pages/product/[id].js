import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./EditProduct.module.css";

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1); // Initialize quantity to 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        console.log('aas')

        try {
          const response = await axios.get(`http://localhost:8080/products/${id}`);
          console.log(response.data.result.product)
          const product = response.data.result.product;
          setTitle(product.title);
          setPrice(product.price);
          setDescription(product.description);
          setCategoryId(product.category.id);
          setImageUrl(product.imageUrl);

          const responseCategory = await axios.get(`http://localhost:8080/categories/${product.category.id}`);
          setCategoryName(responseCategory.data.result.name);
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

  const getCart = async () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    try {
      const response = await axios.get(
        "http://localhost:8080/carts",
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      console.log(response.data.result)
      setCartId(response.data.result.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const handleAddToCart = async (productId) => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    console.log("asas")
    console.log(cartId)
    console.log(quantity)

    try {
      const response = await axios.post(
        `http://localhost:8080/cartItems/${productId}`,
        {
          cartId: cartId,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${loginInfo.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        router.push("/products");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add product to cart.");
    }
  };

  const handleQuantityChange = (quantity) => {
    setQuantity(quantity);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Details</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.productDetail}>
        <div className={styles.productImage}>
          <img src={imageUrl} alt={title} />
        </div>
        <div className={styles.productInfo}>
          <h2>{title}</h2>
          <p className={styles.price}>${price}</p>
          <p className={styles.description}>{description}</p>
          <p className={styles.category}>Category: {categoryName}</p>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className={styles.quantityInput}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.cartButton}
          onClick={() => handleAddToCart(id)}
          disabled={loading || quantity === 0}  // Disable button if loading or quantity is 0
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
