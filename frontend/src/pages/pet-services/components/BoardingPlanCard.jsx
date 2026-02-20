import React from 'react';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BoardingPlanCard = ({ title, imageSrc, plans = [], onSelectPlan, petType }) => {
  const isDog = petType === 'dog';

  return (
    <div className="rounded-3xl overflow-hidden border border-border bg-white shadow-warm-md flex flex-col group hover:shadow-warm-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <AppImage
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Pet type badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
          <Icon name={isDog ? 'Dog' : 'Cat'} size={13} />
          {isDog ? 'Dogs' : 'Cats'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        <div>
          <h3 className="text-xl font-heading font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Charges per pet · All plans include supervised care</p>
        </div>

        {/* Plans table */}
        <div className="flex flex-col gap-2">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-background rounded-xl px-4 py-3 border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors group/row"
            >
              <div>
                <p className="font-semibold text-sm text-foreground">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary font-heading">₹{plan.price}</p>
                  <p className="text-xs text-muted-foreground">per stay</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                >
                  Book
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Icon name="Info" size={13} className="text-primary flex-shrink-0" />
          Festive season rates may be 25–30% higher.
        </p>
      </div>
    </div>
  );
};

export default BoardingPlanCard;
