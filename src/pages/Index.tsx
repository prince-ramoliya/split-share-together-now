
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import ExpenseSplitter from '../components/ExpenseSplitter';

const Index = () => {
  return (
    <ThemeProvider>
      <ExpenseSplitter />
    </ThemeProvider>
  );
};

export default Index;
