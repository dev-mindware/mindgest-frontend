"use client";
import { useState } from "react";
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import { ThirdStep } from "./third-step";
import { FourthStep } from "./fourth-step";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components";
import { NavigationButtons } from "./navigation-buttons";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/schemas";
import { HeroImageSide, SeparatorLine } from "@/components/auth";

export function RegisterSteps() {
  const steps = [1, 2, 3, 4];
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await form.trigger("step1");
      case 2:
        return await form.trigger("step2");
      case 3:
        return await form.trigger("step3");
      case 4:
        return await form.trigger("step4");
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = async () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log("DADOS A ENVIAR NO BACKEND", data);
    } catch (error) {
      console.error("Erro ao enviar dados", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return <FirstStep />;
      case 2:
        return <SecondStep />;
      case 3:
        return <ThirdStep />;
      case 4:
        return <FourthStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative grid min-h-svh lg:grid-cols-2">
          <HeroImageSide source="/register.svg" />
          <SeparatorLine />

          <div className="relative z-20 flex flex-col p-6 md:p-10">
            <div className="max-w-xl mx-auto space-y-8 text-center md:w-[25rem] w-50">
              <Stepper value={currentStep} onValueChange={setCurrentStep}>
                {steps.map((step) => (
                  <StepperItem
                    key={step}
                    step={step}
                    className="not-last:flex-1"
                    loading={isLoading}
                  >
                    <StepperTrigger asChild>
                      <StepperIndicator />
                    </StepperTrigger>
                    {step < steps.length && <StepperSeparator />}
                  </StepperItem>
                ))}
              </Stepper>
              <p
                className="mt-2 text-xs text-muted-foreground"
                role="region"
                aria-live="polite"
              >
                Passo {currentStep} de {steps.length}
              </p>
            </div>

            <div className="flex items-center justify-center flex-1">
              <div className="w-full max-w-md">{renderCurrentForm()}</div>
            </div>

            <NavigationButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              handlePrevStep={handlePrevStep}
              handleNextStep={handleNextStep}
              isLoading={isLoading}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
