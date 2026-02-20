import React from 'react';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BoardingPlanCard = ({ title, imageSrc, plans = [], onSelectPlan }) => {
  return (
    <div className="rounded-3xl overflow-hidden border border-border bg-surface shadow-sm flex flex-col">
      {/* Image */}
      <div className="overflow-hidden h-52">
        <AppImage
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <h3 className="text-xl font-heading font-bold text-foreground">{title}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Plan</th>
                <th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Duration</th>
                <th className="text-right py-2 pr-4 font-semibold text-muted-foreground">Price</th>
                <th className="text-right py-2 font-semibold text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, idx) => (
                <tr key={idx} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{plan.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{plan.subtitle}</td>
                  <td className="py-3 pr-4 text-right font-semibold text-primary">₹{plan.price}</td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => onSelectPlan && onSelectPlan(plan)}
                    >
                      Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BoardingPlanCard;
