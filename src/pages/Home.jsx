import { useState, useEffect } from 'react';
import { ArrowRightLeft, Star, Clock } from 'lucide-react';
import { useAppContext } from '../App';
import CurrencyConverter from '../components/CurrencyConverter';
import RecentConversions from '../components/RecentConversions';
import QuickRates from '../components/QuickRates';

const Home = () => {
  return (
    <div className="grid grid-2">
      <div>
        <CurrencyConverter />
        <RecentConversions />
      </div>
      <div>
        <QuickRates />
      </div>
    </div>
  );
};

export default Home;