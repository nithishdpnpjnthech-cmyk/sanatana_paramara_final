import React from 'react';
import Icon from '../../../components/AppIcon';

const CheckoutProgress = ({ currentStep = 1, totalSteps = 4 }) => {
  const steps = [
    { id: 1, label: 'Shipping', icon: 'Truck' },
    { id: 2, label: 'Delivery', icon: 'Clock' },
    { id: 3, label: 'Payment', icon: 'CreditCard' },
    { id: 4, label: 'Review', icon: 'CheckCircle' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Checkout Progress
        </span>
        <span className="text-sm font-bold text-primary">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step?.id === currentStep 
                  ? 'bg-primary border-primary text-primary-foreground animate-pulse-subtle scale-110' 
                  : step?.id < currentStep
                  ? 'bg-primary/90 border-primary text-primary-foreground'
                  : 'bg-background border-border text-muted-foreground'
              }`}>
                {step?.id < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={step?.icon} size={16} />
                )}
              </div>
              <span className={`mt-3 text-xs font-caption font-semibold ${
                step?.id === currentStep ? 'text-primary' : step?.id < currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step?.label}
              </span>
            </div>
            {index < steps?.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                step?.id < currentStep ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;