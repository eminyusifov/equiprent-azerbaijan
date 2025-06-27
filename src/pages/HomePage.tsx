import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import EquipmentCatalog from '../components/EquipmentCatalog';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Categories />
      <HowItWorks />
      <EquipmentCatalog />
    </>
  );
};

export default HomePage;