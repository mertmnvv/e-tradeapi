import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading: productsLoading, error: productsError } = useSelector(
    (state: RootState) => state.products
  );
  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories({}));
  }, [dispatch]);

  if (productsLoading || categoriesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (productsError || categoriesError) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {productsError || categoriesError}
      </Alert>
    );
  }

  return (
    <Container>
      {/* Kategoriler */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Kategoriler
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={category.imageUrl || '/placeholder.png'}
                alt={category.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/categories/${category.id}`}
                  variant="contained"
                  fullWidth
                >
                  Ürünleri Gör
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ürünler */}
      <Typography variant="h4" component="h2" gutterBottom>
        Öne Çıkan Ürünler
      </Typography>
      <Grid container spacing={4}>
        {products.slice(0, 6).map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {product.discountedPrice ? (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                            mr: 1,
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
                  >
                    {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to={`/products/${product.id}`}
                  variant="contained"
                  fullWidth
                >
                  İncele
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage; 