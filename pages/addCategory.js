import React from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
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

const addProducts = () => {
  const classes = useStyles();
  const router = useRouter();

  const [name, setName] = useState("");
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(name)
    try {
      const response = await axios.post("http://localhost:8080/categories", {
        name
      });

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container} component="main">
      {/* 변경된 코드 */}
      <Typography variant="h4" component="h1" gutterBottom>
        카테고리 등록
      </Typography>
      <Box component="form" className={classes.form} onSubmit={handleLogin}>
        <TextField
          label="name"
          type="name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          제출
        </Button>
      </Box>
    </Container>
  );
};

export default addProducts;
