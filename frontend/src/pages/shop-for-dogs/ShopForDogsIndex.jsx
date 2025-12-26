import React from 'react';
import { useLocation } from 'react-router-dom';
import DogTreats from './DogTreats';
import WalkEssentials from './WalkEssentials';
import DogFood from './DogFood';
import DogTrainingEssentials from './DogTrainingEssentials';
import DogGrooming from './DogGrooming';
import DogClothing from './DogClothing';
import DogHealthHygiene from './DogHealthHygiene';
import DogBedding from './DogBedding';
import DogBowlsDiners from './DogBowlsDiners';
import DogTravelSupplies from './DogTravelSupplies';
import DogToys from './DogToys';
import MobileBottomNav from '../../components/ui/MobileBottomNav';

export default function ShopForDogsIndex() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get('category') || '';
  const sub = new URLSearchParams(location.search).get('sub') || '';
  const cat = q.toLowerCase();

  let Page = DogTreats; // Default fallback

  if (cat === 'walk-essentials' || cat === 'walkessentials' || cat === 'walk') {
    Page = WalkEssentials;
  } else if (cat.includes('groom')) {
    Page = () => <DogGrooming initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('treat')) {
    Page = DogTreats;
  } else if (cat.includes('train') || cat.includes('training') || cat === 'dog-training' || cat === 'dog-training-essentials') {
    Page = DogTrainingEssentials;
  } else if (cat.includes('food') || cat === 'dogfood' || cat === 'dog-food') {
    Page = DogFood;
  } else if (cat.includes('clothing') || cat === 'dog-clothing') {
    Page = () => <DogClothing initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('health') || cat === 'dog-health' || cat === 'dog-health-hygiene') {
    Page = () => <DogHealthHygiene initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('bedding') || cat === 'dog-bedding') {
    Page = () => <DogBedding initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('bowl') || cat.includes('diner') || cat === 'dog-bowls-diners') {
    Page = () => <DogBowlsDiners initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('travel') || cat === 'dog-travel-supplies') {
    Page = () => <DogTravelSupplies initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('toy') || cat === 'dog-toys') {
    Page = () => <DogToys initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  }

  return (
    <>
      <Page />
      <MobileBottomNav />
    </>
  );
}
