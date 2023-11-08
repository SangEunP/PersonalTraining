import React from 'react';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
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
      <Calendar />
      <Statistics />
    </Container>
  );
}

export default App;
