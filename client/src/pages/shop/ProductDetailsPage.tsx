import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { fetchProduct } from '../../store/slices/productSlice';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);

  const { selectedProduct: product, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(Number(id)));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && (!product || value <= product.stock)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Sepete ekleme işlemi burada yapılacak
      console.log(`${quantity} adet ${product.name} sepete eklendi`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Ürün bulunamadı
      </Alert>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Geri Dön
        </Button>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" color="inherit">
            Ana Sayfa
          </Link>
          <Link
            component={RouterLink}
            to={`/categories/${product.categoryId}`}
            color="inherit"
          >
            {product.categoryName}
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.imageUrl}
              alt={product.name}
              sx={{ width: '100%', height: 'auto', minHeight: 400 }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                {product.discountedPrice ? (
                  <>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                        mr: 2,
                      }}
                    >
                      {product.price.toFixed(2)} TL
                    </Typography>
                    {product.discountedPrice.toFixed(2)} TL
                  </>
                ) : (
                  `${product.price.toFixed(2)} TL`
                )}
              </Typography>

              <Typography
                variant="body2"
                color={product.stock > 0 ? 'success.main' : 'error.main'}
                gutterBottom
              >
                {product.stock > 0
                  ? `Stokta ${product.stock} adet var`
                  : 'Stokta yok'}
              </Typography>
            </Box>

            {product.stock > 0 && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="number"
                  label="Adet"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={quantity < 1}
                  sx={{ flex: 1 }}
                >
                  Sepete Ekle
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailsPage; 