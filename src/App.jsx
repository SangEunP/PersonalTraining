import React from 'react';
import CustomerList from './components/customerlist';
import TrainingList from './components/TrainingList';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Container maxWidth="xl">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Personal Trainer</Typography>
        </Toolbar>
      </AppBar>
      <CustomerList />
      <TrainingList />
    </Container>
  );
}

export default App;
