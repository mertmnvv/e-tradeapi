import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Hakkımızda
            </Typography>
            <Typography variant="body2">
              E-Ticaret sitemiz, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmayı
              hedeflemektedir.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Hızlı Linkler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} to="/" color="inherit" sx={{ mb: 1 }}>
                Ana Sayfa
              </Link>
              <Link component={RouterLink} to="/products" color="inherit" sx={{ mb: 1 }}>
                Ürünler
              </Link>
              <Link component={RouterLink} to="/categories" color="inherit" sx={{ mb: 1 }}>
                Kategoriler
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              İletişim
            </Typography>
            <Typography variant="body2" paragraph>
              Adres: İstanbul, Türkiye
            </Typography>
            <Typography variant="body2" paragraph>
              Email: info@eticaret.com
            </Typography>
            <Typography variant="body2">
              Tel: +90 (212) 123 45 67
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} E-Ticaret. Tüm hakları saklıdır.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 