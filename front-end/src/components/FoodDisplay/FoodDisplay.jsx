import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/ShowContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  const filteredFood = food_list.filter(item =>
    category === "All" || item.category === category
  );

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {
          filteredFood.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        }
      </div>
    </div>
  );
};

export default FoodDisplay;
