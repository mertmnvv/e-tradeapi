import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  TextField,
  Slider,
  FormControlLabel,
  Switch,
  Breadcrumbs,
  Link,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts, setFilters, clearFilters } from '../../store/slices/productSlice';
import { fetchCategory } from '../../store/slices/categorySlice';

const CategoryProductsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true);

  const {
    items: products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);

  const {
    selectedCategory: category,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    if (id) {
      dispatch(fetchCategory(Number(id)));
      dispatch(
        fetchProducts({
          categoryId: Number(id),
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          searchTerm,
          includeOutOfStock,
        })
      );
    }
  }, [dispatch, id, priceRange, searchTerm, includeOutOfStock]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeOutOfStock(event.target.checked);
  };

  if (categoryLoading || productsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (categoryError || productsError) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {categoryError || productsError}
      </Alert>
    );
  }

  if (!category) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Kategori bulunamadı
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
          <Typography color="text.primary">{category.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Grid container spacing={4}>
        {/* Filtreler */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filtreler
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Ürün Ara"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Fiyat Aralığı</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{priceRange[0]} TL</Typography>
                <Typography variant="body2">{priceRange[1]} TL</Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={includeOutOfStock}
                  onChange={handleStockChange}
                />
              }
              label="Stokta Olmayan Ürünleri Göster"
            />
          </Paper>
        </Grid>

        {/* Ürün Listesi */}
        <Grid item xs={12} md={9}>
          <Typography variant="h4" gutterBottom>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {category.description}
            </Typography>
          )}

          {products.length === 0 ? (
            <Alert severity="info">Bu kategoride ürün bulunamadı.</Alert>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
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
                        startIcon={<ShoppingCart />}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? 'Sepete Ekle' : 'Tükendi'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryProductsPage; 