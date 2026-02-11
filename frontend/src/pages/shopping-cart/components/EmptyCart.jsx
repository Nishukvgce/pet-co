import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCart = () => {

  return (
    <div className="text-center py-12">
      {/* Empty Cart Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
        </div>
        <h2 className="font-heading font-semibold text-2xl text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="font-body text-muted-foreground max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up with natural goodness!
        </p>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link to="/homepage">
          <Button variant="default" size="lg" iconName="Home" iconPosition="left">
            Go to Homepage
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg" iconName="Search" iconPosition="left">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;